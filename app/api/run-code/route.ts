import { NextRequest, NextResponse } from "next/server";
import { submitBatch, pollResults } from "@/lib/judge0";
import { handleApiError } from "@/lib/error-handler";
import { prisma } from "@/lib/db";

type TestCase = { input: string };

type RequestBody = {
  code: string;
  languageId: number;
  problemId: string;
  testCases: TestCase[];
};

export async function POST(req: NextRequest) {
  try {
    const { code, languageId, problemId, testCases }: RequestBody =
      await req.json();

    if (!code || !languageId || !problemId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (testCases.length == 0) {
      return NextResponse.json(
        { success: false, message: "Test case can't be empty" },
        { status: 400 }
      );
    }

    const res = await prisma.problem.findUnique({
      where: { id: problemId },
      select: { teacherSolution: true, teacherSolutionLanguageId: true },
    });

    if (!res) {
      return NextResponse.json(
        {
          success: false,
          message: "Unable to evaluate code",
          error: "Original solution can't be found",
        },
        { status: 404 }
      );
    }

    // Run user code and correct code on the same inputs
    const [userTokens, correctTokens] = await Promise.all([
      submitBatch(code, languageId, testCases),
      submitBatch(
        res.teacherSolution,
        res.teacherSolutionLanguageId,
        testCases
      ),
    ]);

    const [userResults, correctResults] = await Promise.all([
      pollResults(userTokens),
      pollResults(correctTokens),
    ]);

    // Compare results
    const compared = userResults.map((r, i) => {
      const userOut = r.stdout?.trim() || "";
      const expectedOut = correctResults[i].stdout?.trim() || "";
      return {
        input: testCases[i].input,
        output: userOut,
        expected: expectedOut,
        passed: userOut === expectedOut,
        status: r.status.description,
        time: r.time || "0",
        memory: r.memory || 0,
      };
    });

    // Compute aggregate performance

    const totalCount = compared.length;
    const passedCount = compared.filter((r) => r.passed).length;
    const percentagePassed = ((passedCount / totalCount) * 100).toFixed(2);

    const totalTime = compared.reduce(
      (acc, cur) => acc + parseFloat(cur.time || "0"),
      0
    );
    const totalMemory = compared.reduce((acc, cur) => acc + cur.memory, 0);

    return NextResponse.json({
      success: true,
      results: compared,
      summary: {
        passedCount,
        totalCount,
        percentagePassed: `${percentagePassed}%`,
        totalTime: totalTime.toFixed(3) + "s",
        totalMemory: totalMemory + " KB",
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

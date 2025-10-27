import { NextRequest, NextResponse } from "next/server";
import { submitBatch, pollResults } from "@/lib/judge0";
import { prisma } from "@/lib/db";
import checkRoleBasedAccess from "@/lib/checkRoleAccess";

type TestCase = { input: string };

type RequestBody = {
  code: string;
  languageId: number;
  problemId: string;
};


export async function POST(req: NextRequest) {
  try {
    const { code, languageId, problemId }: RequestBody = await req.json();

    if (!code || !languageId || !problemId) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const checkAccess = await checkRoleBasedAccess({ req });
    if (!checkAccess.hasAccess || !checkAccess.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized", message: checkAccess.message },
        { status: 401 }
      );
    }

    const userId = checkAccess.user.id;
    const codeAndCase = await prisma.problem.findUnique({
      where: { id: problemId },
      select: {
        teacherSolutionLanguageId: true,
        teacherSolution: true,
        testCases: {
          select: { input: true },
        },
      },
    });
    if (!codeAndCase) {
      return NextResponse.json(
        { success: false, message: "Unable to find problem" },
        { status: 404 }
      );
    }
    const correct = {
      languageId: codeAndCase?.teacherSolutionLanguageId,
      code: codeAndCase?.teacherSolution,
    };
    const cases = codeAndCase.testCases;

    if (!correct || !cases) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    // Run both user and correct solution in parallel
    const [userTokens, correctTokens] = await Promise.all([
      submitBatch(code, languageId, cases),
      submitBatch(correct.code, correct.languageId, cases),
    ]);

    // Wait for all results
    const [userResults, correctResults] = await Promise.all([
      pollResults(userTokens),
      pollResults(correctTokens),
    ]);

    // Compare outputs
    const compared = userResults.map((r, i) => {
      const userOut = r.stdout?.trim() || "";
      const expectedOut = correctResults[i].stdout?.trim() || "";
      return {
        input: cases[i].input,
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

    const submissions = await prisma.submission.create({
      data: {
        problemId,
        studentId: userId,
        languageId,
        code,
        status: "Accepted",
        testCasesPassed: passedCount,
        totalTestCases: totalCount,
        executionTime: totalTime,
        memoryUsed: totalMemory,
        judge0Tokens: { userTokens },
        judge0Result: { userResults },
      },
    });

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
    console.error("❌ Submission error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

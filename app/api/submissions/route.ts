import { NextRequest, NextResponse } from "next/server";
import { submitBatch, pollResults } from "@/lib/judge0";
import { prisma } from "@/lib/db";
import checkRoleBasedAccess from "@/lib/checkRoleAccess";
import { SubmissionStatus } from "@prisma/client";

type RequestBody = {
  code: string;
  languageId: number;
  problemId: string;
  assignmentId?: string;
};

export async function POST(req: NextRequest) {
  try {
    const body: RequestBody = await req.json();
    const { code, languageId, problemId}: RequestBody = body;
    const assignmentId = body.assignmentId || undefined;
    console.log(`Assignment ID: ${assignmentId}`);
    if (!code || !languageId || !problemId) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    const [checkAccess, codeAndCase] = await Promise.all([
      checkRoleBasedAccess({ req }),
      prisma.problem.findUnique({
        where: { id: problemId },
        select: {
          teacherSolutionLanguageId: true,
          teacherSolution: true,
          testCases: {
            select: { input: true },
          },
        },
      }),
    ]);

    if (!checkAccess.hasAccess || !checkAccess.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized", message: checkAccess.message },
        { status: 401 }
      );
    }

    const userId = checkAccess.user.id;
    if (!codeAndCase) {
      return NextResponse.json(
        { success: false, message: "Unable to find problem" },
        { status: 404 }
      );
    }

    if (assignmentId) {
      const assignmentProblem = await prisma.assignmentProblem.findFirst({
        where: {
          assignmentId,
          problemId,
        },
      });
      if (!assignmentProblem) {
        return NextResponse.json(
          { success: false, message: "Problem not part of the assignment" },
          { status: 403 }
        );
      }
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

    let finalStatus = "Accepted";

    // Check for compilation or runtime errors
    const hasCompileError = userResults.some(
      (r) => r.status?.description === "Compilation Error"
    );
    const hasRuntimeError = userResults.some(
      (r) =>
        r.status?.description === "Runtime Error" ||
        r.stderr ||
        r.status?.description === "Time Limit Exceeded"
    );

    if (hasCompileError) {
      finalStatus = "CompilationError";
    } else if (hasRuntimeError) {
      finalStatus = "RuntimeError";
    } else if (passedCount === totalCount) {
      finalStatus = "Accepted";
    } else if (passedCount > 0) {
      finalStatus = "PartiallyCorrect";
    } else {
      finalStatus = "WrongAnswer";
    }

    const payloadSubmission: any = {
      problemId,
      studentId: userId,
      languageId,
      code,
      status: finalStatus as SubmissionStatus,
      testCasesPassed: passedCount,
      totalTestCases: totalCount,
      executionTime: totalTime,
      memoryUsed: totalMemory,
      judge0Tokens: { userTokens },
      judge0Result: { userResults },
    };

    if (assignmentId) {
      payloadSubmission.assignmentId = assignmentId;
    }

    const submissions = await prisma.submission.create({
      data: payloadSubmission,
    });

    return NextResponse.json({
      success: true,
      results: compared,
      summary: {
        submissionId: submissions.id,
        passedCount,
        totalCount,
        percentagePassed: `${percentagePassed}%`,
        status: finalStatus,
        totalTime: totalTime.toFixed(3) + "s",
        totalMemory: totalMemory + " KB",
        createdAt: submissions.createdAt,
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

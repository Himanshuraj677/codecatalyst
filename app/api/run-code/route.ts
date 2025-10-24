import { NextRequest, NextResponse } from "next/server";
import { submitBatch, pollResults } from "@/lib/judge0";
import { handleApiError } from "@/lib/error-handler";

type TestCase = { input: string };

type RequestBody = {
  code: string;
  languageId: number;
  problemId: string;
  testCases: TestCase[];
};

// ✅ Mock correct solutions (use DB later)
const correctSolutions: Record<string, { code: string; languageId: number }> = {
  "problem-1": { code: "print(int(input())*2)", languageId: 71 },
};

// ✅ Visible test cases per problem (shown to user)
const visibleTestCases: Record<string, TestCase[]> = {
  "problem-1": [
    { input: "5" },
    { input: "10" },
    { input: "25" },
  ],
};

export async function POST(req: NextRequest) {
  try {
    const { code, languageId, problemId, testCases }: RequestBody = await req.json();

    if (!code || !languageId || !problemId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const correct = correctSolutions[problemId];
    const cases = testCases?.length ? testCases : visibleTestCases[problemId];

    if (!correct || !cases) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    // Run user code and correct code on the same inputs
    const [userTokens, correctTokens] = await Promise.all([
      submitBatch(code, languageId, cases),
      submitBatch(correct.code, correct.languageId, cases),
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
        input: cases[i].input,
        output: userOut,
        expected: expectedOut,
        passed: userOut === expectedOut,
        status: r.status.description,
      };
    });

    return NextResponse.json({ results: compared });
  } catch (error) {
    return handleApiError(error);
  }
}

import { NextRequest, NextResponse } from "next/server";
import { submitBatch, pollResults } from "@/lib/judge0";

type TestCase = { input: string };

type RequestBody = {
  code: string;
  languageId: number;
  problemId: string;
};

// ✅ Mock DB (replace with actual DB later)
const correctSolutions: Record<string, { code: string; languageId: number }> = {
  "problem-1": { code: "print(int(input())*2)", languageId: 71 },
};

// ✅ Hidden test cases (won’t be visible to user)
const hiddenTestCases: Record<string, TestCase[]> = {
  "problem-1": [{ input: "2" }, { input: "5" }, { input: "10" }],
};

export async function POST(req: NextRequest) {
  try {
    const { code, languageId, problemId }: RequestBody = await req.json();

    if (!code || !languageId || !problemId) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const correct = correctSolutions[problemId];
    const cases = hiddenTestCases[problemId];

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
    const results = userResults.map((r, i) => {
      const userOut = r.stdout?.trim() || "";
      const expectedOut = correctResults[i].stdout?.trim() || "";
      return {
        input: cases[i].input,
        actual: userOut,
        expected: expectedOut,
        status: r.status.description,
        passed: userOut === expectedOut,
      };
    });

    // TODO: Store `userTokens` in DB for tracking submissions

    return NextResponse.json({ results });
  } catch (error) {
    console.error("❌ Submission error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

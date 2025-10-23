import { NextRequest, NextResponse } from "next/server";
import { submitBatch, pollResults } from "@/lib/judge0";
import { handleApiError } from "@/lib/error-handler";

type TestCase = { input: string };

type RequestBody = {
  code: string;
  languageId: number;
  problemId: string;
};

const correctSolutions: Record<string, { code: string; languageId: number }> = {
  "problem-1": { code: "print(int(input())*2)", languageId: 71 },
};

const hiddenTestCases: Record<string, TestCase[]> = {
  "problem-1": [{ input: "2" }, { input: "5" }, { input: "10" }],
};

// Helper: Poll until all results ready
async function pollBatch(tokens: string[], interval = 400) {
  let results: any[] = [];
  while (true) {
    results = await pollResults(tokens);
    const allDone = results.every((r) => r.status.id > 2);
    if (allDone) break;
    await new Promise((r) => setTimeout(r, interval));
  }
  return results;
}

export async function POST(req: NextRequest) {
  try {
    const body: RequestBody = await req.json();
    const { code, languageId, problemId } = body;

    if (!code || !languageId || !problemId) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    if (!correctSolutions[problemId] || !hiddenTestCases[problemId]) {
      return NextResponse.json(
        { error: "Problem or hidden test cases not found" },
        { status: 400 }
      );
    }

    const userCode = code;
    const userLang = languageId;
    const correctCode = correctSolutions[problemId].code;
    const correctLang = correctSolutions[problemId].languageId;
    const cases = hiddenTestCases[problemId];

    // Submit both batches in parallel
    const [userTokens, correctTokens] = await Promise.all([
      submitBatch(userCode, userLang, cases),
      submitBatch(correctCode, correctLang, cases),
    ]);

    // Poll for both in parallel until all ready
    const [userResults, correctResults] = await Promise.all([
      pollBatch(userTokens),
      pollBatch(correctTokens),
    ]);

    // Compare outputs
    const finalResults = userResults.map((r, i) => {
      const userOutput = r.stdout?.trim() || "";
      const expectedOutput = correctResults[i].stdout?.trim() || "";
      return {
        input: cases[i].input,
        actual: userOutput,
        expected: expectedOutput,
        status: r.status.description,
        passed: userOutput === expectedOutput,
      };
    });

    // TODO: Store tokens in DB here for reference
    // await db.submission.create({ tokens: userTokens, ... })

    return NextResponse.json({ results: finalResults });
  } catch (err: any) {
    handleApiError(err);
  }
}

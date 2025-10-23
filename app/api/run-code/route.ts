import { NextRequest, NextResponse } from "next/server";
import { submitBatch, getBatchResults } from "@/lib/judge0";

type TestCase = { input: string };

type RequestBody = {
  code: string;
  languageId: number;
  testCases: TestCase[];
  problemId: string; // To fetch correct solution
};

// Mock database of correct solutions
const correctSolutions: Record<string, { code: string; languageId: number }> = {
  "problem-1": { code: "print(int(input())*2)", languageId: 71 }
};


export async function POST(req: NextRequest) {
  try {
    const body: RequestBody = await req.json();
    const { code, languageId, testCases, problemId } = body;

    if (!code || !languageId || !testCases?.length || !problemId) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    if (!correctSolutions[problemId]) {
      return NextResponse.json({ error: "Problem not found in mock DB" }, { status: 400 });
    }

    const correctCode = correctSolutions[problemId].code;
    const correctLang = correctSolutions[problemId].languageId;

    // Submit batches simultaneously
    const userTokens = await submitBatch(code, languageId, testCases);
    const correctTokens = await submitBatch(correctCode, correctLang, testCases);

    // Get batch results
    const userResults = await getBatchResults(userTokens);
    const correctResults = await getBatchResults(correctTokens);

    // Map results to include expected output and pass/fail
    const finalResults = userResults.map((r, i) => {
      const actual = r.stdout?.trim() || "";
      const expected = correctResults[i].stdout?.trim() || "";
      return {
        input: testCases[i].input,
        actual,
        expected,
        stderr: r.stderr?.trim() || "",
        status: r.status.description,
        passed: actual === expected
      };
    });

    return NextResponse.json({ results: finalResults });
  } catch (err: any) {
    console.error("Judge0 batch submission failed:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
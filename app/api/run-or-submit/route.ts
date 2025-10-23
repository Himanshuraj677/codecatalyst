import { NextRequest, NextResponse } from "next/server";

const JUDGE0_URL = process.env.JUDGE0_URL;

type TestCase = { input: string };

type RequestBody = {
  code: string;
  languageId: number;
  testCases?: TestCase[];
  mode: "run" | "submit";
  problemId?: string;
};

const correctSolutions: Record<string, { code: string; languageId: number }> = {
  "problem-1": { code: "print(int(input())*2)", languageId: 71 },
};

const hiddenTestCases: Record<string, TestCase[]> = {
  "problem-1": [{ input: "2" }, { input: "5" }, { input: "10" }],
};

async function submitBatch(
  code: string,
  languageId: number,
  testCases: TestCase[]
) {
  const submissions = testCases.map((tc) => ({
    source_code: code,
    language_id: languageId,
    stdin: tc.input,
  }));

  const res = await fetch(
    `${JUDGE0_URL}/submissions/batch?base64_encoded=false&wait=false`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ submissions }),
    }
  );

  const data = await res.json();
  return data.map((s: any) => s.token);
}

async function getBatchResults(tokens: string[]) {
  const res = await fetch(
    `${JUDGE0_URL}/submissions/batch?tokens=${tokens.join(
      ","
    )}&base64_encoded=false`
  );
  const data = await res.json();
  return data.submissions;
}

export async function POST(req: NextRequest) {
  try {
    const body: RequestBody = await req.json();
    const { code, languageId, testCases, mode, problemId } = body;

    if (!code || !languageId || !mode) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    if (mode === "run") {
      if (!testCases || !testCases.length) {
        return NextResponse.json(
          { error: "Provide at least one input" },
          { status: 400 }
        );
      }

      const tokens = await submitBatch(code, languageId, testCases);

      let correctTokens: string[] = [];
      if (problemId && correctSolutions[problemId]) {
        const correctCode = correctSolutions[problemId].code;
        const correctLang = correctSolutions[problemId].languageId;
        correctTokens = await submitBatch(correctCode, correctLang, testCases);
      }

      let allReady = false;
      let userResults: any[] = [];
      let correctResults: any[] = [];

      while (!allReady) {
        userResults = await getBatchResults(tokens);

        if (correctTokens.length > 0) {
          correctResults = await getBatchResults(correctTokens);
          allReady =
            userResults.every((r) => r.status.id > 2) &&
            correctResults.every((r) => r.status.id > 2);
        } else {
          allReady = userResults.every((r) => r.status.id > 2);
        }

        if (!allReady) await new Promise((r) => setTimeout(r, 500));
      }

      const formatted = userResults.map((r, i) => ({
        input: r.stdin,
        output: r.stdout?.trim() || "",
        stderr: r.stderr?.trim() || "",
        status: r.status.description,
        expectedOutput: correctResults[i]?.stdout?.trim() || null,
      }));

      return NextResponse.json({ results: formatted });
    } else if (mode === "submit") {
      if (
        !problemId ||
        !correctSolutions[problemId] ||
        !hiddenTestCases[problemId]
      ) {
        return NextResponse.json(
          { error: "Invalid problem or missing hidden test cases" },
          { status: 400 }
        );
      }

      const userCode = code;
      const userLang = languageId;
      const correctCode = correctSolutions[problemId].code;
      const correctLang = correctSolutions[problemId].languageId;
      const cases = hiddenTestCases[problemId];

      const userTokens = await submitBatch(userCode, userLang, cases);
      const correctTokens = await submitBatch(correctCode, correctLang, cases);

      let allReady = false;
      let userResults: any[] = [];
      let correctResults: any[] = [];
      while (!allReady) {
        userResults = await getBatchResults(userTokens);
        correctResults = await getBatchResults(correctTokens);

        allReady =
          userResults.every((r) => r.status.id > 2) &&
          correctResults.every((r) => r.status.id > 2);
        if (!allReady) await new Promise((r) => setTimeout(r, 500));
      }

      const finalResults = userResults.map((r, i) => {
        const userOutput = r.stdout ? r.stdout.trim() : "";
        const expectedOutput = correctResults[i].stdout
          ? correctResults[i].stdout.trim()
          : "";
        return {
          actual: userOutput,
          status: r.status.description,
          passed: userOutput === expectedOutput,
        };
      });

      return NextResponse.json({ results: finalResults });
    }

    return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

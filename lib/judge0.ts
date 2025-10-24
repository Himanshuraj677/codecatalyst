// lib/judge0.ts
const JUDGE0_URL = process.env.JUDGE0_URL;
if (!JUDGE0_URL) throw new Error("❌ JUDGE0_URL is not set in environment variables.");

type TestCase = { input: string };

/**
 * Submits multiple test cases in a single Judge0 batch request.
 * Returns array of submission tokens.
 */
export async function submitBatch(code: string, languageId: number, testCases: TestCase[]) {
  const submissions = testCases.map(tc => ({
    source_code: code,
    language_id: languageId,
    stdin: tc.input,
  }));

  const res = await fetch(`${JUDGE0_URL}/submissions/batch?base64_encoded=false&wait=false`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ submissions }),
  });

  const data = await res.json();

  if (!Array.isArray(data)) {
    console.error("Judge0 batch submission failed:", data);
    throw new Error("Failed to submit batch");
  }

  return data.map((s: any) => s.token);
}

/**
 * Fetches results for a batch of submission tokens.
 */
export async function getBatchResults(tokens: string[]) {
  if (!tokens.length) return [];

  const res = await fetch(
    `${JUDGE0_URL}/submissions/batch?tokens=${tokens.join(",")}&base64_encoded=false`
  );

  const data = await res.json();
  return data.submissions;
}

/**
 * Submits and waits for a single code execution result.
 */
export async function runSingle(code: string, languageId: number, input: string) {
  const res = await fetch(`${JUDGE0_URL}/submissions?base64_encoded=false&wait=true`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ source_code: code, language_id: languageId, stdin: input }),
  });

  return res.json();
}

/**
 * Polls Judge0 until all batch results are completed.
 */
export async function pollResults(tokens: string[], interval = 400) {
  while (true) {
    const res = await getBatchResults(tokens);
    const allDone = res.every(r => r.status.id > 2);
    if (allDone) return res;
    await new Promise(resolve => setTimeout(resolve, interval));
  }
}

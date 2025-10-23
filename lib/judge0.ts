// lib/judge0.ts
const JUDGE0_URL = process.env.JUDGE0_URL;

type TestCase = { input: string };

export async function submitBatch(code: string, languageId: number, testCases: TestCase[]) {
  const submissions = testCases.map(tc => ({
    source_code: code,
    language_id: languageId,
    stdin: tc.input
  }));

  const res = await fetch(`${JUDGE0_URL}/submissions/batch?base64_encoded=false&wait=false`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ submissions })
  });

  const data = await res.json();

  if (!Array.isArray(data)) {
    console.error("Judge0 batch submission failed:", data);
    throw new Error("Failed to submit batch");
  }

  // Map over data array
  return data.map((s: any) => s.token);
}


export async function getBatchResults(tokens: string[]) {
  if (!JUDGE0_URL)
    throw new Error("JUDGE0_URL is not set in environment variables");
  if (!tokens.length) return [];

  const res = await fetch(
    `${JUDGE0_URL}/submissions/batch?tokens=${tokens.join(
      ","
    )}&base64_encoded=false`
  );

  const data = await res.json();
  return data.submissions;
}

// Single submission helper for run mode with wait=true
export async function runSingle(
  code: string,
  languageId: number,
  input: string
) {
  if (!JUDGE0_URL)
    throw new Error("JUDGE0_URL is not set in environment variables");

  const res = await fetch(
    `${JUDGE0_URL}/submissions?base64_encoded=false&wait=true`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source_code: code,
        language_id: languageId,
        stdin: input,
      }),
    }
  );

  return res.json();
}

export async function pollResults(tokens: string[], interval = 300) {
  return new Promise<any[]>((resolve) => {
    const check = async () => {
      const res = await getBatchResults(tokens);
      if (res.every((r) => r.status.id > 2)) return resolve(res);
      setTimeout(check, interval);
    };
    check();
  });
}


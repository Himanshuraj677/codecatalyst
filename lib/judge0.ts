const JUDGE0_URL = process.env.JUDGE0_URL;
if (!JUDGE0_URL)
  throw new Error("❌ JUDGE0_URL is not set in environment variables.");

type TestCase = { input: string };

/** 🔹 Utility: Base64 encode/decode helpers */
function encodeBase64(str: string) {
  return Buffer.from(str, "utf-8").toString("base64");
}

function decodeBase64(str?: string) {
  return str ? Buffer.from(str, "base64").toString("utf-8") : "";
}

/**
 * 🔹 Submit multiple test cases as a batch (Base64 encoded)
 * Returns array of submission tokens.
 */
export async function submitBatch(
  code: string,
  languageId: number,
  testCases: TestCase[]
) {
  const submissions = testCases.map((tc) => ({
    source_code: encodeBase64(code),
    language_id: languageId,
    stdin: encodeBase64(tc.input),
  }));

  const res = await fetch(
    `${JUDGE0_URL}/submissions/batch?base64_encoded=true&wait=false`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ submissions }),
    }
  );

  const data = await res.json();

  // Some Judge0 instances wrap in { submissions: [...] }
  const arr = Array.isArray(data) ? data : data.submissions;

  if (!Array.isArray(arr)) {
    console.error("Judge0 batch submission failed:", data);
    throw new Error("Failed to submit batch");
  }

  return arr.map((s: any) => s.token);
}

/**
 * 🔹 Fetch batch results (Base64 decoding applied)
 */
export async function getBatchResults(tokens: string[]) {
  if (!tokens.length) return [];

  const res = await fetch(
    `${JUDGE0_URL}/submissions/batch?tokens=${tokens.join(
      ","
    )}&base64_encoded=true`
  );

  const data = await res.json();
  const results = data.submissions || [];

  // Decode outputs safely
  return results.map((r: any) => ({
    ...r,
    stdout: decodeBase64(r.stdout),
    stderr: decodeBase64(r.stderr),
    compile_output: decodeBase64(r.compile_output),
    message: decodeBase64(r.message),
  }));
}

/**
 * 🔹 Submit and wait for a single code execution result (Base64 encoded)
 */
export async function runSingle(
  code: string,
  languageId: number,
  input: string
) {
  const res = await fetch(
    `${JUDGE0_URL}/submissions?base64_encoded=true&wait=true`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source_code: encodeBase64(code),
        language_id: languageId,
        stdin: encodeBase64(input),
      }),
    }
  );

  const result = await res.json();
  return {
    ...result,
    stdout: decodeBase64(result.stdout),
    stderr: decodeBase64(result.stderr),
    compile_output: decodeBase64(result.compile_output),
    message: decodeBase64(result.message),
  };
}

/**
 * 🔹 Poll until all results are completed
 */
export async function pollResults(tokens: string[], interval = 400) {
  while (true) {
    const results = await getBatchResults(tokens);
    const allDone = results.every((r) => r.status?.id > 2);
    if (allDone) {
      return results;
    }
    await new Promise((resolve) => setTimeout(resolve, interval));
  }
}

import { list, get } from "@vercel/blob";

// Helper to read a script by its hash id
export async function readScriptById(id: string): Promise<string | null> {
  const key = `scripts/${id}.txt`;
  try {
    const file = await get(key);
    const text = await (await fetch(file.url)).text();
    return text;
  } catch {
    // fallback: some old uploads may have slightly different keys
    // try to find by prefix
    const files = await list({ prefix: `scripts/${id}` });
    if (files.blobs[0]) {
      const text = await (await fetch(files.blobs[0].url)).text();
      return text;
    }
    return null;
  }
}

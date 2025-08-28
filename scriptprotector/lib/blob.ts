import { list, get } from "@vercel/blob";

export async function readScriptById(id: string): Promise<string | null> {
  const key = `scripts/${id}.txt`;

  try {
    // Try exact key first
    const file = await get(key);
    return await (await fetch(file.url)).text();
  } catch {
    // Fallback: search blobs by prefix
    try {
      const files = await list({ prefix: `scripts/${id}` });
      if (files.blobs.length > 0) {
        const file = files.blobs[0];
        return await (await fetch(file.url)).text();
      }
    } catch {
      return null;
    }
  }

  return null;
}

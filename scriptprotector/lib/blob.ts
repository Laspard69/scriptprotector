import { get } from "@vercel/blob";

export async function readScriptById(id: string): Promise<string | null> {
  try {
    const file = await get(`scripts/${id}.txt`);
    return await (await fetch(file.url)).text();
  } catch {
    return null;
  }
}

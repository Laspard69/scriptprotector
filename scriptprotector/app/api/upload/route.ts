import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

export const runtime = "edge";

async function sha512Hex(input: string) {
  const enc = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-512", enc);
  return Array.from(new Uint8Array(digest))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function POST(req: Request) {
  const { script } = (await req.json()) as { script?: string };
  if (!script || typeof script !== "string") {
    return NextResponse.json({ error: "No script" }, { status: 400 });
  }

  const id = await sha512Hex(script);
  const key = `scripts/${id}.txt`;
  await put(key, script, {
    access: "public",
    contentType: "text/plain; charset=utf-8",
  });

  // Build origin dynamically from the incoming request (no env var needed)
  const origin = new URL(req.url).origin; // -> https://scriptprotector.vercel.app
  return NextResponse.json({ id, url: `${origin}/raw/${id}` });
}

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
  if (!script) {
    return NextResponse.json({ error: "No script" }, { status: 400 });
  }

  const id = await sha512Hex(script);

  // ✅ force key with pathname
  const { url } = await put(`scripts/${id}.txt`, script, {
    access: "public",
    contentType: "text/plain; charset=utf-8",
    // NEW: explicit pathname makes it stable
    pathname: `scripts/${id}.txt`,
  });

  const origin = new URL(req.url).origin;
  return NextResponse.json({ id, url: `${origin}/raw/${id}` });
}

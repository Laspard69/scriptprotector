import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

export const runtime = "edge";

async function sha512Hex(input: string) {
  const enc = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-512", enc);
  const bytes = new Uint8Array(digest);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, "0")).join("");
}

export async function POST(req: Request) {
  const { script } = await req.json() as { script?: string };
  if (!script || typeof script !== "string") {
    return NextResponse.json({ error: "No script" }, { status: 400 });
  }

  // long, deterministic id like the one you showed
  const id = await sha512Hex(script);

  // store as text/plain, using the hash as the key
  const key = `scripts/${id}.txt`;
  await put(key, script, { access: "public", contentType: "text/plain; charset=utf-8" });

  // canonical raw link (your Vercel domain may differ)
  const origin = process.env.NEXT_PUBLIC_SITE_ORIGIN ?? "https://scriptprotector.vercel.app";
  const url = `${origin}/raw/${id}`;

  return NextResponse.json({ id, url });
}

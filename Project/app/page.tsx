"use client";

import { useState } from "react";

export default function Home() {
  const [script, setScript] = useState("");
  const [link, setLink] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const submit = async () => {
    if (!script.trim()) return;
    setBusy(true);
    setCopied(false);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ script })
      });
      const data = await res.json();
      setLink(data.url);
    } catch (e) {
      alert("Upload failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const copy = async () => {
    if (!link) return;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <main className="relative z-10 mx-auto max-w-3xl p-6 md:p-10">
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          just <span className="text-brand-red">ts</span> vro
        </h1>
        <p className="mt-2 text-white/70">
          Share your script safely. A <span className="text-brand-red/90">/raw</span> link will be generated.
          Use <span className="px-2 py-0.5 rounded bg-white/10">?access=LaspardDaddy</span> to view it.
        </p>
      </header>

      <section className="card p-4 md:p-6">
        <label className="block text-sm mb-2 text-white/70">Paste your script</label>
        <textarea
          value={script}
          onChange={(e) => setScript(e.target.value)}
          placeholder="-- Enter your Lua script here..."
          className="input h-64 resize-y font-mono"
        />
        <div className="mt-4 flex items-center gap-3">
          <button onClick={submit} className="btn hover:shadow-glow"
                  disabled={busy}>
            {busy ? "Uploading..." : "Upload Script"}
          </button>
          <span className="text-xs text-white/50">
            A long hash-based link will be created.
          </span>
        </div>

        {link && (
          <div className="mt-6">
            <label className="block text-sm mb-2 text-white/70">Generated Link:</label>
            <div className="flex gap-2">
              <input className="input font-mono text-xs" readOnly value={link} />
              <button onClick={copy} className="btn w-28">{copied ? "Copied!" : "Copy"}</button>
            </div>
            <p className="mt-2 text-xs text-white/50">
              Add <code className="px-1 bg-white/10 rounded">?access=LaspardDaddy</code> to view.
            </p>
          </div>
        )}
      </section>

      <footer className="mt-10 text-center text-xs text-white/40">
        not sponsored • stay goated
      </footer>
    </main>
  );
}

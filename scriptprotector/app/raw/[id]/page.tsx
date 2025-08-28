import { readScriptById } from "@/lib/blob";

export const dynamic = "force-dynamic"; // always re-render on request

export default async function RawPage({
  params,
  searchParams
}: {
  params: { id: string };
  searchParams: { access?: string };
}) {
  const { id } = params;
  const allowed = searchParams?.access === "LaspardDaddy";

  // If the ?access query is missing/wrong → show 403 page
  if (!allowed) {
    return (
      <main className="min-h-screen grid place-items-center p-6">
        <div className="card p-8 text-center max-w-md">
          <div className="mx-auto mb-4 h-14 w-14 grid place-items-center rounded-full bg-white/5 border border-white/10">
            <span className="text-3xl">🔒</span>
          </div>
          <h1 className="text-5xl font-extrabold text-brand-red">403</h1>
          <h2 className="mt-2 text-xl font-semibold">Access Denied</h2>
          <p className="mt-2 text-white/60">
            You do not have permission to access this page.
          </p>
          <p className="mt-3 text-sm text-white/50">
            Tip: append{" "}
            <code className="px-1 rounded bg-white/10">?access=LaspardDaddy</code>{" "}
            to the URL.
          </p>
        </div>
      </main>
    );
  }

  // Try fetching the script from Vercel Blob
  const script = await readScriptById(id);

  if (script == null) {
    return (
      <main className="min-h-screen grid place-items-center p-6">
        <div className="card p-8 text-center max-w-md">
          <h1 className="text-3xl font-bold">Not Found</h1>
          <p className="text-white/60 mt-2">No script found for this id.</p>
        </div>
      </main>
    );
  }

  // If allowed + script exists → show script content
  return (
    <main className="p-6 md:p-10">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl text-white/70">
          /raw/{id.slice(0, 12)}…
        </h1>
        <button
          className="btn"
          onClick={async () => {
            await navigator.clipboard.writeText(script);
            const el = document.createElement("div");
            el.textContent = "Copied!";
            el.className =
              "fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/10 border border-white/10 px-3 py-1 rounded text-white text-sm";
            document.body.appendChild(el);
            setTimeout(() => el.remove(), 1200);
          }}
        >
          Copy
        </button>
      </div>

      <pre className="card p-4 overflow-x-auto text-sm font-mono whitespace-pre-wrap">
{script}
      </pre>
    </main>
  );
}

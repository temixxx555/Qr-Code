"use client";
export default function ErrorPage({ reset }) {
  return (
    <main className="mx-auto my-20 max-w-sm rounded-2xl border p-6 text-center">
      <h1 className="text-xl font-bold">Temporarily unavailable</h1>
      <p className="my-4 text-sm text-slate-500">
        We couldn’t open this page. Please try again.
      </p>
      <button
        onClick={reset}
        className="rounded-xl bg-emerald-600 px-5 py-3 text-white"
      >
        Try again
      </button>
    </main>
  );
}

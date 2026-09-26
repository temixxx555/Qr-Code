"use client";
export const button =
  "inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:cursor-not-allowed disabled:opacity-50";
export const secondary =
  "inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50";
export function Card({ title, children, className = "" }) {
  return (
    <section
      className={`rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 ${className}`}
    >
      {title && (
        <h2 className="mb-4 text-lg font-semibold text-slate-900">{title}</h2>
      )}
      {children}
    </section>
  );
}
export function Field({ label, children }) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-700">
      {label}
      {children}
    </label>
  );
}
export const input =
  "w-full min-w-0 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-emerald-600 focus:outline-emerald-600";
export function Notice({ error, children }) {
  return (
    <p
      role={error ? "alert" : "status"}
      className={`rounded-xl p-4 text-sm ${error ? "bg-red-50 text-red-800" : "bg-emerald-50 text-emerald-900"}`}
    >
      {children}
    </p>
  );
}
export function DateText({ value }) {
  return value
    ? new Date(value).toLocaleDateString("en-NG", { dateStyle: "medium" })
    : "—";
}

import { Picture, Intro, Action } from "../presentation";

export default function Preview({ content: c }) {
  return (
    <article className="min-h-full bg-slate-100 p-5">
      <div className="my-7 rounded-tr-[40px] border bg-white p-8 shadow-sm">
        <span className="text-5xl text-red-500">▤</span>
        <p className="mt-5 text-xs font-bold uppercase tracking-widest text-red-500">
          PDF Document
        </p>
      </div>
      <Intro title={c.title || "Your document"} description={c.description} />
      <p className="my-4 text-xs text-slate-500">
        {c.filename || "PDF file"}{" "}
        {c.size ? " · " + (c.size / 1048576).toFixed(2) + " MB" : ""}
      </p>
      <Action href={c.url}>{c.ctaLabel || "View PDF"}</Action>
      <Action href={c.url} download>
        Download PDF
      </Action>
    </article>
  );
}

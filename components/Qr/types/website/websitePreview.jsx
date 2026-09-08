import { Picture, Intro, Action } from "../presentation";
import { safeUrl } from "@/lib/qr-content";
export default function Preview({ content: c }) {
  const url = safeUrl(c.websiteUrl || c.url);
  return (
    <article className="min-h-full bg-slate-100 p-5">
      <div className="rounded-lg border bg-white px-3 py-2 text-xs text-slate-500">
        🔒 {url ? new URL(url).hostname : "Website preview"}
      </div>
      <div className="mt-16 rounded-2xl bg-white p-5 shadow-sm">
        <div className="mb-4 text-4xl text-emerald-600">↗</div>
        <Intro
          title="Visit website"
          description="Scanning opens this destination in your browser."
        />
        <p className="my-5 break-all text-xs text-slate-500">
          {url || "Enter a website URL"}
        </p>
        <Action href={url}>Open website</Action>
      </div>
    </article>
  );
}

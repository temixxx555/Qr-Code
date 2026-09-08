import { Picture, Intro, Action } from "../presentation";
import { safeUrl } from "@/lib/qr-content";
export default function Preview({ content: c }) {
  const url = safeUrl(c.url);
  const hosted =
    /[.](mp4|webm)([?]|$)/i.test(url) || url.includes("/api/media/");
  return (
    <article className="min-h-full bg-slate-950 text-white">
      <div className="bg-black">
        {hosted ? (
          <video
            controls
            playsInline
            preload="metadata"
            poster={safeUrl(c.thumbnail)}
            src={url}
            className="aspect-video w-full"
          />
        ) : (
          <>
            <Picture
              src={c.thumbnail}
              alt="Video thumbnail"
              className="h-44 w-full"
            />
            <div className="p-4">
              <Action href={url}>▶ Watch video</Action>
            </div>
          </>
        )}
      </div>
      <div className="p-5">
        <p className="mb-3 text-xs uppercase tracking-widest text-violet-300">
          Watch & discover
        </p>
        <Intro title={c.title || "Your video"} description={c.description} />
        <Action href={c.ctaUrl}>{c.ctaLabel || "Learn more"}</Action>
      </div>
    </article>
  );
}

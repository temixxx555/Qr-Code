import { Picture, Intro, Action } from "../presentation";
import { safeUrl } from "@/lib/qr-content";
export default function Preview({ content: c }) {
  return (
    <article className="min-h-full bg-gradient-to-b from-indigo-950 to-slate-900 p-5 text-white">
      <Picture
        src={c.cover}
        alt={c.title || "Album artwork"}
        className="mt-6 aspect-square w-full rounded-xl shadow-xl"
      />
      <div className="my-6">
        <Intro title={c.title || "Your track"} description={c.artist} />
      </div>
      {safeUrl(c.url) && (
        <audio
          controls
          preload="metadata"
          src={safeUrl(c.url)}
          className="w-full"
        />
      )}
      <p className="my-5 text-sm text-slate-300">{c.description}</p>
      <Action href={c.url}>Open audio</Action>
    </article>
  );
}

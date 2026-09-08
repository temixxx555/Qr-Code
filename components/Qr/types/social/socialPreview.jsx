import SocialMark from "../SocialMark";
import { Picture, Intro, Action } from "../presentation";

export default function Preview({ content: c }) {
  return (
    <article className="min-h-full bg-slate-950 p-5 text-white">
      <div className="my-6 flex items-center gap-3">
        <Picture
          src={c.avatar}
          alt={c.title || "Profile"}
          className="h-16 w-16 rounded-2xl"
        />
        <Intro title={c.title || "Stay connected"} />
      </div>
      <p className="mb-7 text-sm text-slate-400">{c.description}</p>
      {c.links?.map((l, i) => (
        <div key={i} className="border-b border-white/10 py-1">
          <Action href={l.url}>
            <span className="flex items-center justify-center gap-3">
              <SocialMark label={l.label} url={l.url} />
              {l.label}
              <span aria-hidden="true">↗</span>
            </span>
          </Action>
        </div>
      ))}
    </article>
  );
}

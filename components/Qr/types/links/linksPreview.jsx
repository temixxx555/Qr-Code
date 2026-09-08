import SocialMark from "../SocialMark";
import { Picture, Intro, Action } from "../presentation";
export default function LinksPreview({ content: c }) {
  return (
    <article className="min-h-full bg-gradient-to-b from-violet-100 to-rose-50 px-5 py-9 text-center">
      <Picture
        src={c.avatar}
        alt={c.title || "Profile"}
        className="mx-auto mb-5 h-20 w-20 rounded-full"
      />
      <Intro
        title={c.title || "Your links, together"}
        description={c.description}
      />
      <div className="mt-7 space-y-3">
        {c.links?.length ? (
          c.links.map((l, i) => (
            <Action key={i} href={l.url}>
              <span className="flex items-center justify-center gap-3">
                <SocialMark label={l.label} url={l.url} />
                {l.label}
                <span aria-hidden="true">↗</span>
              </span>
            </Action>
          ))
        ) : (
          <p className="rounded-xl border border-dashed p-5 text-sm text-slate-500">
            Your links will appear here
          </p>
        )}
      </div>
    </article>
  );
}

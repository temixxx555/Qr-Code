import { Picture, Intro, Action } from "../presentation";
import { instagramUrl } from "@/lib/qr-content";
export default function Preview({ content: c }) {
  return (
    <article className="min-h-full bg-gradient-to-b from-rose-50 to-white px-5 py-10 text-center">
      <div className="mx-auto mb-5 w-fit rounded-full bg-gradient-to-tr from-amber-400 via-pink-500 to-violet-600 p-1">
        <Picture
          src={c.avatar}
          alt={c.title || "Profile"}
          className="h-24 w-24 rounded-full border-4 border-white"
        />
      </div>
      <Intro
        title={c.title || c.username || "Your profile"}
        description={c.description}
      />
      <p className="my-5 text-xs text-pink-600">{c.username}</p>
      <Action href={instagramUrl(c.username || c.url)}>
        Explore on Instagram
      </Action>
    </article>
  );
}

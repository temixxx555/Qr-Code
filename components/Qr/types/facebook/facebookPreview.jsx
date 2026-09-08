import { Picture, Intro, Action } from "../presentation";

export default function Preview({ content: c }) {
  return (
    <article className="min-h-full bg-blue-50">
      <Picture src={c.cover} alt="" className="h-28 w-full" />
      <div className="p-5">
        <Picture
          src={c.avatar}
          alt={c.title || "Profile"}
          className="-mt-12 relative mb-5 h-24 w-24 rounded-2xl border-4 border-white"
        />
        <p className="mb-3 text-xs font-semibold text-blue-600">
          Find us on Facebook
        </p>
        <Intro
          title={c.title || "Your community"}
          description={c.description}
        />
        <Action href={c.url}>Visit Facebook</Action>
      </div>
    </article>
  );
}

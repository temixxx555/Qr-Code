import { Picture, Intro, Action } from "../presentation";
import { safeUrl } from "@/lib/qr-content";
export default function Preview({ content: c }) {
  return (
    <article className="min-h-full bg-white p-4">
      <Intro title={c.title || "Your gallery"} description={c.description} />
      <div className="mt-5 grid grid-cols-2 gap-2">
        {c.images?.map((image, i) => (
          <a
            key={i}
            href={safeUrl(image.url)}
            target="_blank"
            rel="noopener noreferrer"
            className={i === 0 ? "col-span-2" : ""}
          >
            <Picture
              src={image.url}
              alt={image.caption || "Gallery image"}
              className={"w-full rounded-xl " + (i === 0 ? "h-52" : "h-28")}
            />
            <p className="py-2 text-xs text-slate-500">{image.caption}</p>
          </a>
        ))}
      </div>
      {!c.images?.length && (
        <div className="my-8 rounded-xl border border-dashed p-8 text-center text-sm text-slate-400">
          Your photos will appear here
        </div>
      )}
    </article>
  );
}

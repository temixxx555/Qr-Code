import { CalendarDays, Clock3, MapPin } from "lucide-react";
import { safeUrl } from "@/lib/qr-content";

function displayDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) return "";
  const date = new Date(`${value}T12:00:00`);
  if (
    !Number.isFinite(date.getTime()) ||
    date.toISOString().slice(0, 10) !== value
  )
    return "";
  return new Intl.DateTimeFormat("en", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default function ProgrammePreview({ content = {} }) {
  const cover = safeUrl(content.cover);
  const crest = safeUrl(content.crest);
  const items = (
    Array.isArray(content.programmeItems) ? content.programmeItems : []
  ).filter((item) => item?.title?.trim());
  const date = displayDate(content.date);

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <header className="relative">
        {cover ? (
          <img
            src={cover}
            alt={content.title ? `${content.title} banner` : "Event banner"}
            className="h-64 w-full object-cover sm:h-80"
          />
        ) : (
          <div className="h-64 bg-gradient-to-br from-emerald-800 via-teal-700 to-slate-900 sm:h-80" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
        <div className="absolute -bottom-12 left-1/2 flex h-24 w-24 -translate-x-1/2 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-white shadow-lg sm:h-28 sm:w-28">
          {crest ? (
            <img
              src={crest}
              alt="Event logo or crest"
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="px-2 text-center text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Logo or crest
            </span>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-5 pb-12 pt-20 sm:px-8">
        <section className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-700">
            Programme of events
          </p>
          <h1 className="mt-3 break-words text-3xl font-bold tracking-tight sm:text-4xl">
            {content.title || "Your event name"}
          </h1>
          {content.host && (
            <p className="mt-2 text-sm text-slate-500">
              Hosted by {content.host}
            </p>
          )}
          {content.intro && (
            <p className="mx-auto mt-4 max-w-lg whitespace-pre-line text-sm leading-6 text-slate-600">
              {content.intro}
            </p>
          )}
          {(date || content.venue) && (
            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-slate-600">
              {date && (
                <span className="inline-flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-emerald-700" />
                  {date}
                </span>
              )}
              {content.venue && (
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-emerald-700" />
                  {content.venue}
                </span>
              )}
            </div>
          )}
        </section>

        <section className="mt-10">
          <h2 className="mb-5 text-xl font-bold">Programme of events</h2>
          {items.length ? (
            <ol className="relative space-y-0 before:absolute before:bottom-8 before:left-[19px] before:top-8 before:w-px before:bg-emerald-200">
              {items.map((item, index) => (
                <li
                  key={`${item.title}-${index}`}
                  className="relative flex gap-4 pb-5 last:pb-0"
                >
                  <span className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-emerald-600 bg-white text-sm font-bold text-emerald-700">
                    {index + 1}
                  </span>
                  <article className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    {item.time && (
                      <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                        <Clock3 className="h-3.5 w-3.5" />
                        {item.time}
                      </p>
                    )}
                    <h3 className="break-words font-semibold">{item.title}</h3>
                    {item.detail && (
                      <p className="mt-1 whitespace-pre-line text-sm leading-6 text-slate-500">
                        {item.detail}
                      </p>
                    )}
                  </article>
                </li>
              ))}
            </ol>
          ) : (
            <p className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
              The event programme will appear here.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}

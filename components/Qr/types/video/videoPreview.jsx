import {
  Play,
  ExternalLink,
  Sparkles,
  Clapperboard,
} from "lucide-react";

import { Picture, Intro, Action } from "../presentation";
import { safeUrl } from "@/lib/qr-content";

export default function Preview({ content: c }) {
  const url = safeUrl(c.url);
  const thumbnail = safeUrl(c.thumbnail);

  const hosted =
    /[.](mp4|webm)([?]|$)/i.test(url) ||
    url.includes("/api/media/");

  return (
    <article className="relative flex min-h-full w-full flex-col overflow-hidden bg-[#090b12] text-white">
      {/* BACKGROUND GLOW */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-120px] h-[340px] w-[340px] -translate-x-1/2 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="absolute -bottom-28 -left-24 h-[300px] w-[300px] rounded-full bg-fuchsia-600/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-[300px] w-[300px] rounded-full bg-indigo-500/10 blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "22px 22px",
          }}
        />
      </div>

      <div className="relative mx-auto flex min-h-full w-full max-w-[720px] flex-1 flex-col px-[5%] py-5">
        {/* TOP LABEL */}
        <div className="flex items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 backdrop-blur-xl">
            <Clapperboard className="h-3.5 w-3.5 text-violet-300" />

            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/60">
              Video
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 text-[10px] font-medium text-white/35">
            <Sparkles className="h-3.5 w-3.5" />
            Watch & discover
          </div>
        </div>

        {/* VIDEO */}
        <div className="mt-5 overflow-hidden rounded-[24px] border border-white/10 bg-black shadow-[0_24px_70px_-30px_rgba(0,0,0,0.95)]">
          {hosted && url ? (
            <video
              controls
              playsInline
              preload="metadata"
              poster={thumbnail}
              src={url}
              className="aspect-video w-full bg-black object-contain"
            />
          ) : (
            <div className="relative aspect-video w-full overflow-hidden bg-black">
              <Picture
                src={thumbnail}
                alt={c.title || "Video thumbnail"}
                className="h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-black/10" />

              {url && (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 flex items-center justify-center"
                  aria-label="Watch video"
                >
                  <span className="group flex h-[62px] w-[62px] items-center justify-center rounded-full border border-white/25 bg-white/15 text-white shadow-2xl backdrop-blur-xl transition-all duration-200 hover:scale-105 hover:bg-white/20 active:scale-95">
                    <Play
                      className="ml-1 h-6 w-6 fill-current"
                      strokeWidth={1.7}
                    />
                  </span>
                </a>
              )}

              <div className="pointer-events-none absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <span className="rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-[9px] font-medium text-white/70 backdrop-blur-md">
                  Tap to play
                </span>
              </div>
            </div>
          )}
        </div>

        {/* CONTENT */}
        <section className="mt-6 rounded-[26px] border border-white/[0.08] bg-white/[0.055] p-[clamp(18px,5%,28px)] shadow-[0_18px_55px_-30px_rgba(0,0,0,0.85)] backdrop-blur-xl">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-violet-500/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-violet-300 ring-1 ring-inset ring-violet-400/10">
            <Sparkles className="h-3 w-3" />
            Featured video
          </div>

          <h1 className="break-words text-[26px] font-bold leading-[1.1] tracking-[-0.04em] text-white">
            {c.title || "Your video"}
          </h1>

          {c.description && (
            <p className="mt-3 whitespace-pre-line text-[13px] leading-6 text-white/55">
              {c.description}
            </p>
          )}

          {!hosted && url && (
            <div className="mt-6">
              <Action href={url}>
                <span className="flex items-center justify-center gap-2">
                  <Play
                    className="h-4 w-4 fill-current"
                    strokeWidth={1.8}
                  />
                  Watch video
                </span>
              </Action>
            </div>
          )}

          {c.ctaUrl && (
            <div className={url && !hosted ? "mt-2.5" : "mt-6"}>
              <Action
                href={c.ctaUrl}
                className="!bg-white !text-slate-900 !shadow-none hover:!bg-slate-100 hover:!shadow-none"
              >
                <span className="flex items-center justify-center gap-2">
                  {c.ctaLabel || "Learn more"}

                  <ExternalLink
                    className="h-4 w-4"
                    strokeWidth={1.9}
                  />
                </span>
              </Action>
            </div>
          )}
        </section>

        {/* FOOTER */}
        <div className="mt-auto pt-6 text-center">
          <p className="text-[9px] font-medium text-white/25">
            Powered by{" "}
            <span className="font-semibold text-white/40">
              Online QR Generator
            </span>
          </p>
        </div>
      </div>
    </article>
  );
}
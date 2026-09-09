import {
  Music2,
  Play,
  ExternalLink,
  Disc3,
  Headphones,
  Download,
  Sparkles,
} from "lucide-react";

import { Picture, Action } from "../presentation";
import { safeUrl } from "@/lib/qr-content";
import Link from "next/link";

export default function Preview({ content: c }) {
  const audioUrl = safeUrl(c.url);
  const cover = safeUrl(c.cover);

  return (
    <article className="relative flex min-h-full w-full flex-col overflow-hidden bg-[#090b14] text-white">
      {/* BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-150px] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="absolute -left-28 bottom-0 h-[320px] w-[320px] rounded-full bg-violet-600/15 blur-3xl" />
        <div className="absolute -right-28 bottom-20 h-[300px] w-[300px] rounded-full bg-cyan-500/10 blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "22px 22px",
          }}
        />
      </div>

      <div className="relative mx-auto flex min-h-full w-full max-w-[620px] flex-1 flex-col px-[5%] py-6">
        {/* TOP BAR */}
        <div className="flex items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 backdrop-blur-xl">
            <Headphones className="h-3.5 w-3.5 text-violet-300" />

            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/55">
              Audio
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 text-[10px] font-medium text-white/30">
            <Sparkles className="h-3.5 w-3.5" />
            Now playing
          </div>
        </div>

        {/* PLAYER */}
        <section className="mt-6 overflow-hidden rounded-[28px] border border-white/[0.08] bg-white/[0.055] p-[5%] shadow-[0_30px_80px_-35px_rgba(0,0,0,0.95)] backdrop-blur-xl">
          {/* ARTWORK */}
          <div className="relative mx-auto aspect-square w-full max-w-[440px] overflow-hidden rounded-[24px] bg-slate-900 shadow-[0_26px_70px_-28px_rgba(0,0,0,1)]">
            <Picture
              src={cover}
              alt={c.title || "Album artwork"}
              className="h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/5" />

            {/* Floating music badge */}
            <div className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-[13px] border border-white/15 bg-black/25 text-white backdrop-blur-xl">
              <Music2 className="h-4 w-4" />
            </div>

            {/* Bottom overlay */}
            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-[9px] font-medium text-white/70 backdrop-blur-md">
                <Disc3 className="h-3 w-3 animate-[spin_5s_linear_infinite]" />
                Audio track
              </div>
            </div>
          </div>

          {/* TRACK DETAILS */}
          <div className="mt-6 text-center">
            <h1 className="break-words text-[27px] font-bold leading-[1.08] tracking-[-0.04em] text-white">
              {c.title || "Your track"}
            </h1>

            {c.artist && (
              <p className="mt-2 text-[12px] font-medium text-violet-300">
                {c.artist}
              </p>
            )}

            {c.description && (
              <p className="mx-auto mt-4 max-w-[440px] whitespace-pre-line text-[12px] leading-5.5 text-white/45">
                {c.description}
              </p>
            )}
          </div>

          {/* AUDIO PLAYER */}
          {audioUrl && (
            <div className="mt-6 rounded-[18px] border border-white/[0.07] bg-black/20 p-3">
              <audio
                controls
                preload="metadata"
                src={audioUrl}
                className="block h-[42px] w-full"
              />
            </div>
          )}

       {/* AUDIO ACTIONS */}
{audioUrl && (
  <div className="mt-4 space-y-2.5">
    <Action
      href={audioUrl}
      className="
        !min-h-[52px]
        !rounded-[16px]
        !bg-gradient-to-r
        !from-indigo-600
        !via-violet-600
        !to-fuchsia-600
        !shadow-[0_14px_30px_-14px_rgba(124,58,237,0.7)]
        hover:!shadow-[0_18px_36px_-14px_rgba(124,58,237,0.8)]
      "
    >
      <span className="flex items-center justify-center gap-2">
        <Play
          className="h-4 w-4 fill-current"
          strokeWidth={1.8}
        />

        Open audio

        <ExternalLink
          className="h-3.5 w-3.5"
          strokeWidth={2}
        />
      </span>
    </Action>

    <Action
      href={audioUrl}
      download
      filename={c.filename || "audio.mp3"}
      className="
        !min-h-[50px]
        !rounded-[16px]
        !border
        !border-white/10
        !bg-white/[0.06]
        !text-white/80
        !shadow-none
        backdrop-blur-xl
        hover:!bg-white/[0.1]
        hover:!text-white
      "
    >
      <span className="flex items-center justify-center gap-2">
        <Download
          className="h-4 w-4"
          strokeWidth={1.9}
        />

        Download audio
      </span>
    </Action>
  </div>
)}
        </section>

        {/* EMPTY AUDIO STATE */}
        {!audioUrl && (
          <div className="mt-4 rounded-[20px] border border-dashed border-white/10 bg-white/[0.035] px-5 py-7 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.06] text-white/50">
              <Music2 className="h-5 w-5" />
            </div>

            <p className="mt-3 text-[13px] font-semibold text-white/70">
              Your audio will appear here
            </p>

            <p className="mx-auto mt-1 max-w-[230px] text-[10px] leading-4 text-white/30">
              Add an audio file or URL to create your listening page.
            </p>
          </div>
        )}

        {/* FOOTER */}
        <Link href={"/"}>
        <div className="mt-auto pt-7 text-center">
          <p className="text-[9px] font-medium text-white/25">
            Powered by{" "}
            <span className="font-semibold text-white/40">
              Smart QR 
            </span>
          </p>
        </div>
        </Link>
      </div>
    </article>
  );
}
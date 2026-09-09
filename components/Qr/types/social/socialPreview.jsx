import {
  ExternalLink,
  Share2,
  Sparkles,
  Users,
} from "lucide-react";

import SocialMark from "../SocialMark";
import { Picture } from "../presentation";
import Link from "next/link";

export default function Preview({ content: c }) {
  const links = Array.isArray(c.links) ? c.links : [];

  return (
    <article className="relative flex min-h-full w-full flex-col overflow-hidden bg-[#0b1020] text-white">
      {/* BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 -top-20 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute -right-24 top-28 h-72 w-72 rounded-full bg-violet-500/15 blur-3xl" />
        <div className="absolute bottom-[-120px] left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />

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
            <Share2 className="h-3.5 w-3.5 text-cyan-300" />

            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/55">
              Social profile
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 text-[10px] font-medium text-white/30">
            <Sparkles className="h-3.5 w-3.5" />
            Connect
          </div>
        </div>

        {/* PROFILE */}
        <div className="mt-7 text-center">
          <div className="relative mx-auto w-fit">
            <div className="absolute -inset-1 rounded-[26px] bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-600 opacity-80 blur-[2px]" />

            <Picture
              src={c.avatar}
              alt={c.title || "Profile"}
              className="relative h-[92px] w-[92px] rounded-[24px] border-[3px] border-[#0b1020] object-cover shadow-2xl"
            />

            <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-xl border-2 border-[#0b1020] bg-white text-slate-900 shadow-lg">
              <Users className="h-4 w-4" />
            </div>
          </div>

          <div className="mx-auto mt-5 max-w-[430px]">
            <h1 className="break-words text-[26px] font-bold leading-[1.1] tracking-[-0.04em] text-white">
              {c.title || "Stay connected"}
            </h1>

            {c.description && (
              <p className="mx-auto mt-3 whitespace-pre-line text-[13px] leading-6 text-white/50">
                {c.description}
              </p>
            )}
          </div>
        </div>

        {/* SOCIAL LINKS */}
        <div className="mt-7 space-y-2.5">
          {links.length > 0 ? (
            links.map((link, index) => (
              <a
                key={`${link.url}-${index}`}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  group
                  flex
                  min-h-[58px]
                  w-full
                  items-center
                  gap-3
                  rounded-[18px]
                  border
                  border-white/[0.08]
                  bg-white/[0.055]
                  px-3.5
                  py-3
                  shadow-[0_12px_34px_-20px_rgba(0,0,0,0.8)]
                  backdrop-blur-xl
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:border-white/[0.14]
                  hover:bg-white/[0.09]
                  hover:shadow-[0_18px_38px_-20px_rgba(0,0,0,0.9)]
                  active:translate-y-0
                  active:scale-[0.99]
                "
              >
                {/* SOCIAL ICON */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] bg-white text-slate-900 shadow-sm">
                  <SocialMark
                    label={link.label}
                    url={link.url}
                  />
                </div>

                {/* LABEL */}
                <div className="min-w-0 flex-1 text-left">
                  <p className="truncate text-[13px] font-semibold text-white">
                    {link.label || "Social link"}
                  </p>

                  <p className="mt-0.5 text-[10px] text-white/30">
                    Tap to connect
                  </p>
                </div>

                {/* ARROW */}
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.05] text-white/40 transition group-hover:bg-white/[0.09] group-hover:text-white">
                  <ExternalLink
                    className="h-4 w-4"
                    strokeWidth={1.9}
                  />
                </div>
              </a>
            ))
          ) : (
            <div className="rounded-[22px] border border-dashed border-white/15 bg-white/[0.04] px-6 py-10 text-center backdrop-blur-xl">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.07] text-white/60">
                <Share2 className="h-5 w-5" />
              </div>

              <p className="mt-4 text-sm font-semibold text-white/80">
                Your social links will appear here
              </p>

              <p className="mx-auto mt-1 max-w-[240px] text-xs leading-5 text-white/35">
                Add your social profiles so people can connect with you in one
                place.
              </p>
            </div>
          )}
        </div>

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
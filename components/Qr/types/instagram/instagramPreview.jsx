import {
  ExternalLink,
  Sparkles,
  AtSign,
} from "lucide-react";

import {  FaInstagram as Instagram  } from "react-icons/fa";


import { Picture, Action } from "../presentation";
import { instagramUrl } from "@/lib/qr-content";

export default function Preview({ content: c }) {
  const profileUrl = instagramUrl(c.username || c.url);

  const username = c.username
    ? String(c.username).replace(/^@/, "")
    : "";

  return (
    <article className="relative flex min-h-full w-full flex-col overflow-hidden bg-[#fffafc] text-slate-900">
      {/* BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-28 -top-24 h-[320px] w-[320px] rounded-full bg-pink-200/45 blur-3xl" />
        <div className="absolute -right-28 top-24 h-[300px] w-[300px] rounded-full bg-violet-200/40 blur-3xl" />
        <div className="absolute bottom-[-120px] left-1/2 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-orange-100/45 blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgb(15 23 42) 1px, transparent 0)",
            backgroundSize: "22px 22px",
          }}
        />
      </div>

      <div className="relative mx-auto flex min-h-full w-full max-w-[600px] flex-1 flex-col px-[5%] py-6">
        {/* TOP BRAND */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-400 via-pink-500 to-violet-600 text-white shadow-sm">
              <Instagram className="h-4 w-4" />
            </div>

            <span className="text-[11px] font-semibold text-slate-700">
              Instagram
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full border border-pink-100 bg-white/70 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.1em] text-pink-500 backdrop-blur">
            <Sparkles className="h-3 w-3" />
            Social
          </div>
        </div>

        {/* PROFILE CARD */}
        <div className="flex flex-1 items-center justify-center py-7">
          <section className="relative w-full overflow-hidden rounded-[30px] border border-white bg-white/90 shadow-[0_28px_80px_-38px_rgba(76,29,149,0.38)] backdrop-blur-xl">
            {/* TOP GRADIENT */}
            <div className="relative h-[100px] overflow-hidden bg-gradient-to-r from-amber-400 via-pink-500 to-violet-600">
              <div className="absolute inset-0 bg-white/5" />

              <div className="absolute -right-12 -top-14 h-36 w-36 rounded-full border border-white/20" />
              <div className="absolute -right-2 -top-6 h-20 w-20 rounded-full border border-white/20" />
              <div className="absolute -left-10 bottom-[-70px] h-32 w-32 rounded-full bg-white/10 blur-xl" />
            </div>

            <div className="px-[7%] pb-7">
              {/* AVATAR */}
              <div className="relative -mt-[52px] mx-auto w-fit">
                <div className="absolute -inset-[5px] rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-violet-600 shadow-lg" />

                <div className="relative rounded-full bg-white p-[4px]">
                  <Picture
                    src={c.avatar}
                    alt={c.title || username || "Profile"}
                    className="h-[94px] w-[94px] rounded-full object-cover"
                  />
                </div>
              </div>

              {/* PROFILE INFO */}
              <div className="mt-5 text-center">
                <h1 className="break-words text-[26px] font-bold leading-[1.1] tracking-[-0.04em] text-slate-950">
                  {c.title || username || "Your profile"}
                </h1>

                {username && (
                  <div className="mt-2 inline-flex max-w-full items-center justify-center gap-1 text-[12px] font-medium text-pink-600">
                    <AtSign className="h-3.5 w-3.5 shrink-0" />

                    <span className="truncate">
                      {username}
                    </span>
                  </div>
                )}

                {c.description && (
                  <p className="mx-auto mt-4 max-w-[430px] whitespace-pre-line text-[13px] leading-6 text-slate-500">
                    {c.description}
                  </p>
                )}
              </div>

              {/* DECORATIVE DIVIDER */}
              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-slate-200" />

                <Instagram className="h-4 w-4 text-pink-400" />

                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-slate-200" />
              </div>

              {/* CTA */}
              {profileUrl && (
                <Action
                  href={profileUrl}
                  className="
                    !min-h-[52px]
                    !rounded-[16px]
                    !bg-gradient-to-r
                    !from-[#f97316]
                    !via-[#ec4899]
                    !to-[#7c3aed]
                    !shadow-[0_14px_28px_-14px_rgba(219,39,119,0.65)]
                    hover:!shadow-[0_18px_34px_-14px_rgba(219,39,119,0.75)]
                  "
                >
                  <span className="flex items-center justify-center gap-2">
                    <Instagram
                      className="h-4 w-4"
                      strokeWidth={2}
                    />

                    Explore on Instagram

                    <ExternalLink
                      className="h-3.5 w-3.5"
                      strokeWidth={2}
                    />
                  </span>
                </Action>
              )}

              <p className="mt-4 text-center text-[10px] leading-4 text-slate-400">
                Open the profile to see posts, reels and more.
              </p>
            </div>
          </section>
        </div>

        {/* FOOTER */}
        <p className="text-center text-[9px] font-medium text-slate-400">
          Powered by{" "}
          <span className="font-semibold text-slate-500">
            Online QR Generator
          </span>
        </p>
      </div>
    </article>
  );
}
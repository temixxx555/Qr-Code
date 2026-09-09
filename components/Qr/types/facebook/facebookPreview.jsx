import {
  
  ExternalLink,
  Users,
  Sparkles,
} from "lucide-react";
import { FaFacebook as Facebook  } from "react-icons/fa";
import { Picture, Action } from "../presentation";
import Link from "next/link";

export default function Preview({ content: c }) {
  return (
    <article className="relative flex min-h-full w-full flex-col overflow-hidden bg-[#f6f8fc] text-slate-900">
      {/* BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-blue-100/60 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-indigo-100/50 blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgb(15 23 42) 1px, transparent 0)",
            backgroundSize: "22px 22px",
          }}
        />
      </div>

      <div className="relative mx-auto flex min-h-full w-full max-w-[640px] flex-1 flex-col">
        {/* COVER */}
        <div className="relative h-[150px] w-full overflow-hidden">
          <Picture
            src={c.cover}
            alt={c.title || "Facebook cover"}
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

          <div className="absolute left-[5%] top-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/20 px-3 py-1.5 text-[10px] font-semibold text-white backdrop-blur-md">
            <Facebook className="h-3.5 w-3.5 fill-current" />
            Facebook
          </div>
        </div>

        {/* CARD */}
        <div className="relative mx-auto -mt-8 w-[90%] max-w-[560px] pb-7">
          <section className="overflow-hidden rounded-[28px] border border-white/80 bg-white/95 shadow-[0_24px_70px_-30px_rgba(15,23,42,0.35)] backdrop-blur-xl">
            <div className="px-[6%] pb-6">
              {/* AVATAR */}
              <div className="mt-3 flex items-end justify-between gap-3">
                <Picture
                  src={c.avatar}
                  alt={c.title || "Profile"}
                  className="h-[92px] w-[92px] shrink-0 rounded-[24px] border-[4px] border-white object-cover shadow-lg"
                />

                <div className="mb-2 flex h-8 items-center gap-1.5 rounded-full bg-blue-50 px-3 text-[10px] font-semibold text-blue-700 ring-1 ring-blue-100">
                  <Users className="h-3.5 w-3.5" />
                  Community
                </div>
              </div>

              {/* CONTENT */}
              <div className="mt-5">
                <div className="mb-3 inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.11em] text-blue-600">
                  <Sparkles className="h-3.5 w-3.5" />
                  Find us on Facebook
                </div>

                <h1 className="break-words text-[26px] font-bold leading-[1.1] tracking-[-0.04em] text-slate-950">
                  {c.title || "Your community"}
                </h1>

                {c.description && (
                  <p className="mt-3 whitespace-pre-line text-[13px] leading-6 text-slate-500">
                    {c.description}
                  </p>
                )}
              </div>

              {/* FACEBOOK INFO CARD */}
              <div className="mt-6 rounded-[18px] border border-blue-100 bg-blue-50/60 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] bg-[#1877F2] text-white shadow-sm">
                    <Facebook
                      className="h-5 w-5 fill-current"
                      strokeWidth={1.8}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] font-semibold text-slate-800">
                      Connect with us
                    </p>

                    <p className="mt-0.5 text-[10px] leading-4 text-slate-500">
                      See updates, posts and community activity.
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              {c.url && (
                <div className="mt-6">
                  <Action
                    href={c.url}
                    className="
                      !min-h-[52px]
                      !rounded-[16px]
                      !bg-[#1877F2]
                      !shadow-[0_12px_28px_-14px_rgba(24,119,242,0.75)]
                      hover:!bg-[#166FE5]
                      hover:!shadow-[0_16px_34px_-14px_rgba(24,119,242,0.8)]
                    "
                  >
                    <span className="flex items-center justify-center gap-2">
                      <Facebook
                        className="h-4 w-4 fill-current"
                        strokeWidth={1.8}
                      />

                      Visit Facebook

                      <ExternalLink
                        className="h-3.5 w-3.5"
                        strokeWidth={2}
                      />
                    </span>
                  </Action>
                </div>
              )}

              <p className="mt-4 text-center text-[10px] leading-4 text-slate-400">
                Open Facebook to view the latest posts and updates.
              </p>
            </div>
          </section>

          {/* FOOTER */}
          <Link href={"/"}>
          <p className="mt-5 text-center text-[9px] font-medium text-slate-400">
            Powered by{" "}
            <span className="font-semibold text-slate-500">
              Smart QR 
            </span>
          </p>
          </Link>
        </div>
      </div>
    </article>
  );
}
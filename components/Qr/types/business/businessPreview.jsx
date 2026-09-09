import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Clock3,
  Globe2,
  ExternalLink,
  Navigation,
  ArrowUpRight,
  Store,
} from "lucide-react";

import { Picture, Intro, Action } from "../presentation";
import { safeUrl } from "@/lib/qr-content";
import Link from "next/link";

export default function BusinessPreview({ content: c }) {
  const phone = c.phone
    ? String(c.phone).replace(/[^+\d]/g, "")
    : "";

  const hours = Object.entries(c.hours || {});
  const links = Array.isArray(c.links) ? c.links : [];

  return (
    <article className="relative flex min-h-full w-full flex-col overflow-hidden bg-[#f7f8f7] text-slate-900">
      {/* BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-32 h-72 w-72 rounded-full bg-emerald-100/60 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-teal-100/50 blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgb(15 23 42) 1px, transparent 0)",
            backgroundSize: "22px 22px",
          }}
        />
      </div>

      <div className="relative mx-auto flex min-h-full w-full max-w-5xl flex-1 flex-col">
        {/* COVER */}
        <div className="relative h-[165px] w-full overflow-hidden">
          <Picture
            src={c.cover}
            alt={c.name || "Business"}
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />

          {c.category && (
            <div className="absolute right-[5%] top-4">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/20 px-3 py-1.5 text-[10px] font-semibold text-white backdrop-blur-md">
                <Store className="h-3.5 w-3.5" />
                {c.category}
              </span>
            </div>
          )}
        </div>

        {/* MAIN CONTENT */}
        <div className="relative mx-auto -mt-8 w-[90%] max-w-[560px] pb-7">
          <section className="overflow-hidden rounded-[28px] border border-white/80 bg-white/95 shadow-[0_24px_70px_-30px_rgba(15,23,42,0.35)] backdrop-blur-xl">
            <div className="px-[6%] pb-6">
              {/* LOGO */}
              <div className="mt-3 flex items-end justify-between gap-3">
                <Picture
                  src={c.logo}
                  alt={c.name || "Business"}
                  className="h-[84px] w-[84px] shrink-0 rounded-[22px] border-[4px] border-white object-cover shadow-lg"
                />

                <div className="mb-2 flex h-8 items-center rounded-full bg-emerald-50 px-3 text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-100">
                  Business
                </div>
              </div>

              {/* BUSINESS IDENTITY */}
              <div className="mt-5">
                <Intro
                  title={c.name || "Your business"}
                  description={c.category}
                />
              </div>

              {/* CONTACT ACTIONS */}
              {(c.phone || c.email) && (
                <div className="mt-6 grid grid-cols-2 gap-2.5">
                  {c.phone && (
                    <a
                      href={`tel:${phone}`}
                      className="flex min-h-[48px] items-center justify-center gap-2 rounded-[14px] bg-[#22c55e] px-3 text-[13px] font-semibold text-white shadow-[0_8px_20px_-10px_rgba(34,197,94,0.65)] transition hover:bg-[#16a34a] active:scale-[0.98]"
                    >
                      <Phone className="h-4 w-4" strokeWidth={2} />
                      Call
                    </a>
                  )}

                  {c.email && (
                    <a
                      href={`mailto:${encodeURIComponent(c.email)}`}
                      className="flex min-h-[48px] items-center justify-center gap-2 rounded-[14px] border border-slate-200 bg-white px-3 text-[13px] font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-[0.98]"
                    >
                      <Mail
                        className="h-4 w-4 text-slate-500"
                        strokeWidth={2}
                      />
                      Email
                    </a>
                  )}
                </div>
              )}

              {/* ABOUT */}
              {c.description && (
                <div className="mt-6 rounded-[18px] border border-slate-100 bg-slate-50/70 p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm ring-1 ring-slate-100">
                      <Building2 className="h-4 w-4" />
                    </div>

                    <h2 className="text-[13px] font-semibold text-slate-800">
                      About us
                    </h2>
                  </div>

                  <p className="mt-3 whitespace-pre-line text-[13px] leading-6 text-slate-500">
                    {c.description}
                  </p>
                </div>
              )}

              {/* BUSINESS DETAILS */}
              {(c.phone || c.email || c.address || c.websiteUrl) && (
                <div className="mt-5 overflow-hidden rounded-[18px] border border-slate-100 bg-white">
                  {c.phone && (
                    <a
                      href={`tel:${phone}`}
                      className="flex min-w-0 items-center gap-3 border-b border-slate-100 px-4 py-3.5 transition hover:bg-slate-50"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                        <Phone className="h-4 w-4" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                          Phone
                        </p>
                        <p className="mt-0.5 truncate text-[13px] font-medium text-slate-700">
                          {c.phone}
                        </p>
                      </div>
                    </a>
                  )}

                  {c.email && (
                    <a
                      href={`mailto:${encodeURIComponent(c.email)}`}
                      className="flex min-w-0 items-center gap-3 border-b border-slate-100 px-4 py-3.5 transition hover:bg-slate-50"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                        <Mail className="h-4 w-4" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                          Email
                        </p>
                        <p className="mt-0.5 truncate text-[13px] font-medium text-slate-700">
                          {c.email}
                        </p>
                      </div>
                    </a>
                  )}

                  {c.websiteUrl && (
                    <a
                      href={safeUrl(c.websiteUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex min-w-0 items-center gap-3 border-b border-slate-100 px-4 py-3.5 transition hover:bg-slate-50"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                        <Globe2 className="h-4 w-4" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                          Website
                        </p>
                        <p className="mt-0.5 truncate text-[13px] font-medium text-slate-700">
                          {c.websiteUrl}
                        </p>
                      </div>

                      <ExternalLink className="h-4 w-4 shrink-0 text-slate-300" />
                    </a>
                  )}

                  {c.address && (
                    <div className="flex items-start gap-3 px-4 py-3.5">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                        <MapPin className="h-4 w-4" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                          Address
                        </p>
                        <p className="mt-0.5 break-words text-[13px] leading-5 text-slate-700">
                          {c.address}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* OPENING HOURS */}
              {hours.length > 0 && (
                <div className="mt-5 rounded-[18px] border border-slate-100 bg-slate-50/70 p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm ring-1 ring-slate-100">
                      <Clock3 className="h-4 w-4" />
                    </div>

                    <div>
                      <h2 className="text-[13px] font-semibold text-slate-800">
                        Opening hours
                      </h2>
                      <p className="mt-0.5 text-[10px] text-slate-400">
                        Business availability
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 overflow-hidden rounded-[14px] bg-white ring-1 ring-slate-100">
                    {hours.map(([day, time], index) => (
                      <div
                        key={day}
                        className={`flex items-center justify-between gap-4 px-3.5 py-2.5 text-[11px] ${
                          index !== hours.length - 1
                            ? "border-b border-slate-100"
                            : ""
                        }`}
                      >
                        <span className="min-w-0 font-medium capitalize text-slate-600">
                          {day}
                        </span>

                        <span
                          className={`shrink-0 text-right font-medium ${
                            time
                              ? "text-slate-700"
                              : "text-slate-400"
                          }`}
                        >
                          {time || "Not specified"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* MAP */}
              {c.mapUrl && (
                <div className="mt-5">
                  <Action href={c.mapUrl}>
                    <span className="flex items-center justify-center gap-2">
                      <Navigation className="h-4 w-4" />
                      Show on map
                    </span>
                  </Action>
                </div>
              )}

              {/* WEBSITE */}
              {c.websiteUrl && (
                <div className="mt-2.5">
                  <Action
                    href={c.websiteUrl}
                    className="!bg-white !text-slate-700 !shadow-none ring-1 ring-inset ring-slate-200 hover:!bg-slate-50 hover:!shadow-none"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <Globe2 className="h-4 w-4" />
                      Visit website
                    </span>
                  </Action>
                </div>
              )}

              {/* CUSTOM CTA */}
              {c.ctaUrl && (
                <div className="mt-2.5">
                  <Action
                    href={c.ctaUrl}
                    className="!bg-slate-950 hover:!bg-slate-800"
                  >
                    <span className="flex items-center justify-center gap-2">
                      {c.ctaLabel || "Learn more"}
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </Action>
                </div>
              )}

              {/* ADDITIONAL LINKS */}
              {links.length > 0 && (
                <div className="mt-6">
                  <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                    More links
                  </p>

                  <div className="space-y-2">
                    {links.map((link, index) => (
                      <Action
                        key={`${link.url}-${index}`}
                        href={link.url}
                        className="!min-h-[48px] !rounded-[14px] !bg-white !text-slate-700 !shadow-none ring-1 ring-inset ring-slate-200 hover:!bg-slate-50 hover:!shadow-none"
                      >
                        <span className="flex w-full min-w-0 items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                            <ExternalLink className="h-3.5 w-3.5" />
                          </div>

                          <span className="min-w-0 flex-1 truncate text-left">
                            {link.label || "Open link"}
                          </span>

                          <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-slate-300" />
                        </span>
                      </Action>
                    ))}
                  </div>
                </div>
              )}
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
import {
  Building2,
  Phone,
  Mail,
  Globe2,
  MapPin,
  UserPlus,
  ExternalLink,
  Link2,
} from "lucide-react";

import { Picture, Intro, Action } from "../presentation";
import { vcardText, safeUrl } from "@/lib/qr-content";

export default function VCardPreview({ content: c }) {
  const name =
    [c.firstName, c.lastName].filter(Boolean).join(" ") ||
    c.name ||
    "Your name";

  const address = [
    c.street,
    c.city,
    c.state,
    c.postalCode,
    c.country,
  ]
    .filter(Boolean)
    .join(", ");

  const phone = c.phone
    ? String(c.phone).replace(/[^+\d]/g, "")
    : "";

  const links = Array.isArray(c.links) ? c.links : [];

  return (
    <article className="relative flex min-h-full w-full flex-col overflow-hidden bg-[#f7f8f8] text-slate-900">
      {/* BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-emerald-100/60 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-teal-100/50 blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgb(15 23 42) 1px, transparent 0)",
            backgroundSize: "22px 22px",
          }}
        />
      </div>

      <div className="relative mx-auto flex min-h-full w-full max-w-5xl flex-1 flex-col">
        {/* COVER */}
        <div className="relative mt-5 h-[150px] w-full overflow-hidden sm:h-[190px]">
          <Picture
            src={c.cover}
            alt=""
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-black/5 to-transparent" />
        </div>

        {/* MAIN CARD */}
        <div className="relative mx-auto -mt-8 w-[90%] max-w-[560px] pb-7">
          <section className="overflow-hidden rounded-[28px] border border-white/80 bg-white/95 shadow-[0_24px_70px_-30px_rgba(15,23,42,0.35)] backdrop-blur-xl">
            <div className="px-[6%] pb-6">
              {/* AVATAR */}
              <div className="mt-3 flex items-end justify-between gap-3">
                <Picture
                  src={c.avatar}
                  alt={name}
                  className="h-[92px] w-[92px] shrink-0 rounded-[24px] border-[4px] border-white object-cover shadow-lg"
                />

                <span className="mb-2 rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-emerald-700 ring-1 ring-emerald-100">
                  Contact
                </span>
              </div>

              {/* IDENTITY */}
              <div className="mt-5">
                <Intro
                  title={name}
                  description={c.headline}
                />

                {c.company && (
                  <div className="mt-3 flex items-center gap-2 text-[13px] font-medium text-emerald-700">
                    <Building2
                      className="h-4 w-4 shrink-0"
                      strokeWidth={1.8}
                    />

                    <span className="truncate">
                      {c.company}
                    </span>
                  </div>
                )}
              </div>

              {/* DESCRIPTION */}
              {c.description && (
                <p className="mt-5 whitespace-pre-line text-[13px] leading-6 text-slate-500">
                  {c.description}
                </p>
              )}

              {/* PRIMARY CONTACT ACTIONS */}
              {(c.phone || c.email) && (
                <div className="mt-6 grid grid-cols-2 gap-2.5">
                  {c.phone && (
                    <a
                      href={`tel:${phone}`}
                      className="group flex min-h-[48px] items-center justify-center gap-2 rounded-[14px] bg-[#22c55e] px-3 text-[13px] font-semibold text-white shadow-[0_8px_20px_-10px_rgba(34,197,94,0.65)] transition hover:bg-[#16a34a] active:scale-[0.98]"
                    >
                      <Phone
                        className="h-4 w-4"
                        strokeWidth={2}
                      />

                      Call
                    </a>
                  )}

                  {c.email && (
                    <a
                      href={`mailto:${encodeURIComponent(c.email)}`}
                      className="group flex min-h-[48px] items-center justify-center gap-2 rounded-[14px] border border-slate-200 bg-white px-3 text-[13px] font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-[0.98]"
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

              {/* DETAILS */}
              {(c.phone ||
                c.email ||
                c.websiteUrl ||
                address) && (
                <div className="mt-6 overflow-hidden rounded-[18px] border border-slate-100 bg-slate-50/70">
                  {c.phone && (
                    <a
                      href={`tel:${phone}`}
                      className="flex min-w-0 items-center gap-3 border-b border-slate-100 px-4 py-3.5 transition hover:bg-white"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm ring-1 ring-slate-100">
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
                      className="flex min-w-0 items-center gap-3 border-b border-slate-100 px-4 py-3.5 transition hover:bg-white"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm ring-1 ring-slate-100">
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
                      className="flex min-w-0 items-center gap-3 border-b border-slate-100 px-4 py-3.5 transition hover:bg-white"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm ring-1 ring-slate-100">
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

                  {address && (
                    <div className="flex items-start gap-3 px-4 py-3.5">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm ring-1 ring-slate-100">
                        <MapPin className="h-4 w-4" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                          Address
                        </p>

                        <p className="mt-0.5 break-words text-[13px] leading-5 text-slate-700">
                          {address}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* EXTRA LINKS */}
              {links.length > 0 && (
                <div className="mt-6">
                  <div className="mb-3 flex items-center gap-2">
                    <Link2 className="h-4 w-4 text-slate-400" />

                    <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-400">
                      Links
                    </p>
                  </div>

                  <div className="space-y-2">
                    {links.map((link, index) => (
                      <Action
                        key={`${link.url}-${index}`}
                        href={safeUrl(link.url)}
                        className="!min-h-[48px] !rounded-[14px] !bg-white !text-slate-700 !shadow-none ring-1 ring-inset ring-slate-200 hover:!bg-slate-50 hover:!shadow-none"
                      >
                        <span className="flex w-full min-w-0 items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                            <ExternalLink className="h-3.5 w-3.5" />
                          </div>

                          <span className="min-w-0 flex-1 truncate text-left">
                            {link.label || "Open link"}
                          </span>

                          <ExternalLink className="h-3.5 w-3.5 shrink-0 text-slate-300" />
                        </span>
                      </Action>
                    ))}
                  </div>
                </div>
              )}

              {/* SAVE CONTACT */}
              <a
                download="contact.vcf"
                href={`data:text/vcard;charset=utf-8,${encodeURIComponent(
                  vcardText(c),
                )}`}
                className="mt-6 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-[16px] bg-slate-950 px-4 text-[13px] font-semibold text-white shadow-[0_12px_28px_-14px_rgba(15,23,42,0.75)] transition hover:-translate-y-0.5 hover:bg-slate-800 active:translate-y-0 active:scale-[0.99]"
              >
                <UserPlus
                  className="h-4 w-4"
                  strokeWidth={2}
                />

                Add to contacts
              </a>
            </div>
          </section>

          {/* FOOTER */}
          <p className="mt-5 text-center text-[9px] font-medium text-slate-400">
            Powered by{" "}
            <span className="font-semibold text-slate-500">
              Online QR Generator
            </span>
          </p>
        </div>
      </div>
    </article>
  );
}
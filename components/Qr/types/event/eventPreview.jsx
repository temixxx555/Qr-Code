"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Clock,
  MapPin,
  Shirt,
  Navigation,
  MessageCircle,
  ClipboardList,
  Gift,
  Play,
  X,
  Radio,
  Ticket,
  Phone,
  User,
} from "lucide-react";
import { safeUrl, phoneDigits, whatsappUrl } from "@/lib/qr-content";
import {
  formatDate,
  formatTime,
  youtubeId,
  Countdown,
  Heading,
} from "../wedding/weddingPreview";
import { EVENT_THEMES, EVENT_KINDS } from "./themes";

export default function EventPreview({ content: c }) {
  const [open, setOpen] = useState(null);
  const kind = EVENT_KINDS[c.kind] || EVENT_KINDS.other;
  const t = EVENT_THEMES[c.theme] || EVENT_THEMES[kind.theme];
  const memorial = c.kind === "memorial";
  const title = c.title || "Your event";
  const cover = safeUrl(c.cover);
  const images = (Array.isArray(c.images) ? c.images : []).filter((i) =>
    safeUrl(i?.url),
  );
  const videos = (Array.isArray(c.videos) ? c.videos : []).filter((v) =>
    safeUrl(v?.url),
  );
  const schedule = (Array.isArray(c.schedule) ? c.schedule : []).filter(
    (e) => e?.title,
  );
  const speakers = (Array.isArray(c.speakers) ? c.speakers : []).filter(
    (p) => p?.name,
  );
  const longDate = formatDate(c.date, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const timeRange = [c.time, c.endTime]
    .filter(Boolean)
    .map(formatTime)
    .join(" – ");
  const rsvpPhone = phoneDigits(c.rsvpPhone);
  const rsvpBy = formatDate(c.rsvpBy, { day: "numeric", month: "long" });
  const card = {
    background: t.card,
    borderColor: `${t.accent}33`,
  };
  const button =
    "flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold";

  return (
    <article
      className="relative flex min-h-full w-full flex-col"
      style={{ background: t.bg, color: t.text }}
    >
      {/* HERO */}
      <header className="relative overflow-hidden">
        {cover ? (
          <img
            src={cover}
            alt={title}
            className={`h-[320px] w-full object-cover ${memorial ? "grayscale-[30%]" : ""}`}
          />
        ) : (
          <div
            className="h-[220px] w-full"
            style={{
              background: `radial-gradient(circle at 30% 20%, ${t.accent}44, transparent 60%), radial-gradient(circle at 80% 70%, ${t.accent}33, transparent 55%)`,
            }}
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, transparent 35%, ${t.bg})`,
          }}
        />
      </header>

      <div className="relative mx-auto -mt-24 w-full max-w-[620px] px-[6%] pb-8 text-center">
        <p
          className="text-[10px] font-semibold uppercase tracking-[0.35em]"
          style={{ color: t.accent }}
        >
          {kind.kicker}
        </p>
        {c.intro && (
          <p
            className="mx-auto mt-4 max-w-[300px] whitespace-pre-line text-[13px] leading-6"
            style={{ color: t.muted }}
          >
            {c.intro}
          </p>
        )}
        <h1 className="mt-4 break-words font-serif text-[38px] leading-[1.08] tracking-tight">
          {title}
        </h1>
        {c.host && (
          <p className="mt-3 text-sm" style={{ color: t.muted }}>
            {kind.hostPrefix ? `${kind.hostPrefix} ` : ""}
            <strong style={{ color: t.text }}>{c.host}</strong>
          </p>
        )}
        {longDate && (
          <p className="mt-4 text-sm font-medium tracking-wide">{longDate}</p>
        )}
        {c.hashtag && (
          <p className="mt-2 text-xs font-semibold" style={{ color: t.accent }}>
            {c.hashtag}
          </p>
        )}

        {kind.countdown !== false && (
          <Countdown
            date={c.date}
            time={c.time}
            accent={t.accent}
            todayText={kind.today}
            pastText={kind.past}
          />
        )}

        {/* DETAILS */}
        {(longDate ||
          timeRange ||
          c.venue ||
          c.address ||
          c.dressCode ||
          safeUrl(c.onlineUrl)) && (
          <section
            className="mt-8 space-y-3 rounded-[24px] border p-5 text-left"
            style={card}
          >
            {longDate && (
              <p className="flex items-start gap-3 text-[13px]">
                <CalendarDays className="mt-0.5 h-4 w-4 shrink-0" style={{ color: t.accent }} />
                {longDate}
              </p>
            )}
            {timeRange && (
              <p className="flex items-start gap-3 text-[13px]">
                <Clock className="mt-0.5 h-4 w-4 shrink-0" style={{ color: t.accent }} />
                {timeRange}
              </p>
            )}
            {(c.venue || c.address) && (
              <p className="flex items-start gap-3 text-[13px]">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" style={{ color: t.accent }} />
                <span>
                  {c.venue && <strong className="block">{c.venue}</strong>}
                  {c.address && <span style={{ color: t.muted }}>{c.address}</span>}
                </span>
              </p>
            )}
            {c.dressCode && (
              <p className="flex items-start gap-3 text-[13px]">
                <Shirt className="mt-0.5 h-4 w-4 shrink-0" style={{ color: t.accent }} />
                Dress code: {c.dressCode}
              </p>
            )}
            {safeUrl(c.mapUrl) && (
              <a
                href={safeUrl(c.mapUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-2 text-white ${button}`}
                style={{ background: t.accent }}
              >
                <Navigation className="h-4 w-4" /> Get directions
              </a>
            )}
            {safeUrl(c.onlineUrl) && (
              <a
                href={safeUrl(c.onlineUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className={`border ${button}`}
                style={{ borderColor: t.accent, color: t.accent }}
              >
                <Radio className="h-4 w-4" /> Join online
              </a>
            )}
          </section>
        )}

        {/* TICKETS */}
        {(c.ticketPrice || safeUrl(c.ticketUrl)) && (
          <section className="mt-6 rounded-[24px] border p-5" style={card}>
            <Heading accent={t.accent}>Tickets</Heading>
            {c.ticketPrice && (
              <p className="text-2xl font-semibold">{c.ticketPrice}</p>
            )}
            {safeUrl(c.ticketUrl) && (
              <a
                href={safeUrl(c.ticketUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-4 text-white ${button}`}
                style={{ background: t.accent }}
              >
                <Ticket className="h-4 w-4" /> Get tickets
              </a>
            )}
          </section>
        )}

        {/* PROGRAMME */}
        {schedule.length > 0 && (
          <section className="mt-10">
            <Heading accent={t.accent}>{kind.scheduleTitle}</Heading>
            <ol className="space-y-3 text-left">
              {schedule.map((item, i) => (
                <li
                  key={i}
                  className="flex gap-4 rounded-2xl border p-4"
                  style={card}
                >
                  <span
                    className="w-16 shrink-0 text-xs font-semibold"
                    style={{ color: t.accent }}
                  >
                    {formatTime(item.time)}
                  </span>
                  <span className="min-w-0">
                    <strong className="block text-[13px]">{item.title}</strong>
                    {item.location && (
                      <span className="text-[11px]" style={{ color: t.muted }}>
                        {item.location}
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* PEOPLE */}
        {speakers.length > 0 && (
          <section className="mt-10">
            <Heading accent={t.accent}>{kind.peopleTitle}</Heading>
            <div className="grid grid-cols-2 gap-3">
              {speakers.map((person, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center rounded-2xl border p-4"
                  style={card}
                >
                  {safeUrl(person.image) ? (
                    <img
                      src={safeUrl(person.image)}
                      alt={person.name}
                      loading="lazy"
                      className="h-16 w-16 rounded-full object-cover"
                    />
                  ) : (
                    <span
                      className="flex h-16 w-16 items-center justify-center rounded-full"
                      style={{ background: `${t.accent}22`, color: t.accent }}
                    >
                      <User className="h-7 w-7" />
                    </span>
                  )}
                  <strong className="mt-3 text-[13px]">{person.name}</strong>
                  {person.role && (
                    <span className="text-[11px]" style={{ color: t.muted }}>
                      {person.role}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* MESSAGE */}
        {c.message && (
          <section className="mt-10">
            <Heading accent={t.accent}>{kind.messageTitle}</Heading>
            <p className="whitespace-pre-line font-serif text-[15px] italic leading-7">
              {c.message}
            </p>
            {c.host && !memorial && (
              <p className="mt-4 text-xs font-semibold" style={{ color: t.accent }}>
                — {c.host}
              </p>
            )}
          </section>
        )}

        {/* GALLERY */}
        {images.length > 0 && (
          <section className="mt-10">
            <Heading accent={t.accent}>Gallery</Heading>
            <div className="grid grid-cols-2 gap-2">
              {images.map((image, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setOpen(i)}
                  className={`overflow-hidden rounded-2xl ${i % 5 === 0 ? "col-span-2 aspect-[16/10]" : "aspect-square"}`}
                >
                  <img
                    src={safeUrl(image.url)}
                    alt={image.caption || `Photo ${i + 1}`}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-300 hover:scale-105"
                  />
                </button>
              ))}
            </div>
          </section>
        )}

        {/* VIDEOS */}
        {videos.length > 0 && (
          <section className="mt-10 space-y-4">
            <Heading accent={t.accent}>Videos</Heading>
            {videos.map((video, i) => {
              const url = safeUrl(video.url);
              const yt = youtubeId(url);
              const hosted = /\.(mp4|webm)([?#]|$)/i.test(url);
              return (
                <div key={i} className="overflow-hidden rounded-2xl border text-left" style={card}>
                  {yt ? (
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${yt}`}
                      title={video.title || `Video ${i + 1}`}
                      loading="lazy"
                      allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="aspect-video w-full"
                    />
                  ) : hosted ? (
                    <video
                      controls
                      playsInline
                      preload="metadata"
                      src={url}
                      className="aspect-video w-full bg-black"
                    />
                  ) : (
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex aspect-video w-full items-center justify-center bg-black/80 text-white"
                      aria-label="Watch video"
                    >
                      <Play className="h-10 w-10 fill-current" />
                    </a>
                  )}
                  {video.title && (
                    <p className="px-4 py-3 text-[13px] font-semibold">{video.title}</p>
                  )}
                </div>
              );
            })}
          </section>
        )}

        {/* RSVP */}
        {(rsvpPhone || safeUrl(c.rsvpUrl)) && (
          <section className="mt-10 rounded-[24px] border p-5" style={card}>
            <Heading accent={t.accent}>RSVP</Heading>
            {rsvpBy && (
              <p className="mb-4 text-xs" style={{ color: t.muted }}>
                Kindly respond by {rsvpBy}
              </p>
            )}
            <div className="space-y-2">
              {rsvpPhone && (
                <a
                  href={whatsappUrl({
                    phone: rsvpPhone,
                    message: `Hi! I'm confirming my attendance at ${title}${longDate ? ` on ${longDate}` : ""}.`,
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-white ${button}`}
                  style={{ background: t.accent }}
                >
                  <MessageCircle className="h-4 w-4" /> RSVP on WhatsApp
                </a>
              )}
              {safeUrl(c.rsvpUrl) && (
                <a
                  href={safeUrl(c.rsvpUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`border ${button}`}
                  style={{ borderColor: t.accent, color: t.accent }}
                >
                  <ClipboardList className="h-4 w-4" /> Fill RSVP form
                </a>
              )}
            </div>
          </section>
        )}

        {/* GIFTS / CONTACT */}
        {(c.giftDetails || c.contactPhone) && (
          <section className="mt-6 space-y-4 rounded-[24px] border p-5 text-left" style={card}>
            {c.giftDetails && (
              <p className="flex items-start gap-3 whitespace-pre-line text-[13px] leading-6" style={{ color: t.muted }}>
                <Gift className="mt-1 h-4 w-4 shrink-0" style={{ color: t.accent }} />
                {c.giftDetails}
              </p>
            )}
            {c.contactPhone && (
              <a
                href={`tel:${String(c.contactPhone).replace(/[^+\d]/g, "")}`}
                className="flex items-center gap-3 text-[13px] font-semibold"
              >
                <Phone className="h-4 w-4 shrink-0" style={{ color: t.accent }} />
                {c.contactPhone}
              </a>
            )}
          </section>
        )}

        <Link href="/">
          <p className="mt-10 text-[9px] font-medium" style={{ color: t.muted }}>
            Powered by <span className="font-semibold">Smart QR</span>
          </p>
        </Link>
      </div>

      {/* LIGHTBOX */}
      {open !== null && images[open] && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 p-4"
          onClick={() => setOpen(null)}
        >
          <button
            type="button"
            aria-label="Close"
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white"
            onClick={() => setOpen(null)}
          >
            <X className="h-5 w-5" />
          </button>
          <img
            src={safeUrl(images[open].url)}
            alt={images[open].caption || ""}
            className="max-h-[80vh] max-w-full rounded-xl object-contain"
            onClick={(e) => {
              e.stopPropagation();
              setOpen((open + 1) % images.length);
            }}
          />
          {images[open].caption && (
            <p className="mt-3 text-center text-sm text-white/80">
              {images[open].caption}
            </p>
          )}
          <p className="mt-2 text-[11px] text-white/50">
            {open + 1} / {images.length} · tap photo for next
          </p>
        </div>
      )}
    </article>
  );
}

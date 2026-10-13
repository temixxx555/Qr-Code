"use client";

import { useEffect, useState } from "react";
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
  Heart,
} from "lucide-react";
import { safeUrl, phoneDigits, whatsappUrl } from "@/lib/qr-content";
import { WEDDING_THEMES } from "./themes";

function formatDate(date, options) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date || "")) return "";
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-GB", {
    timeZone: "UTC",
    ...options,
  });
}

function formatTime(time) {
  const match = /^(\d{2}):(\d{2})$/.exec(time || "");
  if (!match) return time || "";
  const hours = Number(match[1]);
  return `${hours % 12 || 12}:${match[2]} ${hours < 12 ? "AM" : "PM"}`;
}

function youtubeId(url) {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\.|^m\./, "");
    let id = "";
    if (host === "youtu.be") id = u.pathname.slice(1);
    else if (host === "youtube.com" || host === "youtube-nocookie.com")
      id =
        u.searchParams.get("v") ||
        u.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/)?.[1] ||
        "";
    return /^[\w-]{11}$/.test(id) ? id : "";
  } catch {
    return "";
  }
}

function Countdown({ date, time, accent }) {
  const [left, setLeft] = useState(null);
  useEffect(() => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date || "")) return;
    const target = new Date(
      `${date}T${/^\d{2}:\d{2}$/.test(time || "") ? time : "00:00"}:00`,
    ).getTime();
    const tick = () => setLeft(target - Date.now());
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [date, time]);
  if (left === null) return null;
  if (left <= 0)
    return (
      <p className="mt-6 text-sm font-semibold" style={{ color: accent }}>
        {left > -86400000 ? "Today is the day! 💍" : "Just married ♥"}
      </p>
    );
  const units = [
    ["Days", Math.floor(left / 86400000)],
    ["Hours", Math.floor(left / 3600000) % 24],
    ["Mins", Math.floor(left / 60000) % 60],
    ["Secs", Math.floor(left / 1000) % 60],
  ];
  return (
    <div className="mt-6 grid grid-cols-4 gap-2">
      {units.map(([label, n]) => (
        <div
          key={label}
          className="rounded-2xl border px-1 py-2.5 text-center"
          style={{ borderColor: `${accent}55` }}
        >
          <p className="text-xl font-semibold tabular-nums">{n}</p>
          <p className="text-[9px] uppercase tracking-widest opacity-60">
            {label}
          </p>
        </div>
      ))}
    </div>
  );
}

function Heading({ children, accent }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="h-px flex-1" style={{ background: `${accent}55` }} />
      <h2
        className="font-serif text-xl italic tracking-tight"
        style={{ color: accent }}
      >
        {children}
      </h2>
      <span className="h-px flex-1" style={{ background: `${accent}55` }} />
    </div>
  );
}

export default function WeddingPreview({ content: c }) {
  const [open, setOpen] = useState(null);
  const t = WEDDING_THEMES[c.theme] || WEDDING_THEMES.classic;
  const celebration = c.purpose === "celebration";
  const names = [c.partnerOne || "Partner", c.partnerTwo || "Partner"];
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
  const longDate = formatDate(c.date, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const rsvpPhone = phoneDigits(c.rsvpPhone);
  const rsvpBy = formatDate(c.rsvpBy, { day: "numeric", month: "long" });
  const card = {
    background: t.card,
    borderColor: `${t.accent}33`,
  };

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
            alt={`${names[0]} and ${names[1]}`}
            className="h-[320px] w-full object-cover"
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
          {celebration ? "Thank you for celebrating with us" : "You're invited"}
        </p>
        {c.intro && (
          <p className="mx-auto mt-4 max-w-[300px] whitespace-pre-line text-[13px] leading-6" style={{ color: t.muted }}>
            {c.intro}
          </p>
        )}
        <h1 className="mt-4 break-words font-serif text-[40px] leading-[1.05] tracking-tight">
          {names[0]}
          <span
            className="mx-auto my-1 block font-serif text-2xl italic"
            style={{ color: t.accent }}
          >
            &amp;
          </span>
          {names[1]}
        </h1>
        {longDate && (
          <p className="mt-4 text-sm font-medium tracking-wide">{longDate}</p>
        )}
        {c.hashtag && (
          <p className="mt-2 text-xs font-semibold" style={{ color: t.accent }}>
            {c.hashtag}
          </p>
        )}

        {!celebration && (
          <Countdown date={c.date} time={c.time} accent={t.accent} />
        )}

        {/* DETAILS */}
        {(longDate || c.time || c.venue || c.address || c.dressCode) && (
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
            {c.time && (
              <p className="flex items-start gap-3 text-[13px]">
                <Clock className="mt-0.5 h-4 w-4 shrink-0" style={{ color: t.accent }} />
                {formatTime(c.time)}
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
                className="mt-2 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white"
                style={{ background: t.accent }}
              >
                <Navigation className="h-4 w-4" /> Get directions
              </a>
            )}
          </section>
        )}

        {/* PROGRAMME */}
        {schedule.length > 0 && (
          <section className="mt-10">
            <Heading accent={t.accent}>Programme</Heading>
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

        {/* MESSAGE */}
        {c.message && (
          <section className="mt-10">
            <Heading accent={t.accent}>
              {celebration ? "Thank you" : "A note from us"}
            </Heading>
            <p className="whitespace-pre-line font-serif text-[15px] italic leading-7">
              {c.message}
            </p>
            <p className="mt-4 text-xs font-semibold" style={{ color: t.accent }}>
              — {names[0]} &amp; {names[1]}{" "}
              <Heart className="inline h-3 w-3 fill-current" />
            </p>
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
        {!celebration && (rsvpPhone || safeUrl(c.rsvpUrl)) && (
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
                    message: `Hi ${names[0]} & ${names[1]}! I'm happy to confirm I'll attend your wedding${longDate ? ` on ${longDate}` : ""}. 💍`,
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white"
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
                  className="flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold"
                  style={{ borderColor: t.accent, color: t.accent }}
                >
                  <ClipboardList className="h-4 w-4" /> Fill RSVP form
                </a>
              )}
            </div>
          </section>
        )}

        {/* GIFTS */}
        {(safeUrl(c.registryUrl) || c.giftDetails) && (
          <section className="mt-6 rounded-[24px] border p-5" style={card}>
            <Heading accent={t.accent}>Gifts</Heading>
            {c.giftDetails && (
              <p className="whitespace-pre-line text-[13px] leading-6" style={{ color: t.muted }}>
                {c.giftDetails}
              </p>
            )}
            {safeUrl(c.registryUrl) && (
              <a
                href={safeUrl(c.registryUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white"
                style={{ background: t.accent }}
              >
                <Gift className="h-4 w-4" /> View gift registry
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

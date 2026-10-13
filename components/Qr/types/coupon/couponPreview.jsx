"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Gift, Ticket, Copy, Check, MapPin, Phone, Clock } from "lucide-react";
import { Picture, Action } from "../presentation";
import { safeUrl } from "@/lib/qr-content";

export default function CouponPreview({ content: c }) {
  const [copied, setCopied] = useState("");
  const [expired, setExpired] = useState(false);
  useEffect(() => {
    const refresh = () =>
      setExpired(
        !!c.expiration &&
          Date.now() > new Date(`${c.expiration}T23:59:59Z`).getTime(),
      );
    refresh();
    const timer = setInterval(refresh, 60000);
    return () => clearInterval(timer);
  }, [c.expiration]);
  const free = c.kind === "free";
  const Icon = free ? Gift : Ticket;
  const expiry = c.expiration
    ? new Date(`${c.expiration}T00:00:00Z`).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      })
    : "";

  return (
    <article className="relative flex min-h-full flex-col bg-gradient-to-b from-orange-500 via-orange-400 to-amber-50 px-[5%] pb-6 pt-6 text-slate-900">
      <div className="flex items-center gap-3 text-white">
        <Picture
          src={c.logo}
          alt={c.merchant || "Offer"}
          className="h-12 w-12 rounded-2xl border-2 border-white/70 shadow"
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">
            {c.merchant || "Your business"}
          </p>
          <p className="inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-widest text-white/80">
            <Icon className="h-3 w-3" />
            {free ? "Free gift coupon" : "Discount coupon"}
          </p>
        </div>
      </div>

      <div className="relative mt-6 overflow-hidden rounded-[26px] bg-white shadow-[0_30px_60px_-30px_rgba(124,45,18,0.6)]">
        {safeUrl(c.cover) && (
          <Picture
            src={c.cover}
            alt={c.title || "Offer"}
            className="h-36 w-full"
          />
        )}
        <div className="px-6 pb-5 pt-6 text-center">
          <p className="break-words text-[38px] font-black leading-none tracking-tight text-orange-600">
            {c.discount || (free ? "FREE" : "20% OFF")}
          </p>
          <h1 className="mt-3 text-lg font-bold leading-tight">
            {c.title || "Something special for you"}
          </h1>
          {c.description && (
            <p className="mt-2 whitespace-pre-line text-[13px] leading-6 text-slate-500">
              {c.description}
            </p>
          )}
        </div>

        {/* Perforation */}
        <div className="relative flex items-center">
          <span className="absolute -left-3 h-6 w-6 rounded-full bg-orange-300" />
          <span className="mx-5 w-full border-t-2 border-dashed border-orange-100" />
          <span className="absolute -right-3 h-6 w-6 rounded-full bg-orange-300" />
        </div>

        <div className="px-6 pb-6 pt-5 text-center">
          {c.code && (
            <>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Your code
              </p>
              <button
                type="button"
                disabled={expired}
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(c.code);
                    setCopied("Copied!");
                  } catch {
                    setCopied("Select and copy the code above.");
                  }
                }}
                className="mx-auto mt-2 flex items-center gap-2 rounded-xl border-2 border-dashed border-orange-200 bg-orange-50 px-5 py-3 font-mono text-xl font-bold tracking-wider text-orange-700 disabled:opacity-50"
              >
                {c.code}
                {copied === "Copied!" ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
              {copied && (
                <p className="mt-1 text-[11px] text-orange-700">{copied}</p>
              )}
            </>
          )}
          <p
            className={`mt-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold ${expired ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-700"}`}
          >
            <Clock className="h-3 w-3" />
            {expired
              ? "This offer has expired"
              : expiry
                ? `Valid until ${expiry}`
                : "Limited-time offer"}
          </p>
          {!expired && (
            <div className="mt-4">
              <Action href={c.ctaUrl} className="!bg-orange-600">
                {free ? "Claim your gift" : "Redeem online"}
              </Action>
            </div>
          )}
        </div>
      </div>

      {c.howToRedeem && (
        <section className="mt-5 rounded-2xl bg-white/90 p-5">
          <h2 className="text-sm font-bold">How to redeem</h2>
          <p className="mt-2 whitespace-pre-line text-[13px] leading-6 text-slate-600">
            {c.howToRedeem}
          </p>
        </section>
      )}

      {(c.address || c.phone) && (
        <section className="mt-3 space-y-2 rounded-2xl bg-white/90 p-4 text-[12px] text-slate-600">
          {c.address && (
            <p className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-orange-600" />
              {c.address}
            </p>
          )}
          {c.phone && (
            <a
              href={`tel:${String(c.phone).replace(/[^+\d]/g, "")}`}
              className="flex items-center gap-2"
            >
              <Phone className="h-4 w-4 shrink-0 text-orange-600" />
              {c.phone}
            </a>
          )}
        </section>
      )}

      {c.terms && (
        <p className="mt-4 whitespace-pre-line px-1 text-[11px] leading-relaxed text-slate-500">
          {c.terms}
        </p>
      )}

      <Link href="/" className="mt-auto pt-6">
        <p className="text-center text-[9px] font-medium text-slate-400">
          Powered by <span className="font-semibold text-slate-500">Smart QR</span>
        </p>
      </Link>
    </article>
  );
}

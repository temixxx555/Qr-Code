"use client";

import Link from "next/link";
import {
  Car,
  Wrench,
  Droplets,
  Gauge,
  CalendarDays,
  CircleCheck,
  CircleX,
  Phone,
  MapPin,
  Navigation,
} from "lucide-react";
import { Picture } from "../presentation";
import { safeUrl } from "@/lib/qr-content";
import { formatDate, Countdown } from "../wedding/weddingPreview";
import { SERVICE_CHECKS } from "./checks";

const ACCENT = "#f59e0b";
const longDate = (date) =>
  formatDate(date, { day: "numeric", month: "short", year: "numeric" });

export default function AutoshopPreview({ content: c }) {
  const log = (Array.isArray(c.log) ? c.log : []).filter(
    (e) => e && typeof e === "object",
  );
  const vehicle = [c.year, c.model].filter(Boolean).join(" ") || "Your vehicle";

  return (
    <article className="relative flex min-h-full flex-col bg-slate-950 px-[5%] pb-6 pt-6 text-slate-100">
      <header className="flex items-center gap-3">
        {safeUrl(c.logo) ? (
          <Picture
            src={c.logo}
            alt={c.shopName || "Workshop"}
            className="h-12 w-12 rounded-2xl border border-white/10"
          />
        ) : (
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-slate-950">
            <Wrench className="h-6 w-6" />
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">
            {c.shopName || "Auto shop"}
          </p>
          <p className="text-[10px] font-medium uppercase tracking-widest text-slate-400">
            Vehicle service record
          </p>
        </div>
      </header>

      {/* VEHICLE */}
      <section className="mt-6 rounded-[26px] bg-gradient-to-br from-slate-800 to-slate-900 p-5 ring-1 ring-white/10">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {c.vehicleType && (
              <p className="text-[11px] font-semibold uppercase tracking-widest text-amber-400">
                {c.vehicleType}
              </p>
            )}
            <h1 className="mt-1 break-words text-2xl font-bold leading-tight">
              {vehicle}
            </h1>
          </div>
          <Car className="h-8 w-8 shrink-0 text-amber-400" />
        </div>
        {c.plate && (
          <p className="mt-4 inline-block rounded-lg border-2 border-slate-900 bg-amber-100 px-4 py-1.5 font-mono text-lg font-black tracking-[0.2em] text-slate-900">
            {c.plate}
          </p>
        )}
        {(c.vin || c.date) && (
          <dl className="mt-4 grid gap-3 text-[12px] sm:grid-cols-2">
            {c.vin && (
              <div>
                <dt className="text-slate-400">VIN</dt>
                <dd className="break-all font-mono font-semibold">{c.vin}</dd>
              </div>
            )}
            {c.date && (
              <div>
                <dt className="text-slate-400">Date</dt>
                <dd className="font-semibold">{longDate(c.date)}</dd>
              </div>
            )}
          </dl>
        )}
      </section>

      {/* SERVICE */}
      {(c.serviceType || c.oilChangeDate || c.nextDueDate) && (
        <section className="mt-4 rounded-[26px] bg-white p-5 text-slate-900">
          {c.serviceType && (
            <p className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-800">
              <Wrench className="h-3 w-3" /> {c.serviceType}
            </p>
          )}
          <div
            className={`mt-4 grid gap-3 text-[12px] ${c.oilChangeDate && c.nextDueDate ? "grid-cols-2" : ""}`}
          >
            {c.oilChangeDate && (
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="flex items-center gap-1.5 text-slate-500">
                  <Droplets className="h-3.5 w-3.5" /> Last oil change
                </p>
                <p className="mt-1 font-bold">{longDate(c.oilChangeDate)}</p>
              </div>
            )}
            {c.nextDueDate && (
              <div className="rounded-2xl bg-amber-50 p-3">
                <p className="flex items-center gap-1.5 text-amber-700">
                  <CalendarDays className="h-3.5 w-3.5" /> Next service due
                </p>
                <p className="mt-1 font-bold">{longDate(c.nextDueDate)}</p>
                {c.nextDueMileage && (
                  <p className="text-[11px] text-slate-500">
                    or at {c.nextDueMileage}
                  </p>
                )}
              </div>
            )}
          </div>
          {c.nextDueDate && (
            <div className="text-center">
              <Countdown
                date={c.nextDueDate}
                accent={ACCENT}
                todayText="Service due today — book your visit"
                pastText="Service overdue — please book a visit"
              />
            </div>
          )}
        </section>
      )}

      {/* LOG */}
      {log.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-400">
            <Gauge className="h-4 w-4 text-amber-400" /> Maintenance log
          </h2>
          <ol className="space-y-3 border-l-2 border-amber-500/40 pl-4">
            {log.map((entry, i) => {
              const done = SERVICE_CHECKS.filter(([key]) => entry[key] === true);
              const skipped = SERVICE_CHECKS.filter(
                ([key]) => entry[key] === false,
              );
              return (
                <li
                  key={i}
                  className="relative rounded-2xl bg-slate-900 p-4 ring-1 ring-white/10"
                >
                  <span className="absolute -left-[23px] top-5 h-3 w-3 rounded-full bg-amber-500 ring-4 ring-slate-950" />
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <strong className="text-[13px]">
                      {longDate(entry.date) || `Service ${log.length - i}`}
                    </strong>
                    {entry.mileage && (
                      <span className="text-[11px] font-semibold text-amber-400">
                        {entry.mileage}
                      </span>
                    )}
                  </div>
                  {(entry.oilType || entry.fluidBrand) && (
                    <p className="mt-1 text-[11px] text-slate-400">
                      {[
                        entry.oilType && `Oil: ${entry.oilType}`,
                        entry.fluidBrand && `Type/brand: ${entry.fluidBrand}`,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  )}
                  {done.length + skipped.length > 0 && (
                    <ul className="mt-3 grid gap-1.5 text-[12px]">
                      {[...done, ...skipped].map(([key, label]) => (
                        <li
                          key={key}
                          className={`flex items-center gap-2 ${entry[key] ? "text-slate-100" : "text-slate-500"}`}
                        >
                          {entry[key] ? (
                            <CircleCheck className="h-4 w-4 shrink-0 text-emerald-400" />
                          ) : (
                            <CircleX className="h-4 w-4 shrink-0 text-slate-600" />
                          )}
                          {label}
                        </li>
                      ))}
                    </ul>
                  )}
                  {entry.notes && (
                    <p className="mt-3 whitespace-pre-line border-t border-white/10 pt-3 text-[12px] leading-5 text-slate-300">
                      {entry.notes}
                    </p>
                  )}
                </li>
              );
            })}
          </ol>
        </section>
      )}

      {/* WORKSHOP */}
      {(c.shopPhone || c.shopAddress || safeUrl(c.mapUrl)) && (
        <section className="mt-6 space-y-2 rounded-2xl bg-slate-900 p-4 text-[13px] ring-1 ring-white/10">
          {c.shopAddress && (
            <p className="flex items-start gap-2 text-slate-300">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
              {c.shopAddress}
            </p>
          )}
          <div className="grid gap-2 pt-1 sm:grid-cols-2">
            {c.shopPhone && (
              <a
                href={`tel:${String(c.shopPhone).replace(/[^+\d]/g, "")}`}
                className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-3 text-sm font-semibold text-slate-950"
              >
                <Phone className="h-4 w-4" /> Book a service
              </a>
            )}
            {safeUrl(c.mapUrl) && (
              <a
                href={safeUrl(c.mapUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl border border-amber-500 px-4 py-3 text-sm font-semibold text-amber-400"
              >
                <Navigation className="h-4 w-4" /> Directions
              </a>
            )}
          </div>
        </section>
      )}

      <Link href="/" className="mt-auto pt-6">
        <p className="text-center text-[9px] font-medium text-slate-500">
          Powered by <span className="font-semibold">Smart QR</span>
        </p>
      </Link>
    </article>
  );
}

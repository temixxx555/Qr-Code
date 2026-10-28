"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Salad,
  TriangleAlert,
  ShieldAlert,
  Package,
  Flag,
  CalendarClock,
  Snowflake,
  Utensils,
  Factory,
  Phone,
  Mail,
  Globe,
} from "lucide-react";
import { Picture } from "../presentation";
import { safeUrl } from "@/lib/qr-content";
import { formatDate } from "../wedding/weddingPreview";

function Block({ icon: Icon, title, children, tone = "bg-white" }) {
  return (
    <section className={`mt-4 rounded-2xl p-5 shadow-sm ${tone}`}>
      <h2 className="flex items-center gap-2 text-sm font-bold">
        <Icon className="h-4 w-4 shrink-0" />
        {title}
      </h2>
      <div className="mt-2 whitespace-pre-line text-[13px] leading-6">
        {children}
      </div>
    </section>
  );
}

export default function NutritionPreview({ content: c }) {
  // Null until mounted so the server render never disagrees with the client.
  const [today, setToday] = useState(null);
  useEffect(() => {
    const tick = () => setToday(new Date().toISOString().slice(0, 10));
    tick();
  }, []);
  const nutrients = (Array.isArray(c.nutrients) ? c.nutrients : []).filter(
    (n) => n?.name,
  );
  const expiry = formatDate(c.expiryDate, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const expired = today && expiry && c.expiryDate < today;
  const facts = [
    [Package, c.netQuantity],
    [Flag, c.countryOfOrigin && `Made in ${c.countryOfOrigin}`],
  ].filter(([, text]) => text);

  return (
    <article className="relative flex min-h-full flex-col bg-emerald-50/70 px-[5%] pb-6 pt-6 text-slate-800">
      <div className="overflow-hidden rounded-[26px] bg-white shadow-[0_30px_60px_-35px_rgba(6,78,59,0.5)]">
        {safeUrl(c.image) ? (
          <Picture
            src={c.image}
            alt={c.name || "Product"}
            className="h-56 w-full bg-slate-50 !object-contain"
          />
        ) : (
          <div className="flex h-40 items-center justify-center bg-gradient-to-br from-emerald-400 to-lime-300">
            <Salad className="h-14 w-14 text-white" />
          </div>
        )}
        <div className="p-5 text-center">
          {c.brand && (
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-emerald-600">
              {c.brand}
            </p>
          )}
          <h1 className="mt-1 break-words text-2xl font-bold leading-tight">
            {c.name || "Your product"}
          </h1>
          {facts.length > 0 && (
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {facts.map(([Icon, text]) => (
                <span
                  key={text}
                  className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-800"
                >
                  <Icon className="h-3 w-3" />
                  {text}
                </span>
              ))}
            </div>
          )}
          {expiry && (
            <p
              className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold ${expired ? "bg-red-50 text-red-600" : "bg-slate-100 text-slate-600"}`}
            >
              <CalendarClock className="h-3 w-3" />
              {expired ? `Expired on ${expiry}` : `Best before ${expiry}`}
            </p>
          )}
          {c.batch && (
            <p className="mt-2 text-[10px] text-slate-400">Batch {c.batch}</p>
          )}
        </div>
      </div>

      {c.allergens && (
        <Block
          icon={TriangleAlert}
          title="Allergen warning"
          tone="bg-amber-50 text-amber-900 ring-1 ring-amber-200"
        >
          {c.allergens}
        </Block>
      )}

      {(c.calories || c.servingSize || nutrients.length > 0) && (
        <section className="mt-4 rounded-2xl border-2 border-slate-900 bg-white p-4">
          <h2 className="border-b-8 border-slate-900 pb-1 text-2xl font-black tracking-tight">
            Nutrition Facts
          </h2>
          {c.servingsPerContainer && (
            <p className="pt-1 text-[12px]">
              {c.servingsPerContainer} servings per container
            </p>
          )}
          {c.servingSize && (
            <p className="flex justify-between border-b-4 border-slate-900 py-1 text-[13px] font-bold">
              <span>Serving size</span>
              <span>{c.servingSize}</span>
            </p>
          )}
          {c.calories && (
            <p className="flex items-end justify-between border-b-4 border-slate-900 py-1">
              <span className="text-lg font-black">Calories</span>
              <span className="text-3xl font-black">{c.calories}</span>
            </p>
          )}
          {nutrients.length > 0 && (
            <>
              <p className="border-b border-slate-400 py-1 text-right text-[10px] font-bold">
                % Daily Value*
              </p>
              {nutrients.map((n, i) => (
                <p
                  key={i}
                  className="flex justify-between gap-3 border-b border-slate-300 py-1.5 text-[13px]"
                >
                  <span>
                    <strong>{n.name}</strong> {n.amount}
                  </span>
                  {n.dailyValue && (
                    <strong>
                      {String(n.dailyValue).replace(/%?$/, "%")}
                    </strong>
                  )}
                </p>
              ))}
              <p className="pt-2 text-[9px] leading-snug text-slate-500">
                * The % Daily Value tells you how much a nutrient in a serving
                contributes to a daily diet.
              </p>
            </>
          )}
        </section>
      )}

      {c.ingredients && (
        <Block icon={Salad} title="Ingredients">
          <span className="text-slate-600">{c.ingredients}</span>
        </Block>
      )}
      {c.directions && (
        <Block icon={Utensils} title="Directions for use">
          <span className="text-slate-600">{c.directions}</span>
        </Block>
      )}
      {c.storage && (
        <Block icon={Snowflake} title="Storage">
          <span className="text-slate-600">{c.storage}</span>
        </Block>
      )}
      {c.warnings && (
        <Block
          icon={ShieldAlert}
          title="Safety warnings"
          tone="bg-red-50 text-red-900 ring-1 ring-red-200"
        >
          {c.warnings}
        </Block>
      )}

      {(c.manufacturer ||
        c.manufacturerPhone ||
        c.manufacturerEmail ||
        safeUrl(c.websiteUrl)) && (
        <Block icon={Factory} title="Manufacturer / distributor">
          {c.manufacturer && (
            <span className="block text-slate-600">{c.manufacturer}</span>
          )}
          <span className="mt-2 block space-y-1.5">
            {c.manufacturerPhone && (
              <a
                href={`tel:${String(c.manufacturerPhone).replace(/[^+\d]/g, "")}`}
                className="flex items-center gap-2 font-semibold text-emerald-700"
              >
                <Phone className="h-4 w-4" /> {c.manufacturerPhone}
              </a>
            )}
            {c.manufacturerEmail && (
              <a
                href={`mailto:${c.manufacturerEmail}`}
                className="flex items-center gap-2 font-semibold text-emerald-700"
              >
                <Mail className="h-4 w-4" /> {c.manufacturerEmail}
              </a>
            )}
            {safeUrl(c.websiteUrl) && (
              <a
                href={safeUrl(c.websiteUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 font-semibold text-emerald-700"
              >
                <Globe className="h-4 w-4" /> Visit website
              </a>
            )}
          </span>
        </Block>
      )}

      <Link href="/" className="mt-auto pt-6">
        <p className="text-center text-[9px] font-medium text-slate-400">
          Powered by <span className="font-semibold text-slate-500">Smart QR</span>
        </p>
      </Link>
    </article>
  );
}

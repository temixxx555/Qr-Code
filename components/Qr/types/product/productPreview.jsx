"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  MapPin,
  Phone,
  Globe,
  MessageCircle,
  Package,
  ExternalLink,
} from "lucide-react";
import { Picture } from "../presentation";
import {
  safeUrl,
  whatsappUrl,
  formatMoney,
  phoneDigits,
} from "@/lib/qr-content";

const SAMPLE = [
  { name: "Your first product", price: 15000, category: "New" },
  { name: "Best seller", price: 25000, salePrice: 20000, category: "Popular" },
];

export default function ProductPreview({ content: c }) {
  const [category, setCategory] = useState("All");
  const products =
    Array.isArray(c.products) && c.products.length ? c.products : SAMPLE;
  const categories = [
    "All",
    ...new Set(products.map((p) => p.category?.trim()).filter(Boolean)),
  ];
  const visible =
    category === "All"
      ? products
      : products.filter((p) => p.category?.trim() === category);
  const whatsapp = phoneDigits(c.whatsapp);
  const money = (v) => formatMoney(v, c.currency);

  return (
    <article className="relative flex min-h-full w-full flex-col bg-[#f6f7f5] text-slate-900">
      <div className="relative h-[150px] w-full overflow-hidden">
        <Picture
          src={c.cover}
          alt={c.name || "Store"}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        <div className="absolute left-[5%] top-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/25 px-3 py-1.5 text-[10px] font-semibold text-white backdrop-blur-md">
          <ShoppingBag className="h-3.5 w-3.5" />
          Shop
        </div>
      </div>

      <section className="relative mx-auto -mt-10 w-[90%] rounded-[26px] border border-white bg-white px-[6%] pb-5 pt-4 shadow-[0_24px_60px_-30px_rgba(15,23,42,0.35)]">
        <div className="-mt-11 flex items-end gap-3">
          <Picture
            src={c.logo}
            alt={c.name || "Store"}
            className="h-[76px] w-[76px] shrink-0 rounded-[20px] border-4 border-white shadow-md"
          />
          <span className="mb-1 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-100">
            {products.length} {products.length === 1 ? "product" : "products"}
          </span>
        </div>
        <h1 className="mt-4 break-words text-[26px] font-bold leading-tight tracking-tight">
          {c.name || "Your store"}
        </h1>
        {c.description && (
          <p className="mt-2 whitespace-pre-line text-[13px] leading-6 text-slate-500">
            {c.description}
          </p>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          {whatsapp && (
            <a
              href={whatsappUrl({
                phone: whatsapp,
                message: `Hi ${c.name || ""}, I'd like to make an enquiry.`,
              })}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#25d366] px-3 py-2 text-[11px] font-semibold text-white"
            >
              <MessageCircle className="h-3.5 w-3.5" /> Chat
            </a>
          )}
          {c.phone && (
            <a
              href={`tel:${String(c.phone).replace(/[^+\d]/g, "")}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-2 text-[11px] font-semibold text-slate-700"
            >
              <Phone className="h-3.5 w-3.5" /> Call
            </a>
          )}
          {safeUrl(c.storeUrl) && (
            <a
              href={safeUrl(c.storeUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-2 text-[11px] font-semibold text-slate-700"
            >
              <Globe className="h-3.5 w-3.5" /> Website
            </a>
          )}
        </div>
        {c.address && (
          <p className="mt-3 flex items-start gap-2 text-[11px] leading-5 text-slate-500">
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
            {c.address}
          </p>
        )}
      </section>

      <div className="mx-auto mt-5 w-[90%] flex-1 pb-6">
        {categories.length > 2 && (
          <div className="-mx-1 mb-4 flex gap-2 overflow-x-auto px-1 pb-1">
            {categories.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => setCategory(name)}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-[11px] font-semibold transition ${
                  category === name
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-600 ring-1 ring-slate-200"
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          {visible.map((p, i) => {
            const soldOut = p.available === false;
            const onSale =
              p.salePrice !== undefined &&
              p.salePrice !== "" &&
              Number(p.salePrice) < Number(p.price);
            const buyUrl = safeUrl(p.buyUrl);
            const orderUrl =
              !soldOut && whatsapp
                ? whatsappUrl({
                    phone: whatsapp,
                    message: `Hi ${c.name || ""}, I'd like to order: ${p.name} (${money(onSale ? p.salePrice : p.price)}).`,
                  })
                : "";
            return (
              <div
                key={`${p.name}-${i}`}
                className={`flex flex-col overflow-hidden rounded-[20px] border border-slate-100 bg-white shadow-[0_10px_30px_-22px_rgba(15,23,42,0.4)] ${soldOut ? "opacity-60" : ""}`}
              >
                <div className="relative aspect-square w-full bg-slate-100">
                  {safeUrl(p.image) ? (
                    <Picture
                      src={p.image}
                      alt={p.name || "Product"}
                      className="h-full w-full"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-300">
                      <Package className="h-8 w-8" />
                    </div>
                  )}
                  {onSale && !soldOut && (
                    <span className="absolute left-2 top-2 rounded-full bg-rose-500 px-2 py-0.5 text-[9px] font-bold text-white">
                      SALE
                    </span>
                  )}
                  {soldOut && (
                    <span className="absolute left-2 top-2 rounded-full bg-slate-900/80 px-2 py-0.5 text-[9px] font-bold text-white">
                      SOLD OUT
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-3">
                  <h2 className="line-clamp-2 text-[12px] font-semibold leading-4">
                    {p.name || "Product"}
                  </h2>
                  {p.description && (
                    <p className="mt-1 line-clamp-2 text-[10px] leading-4 text-slate-500">
                      {p.description}
                    </p>
                  )}
                  <div className="mt-auto pt-2">
                    <p className="text-[13px] font-bold text-emerald-700">
                      {money(onSale ? p.salePrice : p.price)}
                    </p>
                    {onSale && (
                      <p className="text-[10px] text-slate-400 line-through">
                        {money(p.price)}
                      </p>
                    )}
                  </div>
                  {(buyUrl || orderUrl) && !soldOut && (
                    <a
                      href={buyUrl || orderUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`mt-2 inline-flex items-center justify-center gap-1 rounded-xl px-2 py-2 text-[10px] font-semibold text-white ${buyUrl ? "bg-slate-900" : "bg-[#25d366]"}`}
                    >
                      {buyUrl ? (
                        <>
                          Buy now <ExternalLink className="h-3 w-3" />
                        </>
                      ) : (
                        <>
                          <MessageCircle className="h-3 w-3" /> Order
                        </>
                      )}
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <Link href="/">
          <p className="mt-7 text-center text-[9px] font-medium text-slate-400">
            Powered by <span className="font-semibold text-slate-500">Smart QR</span>
          </p>
        </Link>
      </div>
    </article>
  );
}

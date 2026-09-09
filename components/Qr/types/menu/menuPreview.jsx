import {
  MapPin,
  Phone,
  UtensilsCrossed,
  Sparkles,
  CircleOff,
} from "lucide-react";

import { Picture } from "../presentation";
import PdfPreview from "../pdf/pdfPreview";
import WebsitePreview from "../website/websitePreview";
import Link from "next/link";

export default function MenuPreview({ content: c }) {
  if (c.mode === "pdf") return <PdfPreview content={c} />;
  if (c.mode === "url") return <WebsitePreview content={c} />;

  const price = (value) => {
    try {
      return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: c.currency || "NGN",
        maximumFractionDigits: 2,
      }).format(Number(value || 0));
    } catch {
      return `${c.currency || ""} ${value}`;
    }
  };

  const categories = Array.isArray(c.categories) ? c.categories : [];

  return (
    <article className='relative flex min-h-full w-full flex-col overflow-hidden bg-[#fffaf2] text-[#3d2c20]'>
      {/* BACKGROUND */}
      <div className='pointer-events-none absolute inset-0 overflow-hidden'>
        <div className='absolute -left-24 top-24 h-72 w-72 rounded-full bg-amber-100/60 blur-3xl' />
        <div className='absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-orange-100/50 blur-3xl' />

        <div
          className='absolute inset-0 opacity-[0.02]'
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgb(66 46 32) 1px, transparent 0)",
            backgroundSize: "22px 22px",
          }}
        />
      </div>

      <div className='relative mx-auto flex min-h-full w-full max-w-[720px] flex-1 flex-col'>
        {/* COVER */}
        <div className='relative h-[170px] w-full overflow-hidden'>
          <Picture
            src={c.cover}
            alt={c.name || "Restaurant"}
            className='h-full w-full object-cover'
          />

          <div className='absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent' />

          <div className='absolute left-[5%] top-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/20 px-3 py-1.5 text-[10px] font-semibold text-white backdrop-blur-md'>
            <UtensilsCrossed className='h-3.5 w-3.5' />
            Menu
          </div>
        </div>

        {/* RESTAURANT HEADER */}
        <div className='relative mx-auto -mt-10 w-[90%] max-w-[620px]'>
          <section className='rounded-[28px] border border-white/90 bg-white/95 px-[6%] pb-6 pt-5 shadow-[0_24px_70px_-30px_rgba(66,46,32,0.35)] backdrop-blur-xl'>
            <div className='-mt-12 flex items-end justify-between gap-3'>
              <Picture
                src={c.logo}
                alt={c.name || "Menu"}
                className='h-[84px] w-[84px] shrink-0 rounded-[22px] border-[4px] border-white object-cover shadow-lg'
              />

              <div className='mb-1.5 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-amber-700 ring-1 ring-amber-100'>
                <Sparkles className='h-3 w-3' />
                Freshly prepared
              </div>
            </div>

            <div className='mt-5'>
              <h1 className='break-words text-[28px] font-bold leading-[1.08] tracking-[-0.04em] text-[#2e2118]'>
                {c.name || "Your restaurant"}
              </h1>

              {c.description && (
                <p className='mt-3 whitespace-pre-line text-[13px] leading-6 text-[#6f5a4a]'>
                  {c.description}
                </p>
              )}
            </div>

            {(c.address || c.phone) && (
              <div className='mt-5 grid gap-2'>
                {c.address && (
                  <div className='flex items-start gap-2.5 rounded-[14px] bg-[#fff8ed] px-3.5 py-3'>
                    <MapPin className='mt-0.5 h-4 w-4 shrink-0 text-amber-700' />

                    <p className='text-[11px] leading-5 text-[#6f5a4a]'>
                      {c.address}
                    </p>
                  </div>
                )}

                {c.phone && (
                  <a
                    href={`tel:${String(c.phone).replace(/[^+\d]/g, "")}`}
                    className='flex items-center gap-2.5 rounded-[14px] bg-[#fff8ed] px-3.5 py-3 transition hover:bg-amber-50'
                  >
                    <Phone className='h-4 w-4 shrink-0 text-amber-700' />

                    <span className='truncate text-[11px] font-medium text-[#6f5a4a]'>
                      {c.phone}
                    </span>
                  </a>
                )}
              </div>
            )}
          </section>
        </div>

        {/* MENU */}
        <div className='mx-auto mt-6 w-[90%] max-w-[620px] flex-1 pb-7'>
          {categories.length > 0 ? (
            <div className='space-y-6'>
              {categories.map((category, categoryIndex) => {
                const items = Array.isArray(category.items)
                  ? category.items
                  : [];

                return (
                  <section key={`${category.name}-${categoryIndex}`}>
                    {/* CATEGORY */}
                    <div className='mb-3 flex items-center gap-3'>
                      <h2 className='shrink-0 text-[18px] font-bold tracking-[-0.02em] text-[#38281d]'>
                        {category.name || "Category"}
                      </h2>

                      <div className='h-px flex-1 bg-gradient-to-r from-amber-200 to-transparent' />
                    </div>

                    {/* ITEMS */}
                    <div className='space-y-2.5'>
                      {items.map((item, itemIndex) => {
                        const unavailable = item.available === false;

                        return (
                          <div
                            key={`${item.name}-${itemIndex}`}
                            className={`relative overflow-hidden rounded-[20px] border border-[#f1e7d9] bg-white p-3.5 shadow-[0_8px_28px_-20px_rgba(66,46,32,0.28)] ${
                              unavailable ? "opacity-55" : ""
                            }`}
                          >
                            <div className='flex min-w-0 gap-3.5'>
                              <div className='min-w-0 flex-1'>
                                <div className='flex items-start justify-between gap-3'>
                                  <h3 className='break-words text-[13px] font-semibold leading-5 text-[#33251b]'>
                                    {item.name || "Menu item"}
                                  </h3>

                                  <span className='shrink-0 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-800'>
                                    {price(item.price)}
                                  </span>
                                </div>

                                {item.description && (
                                  <p className='mt-1.5 text-[11px] leading-5 text-[#7b6859]'>
                                    {item.description}
                                  </p>
                                )}

                                <div className='mt-2.5 flex flex-wrap items-center gap-1.5'>
                                  {unavailable ? (
                                    <span className='inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-[9px] font-semibold text-red-500'>
                                      <CircleOff className='h-3 w-3' />
                                      Unavailable
                                    </span>
                                  ) : item.tags ? (
                                    String(item.tags)
                                      .split(",")
                                      .map((tag, tagIndex) => (
                                        <span
                                          key={`${tag}-${tagIndex}`}
                                          className='rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-semibold text-emerald-700'
                                        >
                                          {tag.trim()}
                                        </span>
                                      ))
                                  ) : (
                                    <span className='rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-semibold text-emerald-700'>
                                      Available
                                    </span>
                                  )}
                                </div>
                              </div>

                              {item.image && (
                                <Picture
                                  src={item.image}
                                  alt={item.name || "Dish"}
                                  className='h-[78px] w-[78px] shrink-0 rounded-[16px] object-cover'
                                />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                );
              })}
            </div>
          ) : (
            <div className='rounded-[24px] border border-dashed border-amber-200 bg-white/70 px-6 py-10 text-center backdrop-blur'>
              <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700'>
                <UtensilsCrossed className='h-5 w-5' />
              </div>

              <p className='mt-4 text-sm font-semibold text-[#493529]'>
                Your menu is waiting
              </p>

              <p className='mx-auto mt-1 max-w-[250px] text-xs leading-5 text-[#8b7768]'>
                Add your first category and dishes to start building your
                restaurant menu.
              </p>
            </div>
          )}

          {/* FOOTER */}
          <Link href={"/"}>
            <p className='mt-7 text-center text-[9px] font-medium text-[#9a887a]'>
              Powered by{" "}
              <span className='font-semibold text-[#79675a]'>Smart QR</span>
            </p>
          </Link>
        </div>
      </div>
    </article>
  );
}

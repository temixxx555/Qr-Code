import {
  ImageIcon,
  ExternalLink,
  Sparkles,
} from "lucide-react";

import { Picture } from "../presentation";
import { safeUrl } from "@/lib/qr-content";

export default function Preview({ content: c }) {
  const images = Array.isArray(c.images) ? c.images : [];

  return (
    <article className="relative flex min-h-full w-full flex-col overflow-hidden bg-[#f8fafc] text-slate-900">
      {/* BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-violet-100/60 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-rose-100/60 blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgb(15 23 42) 1px, transparent 0)",
            backgroundSize: "22px 22px",
          }}
        />
      </div>

      <div className="relative mx-auto flex min-h-full w-full max-w-[760px] flex-1 flex-col px-[5%] py-5">
        {/* HEADER */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-violet-600 ring-1 ring-violet-100">
              <Sparkles className="h-3 w-3" />
              Gallery
            </div>

            <h1 className="break-words text-[26px] font-bold leading-[1.1] tracking-[-0.04em] text-slate-950">
              {c.title || "Your gallery"}
            </h1>

            {c.description && (
              <p className="mt-2.5 max-w-[520px] whitespace-pre-line text-[13px] leading-6 text-slate-500">
                {c.description}
              </p>
            )}
          </div>

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-violet-600 shadow-sm ring-1 ring-slate-100">
            <ImageIcon className="h-5 w-5" />
          </div>
        </div>

        {/* GALLERY */}
        {images.length > 0 ? (
          <div className="mt-6 grid grid-cols-2 gap-2.5">
            {images.map((image, index) => {
              const url = safeUrl(image.url);
              const isFeatured = index === 0;

              return (
                <a
                  key={`${image.url}-${index}`}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group relative overflow-hidden rounded-[18px] bg-white shadow-sm ring-1 ring-slate-100 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
                    isFeatured ? "col-span-2" : ""
                  }`}
                >
                  <div
                    className={`relative overflow-hidden bg-slate-100 ${
                      isFeatured ? "h-[230px]" : "h-[145px]"
                    }`}
                  >
                    <Picture
                      src={image.url}
                      alt={image.caption || "Gallery image"}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent opacity-70" />

                    <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-xl bg-black/25 text-white backdrop-blur-md">
                      <ExternalLink className="h-3.5 w-3.5" />
                    </div>

                    {image.caption && (
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <p
                          className={`line-clamp-2 font-medium text-white ${
                            isFeatured ? "text-[13px]" : "text-[11px]"
                          }`}
                        >
                          {image.caption}
                        </p>
                      </div>
                    )}
                  </div>
                </a>
              );
            })}
          </div>
        ) : (
          <div className="mt-7 rounded-[24px] border border-dashed border-slate-200 bg-white/75 px-6 py-10 text-center shadow-sm backdrop-blur">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-500 ring-1 ring-violet-100">
              <ImageIcon className="h-5 w-5" />
            </div>

            <p className="mt-4 text-sm font-semibold text-slate-700">
              Your photos will appear here
            </p>

            <p className="mx-auto mt-1 max-w-[240px] text-xs leading-5 text-slate-400">
              Add images to create a beautiful shareable gallery.
            </p>
          </div>
        )}

        {/* FOOTER */}
        <div className="mt-auto pt-7 text-center">
          <p className="text-[9px] font-medium text-slate-400">
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
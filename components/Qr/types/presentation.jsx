import { safeUrl } from "@/lib/qr-content";
export function Picture({ src, alt = "", className = "" }) {
  return safeUrl(src) ? (
    <img
      src={safeUrl(src)}
      alt={alt}
      className={`object-cover ${className}`}
      loading="lazy"
    />
  ) : (
    <div
      className={`flex items-center justify-center bg-gradient-to-br from-emerald-100 to-teal-200 text-3xl font-bold text-emerald-800 ${className}`}
      aria-label={alt}
    >
      {alt.slice(0, 1) || "✦"}
    </div>
  );
}
export function Action({ href, children, download }) {
  const url = safeUrl(href);
  return url ? (
    <a
      href={url}
      download={download}
      target="_blank"
      rel="noopener noreferrer"
      className="my-2 block rounded-xl bg-emerald-600 px-4 py-3 text-center text-sm font-semibold text-white"
    >
      {children}
    </a>
  ) : null;
}
export function Intro({ title, description }) {
  return (
    <>
      <h1 className="text-2xl font-bold leading-tight">{title}</h1>
      {description && (
        <p className="mt-3 whitespace-pre-line text-sm leading-relaxed opacity-75">
          {description}
        </p>
      )}
    </>
  );
}

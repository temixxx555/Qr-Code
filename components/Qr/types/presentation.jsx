import { safeUrl } from "@/lib/qr-content";

export function Picture({
  src,
  alt = "",
  className = "",
}) {
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

function cloudinaryDownloadUrl(url, filename) {
  if (!url) return null;

  // Leave non-Cloudinary URLs unchanged.
  if (!url.includes("res.cloudinary.com")) {
    return url;
  }

  // Remove the extension because Cloudinary adds the
  // actual file extension automatically.
  const nameWithoutExtension = filename
    ? filename.replace(/\.[^/.]+$/, "")
    : "document";

  const safeFilename = nameWithoutExtension
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .slice(0, 100);

  // If attachment transformation is already present,
  // don't add another one.
  if (url.includes("/upload/fl_attachment")) {
    return url;
  }

  return url.replace(
    "/upload/",
    `/upload/fl_attachment:${safeFilename}/`,
  );
}

export function Action({
  href,
  children,
  download = false,
  filename,
  className = "",
}) {
  const originalUrl = safeUrl(href);

  if (!originalUrl) return null;

  const url = download
    ? cloudinaryDownloadUrl(originalUrl, filename)
    : originalUrl;

  return (
    <a
      href={url}
      {...(!download && {
        target: "_blank",
        rel: "noopener noreferrer",
      })}
      className={`my-2 block rounded-xl bg-emerald-600 px-4 py-3 text-center text-sm font-semibold text-white transition-colors ${className}`}
    >
      {children}
    </a>
  );
}

export function Intro({
  title,
  description,
}) {
  return (
    <>
      <h1 className="text-2xl font-bold leading-tight">
        {title}
      </h1>

      {description && (
        <p className="mt-3 whitespace-pre-line text-sm leading-relaxed opacity-75">
          {description}
        </p>
      )}
    </>
  );
}
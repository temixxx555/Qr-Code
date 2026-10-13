// Approximate location from the hosting edge (Vercel, or Cloudflare with
// visitor location headers enabled). Derived from the network, not GPS.
function header(request, ...names) {
  for (const name of names) {
    const value = request.headers.get(name);
    if (value) {
      try {
        return decodeURIComponent(value).trim().slice(0, 100);
      } catch {
        return value.trim().slice(0, 100);
      }
    }
  }
  return null;
}
// Round to ~1 km so stored coordinates stay city-level.
function coordinate(value, limit) {
  const n = Number(value);
  return value && Number.isFinite(n) && Math.abs(n) <= limit
    ? Math.round(n * 100) / 100
    : null;
}
function validTimezone(value) {
  if (!value) return null;
  try {
    new Intl.DateTimeFormat("en", { timeZone: value });
    return value;
  } catch {
    return null;
  }
}
export function scanLocation(request) {
  const country = header(request, "x-vercel-ip-country", "cf-ipcountry");
  return {
    country: /^[A-Z]{2}$/i.test(country || "") && !/^(XX|T1)$/i.test(country)
      ? country.toUpperCase()
      : "Unknown",
    region: header(request, "x-vercel-ip-country-region", "cf-region"),
    city: header(request, "x-vercel-ip-city", "cf-ipcity"),
    postalCode: header(request, "x-vercel-ip-postal-code", "cf-postal-code"),
    latitude: coordinate(
      header(request, "x-vercel-ip-latitude", "cf-iplatitude"),
      90,
    ),
    longitude: coordinate(
      header(request, "x-vercel-ip-longitude", "cf-iplongitude"),
      180,
    ),
    timezone: validTimezone(header(request, "x-vercel-ip-timezone", "cf-timezone")),
  };
}
const BRANDS = [
  [/iphone/i, "Apple iPhone"],
  [/ipad/i, "Apple iPad"],
  [/macintosh/i, "Apple Mac"],
  [/samsung|SM-[A-Z0-9]/i, "Samsung"],
  [/tecno/i, "Tecno"],
  [/infinix/i, "Infinix"],
  [/\bitel\b/i, "itel"],
  [/redmi|xiaomi|\bmi \d|poco/i, "Xiaomi"],
  [/oppo|CPH\d{4}/i, "Oppo"],
  [/vivo/i, "Vivo"],
  [/huawei|honor/i, "Huawei / Honor"],
  [/pixel/i, "Google Pixel"],
  [/oneplus/i, "OnePlus"],
  [/nokia/i, "Nokia"],
  [/motorola|moto /i, "Motorola"],
];
export function deviceBrand(ua) {
  return BRANDS.find(([pattern]) => pattern.test(ua))?.[1] || "Other";
}
export function language(request) {
  const tag = (request.headers.get("accept-language") || "")
    .split(",")[0]
    .split(";")[0]
    .trim();
  if (!/^[a-z]{2,3}(-[a-z0-9]{2,8})?$/i.test(tag)) return "Unknown";
  try {
    return (
      new Intl.DisplayNames(["en"], { type: "language" }).of(tag) || tag
    );
  } catch {
    return tag;
  }
}

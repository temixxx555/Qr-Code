export const QR_TYPES = [
  "website",
  "pdf",
  "links",
  "vcard",
  "business",
  "video",
  "images",
  "facebook",
  "instagram",
  "social",
  "whatsapp",
  "menu",
  "wifi",
  "mp3",
  "apps",
  "coupon",
  "product",
  "wedding",
  "event",
];
// Per-list limits for repeatable content. Items must be flat objects.
const LIST_LIMITS = {
  links: 50,
  images: 50,
  categories: 50,
  products: 100,
  videos: 10,
  schedule: 20,
  speakers: 30,
};
export const typeLabel = (type) =>
  ({
    vcard: "vCard",
    links: "List of Links",
    social: "Social Media",
    wifi: "WiFi",
    mp3: "MP3",
    pdf: "PDF",
    whatsapp: "WhatsApp",
    product: "Products",
    wedding: "Wedding",
    event: "Event",
  })[type] || type.charAt(0).toUpperCase() + type.slice(1);
export function safeUrl(value) {
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) &&
      !url.username &&
      !url.password
      ? url.href
      : "";
  } catch {
    return "";
  }
}
export function instagramUrl(value = "") {
  return (
    safeUrl(value) ||
    (/^@?[a-zA-Z0-9._]{1,30}$/.test(value)
      ? `https://www.instagram.com/${value.replace(/^@/, "")}/`
      : "")
  );
}
export function whatsappUrl(c) {
  return `https://wa.me/${String(c.phone || "").replace(/\D/g, "")}?text=${encodeURIComponent(c.message || "")}`;
}
export function phoneDigits(value) {
  return String(value || "").replace(/\D/g, "");
}
export function formatMoney(value, currency = "NGN") {
  try {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: currency || "NGN",
      maximumFractionDigits: 2,
    }).format(Number(value || 0));
  } catch {
    return `${currency || ""} ${value}`.trim();
  }
}
export function wifiPayload(c) {
  const escape = (s) => String(s || "").replace(/[\\;,:\"]/g, "\\$&");
  return `WIFI:T:${c.encryption || "WPA"};S:${escape(c.ssid)};P:${c.encryption === "nopass" ? "" : escape(c.password)};H:${!!c.hidden};;`;
}
function validateContentUnsafe(type, c) {
  if (!QR_TYPES.includes(type)) return "Unsupported QR type.";
  if (!c || typeof c !== "object" || Array.isArray(c))
    return "Content is required.";
  if (JSON.stringify(c).length > 150000)
    return "Content is too large. Upload media instead of embedding it.";
  for (const [key, val] of Object.entries(c)) {
    if (Object.hasOwn(LIST_LIMITS, key)) {
      if (!Array.isArray(val) || val.length > LIST_LIMITS[key])
        return "Invalid content list.";
      if (
        key !== "categories" &&
        val.some(
          (item) =>
            !item ||
            typeof item !== "object" ||
            Array.isArray(item) ||
            Object.values(item).some(
              (v) =>
                v != null && !["string", "number", "boolean"].includes(typeof v),
            ),
        )
      )
        return "Invalid content list item.";
    } else if (key === "hours") {
      if (
        !val ||
        typeof val !== "object" ||
        Array.isArray(val) ||
        Object.values(val).some((v) => typeof v !== "string")
      )
        return "Invalid opening hours.";
    } else if (["passwordEnabled", "hidden"].includes(key)) {
      if (typeof val !== "boolean") return "Invalid content option.";
    } else if (val != null && !["string", "number"].includes(typeof val))
      return "Invalid content field.";
  }
  if (
    c.images?.some(
      (image) =>
        !image || (image.caption != null && typeof image.caption !== "string"),
    )
  )
    return "Image captions must be text.";
  if (
    c.categories?.some(
      (category) =>
        !category ||
        !Array.isArray(category.items) ||
        category.items.length > 100 ||
        category.items.some(
          (item) =>
            !item ||
            ["description", "tags"].some(
              (key) => item[key] != null && typeof item[key] !== "string",
            ) ||
            (item.available != null && typeof item.available !== "boolean"),
        ),
    )
  )
    return "Invalid menu items.";
  const walk = (obj) =>
    Object.entries(obj).some(([key, value]) => {
      if (["__proto__", "constructor", "prototype"].includes(key)) return true;
      if (value && typeof value === "object") return walk(value);
      return (
        typeof value === "string" &&
        value &&
        (/url$/i.test(key) ||
          ["avatar", "logo", "cover", "thumbnail", "image"].includes(key)) &&
        !safeUrl(value)
      );
    });
  if (walk(c)) return "Use valid HTTP or HTTPS links for websites and media.";
  const required = (condition, message) => (condition ? null : message);
  switch (type) {
    case "website":
      return required(
        safeUrl(c.websiteUrl || c.url),
        "Enter a valid website URL.",
      );
    case "vcard":
      return required(
        c.firstName?.trim() || c.lastName?.trim() || c.name?.trim(),
        "Enter the contact's name.",
      );
    case "business":
      return required(c.name?.trim(), "Enter your business name.");
    case "links":
    case "social":
      return required(
        c.links?.length &&
          c.links.length <= 50 &&
          c.links.every((l) => l.label?.trim() && safeUrl(l.url)),
        "Add up to 50 named, valid links.",
      );
    case "pdf":
      return required(safeUrl(c.url), "Upload a PDF or enter its URL.");
    case "video":
    case "mp3":
      return required(
        safeUrl(c.url),
        "Upload media or enter a valid media URL.",
      );
    case "images":
      return required(
        c.images?.length &&
          c.images.length <= 30 &&
          c.images.every((i) => safeUrl(i.url)),
        "Add between 1 and 30 images.",
      );
    case "facebook":
      return required(
        safeUrl(c.url) && /(^|\.)facebook\.com$/.test(new URL(c.url).hostname),
        "Enter a Facebook URL.",
      );
    case "instagram":
      return required(
        instagramUrl(c.username || c.url),
        "Enter an Instagram username or URL.",
      );
    case "whatsapp":
      return required(
        /^[1-9]\d{6,14}$/.test(String(c.phone || "").replace(/[+\s()-]/g, "")),
        "Enter an international phone number with 7–15 digits.",
      );
    case "wifi":
      return required(
        c.ssid?.trim() &&
          c.ssid.length <= 32 &&
          ["WPA", "WEP", "nopass"].includes(c.encryption || "WPA") &&
          (c.encryption === "nopass" || c.password),
        "Enter a network name and password, or select no security.",
      );
    case "apps":
      return required(
        safeUrl(c.iosUrl) || safeUrl(c.androidUrl),
        "Add at least one app store URL.",
      );
    case "coupon":
      return required(
        c.title?.trim() &&
          c.discount?.trim() &&
          (!c.expiration || /^\d{4}-\d{2}-\d{2}$/.test(c.expiration)) &&
          [c.startsAt, c.expiresAt].every(
            (v) => !v || (typeof v === "string" && !isNaN(Date.parse(v))),
          ) &&
          (!c.startsAt ||
            !c.expiresAt ||
            Date.parse(c.expiresAt) > Date.parse(c.startsAt)),
        "Enter a coupon title, discount (e.g. FREE or 20% OFF), and a valid offer period that ends after it starts.",
      );
    case "product":
      return required(
        c.name?.trim() &&
          (!c.whatsapp ||
            /^[1-9]\d{6,14}$/.test(String(c.whatsapp).replace(/[+\s()-]/g, ""))) &&
          c.products?.length &&
          c.products.every(
            (p) =>
              typeof p.name === "string" &&
              p.name.trim() &&
              String(p.price ?? "").trim() &&
              Number.isFinite(Number(p.price)) &&
              Number(p.price) >= 0 &&
              (p.salePrice == null ||
                p.salePrice === "" ||
                (Number.isFinite(Number(p.salePrice)) &&
                  Number(p.salePrice) >= 0)),
          ),
        "Add a business name and at least one product with a name and price. WhatsApp must be an international number.",
      );
    case "wedding":
      return required(
        c.partnerOne?.trim() &&
          c.partnerTwo?.trim() &&
          (!c.date || /^\d{4}-\d{2}-\d{2}$/.test(c.date)) &&
          (!c.time || /^\d{2}:\d{2}$/.test(c.time)) &&
          (!c.rsvpPhone ||
            /^[1-9]\d{6,14}$/.test(String(c.rsvpPhone).replace(/[+\s()-]/g, ""))) &&
          (c.images || []).length <= 30 &&
          (c.images || []).every((i) => safeUrl(i.url)) &&
          (c.videos || []).every((v) => safeUrl(v.url)) &&
          (c.schedule || []).every(
            (e) => typeof e.title === "string" && e.title.trim(),
          ),
        "Enter both names. Dates, RSVP numbers in country format (+234), photos, videos and programme items must be valid.",
      );
    case "event":
      return required(
        c.title?.trim() &&
          (!c.date || /^\d{4}-\d{2}-\d{2}$/.test(c.date)) &&
          (!c.time || /^\d{2}:\d{2}$/.test(c.time)) &&
          (!c.endTime || /^\d{2}:\d{2}$/.test(c.endTime)) &&
          (!c.rsvpBy || /^\d{4}-\d{2}-\d{2}$/.test(c.rsvpBy)) &&
          (!c.rsvpPhone ||
            /^[1-9]\d{6,14}$/.test(String(c.rsvpPhone).replace(/[+\s()-]/g, ""))) &&
          (c.images || []).length <= 30 &&
          (c.images || []).every((i) => safeUrl(i.url)) &&
          (c.videos || []).every((v) => safeUrl(v.url)) &&
          (c.schedule || []).every(
            (e) => typeof e.title === "string" && e.title.trim(),
          ) &&
          (c.speakers || []).every(
            (p) => typeof p.name === "string" && p.name.trim(),
          ),
        "Enter the event title. Dates, RSVP numbers in country format (+234), photos, videos, programme items and people must be valid.",
      );
    case "menu":
      if (["url", "pdf"].includes(c.mode))
        return required(
          safeUrl(c.url),
          "Enter a valid menu URL or upload a PDF.",
        );
      return required(
        c.name?.trim() &&
          c.categories?.length &&
          c.categories.every(
            (cat) =>
              cat.name?.trim() &&
              cat.items?.length &&
              cat.items.every(
                (i) =>
                  i.name?.trim() &&
                  String(i.price).trim() &&
                  Number.isFinite(Number(i.price)) &&
                  Number(i.price) >= 0,
              ),
          ),
        "Add a restaurant name and categories containing named, priced items.",
      );
    default:
      return "Unsupported content.";
  }
}
export function vcardText(c) {
  const esc = (v) =>
    String(v || "")
      .replace(/\\/g, "\\\\")
      .replace(/\r?\n/g, "\\n")
      .replace(/[,;]/g, "\\$&");
  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${esc([c.firstName, c.lastName].filter(Boolean).join(" ") || c.name)}`,
    `N:${esc(c.lastName)};${esc(c.firstName || c.name)};;;`,
    `ORG:${esc(c.company)}`,
    `TITLE:${esc(c.headline)}`,
    `TEL:${esc(c.phone)}`,
    `EMAIL:${esc(c.email)}`,
    `URL:${esc(safeUrl(c.websiteUrl))}`,
    `ADR:;;${esc(c.street)};${esc(c.city)};${esc(c.state)};${esc(c.postalCode)};${esc(c.country)}`,
    "END:VCARD",
    "",
  ].join("\r\n");
}

export function validateContent(type, content) {
  try {
    return validateContentUnsafe(type, content);
  } catch {
    return "Invalid content. Please check the fields.";
  }
}

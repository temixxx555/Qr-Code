import { validateContent, typeLabel } from "./qr-content.js";

export const BULK_LIMIT = 100;

// Types whose content is a flat set of fields, so one CSV row can describe a
// whole QR. Lists (galleries, menus, products…) are left to the editor.
// Each column is [content key, required, example].
export const BULK_COLUMNS = {
  website: [["websiteUrl", true, "https://example.com"]],
  pdf: [
    ["url", true, "https://example.com/brochure.pdf"],
    ["title", false, "Company brochure"],
    ["description", false, ""],
  ],
  video: [
    ["url", true, "https://www.youtube.com/watch?v=dQw4w9WgXcQ"],
    ["title", false, "Product launch"],
    ["description", false, ""],
    ["ctaLabel", false, ""],
    ["ctaUrl", false, ""],
  ],
  mp3: [
    ["url", true, "https://example.com/song.mp3"],
    ["title", false, "Summer song"],
    ["artist", false, ""],
    ["description", false, ""],
  ],
  facebook: [
    ["url", true, "https://www.facebook.com/yourpage"],
    ["title", false, "Your page"],
    ["description", false, ""],
  ],
  instagram: [
    ["username", true, "@yourbrand"],
    ["title", false, "Your brand"],
    ["description", false, ""],
  ],
  whatsapp: [
    ["phone", true, "+2348012345678"],
    ["message", false, "Hello! I'd like to know more."],
    ["title", false, "Your business"],
  ],
  wifi: [
    ["ssid", true, "Guest WiFi"],
    ["password", false, "supersecret"],
    ["encryption", false, "WPA"],
    ["hidden", false, "false"],
  ],
  vcard: [
    ["firstName", true, "Ada"],
    ["lastName", false, "Obi"],
    ["headline", false, "Sales Manager"],
    ["company", false, "Acme Ltd"],
    ["phone", false, "+2348012345678"],
    ["email", false, "ada@example.com"],
    ["websiteUrl", false, "https://example.com"],
    ["street", false, ""],
    ["city", false, "Lagos"],
    ["state", false, ""],
    ["postalCode", false, ""],
    ["country", false, "Nigeria"],
    ["description", false, ""],
  ],
  apps: [
    ["title", false, "My app"],
    ["iosUrl", false, "https://apps.apple.com/app/id000000000"],
    ["androidUrl", false, "https://play.google.com/store/apps/details?id=com.example"],
    ["websiteUrl", false, ""],
    ["description", false, ""],
  ],
  business: [
    ["name", true, "Northside Coffee"],
    ["category", false, "Coffee shop"],
    ["description", false, ""],
    ["phone", false, "+2348012345678"],
    ["email", false, ""],
    ["websiteUrl", false, ""],
    ["address", false, "12 Allen Avenue, Ikeja"],
    ["mapUrl", false, ""],
  ],
  coupon: [
    ["title", true, "Weekend special"],
    ["discount", true, "20% OFF"],
    ["kind", false, "discount"],
    ["merchant", false, "Your business"],
    ["code", false, "SAVE20"],
    ["description", false, ""],
    ["startsAt", false, "2026-11-01 09:00"],
    ["expiresAt", false, "2026-11-08 23:59"],
    ["howToRedeem", false, ""],
    ["terms", false, ""],
    ["ctaUrl", false, ""],
    ["phone", false, ""],
    ["address", false, ""],
  ],
  event: [
    ["title", true, "Lagos Tech Summit"],
    ["kind", false, "conference"],
    ["host", false, "Tech Community NG"],
    ["date", false, "2026-11-20"],
    ["time", false, "09:00"],
    ["endTime", false, "17:00"],
    ["venue", false, "Landmark Centre"],
    ["address", false, "Victoria Island, Lagos"],
    ["mapUrl", false, ""],
    ["onlineUrl", false, ""],
    ["dressCode", false, ""],
    ["ticketPrice", false, "Free"],
    ["ticketUrl", false, ""],
    ["rsvpPhone", false, ""],
    ["rsvpUrl", false, ""],
    ["message", false, ""],
  ],
};

export const BULK_TYPES = Object.keys(BULK_COLUMNS);
const NAME_COLUMN = "qrName";

const normalize = (header) =>
  String(header || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

export function templateCsv(type) {
  const columns = BULK_COLUMNS[type] || [];
  const row = (cells) =>
    cells.map((v) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v)).join(",");
  return [
    row([NAME_COLUMN, ...columns.map(([key]) => key)]),
    row([`${typeLabel(type)} 1`, ...columns.map(([, , example]) => example)]),
  ].join("\n");
}

// Minimal RFC 4180 parser: quoted fields, escaped quotes, CRLF or LF.
export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  const source = String(text || "").replace(/^﻿/, "");
  for (let i = 0; i < source.length; i++) {
    const ch = source[i];
    if (quoted) {
      if (ch === '"' && source[i + 1] === '"') {
        field += '"';
        i++;
      } else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && source[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else field += ch;
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((cell) => cell.trim()));
}

function toIso(value) {
  // "2026-11-01 09:00" is read as the uploader's local time, like the editor.
  const date = new Date(String(value).trim().replace(" ", "T"));
  return isNaN(date) ? value : date.toISOString();
}

function toContent(type, record) {
  const content = {};
  for (const [key] of BULK_COLUMNS[type]) {
    const value = String(record[normalize(key)] ?? "").trim();
    if (value) content[key] = value;
  }
  if (type === "wifi") {
    content.encryption = content.encryption || "WPA";
    content.hidden = /^(true|yes|1)$/i.test(content.hidden || "");
  }
  if (type === "coupon") {
    content.kind = content.kind === "free" ? "free" : "discount";
    for (const key of ["startsAt", "expiresAt"])
      if (content[key]) content[key] = toIso(content[key]);
  }
  return content;
}

// Checks the header against the type's columns, then turns each row into a
// QR { name, content } with its validation error, if any.
export function rowsFromCsv(type, text) {
  const columns = BULK_COLUMNS[type];
  if (!columns) return { error: "This QR type can't be created in bulk." };
  const [header, ...body] = parseCsv(text);
  if (!header) return { error: "The file is empty." };
  const keys = header.map(normalize);
  const missing = columns
    .filter(([key, required]) => required && !keys.includes(normalize(key)))
    .map(([key]) => key);
  if (missing.length)
    return {
      error: `This CSV doesn't match the ${typeLabel(type)} template. Missing column${missing.length > 1 ? "s" : ""}: ${missing.join(", ")}.`,
    };
  if (!body.length) return { error: "Add at least one row under the header." };
  if (body.length > BULK_LIMIT)
    return { error: `Upload at most ${BULK_LIMIT} rows at a time.` };
  const known = new Set([normalize(NAME_COLUMN), ...columns.map(([k]) => normalize(k))]);
  const ignored = header.filter((h, i) => h.trim() && !known.has(keys[i]));
  const rows = body.map((cells, index) => {
    const record = Object.fromEntries(keys.map((k, i) => [k, cells[i]]));
    const content = toContent(type, record);
    const name = (
      String(record[normalize(NAME_COLUMN)] || "").trim() ||
      content.title ||
      content.name ||
      [content.firstName, content.lastName].filter(Boolean).join(" ") ||
      `${typeLabel(type)} ${index + 1}`
    ).slice(0, 100);
    return { line: index + 2, name, content, error: validateContent(type, content) };
  });
  return { rows, ignored };
}

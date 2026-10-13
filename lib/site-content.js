import { safeUrl } from "./qr-content.js";
import { PLANS } from "./billing-rules.js";

// Admin-editable public site content. Defaults mirror the original hardcoded
// copy so the site looks the same until an administrator changes something.
export const SOCIAL_PLATFORMS = [
  ["facebook", "Facebook"],
  ["instagram", "Instagram"],
  ["x", "X (Twitter)"],
  ["linkedin", "LinkedIn"],
  ["tiktok", "TikTok"],
  ["youtube", "YouTube"],
  ["whatsapp", "WhatsApp"],
];

// [key, label, maxLength, kind] — kind: "text" | "textarea" | "list"
export const SITE_TEXT_FIELDS = {
  "Announcement bar": [
    ["announcement", "Announcement (leave blank to hide)", 200, "text"],
    ["announcementUrl", "Announcement link (optional)", 500, "url"],
  ],
  Homepage: [
    ["heroTitle", "Hero headline", 120, "text"],
    ["heroHighlight", "Highlighted words in headline", 60, "text"],
    ["heroFeatures", "Hero bullet points (one per line)", 120, "list"],
    ["heroCta", "Hero button text", 40, "text"],
  ],
  Footer: [
    ["footerCtaTitle", "Call-to-action title", 120, "text"],
    ["footerCtaText", "Call-to-action text", 600, "textarea"],
    ["footerTagline", "Brand tagline", 200, "text"],
    ["footerRegisterText", "Register box text", 120, "text"],
    ["contactEmail", "Contact email", 120, "email"],
    ["contactPhone", "Contact phone", 40, "text"],
    ["copyright", "Copyright text (year is added automatically)", 120, "text"],
    ["poweredBy", "Powered-by line", 120, "text"],
  ],
  "Pricing page": [
    ["pricingEyebrow", "Small heading", 60, "text"],
    ["pricingTitle", "Title", 120, "text"],
    ["pricingSubtitle", "Subtitle", 600, "textarea"],
    ["pricingFeatures", "Premium features (one per line)", 120, "list"],
    ["pricingButton", "Plan button text", 40, "text"],
    ["freeTitle", "Free plan title", 120, "text"],
    ["freeText", "Free plan text", 600, "textarea"],
  ],
};

export const SITE_DEFAULTS = Object.freeze({
  socials: Object.fromEntries(SOCIAL_PLATFORMS.map(([key]) => [key, ""])),
  featuredPlan: "annual",
  announcement: "",
  announcementUrl: "",
  heroTitle: "We make QR codes easy",
  heroHighlight: "QR codes",
  heroFeatures: [
    "Generate dynamic, editable QR codes",
    "Track performance with analytics",
    "Design QR codes with logo, colors & shapes",
  ],
  heroCta: "Create QR code",
  footerCtaTitle: "Ready to get started?",
  footerCtaText:
    "Sign up today to build your customizable and fully trackable QR codes. Unlock advanced insights, implement your branding and make updates to your QR codes at any time.",
  footerTagline: "Create, customize, manage and track smarter QR codes.",
  footerRegisterText: "Generate, Manage & Track your QR codes 👇",
  contactEmail: "",
  contactPhone: "",
  copyright: "SmartQR. All rights reserved.",
  poweredBy: "Powered by Erebun Solutions",
  pricingEyebrow: "SIMPLE NGN PRICING",
  pricingTitle: "Start free. Grow with Premium.",
  pricingSubtitle:
    "Dynamic QR codes that evolve with your business. Update content after printing and see how people engage.",
  pricingFeatures: [
    "Dynamic publishing & editing",
    "Custom QR designs",
    "Scan analytics",
    "Folders & hosted media",
  ],
  pricingButton: "Choose Premium",
  freeTitle: "Free, for as long as you need",
  freeText:
    "Create and download static WiFi QR codes, preview dynamic pages, and earn referral rewards. Personal and Business accounts share the same prices. Automatic renewal is optional and clearly shown before payment.",
});

const FIELDS = Object.values(SITE_TEXT_FIELDS).flat();

/** Merge stored content over defaults, ignoring unknown or malformed keys. */
export function withDefaults(stored) {
  const result = { ...SITE_DEFAULTS, socials: { ...SITE_DEFAULTS.socials } };
  if (!stored || typeof stored !== "object") return result;
  for (const [key, , , kind] of FIELDS) {
    const value = stored[key];
    if (kind === "list" ? Array.isArray(value) : typeof value === "string")
      result[key] = value;
  }
  for (const [key] of SOCIAL_PLATFORMS)
    if (typeof stored.socials?.[key] === "string")
      result.socials[key] = stored.socials[key];
  if (PLANS.some((plan) => plan.key === stored.featuredPlan))
    result.featuredPlan = stored.featuredPlan;
  return result;
}

/** Validate admin input. Returns clean content or throws a user-facing Error. */
export function normalizeSiteContent(input) {
  if (!input || typeof input !== "object" || Array.isArray(input))
    throw new Error("Invalid site content.");
  const clean = { socials: {} };
  for (const [key, label] of SOCIAL_PLATFORMS) {
    const value = String(input.socials?.[key] ?? "").trim();
    if (value && !safeUrl(value))
      throw new Error(`${label}: enter a full link starting with https://`);
    clean.socials[key] = value ? safeUrl(value) : "";
  }
  for (const [key, label, max, kind] of FIELDS) {
    const value = input[key] ?? SITE_DEFAULTS[key];
    if (kind === "list") {
      if (!Array.isArray(value)) throw new Error(`${label}: invalid list.`);
      const items = value.map((v) => String(v ?? "").trim()).filter(Boolean);
      if (items.length > 8) throw new Error(`${label}: use at most 8 lines.`);
      if (items.some((item) => item.length > max))
        throw new Error(`${label}: keep each line under ${max} characters.`);
      clean[key] = items;
      continue;
    }
    if (typeof value !== "string") throw new Error(`${label}: invalid text.`);
    const text = value.trim();
    if (text.length > max)
      throw new Error(`${label}: keep it under ${max} characters.`);
    if (kind === "url" && text && !safeUrl(text))
      throw new Error(`${label}: enter a full link starting with https://`);
    if (kind === "email" && text && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text))
      throw new Error(`${label}: enter a valid email address.`);
    clean[key] = kind === "url" && text ? safeUrl(text) : text;
  }
  if (!PLANS.some((plan) => plan.key === input.featuredPlan))
    throw new Error("Choose a valid featured plan.");
  clean.featuredPlan = input.featuredPlan;
  return clean;
}

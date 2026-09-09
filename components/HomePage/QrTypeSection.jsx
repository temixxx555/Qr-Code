"use client";

import { useState } from "react";
import Image from "next/image";

import {
  Contact,
  Globe,
  FileText,
  Image as ImageIcon,
  Wifi,
  UtensilsCrossed,
  Briefcase,
  Link2,
  MessageCircle,
  Share2,
  QrCode,
  Download,
  ExternalLink,
  Star,
  MapPin,
  Clock,
  Phone,
} from "lucide-react";

import { FaFacebook, FaInstagram, FaLinkedin, FaWhatsapp } from "react-icons/fa";

const qrTypes = [
  {
    id: "vcard",
    label: "vCard",
    icon: Contact,
    mockupBg: "bg-[#0f3d2e]",
    title: "vCard",
    description:
      "vCards are virtual business cards, and hooking them up to a QR code makes it super easy for you to share your email address, phone number, job title, and more. You can update it anytime and share your details with new connections on the fly.",
    mockup: {
      type: "vcard",
      headline: "John Carlson",
      subline: "Account Manager",
      body: "As an account manager, I thrive on building lasting relationships and helping clients to succeed. Let's connect and grow together!",
      footer: "555-100-1000",
    },
  },
  {
    id: "website",
    label: "Website",
    icon: Globe,
    mockupBg: "bg-[#e8672b]",
    title: "Website",
    description:
      "Increase traffic to a website or webpage by linking its URL to a QR code. Users can now easily access any website or webpage by simply scanning the QR code.",
    mockup: {
      type: "website",
      headline: "online-qr-generator.com",
      subline: "Your all-in-one QR code platform",
      body: "Create, customize, and track QR codes for every part of your business — websites, menus, links, and more.",
      footer: "Visit Website",
    },
  },
  {
    id: "pdf",
    label: "PDF",
    icon: FileText,
    mockupBg: "bg-[#334155]",
    title: "PDF",
    description:
      "Share documents, brochures, or catalogs instantly. Link your QR code to a PDF file so users can view or download it straight from their phone with a single scan.",
    mockup: {
      type: "pdf",
      headline: "Company-Brochure.pdf",
      subline: "4.2 MB · 12 pages",
      body: "Your full product catalog, pricing sheet, and company overview, ready to view or download in one tap.",
      footer: "Download PDF",
    },
  },
  {
    id: "images",
    label: "Images",
    icon: ImageIcon,
    mockupBg: "bg-[#7c3aed]",
    title: "Images",
    description:
      "Share a photo gallery or a single image with anyone who scans your QR code. Perfect for portfolios, event photos, or product galleries.",
    mockup: {
      type: "images",
      headline: "Event Gallery",
      subline: "24 photos",
      body: "A shared album from the summer showcase — browse, save, and share every shot in the collection.",
      footer: "View Gallery",
    },
  },
  {
    id: "wifi",
    label: "WiFi",
    icon: Wifi,
    mockupBg: "bg-[#0891b2]",
    title: "WiFi",
    description:
      "Let guests connect to your WiFi network instantly without typing a password. Just scan the code and they're online.",
    mockup: {
      type: "wifi",
      headline: "Guest-Network",
      subline: "WPA2 Secured",
      body: "Scan to join automatically — no need to search for the network or type a password by hand.",
      footer: "Connect Now",
    },
  },
  {
    id: "menu",
    label: "Menu",
    icon: UtensilsCrossed,
    mockupBg: "bg-[#b45309]",
    title: "Menu",
    description:
      "Give customers a contactless way to browse your restaurant menu. Update items, prices, or specials anytime without reprinting.",
    mockup: {
      type: "menu",
      headline: "The Oak & Vine",
      subline: "Starters · Mains · Desserts",
      body: "Today's specials and full menu, updated live — no reprinting needed when prices or dishes change.",
      footer: "View Menu",
    },
  },
  {
    id: "business",
    label: "Business",
    icon: Briefcase,
    mockupBg: "bg-[#1e3a8a]",
    title: "Business",
    description:
      "Showcase your business information, hours, and location all in one place. Perfect for storefronts, flyers, and packaging.",
    mockup: {
      type: "business",
      headline: "Northside Coffee Co.",
      subline: "4.8 · Coffee shop",
      body: "Open daily, downtown location. Everything customers need — hours, address, and contact — in a single scan.",
      footer: "Get Directions",
    },
  },
  {
    id: "links",
    label: "List of Links",
    icon: Link2,
    mockupBg: "bg-[#4338ca]",
    title: "List of Links",
    description:
      "Bring all your important links together in one place, like a mini landing page. Ideal for social bios and marketing campaigns.",
    mockup: {
      type: "links",
      headline: "@yourbrand",
      subline: "All my links",
      body: "One page for every link that matters — shop, latest post, newsletter, and booking, all in a single scan.",
      footer: "View All Links",
    },
  },
  {
    id: "facebook",
    label: "Facebook",
    icon: FaFacebook,
    mockupBg: "bg-[#1877f2]",
    title: "Facebook",
    description:
      "Grow your Facebook following by letting people scan straight to your page. No searching required.",
    mockup: {
      type: "facebook",
      headline: "Your Business",
      subline: "12.4K followers",
      body: "Send people straight to your Facebook Page — no searching, no typos, just a scan and a follow.",
      footer: "Follow on Facebook",
    },
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    icon: MessageCircle,
    mockupBg: "bg-[#25d366]",
    title: "WhatsApp",
    description:
      "Let customers start a WhatsApp chat with you instantly by scanning your QR code. No need to save a number first.",
    mockup: {
      type: "whatsapp",
      headline: "Chat with us",
      subline: "Typically replies within an hour",
      body: "Skip saving the number — scanning opens a chat with your business instantly, pre-filled and ready to send.",
      footer: "Message on WhatsApp",
    },
  },
  {
    id: "social",
    label: "Social Media",
    icon: Share2,
    mockupBg: "bg-[#7e22ce]",
    title: "Social Media",
    description:
      "Direct people to all your social profiles from a single scan. Great for business cards, packaging, and print ads.",
    mockup: {
      type: "social",
      headline: "Follow Us Everywhere",
      subline: "Instagram · Facebook · LinkedIn",
      body: "One scan, every platform. Perfect for business cards, packaging, and print ads where space is tight.",
      footer: "See All Profiles",
    },
  },
  {
    id: "instagram",
    label: "Instagram",
    icon: FaInstagram,
    mockupBg: "bg-gradient-to-br from-[#feda75] via-[#d62976] to-[#4f5bd5]",
    title: "Instagram",
    description:
      "Grow your Instagram following by letting people scan straight to your profile. Perfect for storefronts and print materials.",
    mockup: {
      type: "instagram",
      headline: "@yourbrand",
      subline: "8,204 followers",
      body: "Send foot traffic straight to your Instagram profile — great for storefronts, packaging, and print materials.",
      footer: "Follow on Instagram",
    },
  },
];

// Small helper so every non-vCard layout shares the same visual rhythm
// (icon badge, headline, subline, body copy, footer pill) while still
// reading as a distinct card per type via its own icon + accent.
function StandardMockupBody({ item }) {
  const { mockup } = item;
  const Icon = item.icon;

  return (
    <>
      <div className="mt-6 flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-white bg-white shadow-sm">
        <Icon className="h-7 w-7 text-gray-700" strokeWidth={2} />
      </div>

      <p className="mt-5 text-base font-semibold text-white">
        {mockup.headline}
      </p>
      {mockup.subline && (
        <p className="mt-1 text-xs text-white/80">{mockup.subline}</p>
      )}

      <div className="mt-6 mb-5 w-full rounded-xl bg-white px-4 py-4 text-left shadow-sm">
        <p className="text-[11px] leading-relaxed text-gray-500">
          {mockup.body}
        </p>
        {mockup.footer && (
          <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-[#22c55e]">
            <span>{mockup.footer}</span>
            <ExternalLink className="h-3 w-3" />
          </div>
        )}
      </div>
    </>
  );
}

function PhoneMockup({ item }) {
  const { mockup, mockupBg } = item;

  return (
    <div className="relative mx-auto h-75 w-75 sm:h-95 sm:w-62.5">
      {/* Back stacked cards for depth */}
      <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-[24px] bg-gray-100 shadow-sm" />
      <div className="absolute inset-0 translate-x-2 translate-y-2 rounded-[24px] bg-gray-50 shadow-sm" />

      {/* Front card */}
      <div className="absolute inset-0 overflow-hidden rounded-[24px] bg-white shadow-lg">
        {/* Accent top section */}
        <div
          className={`absolute inset-x-0 top-0 h-[58%] transition-colors duration-300 ${mockupBg}`}
          style={{
            clipPath: "polygon(0 0, 100% 0, 100% 88%, 0 100%)",
          }}
        />

        {/* Card content */}
        <div className="relative z-10 flex h-full flex-col items-center overflow-y-auto px-5 pt-8 text-center">
          {mockup.type === "vcard" && (
            <>
              <Image
                src="/avatar.webp"
                alt={mockup.headline}
                width={100}
                height={100}
                className="h-18 w-18 rounded-full border-4 border-white object-cover shadow-sm"
              />

              <p className="mt-5 text-base font-semibold text-white">
                {mockup.headline}
              </p>
              <p className="mt-1 text-xs text-white/80">{mockup.subline}</p>

              <div className="mx-auto mt-3 mb-5 flex w-full flex-col items-center rounded-xl px-8 text-center">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-50">
                    <FaFacebook className="h-7 w-7 rounded-full text-black/70" />
                  </div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-50">
                    <FaInstagram className="h-7 w-7 rounded-full text-black/70" />
                  </div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-50">
                    <FaLinkedin className="h-7 w-7 rounded-full text-black/70" />
                  </div>
                </div>
              </div>

              <p className="mt-1.25 max-w-47.5 text-[11px] leading-relaxed text-gray-500">
                {mockup.body}
              </p>
            </>
          )}

          {mockup.type === "wifi" && (
            <>
              <div className="mt-6 flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-white bg-white shadow-sm">
                <Wifi className="h-7 w-7 text-[#0891b2]" strokeWidth={2} />
              </div>
              <p className="mt-5 text-base font-semibold text-white">
                {mockup.headline}
              </p>
              <p className="mt-1 text-xs text-white/80">{mockup.subline}</p>

              <div className="mt-6 mb-5 flex w-full flex-col items-center gap-3 rounded-xl bg-white px-4 py-5 shadow-sm">
                <div className="flex gap-1.5">
                  {[0, 1, 2, 3].map((bar) => (
                    <span
                      key={bar}
                      className="w-1.5 rounded-full bg-[#0891b2]"
                      style={{ height: `${8 + bar * 5}px` }}
                    />
                  ))}
                </div>
                <p className="text-[11px] leading-relaxed text-gray-500">
                  {mockup.body}
                </p>
                <div className="mt-1 flex items-center gap-1.5 text-[11px] font-semibold text-[#0891b2]">
                  <span>{mockup.footer}</span>
                  <ExternalLink className="h-3 w-3" />
                </div>
              </div>
            </>
          )}

          {mockup.type === "pdf" && (
            <>
              <div className="mt-6 flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-white bg-white shadow-sm">
                <FileText className="h-7 w-7 text-[#334155]" strokeWidth={2} />
              </div>
              <p className="mt-5 text-base font-semibold text-white">
                {mockup.headline}
              </p>
              <p className="mt-1 text-xs text-white/80">{mockup.subline}</p>

              <div className="mt-6 mb-5 w-full rounded-xl bg-white px-4 py-4 text-left shadow-sm">
                <p className="text-[11px] leading-relaxed text-gray-500">
                  {mockup.body}
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-[#334155]">
                  <Download className="h-3 w-3" />
                  <span>{mockup.footer}</span>
                </div>
              </div>
            </>
          )}

          {mockup.type === "images" && (
            <>
              <p className="mt-8 text-base font-semibold text-white">
                {mockup.headline}
              </p>
              <p className="mt-1 text-xs text-white/80">{mockup.subline}</p>

              <div className="mt-6 mb-5 grid w-full grid-cols-3 gap-1.5">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-md bg-linear-to-br from-[#7c3aed]/20 to-[#7c3aed]/40"
                  />
                ))}
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#7c3aed]">
                <span>{mockup.footer}</span>
                <ExternalLink className="h-3 w-3" />
              </div>
            </>
          )}

          {mockup.type === "menu" && (
            <>
              <div className="mt-6 flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-white bg-white shadow-sm">
                <UtensilsCrossed
                  className="h-7 w-7 text-[#b45309]"
                  strokeWidth={2}
                />
              </div>
              <p className="mt-5 text-base font-semibold text-white">
                {mockup.headline}
              </p>
              <p className="mt-1 text-xs text-white/80">{mockup.subline}</p>

              <div className="mt-6 mb-5 w-full space-y-2.5 rounded-xl bg-white px-4 py-4 text-left shadow-sm">
                {["Truffle Pasta", "Grilled Salmon", "House Salad"].map(
                  (item) => (
                    <div
                      key={item}
                      className="flex items-center justify-between border-b border-gray-100 pb-2 last:border-0 last:pb-0"
                    >
                      <span className="text-[11px] text-gray-600">
                        {item}
                      </span>
                      <span className="text-[11px] font-semibold text-gray-400">
                        ···
                      </span>
                    </div>
                  )
                )}
              </div>
            </>
          )}

          {mockup.type === "business" && (
            <>
              <div className="mt-6 flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-white bg-white shadow-sm">
                <Briefcase className="h-7 w-7 text-[#1e3a8a]" strokeWidth={2} />
              </div>
              <p className="mt-5 text-base font-semibold text-white">
                {mockup.headline}
              </p>
              <div className="mt-1 flex items-center gap-1 text-xs text-white/80">
                <Star className="h-3 w-3 fill-white/80" />
                <span>{mockup.subline}</span>
              </div>

              <div className="mt-6 mb-5 w-full space-y-2 rounded-xl bg-white px-4 py-4 text-left shadow-sm">
                <div className="flex items-center gap-2 text-[11px] text-gray-500">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-[#1e3a8a]" />
                  <span>123 Main Street, Downtown</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-gray-500">
                  <Clock className="h-3.5 w-3.5 shrink-0 text-[#1e3a8a]" />
                  <span>Open · Closes 6 PM</span>
                </div>
                <div className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-[#1e3a8a]">
                  <span>{mockup.footer}</span>
                  <ExternalLink className="h-3 w-3" />
                </div>
              </div>
            </>
          )}

          {mockup.type === "links" && (
            <>
              <div className="mt-6 h-16 w-16 overflow-hidden rounded-full border-4 border-white bg-white shadow-sm">
                <div className="flex h-full w-full items-center justify-center bg-[#4338ca]/10">
                  <Link2 className="h-7 w-7 text-[#4338ca]" strokeWidth={2} />
                </div>
              </div>
              <p className="mt-5 text-base font-semibold text-white">
                {mockup.headline}
              </p>
              <p className="mt-1 text-xs text-white/80">{mockup.subline}</p>

              <div className="mt-6 mb-5 w-full space-y-2">
                {["Shop New Arrivals", "Latest Blog Post", "Book a Call"].map(
                  (link) => (
                    <div
                      key={link}
                      className="flex items-center justify-between rounded-lg bg-white px-3 py-2.5 text-left shadow-sm"
                    >
                      <span className="text-[11px] font-medium text-gray-600">
                        {link}
                      </span>
                      <ExternalLink className="h-3 w-3 text-[#4338ca]" />
                    </div>
                  )
                )}
              </div>
            </>
          )}

          {mockup.type === "facebook" && (
            <>
              <div className="mt-6 flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-white bg-white shadow-sm">
                <FaFacebook className="h-8 w-8 text-[#1877f2]" />
              </div>
              <p className="mt-5 text-base font-semibold text-white">
                {mockup.headline}
              </p>
              <p className="mt-1 text-xs text-white/80">{mockup.subline}</p>

              <div className="mt-6 mb-5 w-full rounded-xl bg-white px-4 py-4 text-left shadow-sm">
                <p className="text-[11px] leading-relaxed text-gray-500">
                  {mockup.body}
                </p>
                <button
                  type="button"
                  className="mt-3 w-full rounded-lg bg-[#1877f2] py-2 text-[11px] font-semibold text-white"
                >
                  {mockup.footer}
                </button>
              </div>
            </>
          )}

          {mockup.type === "whatsapp" && (
            <>
              <div className="mt-6 flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-white bg-white shadow-sm">
                <FaWhatsapp className="h-8 w-8 text-[#25d366]" />
              </div>
              <p className="mt-5 text-base font-semibold text-white">
                {mockup.headline}
              </p>
              <p className="mt-1 text-xs text-white/80">{mockup.subline}</p>

              <div className="mt-6 mb-5 w-full rounded-xl bg-white px-4 py-4 text-left shadow-sm">
                <p className="text-[11px] leading-relaxed text-gray-500">
                  {mockup.body}
                </p>
                <button
                  type="button"
                  className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#25d366] py-2 text-[11px] font-semibold text-white"
                >
                  <FaWhatsapp className="h-3.5 w-3.5" />
                  {mockup.footer}
                </button>
              </div>
            </>
          )}

          {mockup.type === "social" && (
            <>
              <div className="mt-6 flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-white bg-white shadow-sm">
                <Share2 className="h-7 w-7 text-[#7e22ce]" strokeWidth={2} />
              </div>
              <p className="mt-5 text-base font-semibold text-white">
                {mockup.headline}
              </p>
              <p className="mt-1 text-xs text-white/80">{mockup.subline}</p>

              <div className="mt-6 mb-5 flex w-full items-center justify-center gap-3 rounded-xl bg-white px-4 py-5 shadow-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-50">
                  <FaInstagram className="h-5 w-5 text-black/70" />
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-50">
                  <FaFacebook className="h-5 w-5 text-black/70" />
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-50">
                  <FaLinkedin className="h-5 w-5 text-black/70" />
                </div>
              </div>
            </>
          )}

          {mockup.type === "instagram" && (
            <>
              <div className="mt-6 flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-white shadow-sm">
                <FaInstagram className="h-8 w-8 text-[#d62976]" />
              </div>
              <p className="mt-5 text-base font-semibold text-white">
                {mockup.headline}
              </p>
              <p className="mt-1 text-xs text-white/80">{mockup.subline}</p>

              <div className="mt-6 mb-5 w-full rounded-xl bg-white px-4 py-4 text-left shadow-sm">
                <p className="text-[11px] leading-relaxed text-gray-500">
                  {mockup.body}
                </p>
                <button
                  type="button"
                  className="mt-3 w-full rounded-lg bg-linear-to-r from-[#feda75] via-[#d62976] to-[#4f5bd5] py-2 text-[11px] font-semibold text-white"
                >
                  {mockup.footer}
                </button>
              </div>
            </>
          )}

          {mockup.type === "website" && <StandardMockupBody item={item} />}
        </div>
      </div>
    </div>
  );
}

export default function QRTypesSection() {
  const [activeId, setActiveId] = useState("website");
  const active = qrTypes.find((t) => t.id === activeId) ?? qrTypes[0];

  return (
    <section className="w-full bg-white px-5 py-12 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-0 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[#101828] sm:text-4xl lg:text-5xl">
            QR codes that{" "}
            <span className="text-[#22c55e]">fit your needs</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-gray-500 sm:text-lg">
            With our wide selection of QR codes, choose the right type to fit
            your specific needs. Whether it&apos;s to share a website or a
            business, promote a social media account or display your contact
            information.
          </p>
        </div>

        {/* Content */}
        <div className="mt-12 grid grid-cols-1 items-start gap-10 lg:mt-16 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          {/* Left: preview + description (swaps seamlessly) */}
          <div className="flex flex-col items-center rounded-2xl lg:items-start">
            <div
              key={active.id}
              className="flex w-full max-w-sm animate-in items-center justify-center rounded-2xl bg-[#eefaf2] p-8 fade-in duration-300 sm:max-w-none"
            >
              <PhoneMockup item={active} />
            </div>

            <div
              key={active.id + "-text"}
              className="mt-8 w-full max-w-sm animate-in text-center fade-in duration-300 sm:max-w-none lg:text-left"
            >
              <p className="text-2xl font-bold text-[#101828] sm:text-3xl">
                {active.title}
              </p>
              <p className="mt-2 text-base leading-relaxed text-gray-500 sm:text-lg">
                {active.description}
              </p>

              {/* <button
                type="button"
                className="mt-5 inline-flex h-11 items-center gap-2 rounded-lg bg-[#22c55e] px-6 text-sm font-semibold text-white shadow-md shadow-green-200 transition-colors hover:bg-[#16a34a]"
              >
                <QrCode className="h-4 w-4" />
                Create QR Code
              </button> */}
            </div>
          </div>

          {/* Right: type grid */}
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {qrTypes.map((type) => {
              const isActive = type.id === activeId;
              return (
                <button
                  key={type.id}
                  type="button"
                     // DESKTOP
                    onMouseEnter={() => setActiveId(type.id)}

                    // MOBILE / TOUCH
                    onClick={() => setActiveId(type.id)}

                    // KEYBOARD ACCESSIBILITY
                    onFocus={() => setActiveId(type.id)}

                    aria-pressed={isActive}
              
                  className={` group flex h-30 w-full flex-col items-center justify-center gap-2 rounded-xl border bg-white text-center transition-all duration-200 sm:h-35 ${
                    isActive
                      ? "border-[#22c55e] ring-1 ring-[#22c55e]"
                      : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                  }`}
                >
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                      isActive ? "bg-[#eefaf2]" : "bg-gray-50"
                    }`}
                  >
                    <type.icon
                      className={`h-5 w-5 sm:h-6 sm:w-6 ${
                        isActive ? "text-[#22c55e]" : "text-gray-500"
                      }`}
                      strokeWidth={2}
                    />
                  </div>
                  <span
                    className={`px-1 text-[11px] font-medium leading-tight ${
                      isActive ? "text-[#22c55e]" : "text-gray-600"
                    }`}
                  >
                    {type.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
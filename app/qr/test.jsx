"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
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
  ChevronRight,
  Check,
  Play,
  Smartphone,
} from "lucide-react";

import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaWhatsapp,
} from "react-icons/fa";

import { Button } from "@/components/ui/button";
import QrDesignForm from "@/components/Qr/QrDesignForm";
import QrContentForm from "@/components/Qr/QrContentForm";

// ============================================================
// QR TYPES
// ============================================================

const qrTypes = [
  {
    id: "website",
    label: "Website",
    icon: Globe,
    title: "Website",
    description:
      "Increase traffic to a website or webpage by linking its URL to a QR code.",
    color: "#20c75a",
    mockupBg: "#0f3d2e",
    mockup: {
      type: "website",
      headline: "Online QR Generator",
      subline: "Your all-in-one QR platform",
      body: "Create, customize, and track QR codes for your website and campaigns.",
      footer: "Visit Website",
    },
  },

  {
    id: "pdf",
    label: "PDF",
    icon: FileText,
    title: "PDF",
    description:
      "Share documents, brochures, menus, catalogs, or any PDF instantly.",
    color: "#20c75a",
    mockupBg: "#334155",
    mockup: {
      type: "pdf",
      headline: "Company Brochure.pdf",
      subline: "4.2 MB · 12 pages",
      body: "Your complete company brochure is ready to view or download.",
      footer: "Download PDF",
    },
  },

  {
    id: "links",
    label: "List of Links",
    icon: Link2,
    title: "List of Links",
    description:
      "Bring all your important links together on one beautiful landing page.",
    color: "#20c75a",
    mockupBg: "#4338ca",
    mockup: {
      type: "links",
      headline: "@yourbrand",
      subline: "All my links",
      body: "One page for every link that matters — shop, blog, booking and more.",
      footer: "View All Links",
    },
  },

  {
    id: "vcard",
    label: "vCard",
    icon: Contact,
    title: "vCard",
    description:
      "Share your contact details, job title, social profiles and more with one scan.",
    color: "#20c75a",
    mockupBg: "#0f3d2e",
    mockup: {
      type: "vcard",
      headline: "John Carlson",
      subline: "Account Manager",
      body: "As an account manager, I thrive on building lasting relationships and helping clients succeed.",
      footer: "555-100-1000",
    },
  },

  {
    id: "business",
    label: "Business",
    icon: Briefcase,
    title: "Business",
    description:
      "Showcase your business information, opening hours, location and contact details.",
    color: "#20c75a",
    mockupBg: "#1e3a8a",
    mockup: {
      type: "business",
      headline: "Northside Coffee Co.",
      subline: "4.8 · Coffee shop",
      body: "Everything customers need — hours, address and contact — in a single scan.",
      footer: "Get Directions",
    },
  },

  {
    id: "video",
    label: "Video",
    icon: Play,
    title: "Video",
    description:
      "Share a video instantly. Perfect for marketing, events, tutorials and presentations.",
    color: "#20c75a",
    mockupBg: "#7c3aed",
    mockup: {
      type: "video",
      headline: "Product Launch",
      subline: "2:48 minutes",
      body: "Watch our latest product presentation and discover what's new.",
      footer: "Watch Video",
    },
  },

  {
    id: "images",
    label: "Images",
    icon: ImageIcon,
    title: "Images",
    description:
      "Share a photo gallery or a single image with anyone who scans your QR code.",
    color: "#20c75a",
    mockupBg: "#7c3aed",
    mockup: {
      type: "images",
      headline: "Event Gallery",
      subline: "24 photos",
      body: "Browse and share every photo from your event.",
      footer: "View Gallery",
    },
  },

  {
    id: "facebook",
    label: "Facebook",
    icon: FaFacebook,
    title: "Facebook",
    description:
      "Send people directly to your Facebook page without making them search for you.",
    color: "#20c75a",
    mockupBg: "#1877f2",
    mockup: {
      type: "facebook",
      headline: "Your Business",
      subline: "12.4K followers",
      body: "Send people directly to your Facebook Page with one simple scan.",
      footer: "Follow on Facebook",
    },
  },

  {
    id: "instagram",
    label: "Instagram",
    icon: FaInstagram,
    title: "Instagram",
    description:
      "Grow your Instagram following by sending people directly to your profile.",
    color: "#20c75a",
    mockupBg: "linear-gradient(135deg, #feda75, #d62976, #4f5bd5)",
    mockup: {
      type: "instagram",
      headline: "@yourbrand",
      subline: "8,204 followers",
      body: "Send people directly to your Instagram profile with one quick scan.",
      footer: "Follow on Instagram",
    },
  },

  {
    id: "social",
    label: "Social Media",
    icon: Share2,
    title: "Social Media",
    description:
      "Direct people to all your social profiles from a single QR code.",
    color: "#20c75a",
    mockupBg: "#7e22ce",
    mockup: {
      type: "social",
      headline: "Follow Us Everywhere",
      subline: "Instagram · Facebook · LinkedIn",
      body: "One scan, every social platform.",
      footer: "See All Profiles",
    },
  },

  {
    id: "whatsapp",
    label: "WhatsApp",
    icon: MessageCircle,
    title: "WhatsApp",
    description:
      "Let customers start a WhatsApp conversation with you instantly.",
    color: "#20c75a",
    mockupBg: "#25d366",
    mockup: {
      type: "whatsapp",
      headline: "Chat with us",
      subline: "Typically replies within an hour",
      body: "Skip saving the number. Scanning opens a chat with your business instantly.",
      footer: "Message on WhatsApp",
    },
  },

  {
    id: "menu",
    label: "Menu",
    icon: UtensilsCrossed,
    title: "Menu",
    description:
      "Give customers a contactless way to browse your restaurant menu.",
    color: "#20c75a",
    mockupBg: "#b45309",
    mockup: {
      type: "menu",
      headline: "The Oak & Vine",
      subline: "Starters · Mains · Desserts",
      body: "Today's menu and specials, updated live.",
      footer: "View Menu",
    },
  },

  {
    id: "wifi",
    label: "WiFi",
    icon: Wifi,
    title: "WiFi",
    description:
      "Let guests connect to your WiFi instantly without typing a password.",
    color: "#20c75a",
    mockupBg: "#0891b2",
    mockup: {
      type: "wifi",
      headline: "Guest Network",
      subline: "WPA2 Secured",
      body: "Scan to join automatically — no password typing required.",
      footer: "Connect Now",
    },
  },

  {
    id: "mp3",
    label: "MP3",
    icon: Smartphone,
    title: "MP3",
    description: "Share audio files instantly through a simple QR code.",
    color: "#20c75a",
    mockupBg: "#374151",
    mockup: {
      type: "mp3",
      headline: "Summer Playlist",
      subline: "12 tracks",
      body: "Listen to the complete audio collection directly from your phone.",
      footer: "Listen Now",
    },
  },
];

// ============================================================
// PHONE PREVIEW
// ============================================================

function PhoneMockup({ item }) {
  const { mockup, mockupBg } = item;

  const Icon = item.icon;

  return (
    <div className='relative mx-auto h-97.5 w-61.25'>
      {/* =====================================================
          PHONE SHADOW
      ===================================================== */}
      <div className='absolute inset-x-6 -bottom-3 h-7 rounded-full bg-black/10 blur-xl' />

      {/* =====================================================
          LEFT SIDE BUTTONS
      ===================================================== */}

      {/* Mute / Action button */}
      <div
        className='
          absolute -left-[4px] top-[74px] z-0
          h-[22px] w-[3px]
          rounded-l-full
          bg-[#303030]
          shadow-[-1px_0_1px_rgba(255,255,255,0.15)]
        '
      />

      {/* Volume button 1 */}
      <div
        className='
          absolute -left-[4px] top-[108px] z-0
          h-[36px] w-[3px]
          rounded-l-full
          bg-[#303030]
          shadow-[-1px_0_1px_rgba(255,255,255,0.15)]
        '
      />

      {/* Volume button 2 */}
      <div
        className='
          absolute -left-[4px] top-[150px] z-0
          h-[36px] w-[3px]
          rounded-l-full
          bg-[#303030]
          shadow-[-1px_0_1px_rgba(255,255,255,0.15)]
        '
      />

      {/* =====================================================
          RIGHT SIDE POWER BUTTON
      ===================================================== */}

      <div
        className='
          absolute -right-[4px] top-[111px] z-0
          h-[48px] w-[3px]
          rounded-r-full
          bg-[#303030]
          shadow-[1px_0_1px_rgba(255,255,255,0.15)]
        '
      />

      {/* =====================================================
          PHONE BODY

          SAME SIZE AS YOUR ORIGINAL:
          h-97.5 w-61.25
      ===================================================== */}

      <div
        className='
          absolute inset-0 z-10
          rounded-[48px]
          border-[6px] border-[#252525]
          bg-[#0d0d0d]
          p-[4px]
          shadow-[0_18px_45px_rgba(0,0,0,0.18)]
        '
      >
        {/* Outer metallic highlight */}
        <div
          className='
            pointer-events-none
            absolute -inset-[2px]
            rounded-[50px]
            border border-white/[0.18]
          '
        />

        {/* Inner edge */}
        <div
          className='
            pointer-events-none
            absolute inset-[2px]
            rounded-[43px]
            border border-black
          '
        />

        {/* ===================================================
            SCREEN
        =================================================== */}

        <div
          className='
            relative
            h-full w-full
            overflow-hidden
            rounded-[39px]
            bg-white
          '
        >
          {/* Very subtle screen edge */}
          <div
            className='
              pointer-events-none
              absolute inset-0 z-50
              rounded-[39px]
              ring-1 ring-black/[0.04]
            '
          />

          {/* =================================================
              DYNAMIC BACKGROUND
          ================================================= */}

          <div
            className='
              absolute inset-x-0 top-0
              h-[55%]
              transition-all duration-500
            '
            style={{
              background: mockupBg,
              clipPath: "polygon(0 0, 100% 0, 100% 88%, 0 100%)",
            }}
          />

          {/* =================================================
              DYNAMIC ISLAND
          ================================================= */}

          <div
            className='
              absolute left-1/2 top-[8px] z-40
              h-[19px] w-[73px]
              -translate-x-1/2
              rounded-full
              bg-black
              shadow-[inset_0_1px_2px_rgba(255,255,255,0.08)]
            '
          >
            {/* Camera */}
            <div
              className='
                absolute right-[8px] top-1/2
                h-[4px] w-[4px]
                -translate-y-1/2
                rounded-full
                bg-[#172554]
              '
            />
          </div>

          {/* =================================================
              STATUS BAR
          ================================================= */}

          <div
            className='
              absolute inset-x-0 top-[11px] z-30
              flex items-center justify-between
              px-[22px]
              text-[7px]
              font-bold
              text-black
            '
          >
            <span>9:41</span>

            <div className='flex items-center gap-[3px]'>
              <span className='text-[6px]'>▰</span>
              <span className='text-[7px]'>◒</span>
              <span className='text-[8px]'>▰</span>
            </div>
          </div>

          {/* =================================================
              YOUR EXISTING CONTENT

              NOTHING HERE HAS BEEN CHANGED.
          ================================================= */}

          <div
            key={item.id}
            className='
              relative z-10
              flex h-full min-h-0
              flex-col items-center
              px-5 pb-4 pt-12
              text-center
              animate-in fade-in zoom-in-95
              duration-300
            '
          >
            {/* ================= V CARD ================= */}
            {mockup.type === "vcard" && (
              <>
                {/* Profile */}
                <Image
                  src='/avatar.webp'
                  alt='Profile'
                  width={95}
                  height={95}
                  className='
                    h-18 w-18
                    shrink-0
                    rounded-full
                    border-4 border-white
                    object-cover
                    shadow-lg
                  '
                />

                {/* Headline */}
                <h3
                  className='
                    mt-3
                    line-clamp-2
                    max-w-full
                    text-base
                    font-bold
                    leading-tight
                    text-white
                  '
                >
                  {mockup.headline}
                </h3>

                {/* Subline */}
                <p
                  className='
                    mt-1
                    line-clamp-2
                    max-w-full
                    text-[10px]
                    leading-tight
                    text-white/80
                  '
                >
                  {mockup.subline}
                </p>

                {/* Socials */}
                <div className='mt-3 flex shrink-0 gap-2'>
                  <SocialIcon>
                    <FaFacebook />
                  </SocialIcon>

                  <SocialIcon>
                    <FaInstagram />
                  </SocialIcon>

                  <SocialIcon>
                    <FaLinkedin />
                  </SocialIcon>
                </div>

                {/* Body */}
                <div className='mt-3 min-h-0 flex-1 overflow-hidden'>
                  <p
                    className='
                      line-clamp-5
                      text-[10px]
                      leading-relaxed
                      text-gray-500
                    '
                  >
                    {mockup.body}
                  </p>
                </div>

                {/* Footer */}
                <div
                  className='
                    mt-3
                    w-full
                    shrink-0
                    rounded-xl
                    bg-white
                    p-3
                    text-left
                    shadow-lg
                  '
                >
                  <p className='text-[9px] text-gray-400'>Phone</p>

                  <p
                    className='
                      mt-1
                      line-clamp-2
                      wrap-break-word
                      text-[11px]
                      font-medium
                      leading-tight
                      text-gray-800
                    '
                  >
                    {mockup.footer}
                  </p>
                </div>
              </>
            )}

            {/* ================= STANDARD QR ================= */}
            {mockup.type !== "vcard" && (
              <>
                {/* Icon */}
                <div
                  className='
                    flex h-14 w-14
                    shrink-0
                    items-center justify-center
                    rounded-xl
                    border-4 border-white
                    bg-white
                    shadow-lg
                  '
                >
                  <Icon className='h-6 w-6 text-gray-700' />
                </div>

                {/* Headline */}
                <h3
                  className='
                    mt-3
                    line-clamp-2
                    max-w-full
                    text-base
                    font-bold
                    leading-tight
                    text-white
                  '
                >
                  {mockup.headline}
                </h3>

                {/* Subline */}
                <p
                  className='
                    mt-1
                    line-clamp-2
                    max-w-full
                    text-[10px]
                    leading-tight
                    text-white/80
                  '
                >
                  {mockup.subline}
                </p>

                {/* Main card */}
                <div
                  className='
                    mt-4
                    min-h-0
                    w-full
                    flex-1
                    overflow-hidden
                    rounded-xl
                    bg-white
                    p-4
                    text-left
                    shadow-lg
                  '
                >
                  <div className='h-full overflow-hidden'>
                    <p
                      className='
                        line-clamp-8
                        text-[10px]
                        leading-relaxed
                        text-gray-500
                      '
                    >
                      {mockup.body}
                    </p>

                    <div
                      className='
                        mt-3
                        flex items-center gap-1.5
                        text-[10px]
                        font-semibold
                        text-[#20c75a]
                      '
                    >
                      <span
                        className='
                          line-clamp-1
                          min-w-0
                          break-all
                        '
                      >
                        {mockup.footer}
                      </span>

                      <ExternalLink className='h-3 w-3 shrink-0' />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* =================================================
              HOME INDICATOR
          ================================================= */}

          <div
            className='
              absolute bottom-[7px] left-1/2
              z-40
              h-[3px] w-[73px]
              -translate-x-1/2
              rounded-full
              bg-black
            '
          />
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SMALL SOCIAL ICON
// ============================================================

function SocialIcon({ children }) {
  return (
    <div className='flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-700 shadow'>
      {children}
    </div>
  );
}

// ============================================================
// STEP INDICATOR
// ============================================================

function StepIndicator({ currentStep }) {
  return (
    <div className='flex items-center gap-4'>
      {/* Step 1 */}
      <Step
        number='1'
        label='Type of QR code'
        active={currentStep === 1}
        complete={currentStep > 1}
      />

      <div className='relative h-px w-12 bg-gray-400'>
        <div className='absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 border-y-[6px] border-l-10 border-y-transparent border-l-gray-400' />
      </div>

      {/* Step 2 */}
      <Step
        number='2'
        label='Content'
        active={currentStep === 2}
        complete={currentStep > 2}
      />

      <div className='relative h-px w-12 bg-gray-400'>
        <div className='absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 border-y-[6px] border-l-10 border-y-transparent border-l-gray-400' />
      </div>

      {/* Step 3 */}
      <Step
        number='3'
        label='QR design'
        active={currentStep === 3}
        complete={false}
      />
    </div>
  );
}

function Step({ number, label, active, complete }) {
  return (
    <div
      className={`flex items-center gap-2 transition-all duration-300 ${
        active
          ? "text-[#20c75a]"
          : complete
            ? "text-[#20c75a]"
            : "text-gray-500"
      }`}
    >
      <div
        className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold ${
          active || complete
            ? "bg-[#20c75a] text-white"
            : "bg-gray-500 text-white"
        }`}
      >
        {complete ? <Check size={15} /> : number}
      </div>

      <span className='hidden text-sm font-semibold sm:block'>{label}</span>
    </div>
  );
}

// ============================================================
// MAIN PAGE
// ============================================================

export default function Page() {
  const [selectedId, setSelectedId] = useState("vcard");

  const [hoveredId, setHoveredId] = useState(null);

  const [step, setStep] = useState(1);

  const [qrData, setQrData] = useState({
    website: {
      websiteUrl: "",
      qrName: "",
      passwordEnabled: false,
      password: "",

      design: {
        selectedFrame: "scan",
        selectedPattern: "square",
        selectedCornerSquare: "square",
        selectedCornerDot: "square",

        patternColor: "#000000",
        patternGradientEnabled: false,
        patternColor2: "#20c75a",

        backgroundColor: "#ffffff",
        backgroundGradientEnabled: false,
        backgroundColor2: "#effcf4",
        transparentBackground: false,

        frameColor: "#000000",
        frameText: "Scan me!",

        cornerSquareColor: "#000000",
        cornerDotColor: "#000000",

        logo: "",
      },
    },
    vcard: {},
    whatsapp: {},
    wifi: {},
    pdf: {},
    instagram: {},
    facebook: {},
    video: {},
    images: {},
    links: {},
    business: {},
    menu: {},
    mp3: {},
    social: {},
  });

  const selected = qrTypes.find((item) => item.id === selectedId) ?? qrTypes[0];

  const preview = qrTypes.find((item) => item.id === hoveredId) ?? selected;

  const currentData = qrData[selectedId] || {};
  const designPreviewData = currentData.url || currentData.websiteUrl || currentData.text || (selectedId === "whatsapp" && currentData.phone ? `https://wa.me/${String(currentData.phone).replace(/\D/g, "")}` : "") || (selectedId === "wifi" && currentData.ssid ? `WIFI:T:${currentData.encryption || "WPA"};S:${currentData.ssid};P:${currentData.password || ""};;` : "") || (selectedId === "vcard" && currentData.name ? `BEGIN:VCARD\nFN:${currentData.name}\nEND:VCARD` : "");

  const updateQrData = (updater) => {
    setQrData((prev) => ({
      ...prev,
      [selectedId]:
        typeof updater === "function"
          ? updater(prev[selectedId] || {})
          : updater,
    }));
  };

  const isValidUrl = (url) => {
    if (!url?.trim()) return false;

    try {
      const parsedUrl = new URL(url);
      return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
    } catch {
      return false;
    }
  };

  const isCurrentFormValid = () => {
    switch (selectedId) {
      case "website": case "pdf": case "links": case "business": case "video": case "images": case "facebook": case "instagram": case "social": case "menu": case "mp3": return isValidUrl(currentData.url || currentData.websiteUrl || "");
      case "whatsapp": return Boolean(String(currentData.phone || "").replace(/\D/g, ""));
      case "wifi": return Boolean(currentData.ssid?.trim());
      case "vcard": return Boolean(currentData.name?.trim());
      default: return Boolean(currentData.text?.trim());
    }
  };

  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const router = useRouter();
  const handleCreateQr = async () => {
    if (!isCurrentFormValid()) return;

    setIsCreating(true);
    setCreateError("");

    try {
      const data = qrData[selectedId];
      const design = data.design || {};

      const payload = {
        name: data.qrName || "Untitled QR Code",

        type: selectedId,

        content: Object.fromEntries(Object.entries(data).filter(([key, value]) => key !== "design" && key !== "qrName" && value !== undefined && value !== "")),

        design: {
          frame: design.selectedFrame || "scan",
          frameColor: design.frameColor || "#000000",
          frameText: design.frameText || "Scan me!",

          pattern: design.selectedPattern || "square",

          patternColor: design.patternColor || "#000000",
          patternColor2: design.patternColor2 || "#20c75a",
          patternGradientEnabled: design.patternGradientEnabled ?? false,

          backgroundColor: design.backgroundColor || "#ffffff",

          backgroundColor2: design.backgroundColor2 || "#effcf4",

          backgroundGradientEnabled: design.backgroundGradientEnabled ?? false,

          transparentBackground: design.transparentBackground ?? false,

          cornerSquareStyle: design.selectedCornerSquare || "square",

          cornerSquareColor: design.cornerSquareColor || "#000000",

          cornerDotStyle: design.selectedCornerDot || "square",

          cornerDotColor: design.cornerDotColor || "#000000",

          logo: design.logo || "",
        },

        isDynamic: true,
      };

      console.log("========== QR PAYLOAD ==========");

      console.log(JSON.stringify(payload, null, 2));

      const response = await fetch("/api/qr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create QR code");
      }

      router.push("/dashboard/qrcodes");
    } catch (error) {
      console.error("CREATE QR ERROR:", error);
      setCreateError(error.message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleSelectQrType = (type) => {
    setSelectedId(type.id);
    setHoveredId(null);
    setStep(2);
  };

  // ==========================================================
  // NEXT STEP
  // ==========================================================

  const handleContinue = () => {
    if (step === 2 && !isCurrentFormValid()) return;

    setStep((current) => Math.min(current + 1, 3));
  };

  // ==========================================================
  // BACK
  // ==========================================================

  const handleBack = () => {
    setStep((current) => Math.max(current - 1, 1));
  };

  return (
    <div className='min-h-screen bg-[#f5f8fb]'>
      {/* ======================================================
          TOP HEADER
      ====================================================== */}

      <header className='sticky top-0 z-50 h-15.25 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur'>
        <div className='flex h-full items-center justify-between px-6 lg:px-10'>
          {/* Logo */}
          <div className='flex items-center gap-2'>
            <div className='grid grid-cols-2 gap-1'>
              <div className='h-4 w-4 rounded-lg border-[3px] border-[#20c75a]' />
              <div className='h-4 w-4 rounded-lg border-[3px] border-[#20c75a]' />
              <div className='h-4 w-4 rounded-lg border-[3px] border-[#20c75a]' />
              <div className='h-4 w-4 rounded-lg border-[3px] border-[#20c75a]' />
            </div>

            <div className='leading-none'>
              <p className='text-[11px] text-gray-500'>Online</p>

              <p className='text-lg font-bold text-gray-900'>QR Generator</p>
            </div>
          </div>

          {/* Steps */}
          <StepIndicator currentStep={step} />

          {/* Header actions */}
          <div className='flex items-center gap-3'>
            <button
              className='hidden h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 sm:flex'
              type='button'
            >
              ?
            </button>

            <button
              type='button'
              className='flex h-10 w-10 items-center justify-center rounded-lg bg-[#20c75a] text-white'
            >
              ☰
            </button>
          </div>
        </div>
      </header>

      {/* ======================================================
          CONTENT
      ====================================================== */}

      <main className='mx-auto max-w-362.5 px-5 py-3 lg:px-10'>
        {/* Step heading */}
        <div className='mb-2'>
          <p className='text-[28px] font-normal tracking-tight text-[#101828] '>
            {step === 1 && "1. Select a type of QR code"}
            {step === 2 && `Create your ${selected.title} QR code`}
            {step === 3 && "Design your QR code"}
          </p>
        </div>

        {/* ====================================================
            STEP 1
        ==================================================== */}

        {step === 1 && (
          <div className='grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_400px] xl:grid-cols-[minmax(0,1fr)_440px]'>
            {/* =================================================
                LEFT — QR TYPES
            ================================================= */}

            <div>
              <div className='grid grid-cols-2 gap-4 sm:grid-cols-4 xl:grid-cols-4'>
                {qrTypes.map((type) => {
                  const Icon = type.icon;

                  const isSelected = type.id === selectedId;

                  const isHovered = type.id === hoveredId;

                  return (
                    <button
                      key={type.id}
                      type='button'
                      onMouseEnter={() => setHoveredId(type.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      onClick={() => handleSelectQrType(type)}
                      className={`
                        group
                        relative
                        flex
                        min-h-40
                        flex-col
                        items-center
                        justify-center
                        overflow-hidden
                        rounded-2xl
                        border
                        bg-white
                        px-4
                        py-6
                        text-center
                        transition-all
                        duration-300
                        ease-out
                        hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-100/60
                        ${isSelected ? "border-emerald-500 bg-emerald-50/50 shadow-md shadow-emerald-100" : "border-slate-200"}
                      `}
                    >
                      {/* Active top line */}
                      <div
                        className={`
                          absolute left-0 right-0 top-0 h-1
                          
                          transition-transform duration-300
                          ${isSelected ? "translate-y-0 bg-[#20c75a]" : "group-hover:translate-y-0 group-hover:bg-[#20c75a]"}
                         
                        `}
                      />

                      {/* Icon */}
                      <div
                        className={`
                          mb-4
                          flex
                          h-12
                          w-12
                          items-center
                          justify-center
                          rounded-full
                          transition-all
                          duration-300

                          ${
                            isSelected || isHovered
                              ? "bg-[#eafaf0] scale-110"
                              : "bg-[#f3faf5]"
                          }
                        `}
                      >
                        <Icon
                          className={`
                            h-6
                            w-6
                            transition-colors
                            duration-300
                            ${
                              isSelected || isHovered
                                ? "text-[#20c75a]"
                                : "text-[#20c75a]"
                            }
                          `}
                          strokeWidth={2}
                        />
                      </div>

                      {/* Name */}
                      <span
                        className={`
                          text-[16px]
                          font-bold
                          transition-colors
                          duration-200
                          ${isSelected ? "text-[#20c75a]" : "text-[#101828]"}
                        `}
                      >
                        {type.label}
                      </span>

                      {/* Small description */}
                      <span className='mt-1 text-[11px] leading-4 text-gray-400'>
                        {type.id === "website" && "Link to a website URL"}

                        {type.id === "pdf" && "Share a PDF"}

                        {type.id === "links" && "Share multiple links"}

                        {type.id === "vcard" && "Share a digital business card"}

                        {type.id === "business" && "Share business information"}

                        {type.id === "video" && "Show a video"}

                        {type.id === "images" && "Share multiple images"}

                        {type.id === "facebook" && "Share your Facebook page"}

                        {type.id === "instagram" && "Share your Instagram"}

                        {type.id === "social" && "Share your social channels"}

                        {type.id === "whatsapp" && "Get WhatsApp messages"}

                        {type.id === "menu" && "Share your menu"}

                        {type.id === "wifi" && "Share WiFi access"}

                        {type.id === "mp3" && "Share an audio file"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* =================================================
                RIGHT — PHONE
            ================================================= */}

            <div className='lg:sticky lg:top-26.25'>
              <div className='relative overflow-hidden rounded-[30px]  '>
                {/* Phone */}
                <div className='relative z-10'>
                  <PhoneMockup item={preview} />
                </div>

                {/* Current type */}
                <div className='relative z-10 -mt-1 text-center'>
                  <p className='mt-1 text-lg font-bold text-gray-900'>
                    {preview.title}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ====================================================
            STEP 2
        ==================================================== */}

        {step === 2 && (
          <div>
            <QrContentForm type={selected.id} value={currentData} onChange={updateQrData} />

            {/* {selected.id === "vcard" && <VCardForm />}

    {selected.id === "whatsapp" && <WhatsAppForm />}

    {selected.id === "wifi" && <WifiForm />}

    {selected.id === "pdf" && <PdfForm />}

    {selected.id === "instagram" && <InstagramForm />}

    {selected.id === "facebook" && <FacebookForm />}

    {selected.id === "video" && <VideoForm />}

    {selected.id === "images" && <ImagesForm />}

    {selected.id === "links" && <LinksForm />}

    {selected.id === "business" && <BusinessForm />}

    {selected.id === "menu" && <MenuForm />}

    {selected.id === "mp3" && <Mp3Form />} */}
          </div>
        )}

        {/* ====================================================
            STEP 3
        ==================================================== */}

        {step === 3 && (
          <QrDesignForm
            url={designPreviewData}
            value={currentData.design || {}}
            onChange={(newDesign) =>
              updateQrData((prev) => ({
                ...prev,
                design: newDesign,
              }))
            }
          />
        )}

        {step >= 2 && (
          <div className='mt-10 flex items-center justify-between border-t border-gray-200 pt-6'>
            {step > 1 ? (
              <Button
                type='button'
                variant='outline'
                onClick={handleBack}
                className='h-12 rounded-lg px-6'
              >
                Back
              </Button>
            ) : (
              <div />
            )}

            <div className='flex items-center gap-3'>
              <p className='hidden text-sm text-gray-400 sm:block'>
                Step {step} of 3
              </p>

              {step === 2 && (
                <Button
                  type='button'
                  onClick={handleContinue}
                  disabled={!isCurrentFormValid()}
                  className={`
                    h-12
                    gap-2
                    rounded-lg
                    px-7
                    text-base
                    font-semibold
                    text-white
                    transition-all
                    ${
                      !isCurrentFormValid()
                        ? "cursor-not-allowed bg-gray-300 shadow-none"
                        : "bg-[#20c75a] shadow-lg shadow-green-100 hover:bg-[#19b851]"
                    }
                  `}
                >
                  Continue to Design
                  <ChevronRight size={18} />
                </Button>
              )}

              {step === 3 && (
                <Button
                  type='button'
                  onClick={handleCreateQr}
                  disabled={isCreating}
                  className='h-12 gap-2 rounded-lg bg-[#20c75a] px-7 text-base font-semibold text-white shadow-lg shadow-green-100 hover:bg-[#19b851] disabled:cursor-not-allowed disabled:opacity-60'
                >
                  {isCreating ? "Creating..." : "Create QR Code"}

                  {isCreating ? (
                    <span className='h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent' />
                  ) : (
                    <QrCode size={18} />
                  )}
                </Button>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

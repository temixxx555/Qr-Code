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
  Play,
  Smartphone,
} from "lucide-react";
import { FaFacebook, FaInstagram } from "react-icons/fa";
export const qrTypes = [
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
qrTypes.push(
  {
    id: "apps",
    label: "Apps",
    title: "Apps",
    icon: Smartphone,
    description: "Help people find your app on their favorite store.",
  },

);

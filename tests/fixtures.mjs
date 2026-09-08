export const fixtures = {
  website: { websiteUrl: "https://example.com/first" },
  pdf: { url: "https://example.com/file.pdf", title: "Document" },
  links: {
    title: "Links",
    links: [{ label: "Portfolio", url: "https://example.com" }],
  },
  vcard: {
    firstName: "Adebayo",
    lastName: "Temilade",
    headline: "Software Engineer",
    city: "Lagos",
    phone: "+2348012345678",
  },
  business: { name: "Coffee shop", hours: { Monday: "09:00–18:00" } },
  video: { url: "https://example.com/video.mp4" },
  images: {
    images: [{ url: "https://example.com/photo.jpg", caption: "Photo" }],
  },
  facebook: { url: "https://www.facebook.com/example" },
  instagram: { username: "example" },
  social: { links: [{ label: "LinkedIn", url: "https://linkedin.com" }] },
  whatsapp: { phone: "+2348012345678", message: "Hello & welcome" },
  menu: {
    name: "My Restaurant",
    currency: "NGN",
    categories: [
      {
        name: "MAINS",
        items: [{ name: "Jollof Rice", price: "6500", available: true }],
      },
    ],
  },
  wifi: {
    ssid: "Guest;WiFi",
    password: "p:ass\\word",
    encryption: "WPA",
    hidden: true,
  },
  mp3: { url: "https://example.com/track.mp3" },
  apps: {
    title: "Test app",
    iosUrl: "https://apps.apple.com/app/id123",
    androidUrl: "https://play.google.com/store/apps/details?id=test",
  },
  coupon: { title: "September special", discount: "20% OFF", code: "SAVE20" },
};

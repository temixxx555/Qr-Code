"use client";
import website from "./types/website/websiteForm";
import pdf from "./types/pdf/pdfForm";
import links from "./types/links/linksForm";
import vcard from "./types/vcard/vcardForm";
import business from "./types/business/businessForm";
import video from "./types/video/videoForm";
import images from "./types/images/imagesForm";
import facebook from "./types/facebook/facebookForm";
import instagram from "./types/instagram/instagramForm";
import social from "./types/social/socialForm";
import whatsapp from "./types/whatsapp/whatsappForm";
import menu from "./types/menu/menuForm";
import wifi from "./types/wifi/wifiForm";
import mp3 from "./types/mp3/mp3Form";
import apps from "./types/apps/appsForm";
import coupon from "./types/coupon/couponForm";
const registry = {
  website,
  pdf,
  links,
  vcard,
  business,
  video,
  images,
  facebook,
  instagram,
  social,
  whatsapp,
  menu,
  wifi,
  mp3,
  apps,
  coupon,
};
export default function QrContentForm({ type, value, onChange }) {
  const Component = registry[type === "app" ? "apps" : type];
  return Component ? (
    <div className="min-w-0 wrap-break-word">
      <Component value={value} onChange={onChange} />
    </div>
  ) : (
    <p className="p-6">This content type is unavailable.</p>
  );
}

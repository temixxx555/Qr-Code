import website from "./types/website/websitePreview";
import pdf from "./types/pdf/pdfPreview";
import links from "./types/links/linksPreview";
import vcard from "./types/vcard/vcardPreview";
import business from "./types/business/businessPreview";
import video from "./types/video/videoPreview";
import images from "./types/images/imagesPreview";
import facebook from "./types/facebook/facebookPreview";
import instagram from "./types/instagram/instagramPreview";
import social from "./types/social/socialPreview";
import whatsapp from "./types/whatsapp/whatsappPreview";
import menu from "./types/menu/menuPreview";
import wifi from "./types/wifi/wifiPreview";
import mp3 from "./types/mp3/mp3Preview";
import apps from "./types/apps/appsPreview";
import coupon from "./types/coupon/couponPreview";
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
export default function QrLandingContent({ type, content }) {
  const Component = registry[type === "app" ? "apps" : type];
  return Component ? (
    <div className="min-w-0 h-screen break-words [overflow-wrap:anywhere]">
      <Component content={content || {}} />
    </div>
  ) : (
    <p className="p-6">This content type is unavailable.</p>
  );
}

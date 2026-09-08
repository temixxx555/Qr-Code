import {
  FaInstagram,
  FaFacebook,
  FaTiktok,
  FaTwitter,
  FaLinkedin,
  FaYoutube,
  FaSnapchat,
  FaPinterest,
  FaTelegram,
  FaDiscord,
  FaGithub,
  FaGlobe,
} from "react-icons/fa";
const networks = {
  instagram: FaInstagram,
  facebook: FaFacebook,
  tiktok: FaTiktok,
  twitter: FaTwitter,
  x: FaTwitter,
  linkedin: FaLinkedin,
  youtube: FaYoutube,
  snapchat: FaSnapchat,
  pinterest: FaPinterest,
  telegram: FaTelegram,
  discord: FaDiscord,
  github: FaGithub,
};
export default function SocialMark({ label = "", url = "" }) {
  const name = Object.keys(networks).find(
    (n) => label.toLowerCase() === n || url.toLowerCase().includes(n + ".com"),
  );
  const Icon = networks[name] || FaGlobe;
  return <Icon aria-hidden="true" className="inline-block h-5 w-5 shrink-0" />;
}

import { Picture, Intro, Action } from "../presentation";
import { whatsappUrl } from "@/lib/qr-content";
export default function Preview({ content: c }) {
  return (
    <article className="min-h-full bg-[#ece5d7]">
      <header className="flex items-center gap-3 bg-[#075e54] p-5 text-white">
        <Picture
          src={c.avatar}
          alt={c.title || "Chat"}
          className="h-12 w-12 rounded-full"
        />
        <div>
          <h1 className="font-semibold">{c.title || "Let’s chat"}</h1>
          <p className="text-xs opacity-70">WhatsApp conversation</p>
        </div>
      </header>
      <div className="p-5">
        <div className="my-10 rounded-xl rounded-tl-none bg-white p-4 text-sm shadow-sm">
          {c.message || "Hello! I would like to know more."}
          <p className="mt-3 text-right text-[10px] text-slate-400">
            Message preview ✓✓
          </p>
        </div>
        <p className="text-center text-xs text-slate-500">
          +{c.phone || "Your phone number"}
        </p>
        {c.phone && <Action href={whatsappUrl(c)}>Continue to Chat</Action>}
      </div>
    </article>
  );
}

import { MessageCircle, Phone, ShieldCheck, ArrowUpRight } from "lucide-react";

import { Picture, Action } from "../presentation";
import { whatsappUrl } from "@/lib/qr-content";
import Link from "next/link";

export default function Preview({ content: c }) {
  const phone = c.phone ? String(c.phone).replace(/[^\d+]/g, "") : "";
  const chatUrl = c.phone ? whatsappUrl(c) : "";

  return (
    <article className='relative flex min-h-full w-full flex-col overflow-hidden bg-[#efeae2] text-slate-900'>
      {/* BACKGROUND */}
      <div className='pointer-events-none absolute inset-0 overflow-hidden'>
        <div className='absolute -left-24 top-24 h-72 w-72 rounded-full bg-emerald-100/50 blur-3xl' />
        <div className='absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-green-100/45 blur-3xl' />

        <div
          className='absolute inset-0 opacity-[0.035]'
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgb(15 23 42) 1px, transparent 0)",
            backgroundSize: "20px 20px",
          }}
        />
      </div>

      <div className='relative mx-auto flex min-h-full w-full max-w-[620px] flex-1 flex-col'>
        {/* WHATSAPP HEADER */}
        <header className='relative overflow-hidden bg-[#075e54] px-[5%] pb-7 pt-5 text-white'>
          <div className='pointer-events-none absolute inset-0'>
            <div className='absolute -right-10 -top-16 h-40 w-40 rounded-full bg-white/5' />
            <div className='absolute -left-12 bottom-[-70px] h-40 w-40 rounded-full bg-black/5' />
          </div>

          <div className='relative flex items-center gap-3.5'>
            <Picture
              src={c.avatar}
              alt={c.title || "Chat"}
              className='h-[54px] w-[54px] shrink-0 rounded-full border-2 border-white/25 object-cover shadow-md'
            />

            <div className='min-w-0 flex-1'>
              <h1 className='truncate text-[16px] font-semibold tracking-[-0.01em] text-white'>
                {c.title || "Let’s chat"}
              </h1>

              <div className='mt-1 flex items-center gap-1.5 text-[10px] text-white/70'>
                <span className='h-1.5 w-1.5 rounded-full bg-[#25D366]' />
                Available on WhatsApp
              </div>
            </div>

            <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10'>
              <MessageCircle className='h-4 w-4' />
            </div>
          </div>
        </header>

        {/* CHAT AREA */}
        <div className='relative flex flex-1 flex-col px-[5%] pb-7'>
          <div className='mx-auto -mt-3 w-full max-w-[560px]'>
            {/* ENCRYPTION NOTE */}
            <div className='mx-auto mb-7 w-fit rounded-lg bg-[#fff4c7] px-3 py-2 text-center shadow-sm'>
              <div className='flex items-center justify-center gap-1.5 text-[9px] leading-4 text-[#7c6b35]'>
                <ShieldCheck className='h-3 w-3 shrink-0' />
                Messages are end-to-end encrypted
              </div>
            </div>

            {/* MESSAGE */}
            <div className='flex justify-start'>
              <div className='relative max-w-[88%] rounded-[16px] rounded-tl-[4px] bg-white px-4 py-3.5 shadow-[0_3px_10px_rgba(15,23,42,0.08)]'>
                <div className='absolute -left-[7px] top-0 h-0 w-0 border-b-[8px] border-r-[8px] border-b-transparent border-r-white' />

                <p className='whitespace-pre-line break-words text-[13px] leading-5.5 text-slate-700'>
                  {c.message || "Hello! I would like to know more."}
                </p>

                <div className='mt-2 flex items-center justify-end gap-1 text-[9px] text-slate-400'>
                  <span>Message preview</span>
                  <span className='font-semibold text-[#53bdeb]'>✓✓</span>
                </div>
              </div>
            </div>

            {/* PHONE CARD */}
            <div className='mt-8 rounded-[18px] border border-white/80 bg-white/75 p-3.5 shadow-sm backdrop-blur'>
              <div className='flex min-w-0 items-center gap-3'>
                <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] bg-[#dcf8c6] text-[#128C7E]'>
                  <Phone className='h-4.5 w-4.5' />
                </div>

                <div className='min-w-0 flex-1'>
                  <p className='text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-400'>
                    WhatsApp number
                  </p>

                  <p className='mt-0.5 truncate text-[13px] font-semibold text-slate-700'>
                    {phone
                      ? `+${phone.replace(/^\+/, "")}`
                      : "Your phone number"}
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            {c.phone && (
              <div className='mt-4'>
                <Action
                  href={chatUrl}
                  className='
                    !min-h-[52px]
                    !rounded-[16px]
                    !bg-[#25D366]
                    !shadow-[0_14px_28px_-14px_rgba(37,211,102,0.7)]
                    hover:!bg-[#20bd5a]
                    hover:!shadow-[0_18px_34px_-14px_rgba(37,211,102,0.8)]
                  '
                >
                  <span className='flex items-center justify-center gap-2'>
                    <MessageCircle className='h-4 w-4' strokeWidth={2} />
                    Continue to Chat
                    <ArrowUpRight className='h-3.5 w-3.5' strokeWidth={2} />
                  </span>
                </Action>
              </div>
            )}

            <p className='mt-4 text-center text-[10px] leading-4 text-slate-400'>
              You’ll be redirected to WhatsApp to continue the conversation.
            </p>
          </div>
        </div>

        {/* FOOTER */}
        <Link href={"/"}>
          <p className='pb-5 text-center text-[9px] font-medium text-slate-400'>
            Powered by{" "}
            <span className='font-semibold text-slate-500'>Smart QR</span>
          </p>
        </Link>
      </div>
    </article>
  );
}

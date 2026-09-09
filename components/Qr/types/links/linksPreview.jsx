import { ExternalLink, Link2, Sparkles, BadgeCheck } from "lucide-react";

import SocialMark from "../SocialMark";
import { Picture, Intro, Action } from "../presentation";
import Link from "next/link";

export default function LinksPreview({ content: c }) {
  const links = Array.isArray(c.links) ? c.links : [];

  return (
    <article className='relative flex min-h-full w-full flex-col overflow-hidden bg-[#0f172a] text-white'>
      {/* Background */}
      <div className='pointer-events-none absolute inset-0 overflow-hidden'>
        <div className='absolute left-1/2 top-[-120px] h-[320px] w-[320px] -translate-x-1/2 rounded-full bg-fuchsia-500/20 blur-3xl' />
        <div className='absolute bottom-[-140px] left-[-80px] h-[300px] w-[300px] rounded-full bg-violet-500/20 blur-3xl' />
        <div className='absolute bottom-[-100px] right-[-80px] h-[280px] w-[280px] rounded-full bg-rose-500/15 blur-3xl' />

        <div
          className='absolute inset-0 opacity-[0.03]'
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <div className='relative mx-auto flex min-h-full w-full max-w-[680px] flex-1 flex-col px-[5%] py-6'>
        {/* Profile section */}
        <div className='flex flex-1 items-start justify-center pt-3'>
          <section className='w-full'>
            <div className='text-center'>
              {/* Avatar */}
              <div className='relative mx-auto w-fit'>
                <div className='absolute -inset-1 rounded-full bg-gradient-to-tr from-violet-500 via-fuchsia-500 to-rose-500 blur-[2px]' />

                <Picture
                  src={c.avatar}
                  alt={c.title || "Profile"}
                  className='relative h-[86px] w-[86px] rounded-full border-[3px] border-[#0f172a] object-cover shadow-2xl'
                />

                <div className='absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#0f172a] bg-white text-violet-600 shadow-lg'>
                  <BadgeCheck className='h-4 w-4' strokeWidth={2.3} />
                </div>
              </div>

              {/* Name / title */}
              <div className='mx-auto mt-5 max-w-[460px]'>
                <h1 className='text-[26px] font-bold leading-tight tracking-[-0.03em] text-white'>
                  {c.title || "Your links, together"}
                </h1>

                {c.description && (
                  <p className='mx-auto mt-2 max-w-[420px] text-[13px] leading-5 text-white/60'>
                    {c.description}
                  </p>
                )}
              </div>

              {/* Small decorative indicator */}
              <div className='mt-4 flex items-center justify-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-white/35'>
                <Sparkles className='h-3.5 w-3.5' />
                All my links
              </div>
            </div>

            {/* Links */}
            <div className='mt-7 space-y-3'>
              {links.length ? (
                links.map((link, index) => (
                  <a
                    key={`${link.url}-${index}`}
                    href={link.url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='
                      group
                      flex
                      min-h-[58px]
                      w-full
                      items-center
                      gap-3
                      rounded-[18px]
                      border
                      border-white/10
                      bg-white/[0.08]
                      px-3.5
                      py-3
                      backdrop-blur-xl
                      transition-all
                      duration-200
                      hover:-translate-y-0.5
                      hover:border-white/20
                      hover:bg-white/[0.13]
                      hover:shadow-[0_14px_30px_-16px_rgba(0,0,0,0.75)]
                      active:translate-y-0
                    '
                  >
                    {/* Social icon */}
                    <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-white text-slate-900 shadow-sm'>
                      <SocialMark label={link.label} url={link.url} />
                    </div>

                    {/* Label */}
                    <div className='min-w-0 flex-1 text-left'>
                      <p className='truncate text-[13px] font-semibold text-white'>
                        {link.label || "Open link"}
                      </p>

                      <p className='mt-0.5 truncate text-[10px] text-white/35'>
                        Tap to open
                      </p>
                    </div>

                    {/* Arrow */}
                    <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.07] text-white/50 transition group-hover:bg-white/10 group-hover:text-white'>
                      <ExternalLink className='h-4 w-4' strokeWidth={1.9} />
                    </div>
                  </a>
                ))
              ) : (
                <div className='rounded-[22px] border border-dashed border-white/15 bg-white/[0.05] px-5 py-9 text-center backdrop-blur'>
                  <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white/70'>
                    <Link2 className='h-5 w-5' />
                  </div>

                  <p className='mt-3 text-sm font-semibold text-white/85'>
                    Your links will appear here
                  </p>

                  <p className='mx-auto mt-1 max-w-[230px] text-xs leading-5 text-white/40'>
                    Add links to build your personalized link page.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Footer */}
        <Link href={"/"}>
          <div className='pt-7 text-center'>
            <p className='text-[9px] font-medium text-white/30'>
              Powered by{" "}
              <span className='font-semibold text-white/45'>Smart QR</span>
            </p>
          </div>
        </Link>
      </div>
    </article>
  );
}

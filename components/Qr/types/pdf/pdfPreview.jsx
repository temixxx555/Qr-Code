import { FileText, Download, ExternalLink, ShieldCheck } from "lucide-react";

import { Intro, Action } from "../presentation";
import Link from "next/link";

export default function Preview({ content: c }) {
  const fileSize = c.size ? `${(c.size / 1048576).toFixed(2)} MB` : null;

  const fileName = c.filename || "PDF file";

  return (
    <article className='relative flex min-h-full w-full flex-col overflow-hidden bg-[#f8f8f7] text-slate-900'>
      {/* Decorative background */}
      <div className='pointer-events-none absolute inset-0 overflow-hidden'>
        <div className='absolute -left-20 -top-24 h-64 w-64 rounded-full bg-red-100/55 blur-3xl' />
        <div className='absolute -bottom-24 -right-20 h-64 w-64 rounded-full bg-orange-100/40 blur-3xl' />

        <div
          className='absolute inset-0 opacity-[0.025]'
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgb(15 23 42) 1px, transparent 0)",
            backgroundSize: "20px 20px",
          }}
        />
      </div>

      <div className='relative mx-auto flex min-h-full w-full max-w-5xl flex-1 flex-col px-[5%] py-4'>
        {/* TOP STATUS */}
        <div className='mx-auto w-full max-w-[560px] rounded-[18px] border border-slate-200/80 bg-white/90 p-2 shadow-[0_6px_20px_rgba(15,23,42,0.06)] backdrop-blur-xl'>
          <div className='flex min-w-0 items-center gap-2 rounded-[13px] bg-slate-50 px-3 py-2.5'>
            <ShieldCheck
              className='h-4 w-4 shrink-0 text-emerald-600'
              strokeWidth={2}
            />

            <span className='min-w-0 flex-1 truncate text-xs font-medium text-slate-500'>
              Secure document
            </span>

            <span className='shrink-0 rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-bold text-red-500'>
              PDF
            </span>
          </div>
        </div>

        {/* MAIN */}
        <div className='flex flex-1 items-center justify-center py-5'>
          <section className='relative w-full max-w-[560px] overflow-hidden rounded-[26px] border border-white/90 bg-white shadow-[0_20px_60px_-24px_rgba(15,23,42,0.28)]'>
            {/* top accent */}
            <div className='h-1 bg-gradient-to-r from-red-400 via-red-500 to-orange-400' />

            <div className='p-[clamp(18px,6%,32px)]'>
              {/* TYPE ROW */}
              <div className='flex items-start justify-between gap-3'>
                <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] bg-red-50 text-red-500 ring-1 ring-red-100'>
                  <FileText className='h-6 w-6' strokeWidth={1.9} />
                </div>

                <span className='rounded-full border border-red-100 bg-red-50 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.08em] text-red-500'>
                  PDF document
                </span>
              </div>

              {/* TITLE */}
              <div className='mt-6'>
                <h1 className='break-words text-[clamp(22px,8%,30px)] font-bold leading-[1.15] tracking-[-0.035em] text-slate-950'>
                  {c.title || "Your document"}
                </h1>

                {(c.description || !c.title) && (
                  <p className='mt-2.5 text-[13px] leading-5 text-slate-500'>
                    {c.description ||
                      "View or download this document securely."}
                  </p>
                )}
              </div>

              {/* FILE INFORMATION */}
              <div className='mt-5 rounded-[16px] border border-slate-100 bg-slate-50/80 p-3.5'>
                <div className='flex min-w-0 items-center gap-3'>
                  <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-red-500 shadow-sm ring-1 ring-slate-100'>
                    <FileText className='h-5 w-5' strokeWidth={1.9} />
                  </div>

                  <div className='min-w-0 flex-1'>
                    <p
                      title={fileName}
                      className='truncate text-[13px] font-semibold text-slate-800'
                    >
                      {fileName}
                    </p>

                    <div className='mt-1 flex items-center gap-1.5 text-[10px] text-slate-400'>
                      <span>PDF</span>

                      {fileSize && (
                        <>
                          <span>•</span>
                          <span>{fileSize}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ACTIONS */}
              <div className='mt-5 space-y-2.5'>
                <Action href={c.url}>
                  <span className='flex items-center justify-center gap-2'>
                    {c.ctaLabel || "View PDF"}

                    <ExternalLink className='h-4 w-4' strokeWidth={2} />
                  </span>
                </Action>

                <Action
                  href={c.url}
                  filename={c.title || "document.pdf"}
                  download
                  className='!bg-white !text-slate-700 !shadow-none ring-1 ring-inset ring-slate-200 hover:!bg-slate-50 hover:!shadow-none'
                >
                  <span className='flex items-center justify-center gap-2'>
                    <Download className='h-4 w-4' strokeWidth={2} />
                    Download PDF
                  </span>
                </Action>
              </div>

              {/* TRUST */}
              <div className='mt-4 flex items-center justify-center gap-1.5 text-center text-[10px] leading-4 text-slate-400'>
                <ShieldCheck className='h-3.5 w-3.5 shrink-0 text-emerald-500' />

                <span>Secure document access</span>
              </div>
            </div>
          </section>
        </div>

        {/* FOOTER */}
        <Link href={"/"}>
          <p className='pb-1 text-center text-[9px] font-medium text-slate-400'>
            Powered by{" "}
            <span className='font-semibold text-slate-500'>Smart QR</span>
          </p>
        </Link>
      </div>
    </article>
  );
}

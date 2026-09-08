import { Bell } from "lucide-react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const QRLogo = () => {
  return (
    <svg
      width='64'
      height='64'
      viewBox='0 0 64 64'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      {/* Top-left QR */}
      <rect
        x='6'
        y='6'
        width='20'
        height='20'
        rx='5'
        stroke='#22C55E'
        strokeWidth='6'
      />
      <rect x='12' y='12' width='8' height='8' rx='2' fill='#22C55E' />

      {/* Top-right QR */}
      <rect
        x='38'
        y='6'
        width='20'
        height='20'
        rx='5'
        stroke='#22C55E'
        strokeWidth='6'
      />
      <rect x='44' y='12' width='8' height='8' rx='2' fill='#22C55E' />

      {/* Bottom-left QR */}
      <rect
        x='6'
        y='38'
        width='20'
        height='20'
        rx='5'
        stroke='#22C55E'
        strokeWidth='6'
      />
      <rect x='12' y='44' width='8' height='8' rx='2' fill='#22C55E' />

      {/* QR pattern */}
      <rect x='34' y='34' width='8' height='8' rx='2' fill='#22C55E' />
      <rect x='46' y='34' width='12' height='8' rx='2' fill='#22C55E' />
      <rect x='34' y='46' width='8' height='12' rx='2' fill='#22C55E' />
      <rect x='46' y='46' width='8' height='8' rx='2' fill='#22C55E' />
    </svg>
  );
};

const serviceLinks = [
  { label: "Create QR", href: "#" },
  { label: "Plans and Prices", href: "#" },
  { label: "Language", href: "#" },
];

const companyLinks = [
  { label: "Terms & Conditions", href: "#" },
  { label: "Privacy Policy", href: "#" },
];

const helpLinks = [
  { label: "Contact Us", href: "#" },
  { label: "FAQ", href: "#" },
  { label: "Cancel subscription", href: "#" },
];

function FooterColumn({ title, links }) {
  return (
    <div>
      <h4 className='text-[20px] font-semibold text-white'>{title}</h4>
      <ul className='mt-4 flex flex-col gap-3'>
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className='text-[16px] text-white/60 transition-colors hover:text-white'
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <>
      <section className='w-full bg-white px-15 py-22 '>
        <div className='mx-auto max-w-7xl'>
          <div className='relative overflow-hidden rounded-3xl bg-[#094149] px-25 py-14'>
            <div className='flex flex-col items-start justify-between gap-17 lg:flex-row lg:items-center'>
              <div className='max-w-xl'>
                <h2 className='text-5xl font-bold tracking-tight text-white sm:text-4xl lg:text-[42px]'>
                  Ready to get started?
                </h2>
                <p className='mt-4 text-[20px] leading-relaxed text-white/70 '>
                  Sign up today to build your customizable and fully trackable
                  QR codes. Unlock advanced insights, implement your branding
                  and make updates to your QR codes at any time.
                </p>
              </div>

              <button
                type='button'
                aria-label='Get started'
                className='flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:bg-white/10 sm:h-20 sm:w-20'
              >
                <ArrowRight
                  className='h-6 w-6 sm:h-7 sm:w-7'
                  strokeWidth={1.5}
                />
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className='w-full bg-[#0d3b3a]'>
        <div className='mx-auto max-w-7xl px-12 pb-10 pt-16 '>
          <div className='grid grid-cols-1 gap-10 lg:grid-cols-[1.2fr_1fr_1fr_1fr_1.3fr]'>
            {/* Brand */}
            {/* Logo */}
            <Link href='/' className='flex flex-col  gap-3'>
              <QRLogo />
            </Link>

            <FooterColumn title='Service' links={serviceLinks} />
            <FooterColumn title='Company' links={companyLinks} />
            <FooterColumn title='Help' links={helpLinks} />

            {/* Register box */}
            <div className='rounded-2xl w-75 bg-white/5 p-6'>
              <p className='text-[20px] font-medium leading-relaxed text-white'>
                Generate, Manage &amp; Track your QR codes 👇{" "}
              </p>
              <button
                type='button'
                className='mt-4 h-11 w-full rounded-lg bg-[#22c55e] text-[20px] font-semibold text-white transition-colors hover:bg-[#16a34a]'
              >
                Register
              </button>
            </div>
          </div>

          {/* Bottom bar */}
          <div className='mt-14 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center'>
            <p className='text-xs text-white/50'>
              2026 &copy; Online QR Generator All rights reserved
            </p>

            <a
              href='https://wa.me/2349138721435'
              target='_blank'
              rel='noopener noreferrer'
              className='font-medium text-white/70 transition-colors hover:text-[#22c55e]'
            >
              <p className='text-xs text-white/50'>&apos;Powered by Adex</p>
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}

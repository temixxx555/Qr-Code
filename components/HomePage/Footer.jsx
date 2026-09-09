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
      className='h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16'
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
  { label: "Create QR", href: "/dashboard/create" },
  { label: "Plans and Prices", href: "/pricing" },
  { label: "Language", href: "/faq" },
];

const companyLinks = [
  { label: "Terms & Conditions", href: "/faq" },
  { label: "Privacy Policy", href: "/privacy" },
];

const helpLinks = [
  { label: "Contact Us", href: "/contact" },
  { label: "FAQ", href: "/faq" },
  { label: "Cancel subscription", href: "/dashboard/billing" },
];

function FooterColumn({ title, links }) {
  return (
    <div className='min-w-0'>
      <h4 className='text-base font-semibold text-white sm:text-lg lg:text-xl'>
        {title}
      </h4>

      <ul className='mt-4 flex flex-col gap-3'>
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className='
                text-sm
                leading-6
                text-white/60
                transition-colors
                hover:text-white
                sm:text-base
              '
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <>
      {/* CTA SECTION */}
      <section className='w-full bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20'>
        <div className='mx-auto w-full max-w-7xl'>
          <div
            className='
              relative
              overflow-hidden
              rounded-2xl
              bg-[#094149]
              px-5
              py-8
              sm:rounded-3xl
              sm:px-8
              sm:py-10
              lg:px-12
              lg:py-14
              xl:px-16
            '
          >
            <div
              className='
                flex
                flex-col
                items-start
                justify-between
                gap-8
                sm:gap-10
                lg:flex-row
                lg:items-center
                lg:gap-16
              '
            >
              <Link href='/signup'>
                <div className='min-w-0 max-w-2xl'>
                  <h2
                    className='
                    text-3xl
                    font-bold
                    tracking-[-0.04em]
                    text-white
                    sm:text-4xl
                    lg:text-[42px]
                    lg:leading-[1.08]
                  '
                  >
                    Ready to get started?
                  </h2>

                  <p
                    className='
                    mt-4
                    max-w-xl
                    text-sm
                    leading-7
                    text-white/70
                    sm:text-base
                    lg:text-lg
                  '
                  >
                    Sign up today to build your customizable and fully trackable
                    QR codes. Unlock advanced insights, implement your branding
                    and make updates to your QR codes at any time.
                  </p>
                </div>
              </Link>
              <Link
                href='/signup'
                aria-label='Get started'
                className='
                  flex
                  h-14
                  w-14
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/30
                  text-white
                  transition-all
                  hover:bg-white/10
                  sm:h-16
                  sm:w-16
                  lg:h-20
                  lg:w-20
                '
              >
                <ArrowRight
                  className='h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7'
                  strokeWidth={1.5}
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className='w-full bg-[#0d3b3a]'>
        <div className='mx-auto w-full max-w-7xl px-4 pb-8 pt-12 sm:px-6 sm:pb-10 sm:pt-14 lg:px-8 lg:pt-16'>
          <div
            className='
              grid
              grid-cols-2
              gap-x-6
              gap-y-10
              sm:grid-cols-3
              md:grid-cols-4
              lg:grid-cols-[1.1fr_1fr_1fr_1fr_1.4fr]
              lg:gap-8
            '
          >
            {/* Brand */}
            <div className='col-span-2 sm:col-span-1'>
              <Link href='/' className='inline-flex'>
                <QRLogo />
              </Link>

              <p className='mt-4 max-w-[230px] text-sm leading-6 text-white/50'>
                Create, customize, manage and track smarter QR codes.
              </p>
            </div>

            <FooterColumn title='Service' links={serviceLinks} />

            <FooterColumn title='Company' links={companyLinks} />

            <FooterColumn title='Help' links={helpLinks} />

            {/* Register box */}
            <div
              className='
                col-span-2
                w-full
                rounded-2xl
                bg-white/5
                p-5
                sm:col-span-2
                sm:p-6
                md:col-span-2
                lg:col-span-1
              '
            >
              <p className='text-base font-medium leading-7 text-white sm:text-lg lg:text-xl'>
                Generate, Manage &amp; Track your QR codes 👇
              </p>

              <Link
                href='/register'
                className='
                  mt-5
                  flex
                  h-11
                  w-full
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#22c55e]
                  px-4
                  text-sm
                  font-semibold
                  text-white
                  transition-colors
                  hover:bg-[#16a34a]
                  sm:h-12
                  sm:text-base
                '
              >
                Register
              </Link>
            </div>
          </div>

          {/* Bottom bar */}
          <div
            className='
              mt-10
              flex
              flex-col
              items-start
              justify-between
              gap-3
              border-t
              border-white/10
              pt-6
              sm:mt-12
              sm:flex-row
              sm:items-center
              sm:gap-6
              lg:mt-14
            '
          >
            <p className='text-xs leading-5 text-white/50'>
              2026 &copy; Online QR Generator. All rights reserved.
            </p>

            <a
              href='https://wa.me/2349138721435'
              target='_blank'
              rel='noopener noreferrer'
              className='
                text-xs
                font-medium
                text-white/50
                transition-colors
                hover:text-[#22c55e]
              '
            >
              Powered by Adex
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}

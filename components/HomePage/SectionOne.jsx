import { Check, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className='relative overflow-hidden bg-linear-to-b from-[#e2f7e9] via-[#eefaf2] to-white'>
      <div className='mx-auto flex max-w-7xl flex-col items-center px-4 pb-10 pt-4 sm:px-6 sm:pb-2 sm:pt-8 lg:px-8 lg:pb-2 lg:pt-4'>
        {/* Hero Content */}
        <div className='mx-auto flex min-h-75 w-full flex-col items-center gap-4 px-0 pb-8 pt-6 sm:gap-5 sm:pb-10 sm:pt-8 lg:pb-12 lg:pt-8'>
          {/* Heading */}
          <h1 className='max-w-4xl text-center text-4xl font-black leading-[1.05] tracking-tight text-[#101828] sm:text-5xl md:text-6xl lg:text-[68px] lg:leading-[1.1]'>
            We make <span className='text-[#22c55e]'>QR codes</span> easy
          </h1>

          {/* Features */}
          <div className='mt-3 flex w-full flex-col items-center justify-center gap-3 sm:mt-5 sm:flex-row sm:flex-wrap sm:gap-x-7 sm:gap-y-3 lg:mt-7 lg:gap-x-11'>
            <Feature text='Generate dynamic, editable QR codes' />
            <Feature text='Track performance with analytics' />
            <Feature text='Design QR codes with logo, colors & shapes' />
          </div>

          {/* CTA */}
          <Link href={"/signup"}>
          <Button className='mt-4 h-13 min-w-52 rounded-full bg-[#22c55e] px-6 text-base font-semibold text-white shadow-md shadow-green-200 transition-all hover:bg-[#16a34a] hover:shadow-lg sm:mt-5 sm:h-15 sm:min-w-60 sm:text-lg lg:mt-6 lg:h-18 lg:min-w-70 lg:px-6 lg:text-2xl'>
            <QrCode className='mr-2 h-4 w-4 sm:h-5 sm:w-5' />
            Create QR code
          </Button>
          </Link>
        </div>

        {/* Dashboard Preview */}
        <div className='mt-6 w-full max-w-295 sm:mt-10 lg:mt-14'>
          <div className='relative aspect-video overflow-hidden rounded-xl bg-white shadow-sm sm:rounded-2xl'>
            <Image
              src='/Home-banner.png'
              alt='QR Generator dashboard'
              fill
              priority
              sizes='(max-width: 640px) 100vw, (max-width: 1200px) 100vw, 1180px'
              className='object-contain'
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Feature({ text }) {
  return (
    <div className='flex items-center gap-2 text-[#172b1f]'>
      <span className='flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#22c55e] sm:h-4 sm:w-4'>
        <Check className='h-2.5 w-2.5 text-white' strokeWidth={3} />
      </span>

      <span className='text-center text-sm font-extrabold sm:text-base lg:text-[18px]'>
        {text}
      </span>
    </div>
  );
}

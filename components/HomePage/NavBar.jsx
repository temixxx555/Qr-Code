"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CircleHelp, LogIn, LogOut, Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const QRLogo = () => (

  <Image src={"/logo.png"} width={100} height={100} alt='logo' className="w-[100px] rounded-xl "/>
);

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className='relative z-50 w-full border-b bg-white'>
      <nav className='mx-auto flex h-18 max-w-[1800px] items-center justify-between px-4 sm:h-20 sm:px-6 lg:h-22.5 lg:px-12'>
        {/* LOGO */}
        <Link
          href='/'
          className='flex min-w-0 items-center gap-2 sm:gap-3'
          onClick={() => setMenuOpen(false)}
        >
          <QRLogo />


        </Link>

        {/* DESKTOP NAV */}
        <div className='hidden items-center gap-4 md:flex lg:gap-6'>
          <Link
            href='/pricing'
            className='text-sm font-medium text-slate-700 hover:text-emerald-600'
          >
            Pricing
          </Link>
          <Link href='/faq'>
            <Button
              variant='outline'
              size='icon'
              className='h-12 w-12 rounded-lg border-gray-200 bg-white text-gray-600 hover:bg-gray-50 lg:h-14 lg:w-14'
            >
              <CircleHelp className='h-6 w-6 lg:h-7 lg:w-7' strokeWidth={1.5} />

              <span className='sr-only'>Help</span>
            </Button>
          </Link>

          <Link href='/login'>
            <Button
              variant='outline'
              className='h-12 min-w-20 rounded-lg border border-green-500 bg-white px-4 text-[14px] font-normal text-green-600 hover:bg-green-50 hover:text-green-600 lg:h-14 lg:px-6'
            >
              <LogIn
                className='mr-2 h-5 w-5 lg:mr-3 lg:h-6 lg:w-6'
                strokeWidth={2}
              />
              Log In
            </Button>
          </Link>

          <Link href='/signup'>
            <Button className='h-12 min-w-24 rounded-lg bg-green-500 px-4 text-[14px] font-normal text-white hover:bg-green-600 lg:h-14 lg:px-6'>
              <LogOut
                className='mr-2 h-5 w-5 lg:mr-3 lg:h-6 lg:w-6'
                strokeWidth={2}
              />
              Sign Up
            </Button>
          </Link>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          type='button'
          onClick={() => setMenuOpen((previous) => !previous)}
          className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-700 transition hover:bg-gray-50 md:hidden'
          aria-label={
            menuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
      </nav>

      {/* MOBILE DROPDOWN */}
      <div
        className={`
          overflow-hidden
          border-t
          bg-white
          transition-all
          duration-300
          ease-in-out
          md:hidden

          ${
            menuOpen
              ? "max-h-[320px] opacity-100"
              : "max-h-0 border-transparent opacity-0"
          }
        `}
      >
        <div className='space-y-3 px-4 py-4 sm:px-6'>
          <Link
            href='/pricing'
            onClick={() => setMenuOpen(false)}
            className='block rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700'
          >
            Pricing
          </Link>
          {/* HELP */}
          <Link
            href='/faq'
            onClick={() => setMenuOpen(false)}
            className='flex h-12 w-full items-center gap-3 rounded-lg border border-gray-200 px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50'
          >
            <CircleHelp size={21} strokeWidth={1.7} />
            Help / FAQs
          </Link>

          {/* LOGIN */}
          <Link
            href='/login'
            onClick={() => setMenuOpen(false)}
            className='flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-green-500 px-4 text-sm font-medium text-green-600 transition hover:bg-green-50'
          >
            <LogIn size={20} strokeWidth={2} />
            Log In
          </Link>

          {/* SIGN UP */}
          <Link
            href='/signup'
            onClick={() => setMenuOpen(false)}
            className='flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-green-500 px-4 text-sm font-medium text-white transition hover:bg-green-600'
          >
            <LogOut size={20} strokeWidth={2} />
            Sign Up
          </Link>
        </div>
      </div>

      {/* OPTIONAL MOBILE BACKDROP */}
      {menuOpen && (
        <button
          type='button'
          aria-label='Close navigation menu'
          onClick={() => setMenuOpen(false)}
          className='fixed inset-x-0 bottom-0 top-18 -z-10 bg-black/10 md:hidden sm:top-20'
        />
      )}
    </header>
  );
}

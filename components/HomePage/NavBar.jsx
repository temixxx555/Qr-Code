import { Button } from "@/components/ui/button";
import {
  CircleHelp,
  LogIn,
  LogOut,
} from "lucide-react";
import Link from "next/link";

const QRLogo = () => {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Top-left QR */}
      <rect
        x="6"
        y="6"
        width="20"
        height="20"
        rx="5"
        stroke="#22C55E"
        strokeWidth="6"
      />
      <rect
        x="12"
        y="12"
        width="8"
        height="8"
        rx="2"
        fill="#22C55E"
      />

      {/* Top-right QR */}
      <rect
        x="38"
        y="6"
        width="20"
        height="20"
        rx="5"
        stroke="#22C55E"
        strokeWidth="6"
      />
      <rect
        x="44"
        y="12"
        width="8"
        height="8"
        rx="2"
        fill="#22C55E"
      />

      {/* Bottom-left QR */}
      <rect
        x="6"
        y="38"
        width="20"
        height="20"
        rx="5"
        stroke="#22C55E"
        strokeWidth="6"
      />
      <rect
        x="12"
        y="44"
        width="8"
        height="8"
        rx="2"
        fill="#22C55E"
      />

      {/* QR pattern */}
      <rect x="34" y="34" width="8" height="8" rx="2" fill="#22C55E" />
      <rect x="46" y="34" width="12" height="8" rx="2" fill="#22C55E" />
      <rect x="34" y="46" width="8" height="12" rx="2" fill="#22C55E" />
      <rect x="46" y="46" width="8" height="8" rx="2" fill="#22C55E" />
    </svg>
  );
};

export default function Navbar() {
  return (
    <header className="w-full border-b bg-white">
      <nav className="mx-auto flex h-22.5 max-w-[1800px] items-center justify-between px-6 lg:px-12">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <QRLogo />

          <div className="leading-none">
            <span className="block text-[27px] font-normal tracking-tight text-gray-900">
              Online
            </span>

            <span className="block text-[32px] font-semibold tracking-[-1.5px] text-gray-900">
              QRGenerator
            </span>
          </div>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-6">
          
          {/* Help */}
          <Button
            variant="outline"
            size="icon"
            className="h-14 w-14 rounded-lg border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
          >
            <CircleHelp className="h-7 w-7" strokeWidth={1.5} />
            <span className="sr-only">Help</span>
          </Button>

          {/* Log In */}
           <Link href="/login">
          <Button
            variant="outline"
            className="h-14 min-w-20.75 rounded-lg border border-green-500 bg-white px-6 text-[14px] font-extralight text-green-600 hover:bg-green-50 hover:text-green-600"
          >
            <LogIn className="mr-3 h-6 w-6" strokeWidth={2} />
            Log In
          </Button>
          </Link>

          {/* Sign Up */}
          <Link href="/signup">
          <Button
            className="h-14 min-w-24.5 rounded-lg bg-green-500 px-6 text-[14px] font-normal text-white hover:bg-green-600"
          >
            <LogOut className="mr-3 h-6 w-6" strokeWidth={2} />
            Sign Up
          </Button>
          </Link>
        </div>
      </nav>
    </header>
  );
}
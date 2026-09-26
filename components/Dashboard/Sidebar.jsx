"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  QrCode,
  ChartColumn,
  ScanLine,
  User,
  Wallet,
  MessageCircleMore,
  CircleHelp,
  Clock3,
  X,
} from "lucide-react";

const menuItems = [
  { name: "Referral earnings", href: "/dashboard/referrals", icon: Wallet },
  { name: "Business profile", href: "/dashboard/business", icon: User },
  {
    name: "Create QR Code",
    href: "/qr",
    icon: QrCode,
  },
  {
    name: "Analytics",
    href: "/dashboard/analytics",
    icon: ChartColumn,
  },
  {
    name: "My QR Codes",
    href: "/dashboard/qrcodes",
    icon: ScanLine,
  },
  {
    name: "My Account",
    href: "/dashboard/account",
    icon: User,
  },
  {
    name: "Billing",
    href: "/dashboard/billing",
    icon: Wallet,
  },
];

const supportItems = [
  {
    name: "Contact us",
    href: "/contact",
    icon: MessageCircleMore,
  },
  {
    name: "FAQs",
    href: "/faq",
    icon: CircleHelp,
  },
];

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
}) {
  const pathname = usePathname();
  const { user } = useAuth();

  function closeMobileSidebar() {
    if (setSidebarOpen) {
      setSidebarOpen(false);
    }
  }

  return (
    <aside
      className={`
        fixed
        left-0
        top-0
        z-40
        flex
        h-screen
        w-67.5
        flex-col
        justify-between
        overflow-y-auto
        border-r
        border-gray-200
        bg-white
        transition-transform
        duration-300
        ease-in-out

        ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }

        lg:translate-x-0
      `}
    >
      <div>

        {/* MOBILE CLOSE AREA */}
        <div className="flex h-16 items-center justify-between border-b px-5 lg:hidden">
          <div className="flex items-center gap-3">
            <div className="grid grid-cols-2 gap-1">
              <div className="h-4 w-4 rounded-md border-[3px] border-emerald-400" />
              <div className="h-4 w-4 rounded-md border-[3px] border-emerald-400" />
              <div className="h-4 w-4 rounded-md border-[3px] border-emerald-400" />
              <div className="h-4 w-4 rounded-md border-[3px] border-emerald-500" />
            </div>

            <span className="font-bold">
             Smart QR 
            </span>
          </div>

          <button
            onClick={closeMobileSidebar}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 transition hover:bg-gray-100"
            aria-label="Close sidebar"
          >
            <X size={21} />
          </button>
        </div>

        {/* DESKTOP LOGO */}
        <div className="hidden px-7 py-4 lg:block">
          <div className="flex items-center gap-3">
            <div className="grid grid-cols-2 gap-1">
              <div className="h-4 w-4 rounded-md border-[3px] border-emerald-400" />
              <div className="h-4 w-4 rounded-md border-[3px] border-emerald-400" />
              <div className="h-4 w-4 rounded-md border-[3px] border-emerald-400" />
              <div className="h-4 w-4 rounded-md border-[3px] border-emerald-500" />
            </div>

            <div className="leading-tight">
             

              <h2 className="text-[16px] font-bold text-black">
               Smart QR 
              </h2>
            </div>
          </div>
        </div>

        {/* MAIN NAVIGATION */}
        <nav className="px-2 pt-3 lg:pt-0">
          {user?.adminRole && user.adminRole !== "none" && <Link href="/admin" className="block rounded-xl px-6 py-3 font-semibold text-emerald-700">Administration</Link>}
          {menuItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              pathname === item.href ||
              pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={closeMobileSidebar}
                className={`
                  group
                  flex
                  items-center
                  gap-4
                  rounded-r-xl
                  border-l-4
                  px-5
                  py-2.5
                  text-[16px]
                  transition-all

                  ${
                    isActive
                      ? "border-emerald-500 bg-emerald-50 text-emerald-500"
                      : "border-transparent text-gray-400 hover:bg-gray-50 hover:text-gray-700"
                  }
                `}
              >
                <Icon
                  size={20}
                  className={
                    isActive
                      ? "text-emerald-500"
                      : "text-gray-400 group-hover:text-gray-600"
                  }
                />

                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* DIVIDER */}
        <div className="mx-6 my-4 border-t border-gray-200" />

        {/* SUPPORT */}
        <div className="px-2">
          {supportItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              pathname === item.href ||
              pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={closeMobileSidebar}
                className={`
                  group
                  flex
                  items-center
                  gap-4
                  rounded-r-xl
                  border-l-4
                  px-5
                  py-2.5
                  text-[16px]
                  font-medium
                  transition-all

                  ${
                    isActive
                      ? "border-emerald-500 bg-emerald-50 text-emerald-500"
                      : "border-transparent text-gray-400 hover:bg-gray-50 hover:text-gray-700"
                  }
                `}
              >
                <Icon
                  size={20}
                  className={
                    isActive
                      ? "text-emerald-500"
                      : "text-gray-400 group-hover:text-gray-600"
                  }
                />

                {item.name}
              </Link>
            );
          })}
        </div>
      </div>

      {/* BOTTOM CARD */}
      <div className="p-6">
        <div className="rounded-2xl bg-emerald-50 p-5">
          <div className="mb-5 flex items-center gap-3 text-gray-700">
            <Clock3 size={20} />

            <span className="text-[16px] font-medium">
              Your QR workspace
            </span>
          </div>

          <Link
            href="/qr"
            onClick={closeMobileSidebar}
            className="block w-full rounded-xl bg-emerald-500 py-3 text-center text-sm font-semibold text-white transition hover:bg-emerald-600"
          >
            Create QR code
          </Link>
        </div>
      </div>
    </aside>
  );
}

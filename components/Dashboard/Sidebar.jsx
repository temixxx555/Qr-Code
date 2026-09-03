"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  QrCode,
  ChartColumn,
  ScanLine,
  User,
  Wallet,
  MessageCircleMore,
  CircleHelp,
  Clock3,
} from "lucide-react";

const menuItems = [
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

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-67.5 bg-white border-r border-gray-200 flex flex-col justify-between overflow-y-auto">
      {/* Logo */}
      <div>
        <div className="px-7 py-4">
          <div className="flex items-center gap-3">
            <div className="grid grid-cols-2 gap-1">
              <div className="h-4 w-4 rounded-md border-[3px] border-emerald-400" />
              <div className="h-4 w-4 rounded-md border-[3px] border-emerald-400" />
              <div className="h-4 w-4 rounded-md border-[3px] border-emerald-400" />
              <div className="h-4 w-4 rounded-md border-[3px] border-emerald-500" />
            </div>

            <div className="leading-tight">
              <p className="text-sm font-medium text-gray-500">Online</p>
              <h2 className="text-[16px] font-bold text-black">
                QR Generator
              </h2>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className=" px-2">
          {menuItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              pathname === item.href ||
              pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center gap-4 rounded-r-xl border-l-4 px-5 py-2 text-[16px] transition-all ${
                  isActive
                    ? "border-emerald-500 bg-emerald-50 text-emerald-500"
                    : "border-transparent text-gray-400 hover:bg-gray-50 hover:text-gray-700"
                }`}
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

        {/* Divider */}
        <div className="mx-6 my-4 border-t border-gray-200" />

        {/* Support */}
        <div className=" px-2">
          {supportItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              pathname === item.href ||
              pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center gap-4 rounded-r-xl border-l-4 px-5 py-2 text-[16px] font-medium transition-all ${
                  isActive
                    ? "border-emerald-500 bg-emerald-50 text-emerald-500"
                    : "border-transparent text-gray-400 hover:bg-gray-50 hover:text-gray-700"
                }`}
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

      {/* Upgrade Card */}
      <div className="p-6">
        <div className="rounded-2xl bg-emerald-50 p-5">
          <div className="mb-5 flex items-center gap-3 text-gray-700">
            <Clock3 size={20} />
            <span className="text-[16px] font-medium">9 days remaining</span>
          </div>

          <button className="w-full rounded-xl bg-emerald-500 py-3 text-[16px] font-semibold text-white transition hover:bg-emerald-600">
            Upgrade
          </button>
        </div>
      </div>
    </aside>
  );
}
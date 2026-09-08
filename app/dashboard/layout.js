"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Sidebar from "@/components/Dashboard/Sidebar";
export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden ">

      {/* MOBILE TOP BAR */}
      <div className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center border-b bg-white px-4 lg:hidden">
        <button
          onClick={() => setSidebarOpen((prev) => !prev)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 transition hover:bg-gray-100"
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className="ml-3 flex items-center gap-2">
          <div className="grid grid-cols-2 gap-0.75">
            <div className="h-3 w-3 rounded border-2 border-emerald-400" />
            <div className="h-3 w-3 rounded border-2 border-emerald-400" />
            <div className="h-3 w-3 rounded border-2 border-emerald-400" />
            <div className="h-3 w-3 rounded border-2 border-emerald-500" />
          </div>

          <span className="font-bold text-gray-900">
            QR Generator
          </span>
        </div>
      </div>

      {/* SIDEBAR */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* PAGE CONTENT */}
      <main
        className={`
          min-h-screen
          pt-16
          transition-transform
          duration-300
          ease-in-out
          lg:ml-67.5
          lg:pt-0

          ${
            sidebarOpen
              ? "translate-x-67.5"
              : "translate-x-0"
          }

          lg:translate-x-0
        `}
      >
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>

      {/* DARK OVERLAY */}
      {sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(false)}
          className="
            fixed
            inset-0
            z-30
            bg-black/20
            transition-opacity
            lg:hidden
          "
          aria-label="Close sidebar"
        />
      )}
    </div>
  );
}
import Link from "next/link";
import { ArrowLeft, Home, QrCode, QrCodeIcon, Search } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-4 py-12 sm:px-6 lg:px-8">
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-emerald-100/60 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-teal-100/70 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-3xl text-center">
        {/* Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-emerald-100 bg-emerald-50 shadow-sm sm:h-24 sm:w-24">
          <QrCode
            className="h-10 w-10 text-[#22c55e] sm:h-12 sm:w-12"
            strokeWidth={1.7}
          />
        </div>

        {/* 404 */}
        <div className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#22c55e]">
            Error 404
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-[-0.04em] text-[#101828] sm:text-5xl lg:text-6xl">
            This page went missing.
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-gray-500 sm:text-base lg:text-lg">
            The page you&apos;re looking for may have been moved, deleted, or
            never existed. Don&apos;t worry — your QR codes are still safe.
          </p>
        </div>


        {/* Actions */}
        <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <Link
            href="/"
            className="
              inline-flex
              h-12
              items-center
              justify-center
              gap-2
              rounded-full
              bg-[#22c55e]
              px-6
              text-sm
              font-semibold
              text-white
              transition-all
              hover:bg-[#16a34a]
              hover:shadow-lg
              hover:shadow-emerald-500/20
            "
          >
            <Home className="h-4 w-4" />
            Go home
          </Link>

          <Link
            href="/dashboard/qrcodes"
            className="
              inline-flex
              h-12
              items-center
              justify-center
              gap-2
              rounded-full
              border
              border-gray-200
              bg-white
              px-6
              text-sm
              font-semibold
              text-[#101828]
              transition-all
              hover:border-gray-300
              hover:bg-gray-50
            "
          >
            <QrCode className="h-4 w-4" />
            My QR Codes
          </Link>
        </div>

        {/* Back */}
        <div className="mt-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-[#22c55e]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>
        </div>

        {/* Small helper */}
        <div className="mx-auto mt-12 flex max-w-lg items-start gap-3 rounded-2xl border border-gray-100 bg-[#f8faf9] p-4 text-left">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-[#22c55e] shadow-sm">
            <Search className="h-4 w-4" />
          </div>

          <p className="text-xs leading-6 text-gray-500 sm:text-sm">
            If you followed a link from somewhere in the app, it may be
            outdated. You can head back to your dashboard and continue from
            there.
          </p>
        </div>
      </div>
    </main>
  );
}
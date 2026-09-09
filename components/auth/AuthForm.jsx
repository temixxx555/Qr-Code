"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  User,
  QrCode,
  ArrowRight,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";

export default function AuthForm({ mode }) {
  const isLogin = mode === "login";

  const router = useRouter();
  const { login, register } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      let result;

      if (isLogin) {
        result = await login(email, password);
      } else {
        result = await register(name, email, password);
      }

      if (!result.success) {
        setError(result.message);
        return;
      }

      if (isLogin) {
        router.push("/dashboard");
      } else {
        setSuccess(
          "Account created successfully. You can now log in.",
        );

        setTimeout(() => {
          router.push("/login");
        }, 1000);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="grid min-h-screen lg:grid-cols-[minmax(0,1fr)_minmax(520px,620px)]">

        {/* =====================================================
            LEFT BRAND PANEL
        ===================================================== */}

        <section className="relative hidden overflow-hidden bg-[#16a34a] lg:flex">
          {/* Image */}
          <Image
            src="/bb.jpg"
            alt="Online QR Generator"
            fill
            priority
            className="object-cover opacity-90"
          />

          {/* Brand overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#16a34a]/80 via-[#22c55e]/60 to-black/20" />

          {/* Decorative glows */}
          <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -right-20 h-[420px] w-[420px] rounded-full bg-black/10 blur-3xl" />

          <div className="relative z-10 flex h-full w-full flex-col justify-between p-10 xl:p-14">
            {/* Top brand */}
            <Link href="/" className="inline-flex w-fit items-center gap-3 text-white">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/25 backdrop-blur-sm">
                <QrCode size={24} strokeWidth={2.2} />
              </div>

              <div className="leading-tight">
                <p className="text-sm font-medium text-white/70">
                  Online
                </p>
                <p className="text-lg font-semibold">
                  QR Generator
                </p>
              </div>
            </Link>

            {/* Main copy */}
            <div className="max-w-xl pb-10">
              <p className="mb-4 text-sm font-medium uppercase tracking-[0.18em] text-white/70">
                Simple. Fast. Reliable.
              </p>

              <h1 className="text-4xl font-semibold leading-tight tracking-[-0.035em] text-white xl:text-5xl">
                Create and manage QR codes with confidence.
              </h1>

              <p className="mt-5 max-w-lg text-base leading-7 text-white/80">
                Build dynamic QR codes, update content, organize campaigns,
                and track performance from one clean workspace.
              </p>
            </div>

            <p className="text-xs text-white/55">
              © {new Date().getFullYear()} Online QR Generator
            </p>
          </div>
        </section>

        {/* =====================================================
            RIGHT AUTH AREA
        ===================================================== */}

        <section className="flex min-h-screen flex-col bg-white">

      

          {/* Auth body */}
          <div className="flex flex-1 items-center -mt-21 sm:mt-2 justify-center px-5 py-4 sm:px-8 lg:px-12">
            <div className="w-full max-w-[430px]">

              {/* Heading */}
              <div>
                <h2 className="text-3xl font-semibold mt-5 tracking-[-0.035em] text-slate-950">
                  {isLogin
                    ? "Welcome back"
                    : "Create your account"}
                </h2>

                <p className="mt-2 text-[15px] leading-6 text-slate-500">
                  {isLogin
                    ? "Enter your details to access your QR workspace."
                    : "Get started with your QR workspace in just a few steps."}
                </p>
              </div>

              {/* Google button */}
              <button
                type="button"
                className="mt-8 flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-[0.99]"
              >
                <GoogleIcon />

                {isLogin
                  ? "Continue with Google"
                  : "Sign up with Google"}
              </button>

              {/* Divider */}
              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200" />

                <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  or
                </span>

                <div className="h-px flex-1 bg-slate-200" />
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Full name */}
                {!isLogin && (
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Full name
                    </label>

                    <div className="group flex h-12 items-center rounded-xl border border-slate-200 bg-white transition focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10">
                      <div className="flex w-12 shrink-0 items-center justify-center text-slate-400 group-focus-within:text-emerald-600">
                        <User size={18} />
                      </div>

                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={name}
                        onChange={(event) =>
                          setName(event.target.value)
                        }
                        placeholder="Your full name"
                        className="h-full min-w-0 flex-1 bg-transparent pr-4 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Email address
                  </label>

                  <div className="group flex h-12 items-center rounded-xl border border-slate-200 bg-white transition focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10">
                    <div className="flex w-12 shrink-0 items-center justify-center text-slate-400 group-focus-within:text-emerald-600">
                      <Mail size={18} />
                    </div>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(event) =>
                        setEmail(event.target.value)
                      }
                      placeholder="name@example.com"
                      className="h-full min-w-0 flex-1 bg-transparent pr-4 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="text-sm font-medium text-slate-700"
                    >
                      Password
                    </label>

                    {isLogin && (
                      <Link
                        href="/forgot-password"
                        className="text-xs font-medium text-emerald-600 transition hover:text-emerald-700"
                      >
                        Forgot password?
                      </Link>
                    )}
                  </div>

                  <div className="group flex h-12 items-center rounded-xl border border-slate-200 bg-white transition focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10">
                    <div className="flex w-12 shrink-0 items-center justify-center text-slate-400 group-focus-within:text-emerald-600">
                      <LockKeyhole size={18} />
                    </div>

                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) =>
                        setPassword(event.target.value)
                      }
                      placeholder="Enter your password"
                      className="h-full min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                      required
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((value) => !value)
                      }
                      className="mr-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm leading-5 text-red-600">
                    {error}
                  </div>
                )}

                {/* Success */}
                {success && (
                  <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm leading-5 text-emerald-700">
                    {success}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#22c55e] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#16a34a] focus:outline-none focus:ring-4 focus:ring-emerald-500/20 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? isLogin
                      ? "Logging in..."
                      : "Creating account..."
                    : isLogin
                      ? "Log in"
                      : "Create account"}

                  {!loading && (
                    <ArrowRight
                      size={17}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  )}
                </button>
              </form>

              {/* Switch mode */}
              <p className="mt-7 text-center text-sm text-slate-500">
                {isLogin ? (
                  <>
                    Don&apos;t have an account?{" "}
                    <Link
                      href="/signup"
                      className="font-semibold text-emerald-600 hover:text-emerald-700"
                    >
                      Sign up
                    </Link>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <Link
                      href="/login"
                      className="font-semibold text-emerald-600 hover:text-emerald-700"
                    >
                      Log in
                    </Link>
                  </>
                )}
              </p>

              {/* Terms */}
              {!isLogin && (
                <p className="mx-auto mt-8 max-w-sm text-center text-xs leading-5 text-slate-400">
                  By creating an account, you agree to our{" "}
                  <Link
                    href="/terms"
                    className="text-slate-500 underline-offset-4 hover:text-emerald-600 hover:underline"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-slate-500 underline-offset-4 hover:text-emerald-600 hover:underline"
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fill="#4285F4"
        d="M21.35 12.27c0-.72-.06-1.42-.18-2.09H12v3.96h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.26Z"
      />

      <path
        fill="#34A853"
        d="M12 21.68c2.63 0 4.84-.87 6.45-2.35l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.75 9.75 0 0 0 12 21.68Z"
      />

      <path
        fill="#FBBC05"
        d="M6.54 13.77A5.86 5.86 0 0 1 6.23 12c0-.62.11-1.22.31-1.77V7.7H3.3A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.06 1.05 4.3l3.24-2.53Z"
      />

      <path
        fill="#EA4335"
        d="M12 6.2c1.43 0 2.72.49 3.73 1.45l2.8-2.8C16.83 3.27 14.63 2.32 12 2.32A9.75 9.75 0 0 0 3.3 7.7l3.24 2.53C7.31 7.92 9.46 6.2 12 6.2Z"
      />
    </svg>
  );
}
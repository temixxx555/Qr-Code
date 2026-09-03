"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Eye, EyeOff, LockKeyhole, Mail, User, QrCode } from "lucide-react";

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
        setSuccess("Account created successfully. You can now log in.");

        setTimeout(() => {
          router.push("/login");
        }, 1000);
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className='min-h-screen mt-5 px-8 bg-white'>
      <div className='grid min-h-screen grid-cols-1 lg:grid-cols-2 max-w-8xl mx-auto gap-2'>
        {/* ================= LEFT SIDE (desktop banner) ================= */}
        <div className='relative hidden w-full min-h-screen  bg-[#22c55e] lg:block'>
          <Image
            src='/bb.jpg'
            alt='Online QR Generator'
            fill
            priority
            className='object-contain'
          />
        </div>

        {/* ================= LEFT SIDE (mobile/tablet banner) ================= */}
        <div className='relative flex h-40 items-center justify-center overflow-hidden bg-[#22c55e] sm:h-48 lg:hidden'>
          {/* Decorative glow, mirrors the desktop banner's soft circles */}
          <div className='pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-white/10 blur-2xl' />
          <div className='pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl' />

          <div className='relative flex items-center gap-3 px-6 text-center sm:gap-4'>
            <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25 sm:h-12 sm:w-12'>
              <QrCode
                className='h-5 w-5 text-white sm:h-6 sm:w-6'
                strokeWidth={2.4}
              />
            </div>
            <h1 className='text-left text-[17px] font-bold leading-tight text-white sm:text-[19px]'>
              {isLogin ? (
                <>
                  Welcome Back to
                  <br />
                  Online QR Generator
                </>
              ) : (
                <>Join Online QR Generator</>
              )}
            </h1>
          </div>
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <section className='flex flex-1 items-center justify-center px-5 py-8 sm:px-8 sm:py-10 lg:px-12'>
          <div className='w-full max-w-6xl'>
            {/* Logo / Icon — desktop/tablet only, mobile shows it in the banner instead */}
            <div className='mx-auto mb-7 hidden h-20 w-20 items-center justify-center rounded-full bg-[#f0fdf4] shadow-[0_0_0_10px_rgba(240,253,244,0.55)] lg:flex'>
              <QrCode className='h-10 w-10 text-[#22c55e]' strokeWidth={2.4} />
            </div>

            {/* Heading */}
            <div className='text-center'>
              <h2 className='text-[24px] font-semibold tracking-[-0.02em] text-[#20252d] sm:text-[20px]'>
                {isLogin
                  ? "Log in to Online QR Generator"
                  : "Sign Up to Online QR Generator"}
              </h2>

              <p className='mt-1.5 text-[16px] text-gray-500'>
                {isLogin
                  ? "Use your email to access your account"
                  : "Create a free account"}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className='mt-6 space-y-5 sm:mt-7'>
              {/* Name - Signup */}
              {!isLogin && (
                <div>
                  <label
                    htmlFor='name'
                    className='mb-1.5 block text-[13px] font-medium text-gray-500'
                  >
                    Full Name
                  </label>

                  <div className='flex h-15 items-center overflow-hidden rounded-sm border border-gray-300 bg-white transition focus-within:border-[#22c55e] focus-within:ring-1 focus-within:ring-[#22c55e]/20'>
                    <div className='flex h-full w-9 shrink-0 items-center justify-center border-r border-gray-200'>
                      <User className='h-5 w-5 text-gray-500' />
                    </div>

                    <input
                      id='name'
                      name='name'
                      type='text'
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder='Enter your full name'
                      className='h-full w-full min-w-0 border-0 px-3 text-[13px] text-gray-900 outline-none placeholder:text-gray-400'
                      required
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <label
                  htmlFor='email'
                  className='mb-1.5 block text-[13px] font-medium text-gray-500'
                >
                  Email
                </label>

                <div className='flex h-15 items-center overflow-hidden rounded-sm border border-gray-300 bg-white transition focus-within:border-[#22c55e] focus-within:ring-1 focus-within:ring-[#22c55e]/20'>
                  <div className='flex h-full w-9 shrink-0 items-center justify-center border-r border-gray-200'>
                    <Mail className='h-5.5 w-5.5 text-gray-500' />
                  </div>

                  <input
                    id='email'
                    name='email'
                    type='email'
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder='Enter your email here'
                    className='h-full w-full min-w-0 border-0 px-3 text-[13px] text-gray-900 outline-none placeholder:text-gray-400'
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor='password'
                  className='mb-1.5 block text-[15px] font-medium text-gray-500'
                >
                  Password
                </label>

                <div className='flex h-15 items-center overflow-hidden rounded-sm border border-gray-300 bg-white transition focus-within:border-[#22c55e] focus-within:ring-1 focus-within:ring-[#22c55e]/20'>
                  <div className='flex h-full w-9 shrink-0 items-center justify-center border-r border-gray-200'>
                    <LockKeyhole className='h-5.5 w-5.5 text-gray-500' />
                  </div>

                  <input
                    id='password'
                    name='password'
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder='Enter your password here'
                    className='h-full w-full min-w-0 border-0 px-3 text-[12px] text-gray-900 outline-none placeholder:text-gray-400'
                    required
                  />

                  <button
                    type='button'
                    onClick={() => setShowPassword((value) => !value)}
                    className='mr-2 shrink-0 rounded p-1 text-gray-500 transition hover:text-[#22c55e]'
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className='h-5.5 w-5.5' />
                    ) : (
                      <Eye className='h-5.5 w-5.5' />
                    )}
                  </button>
                </div>
              </div>

              {/* Error / Success messages */}
              {error && (
                <div className='rounded-sm bg-red-50 px-3 py-2 text-sm text-red-600'>
                  {error}
                </div>
              )}

              {success && (
                <div className='rounded-sm bg-green-50 px-3 py-2 text-sm text-green-600'>
                  {success}
                </div>
              )}

              {/* Submit */}
              <button
                type='submit'
                disabled={loading}
                className='h-10 w-full rounded-sm bg-[#22c55e] text-[17px] font-semibold text-white transition hover:bg-[#16a34a] focus:outline-none focus:ring-2 focus:ring-[#22c55e]/30 disabled:cursor-not-allowed disabled:opacity-70'
              >
                {loading
                  ? isLogin
                    ? "Logging in..."
                    : "Creating account..."
                  : isLogin
                    ? "Log In"
                    : "Sign Up"}
              </button>
            </form>

            {/* Divider */}
            <div className='my-6 flex items-center gap-3'>
              <div className='h-px flex-1 bg-gray-200' />

              <span className='text-[14px] font-semibold text-[#52617a]'>
                OR
              </span>

              <div className='h-px flex-1 bg-gray-200' />
            </div>

            {/* Google */}
            <button
              type='button'
              className='flex h-10 w-full items-center justify-center gap-2 rounded-sm bg-[#f7f7f7] text-[18px] font-medium text-[#20252d] transition hover:bg-gray-100'
            >
              <GoogleIcon />

              {isLogin ? "Log in with Google" : "Sign Up with Google"}
            </button>

            {/* Switch Auth Mode */}
            <p className='mt-5 text-center text-[16px] text-gray-500'>
              {isLogin ? (
                <>
                  Don&apos;t have an account?{" "}
                  <Link
                    href='/signup'
                    className='font-semibold text-[#22c55e] hover:underline'
                  >
                    Create an account
                  </Link>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <Link
                    href='/login'
                    className='font-semibold text-[#22c55e] hover:underline'
                  >
                    Sign in
                  </Link>
                </>
              )}
            </p>

            {/* Terms */}
            {!isLogin && (
              <p className='mx-auto mt-8 max-w-82.5 text-center text-[16px] leading-5 text-gray-500 sm:mt-10'>
                By creating an account, you agree to our{" "}
                <Link
                  href='/terms'
                  className='hover:text-[#22c55e] hover:underline'
                >
                  Terms & Conditions
                </Link>{" "}
                and the{" "}
                <Link
                  href='/privacy'
                  className='hover:text-[#22c55e] hover:underline'
                >
                  Privacy Policy
                </Link>
                .
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg width='15' height='15' viewBox='0 0 24 24' aria-hidden='true'>
      <path
        fill='#4285F4'
        d='M21.35 12.27c0-.72-.06-1.42-.18-2.09H12v3.96h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.26Z'
      />

      <path
        fill='#34A853'
        d='M12 21.68c2.63 0 4.84-.87 6.45-2.35l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.75 9.75 0 0 0 12 21.68Z'
      />

      <path
        fill='#FBBC05'
        d='M6.54 13.77A5.86 5.86 0 0 1 6.23 12c0-.62.11-1.22.31-1.77V7.7H3.3A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.06 1.05 4.3l3.24-2.53Z'
      />

      <path
        fill='#EA4335'
        d='M12 6.2c1.43 0 2.72.49 3.73 1.45l2.8-2.8C16.83 3.27 14.63 2.32 12 2.32A9.75 9.75 0 0 0 3.3 7.7l3.24 2.53C7.31 7.92 9.46 6.2 12 6.2Z'
      />
    </svg>
  );
}

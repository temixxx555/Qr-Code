"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, CheckCircle2, KeyRound, Mail, ShieldCheck } from "lucide-react";
import api from "@/lib/axios";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function requestCode(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const response = await api.post("/auth/forgot-password", { email });
      setCodeSent(true);
      setSuccess(response.data.message);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "We couldn’t send a code right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function updatePassword(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (password !== confirmPassword) {
      setError("Your passwords don’t match.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/auth/reset-password", { email, code, password });
      setSuccess(response.data.message);
      setTimeout(() => router.push("/login"), 1400);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "We couldn’t update your password. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-slate-50 px-5 py-12 sm:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-11rem)] max-w-5xl items-center justify-center">
        <section className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/60 sm:p-10">
          <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            {codeSent ? <ShieldCheck size={26} /> : <KeyRound size={26} />}
          </div>

          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-emerald-600">Account recovery</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            {codeSent ? "Choose a new password" : "Forgot your password?"}
          </h1>
          <p className="mt-3 leading-6 text-slate-500">
            {codeSent
              ? `Enter the six-digit code sent to ${email} and create a new password.`
              : "Enter the email address on your account and we’ll send you a one-time reset code."}
          </p>

          {error && <p role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
          {success && <p role="status" className="mt-6 flex gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"><CheckCircle2 className="mt-0.5 shrink-0" size={17} />{success}</p>}

          {!codeSent ? (
            <form onSubmit={requestCode} className="mt-7 space-y-5">
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">Email address</label>
                <div className="flex h-12 items-center rounded-xl border border-slate-200 transition focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10">
                  <Mail className="ml-4 shrink-0 text-slate-400" size={18} />
                  <input id="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@example.com" required className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400" />
                </div>
              </div>
              <button disabled={loading} className="h-12 w-full rounded-xl bg-emerald-600 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60">
                {loading ? "Sending code…" : "Send reset code"}
              </button>
            </form>
          ) : (
            <form onSubmit={updatePassword} className="mt-7 space-y-5">
              <div>
                <label htmlFor="code" className="mb-2 block text-sm font-medium text-slate-700">Six-digit code</label>
                <input id="code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))} placeholder="000000" required className="h-12 w-full rounded-xl border border-slate-200 px-4 text-center font-mono text-lg tracking-[0.35em] text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10" />
              </div>
              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">New password</label>
                <input id="password" type="password" autoComplete="new-password" minLength={8} maxLength={128} pattern="(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,128}" title="Use at least 8 characters, including a capital letter and a special character." value={password} onChange={(event) => setPassword(event.target.value)} placeholder="8+ characters, capital and special character" required className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10" />
              </div>
              <div>
                <label htmlFor="confirm-password" className="mb-2 block text-sm font-medium text-slate-700">Confirm new password</label>
                <input id="confirm-password" type="password" autoComplete="new-password" minLength={8} maxLength={128} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Enter the password again" required className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10" />
              </div>
              <button disabled={loading} className="h-12 w-full rounded-xl bg-emerald-600 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60">
                {loading ? "Updating password…" : "Update password"}
              </button>
              <button type="button" disabled={loading} onClick={requestCode} className="w-full text-sm font-medium text-emerald-700 hover:text-emerald-800 disabled:opacity-60">Send a new code</button>
            </form>
          )}

          <Link href="/login" className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"><ArrowLeft size={16} /> Back to sign in</Link>
        </section>
      </div>
    </main>
  );
}

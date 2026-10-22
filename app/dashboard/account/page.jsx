"use client";

import { useEffect, useState } from "react";
import { LogOut, ShieldCheck, UserRound } from "lucide-react";
import api from "@/lib/axios";

export default function AccountPage() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [code, setCode] = useState("");
  const [verificationChallengeId, setVerificationChallengeId] = useState("");
  const [verificationSent, setVerificationSent] = useState(false);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    api
      .get("/auth/me")
      .then(({ data }) => setUser(data.user))
      .catch(() => setError("Could not load your account."));
  }, []);
  const logout = async () => {
    try {
      await api.post("/auth/logout");

      window.location.href = "/login";
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
      setError("Could not sign out. Please try again.");
    }
  };
  const sendVerification = async () => {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const { data } = await api.post("/auth/email-verification", {
        action: "send",
      });
      setVerificationSent(true);
      setVerificationChallengeId(data.challengeId);
      setMessage(data.message || "A verification code was sent to your email.");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Could not send a verification code. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  };
  const verifyEmail = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const { data } = await api.post("/auth/email-verification", {
        action: "verify",
        challengeId: verificationChallengeId,
        code,
      });
      setUser((current) => ({ ...current, isVerified: data.isVerified }));
      setVerificationSent(false);
      setVerificationChallengeId("");
      setCode("");
      setMessage(data.message);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Could not verify your email. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  };
  const toggleTwoFactor = async () => {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const enabled = !user.twoFactorEnabled;
      const { data } = await api.post("/auth/two-factor", { enabled });
      setUser((current) => ({ ...current, twoFactorEnabled: data.twoFactorEnabled }));
      setMessage(data.message);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Could not update two-factor authentication.",
      );
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className='mx-auto max-w-6xl'>
      <p className='text-sm font-medium text-emerald-600'>Dashboard</p>
      <h1 className='mt-1 text-3xl font-bold text-slate-900'>My account</h1>
      <section className='mt-7 rounded-2xl border bg-white p-6 shadow-sm'>
        {!user && error ? (
          <p className='text-red-600'>{error}</p>
        ) : !user ? (
          <p className='text-slate-500'>Loading account…</p>
        ) : (
          <>
            <div className='flex items-center gap-4'>
              <div className='rounded-full bg-emerald-100 p-4 text-emerald-700'>
                <UserRound size={28} />
              </div>
              <div>
                <h2 className='font-semibold text-slate-900'>{user.name}</h2>
                <p className='text-sm text-slate-500'>{user.email}</p>
              </div>
            </div>
            {error && (
              <p role='alert' className='mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700'>
                {error}
              </p>
            )}
            {message && (
              <p role='status' className='mt-5 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700'>
                {message}
              </p>
            )}
            <div className='mt-6 space-y-6 border-t pt-6'>
              <div>
                <p className='text-sm font-semibold text-slate-900'>Email verification</p>
                <p className='mt-1 text-sm text-slate-600'>
                  {user.isVerified
                    ? "Your email address is verified."
                    : "Verify that you can receive email at this address."}
                </p>
                {!user.isVerified && !verificationSent && (
                  <button
                    type='button'
                    disabled={busy}
                    onClick={sendVerification}
                    className='mt-3 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60'
                  >
                    {busy ? "Sending code…" : "Send verification code"}
                  </button>
                )}
                {!user.isVerified && verificationSent && (
                  <form onSubmit={verifyEmail} className='mt-3 flex flex-wrap gap-2'>
                    <input
                      aria-label='Email verification code'
                      inputMode='numeric'
                      autoComplete='one-time-code'
                      pattern='[0-9]{6}'
                      maxLength={6}
                      required
                      value={code}
                      onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder='Six-digit code'
                      className='h-11 w-40 rounded-lg border border-slate-300 px-3 text-sm'
                    />
                    <button
                      type='submit'
                      disabled={busy || code.length !== 6}
                      className='rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60'
                    >
                      {busy ? "Verifying…" : "Verify email"}
                    </button>
                    <button
                      type='button'
                      disabled={busy}
                      onClick={sendVerification}
                      className='rounded-lg border px-4 py-2.5 text-sm font-medium text-slate-700 disabled:opacity-60'
                    >
                      Resend code
                    </button>
                  </form>
                )}
              </div>
              <div className='border-t pt-6'>
                <div className='flex items-start gap-3'>
                  <ShieldCheck className='mt-0.5 text-emerald-600' size={20} />
                  <div>
                    <p className='font-semibold text-slate-900'>Two-factor authentication</p>
                    <p className='mt-1 text-sm leading-6 text-slate-600'>
                      {user.twoFactorEnabled
                        ? "Enabled. Sign-ins require a one-time code sent to your verified email."
                        : "Add a one-time email code after your password or Google sign-in."}
                    </p>
                  </div>
                </div>
                <button
                  type='button'
                  disabled={busy || (!user.isVerified && !user.twoFactorEnabled)}
                  onClick={toggleTwoFactor}
                  className='mt-3 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50'
                >
                  {user.twoFactorEnabled ? "Turn off two-factor authentication" : "Enable two-factor authentication"}
                </button>
                {!user.isVerified && !user.twoFactorEnabled && (
                  <p className='mt-2 text-xs text-slate-500'>Verify your email first to enable this setting.</p>
                )}
              </div>
            </div>
            <button
              onClick={logout}
              className='mt-7 inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50'
            >
              <LogOut size={16} /> Sign out
            </button>
          </>
        )}
      </section>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  QrCode,
} from "lucide-react";

import api from "@/lib/axios";
import Link from "next/link";

export default function ContactPage() {
  const [user, setUser] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loadingUser, setLoadingUser] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [success, setSuccess] =
    useState("");

  const [error, setError] =
    useState("");

  useEffect(() => {
    let alive = true;

    async function loadUser() {
      try {
        const response =
          await api.get("/auth/me");

        if (!alive) return;

        const currentUser =
          response.data?.user ||
          response.data;

        setUser(currentUser);

        setForm((prev) => ({
          ...prev,

          name:
            currentUser?.name ||
            currentUser?.fullName ||
            "",

          email:
            currentUser?.email ||
            "",
        }));
      } catch {
        // User may not be logged in.
      } finally {
        if (alive) {
          setLoadingUser(false);
        }
      }
    }

    loadUser();

    return () => {
      alive = false;
    };
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!form.name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!form.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!form.subject) {
      setError("Please select a subject.");
      return;
    }

    if (!form.message.trim()) {
      setError("Please enter your message.");
      return;
    }

    try {
      setSubmitting(true);

      const response =
        await api.post(
          "/contact",
          {
            name: form.name.trim(),
            email: form.email.trim(),
            subject: form.subject,
            message: form.message.trim(),
          },
        );

      setSuccess(
        response.data?.message ||
          "Your message has been sent successfully.",
      );

      setForm((prev) => ({
        ...prev,
        subject: "",
        message: "",
      }));
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "We couldn't send your message. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-white">
         {/* Mobile header */}
                  <div className="flex items-center justify-between border-b px-5 py-4 ">
                    <Link href="/" className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                        <QrCode size={20} strokeWidth={2.3} />
                      </div>
        
                      <div className="leading-tight">
                        <p className="text-[14px] underline hover:text-blue-500 font-semibold text-slate-900">
                          Home
                        </p>
                     
                      </div>
                    </Link>
                  </div>
      <div className="mx-auto w-full max-w-3xl px-5 pb-20 pt-14 sm:px-8 md:pt-20">
   
        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <Mail size={20} />
          </div>

          <h1 className="text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl">
            Contact Us
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
            Have a question, suggestion or issue?
            Send us a message and our team will
            get back to you as soon as possible.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-12 max-w-xl space-y-6"
        >
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-xs font-semibold text-slate-700"
            >
              Full name
              <span className="ml-0.5 text-emerald-600">
                *
              </span>
            </label>

            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              autoComplete="name"
              className="
                h-12
                w-full
                min-w-0
                rounded-2xl
                border
                border-slate-200
                bg-white
                px-4
                text-sm
                text-slate-900
                outline-none
                transition
                placeholder:text-slate-400
                focus:border-emerald-500
                focus:ring-4
                focus:ring-emerald-500/10
              "
            />
          </div>

          {/* Email */}
          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <label
                htmlFor="email"
                className="text-xs font-semibold text-slate-700"
              >
                Email address
                <span className="ml-0.5 text-emerald-600">
                  *
                </span>
              </label>

              {user?.email && (
                <span className="text-[10px] font-medium text-emerald-600">
                  Signed-in email
                </span>
              )}
            </div>

            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                
                placeholder={
                  loadingUser
                    ? "Loading email..."
                    : "you@example.com"
                }
                autoComplete="email"
                className={`
                  h-12
                  w-full
                  min-w-0
                  rounded-2xl
                  border
                  px-4
                  pr-11
                  text-sm
                  outline-none
                  transition
                  ${
                    user?.email
                      ? "border-slate-200 bg-slate-100 text-slate-600"
                      : "border-slate-200 bg-white text-slate-900 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  }
                `}
              />

              {loadingUser ? (
                <Loader2 className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-slate-400" />
              ) : user?.email ? (
                <CheckCircle2 className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-500" />
              ) : null}
            </div>
          </div>

          {/* Subject */}
          <div>
            <label
              htmlFor="subject"
              className="mb-2 block text-xs font-semibold text-slate-700"
            >
              Subject
              <span className="ml-0.5 text-emerald-600">
                *
              </span>
            </label>

            <div className="relative">
              <select
                id="subject"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                className="
                  h-12
                  w-full
                  min-w-0
                  appearance-none
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  px-4
                  pr-11
                  text-sm
                  text-slate-700
                  outline-none
                  transition
                  focus:border-emerald-500
                  focus:ring-4
                  focus:ring-emerald-500/10
                "
              >
                <option value="">
                  Select a subject
                </option>

                <option value="general">
                  General question
                </option>

                <option value="technical">
                  Technical issue
                </option>

                <option value="billing">
                  Billing & subscription
                </option>

                <option value="qr-code">
                  QR code issue
                </option>

                <option value="analytics">
                  Analytics
                </option>

                <option value="feature">
                  Feature request
                </option>

                <option value="feedback">
                  Feedback
                </option>

                <option value="other">
                  Other
                </option>
              </select>

              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          {/* Message */}
          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <label
                htmlFor="message"
                className="text-xs font-semibold text-slate-700"
              >
                Question
                <span className="ml-0.5 text-emerald-600">
                  *
                </span>
              </label>

              <span className="text-[10px] text-slate-400">
                {form.message.length}/2000
              </span>
            </div>

            <textarea
              id="message"
              name="message"
              value={form.message}
              onChange={handleChange}
              maxLength={2000}
              rows={6}
              placeholder="Tell us how we can help..."
              className="
                block
                min-h-[150px]
                w-full
                min-w-0
                max-w-full
                resize-none
                overflow-x-hidden
                rounded-2xl
                border
                border-slate-200
                bg-white
                px-4
                py-3
                text-sm
                leading-6
                text-slate-900
                outline-none
                transition
                placeholder:text-slate-400
                focus:border-emerald-500
                focus:ring-4
                focus:ring-emerald-500/10
              "
            />
          </div>

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />

              <p className="text-xs leading-5 text-red-700">
                {error}
              </p>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />

              <p className="text-xs leading-5 text-emerald-700">
                {success}
              </p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="
              flex
              h-12
              w-full
              items-center
              justify-center
              gap-2
              rounded-full
              bg-emerald-500
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-emerald-600
              disabled:cursor-not-allowed
              disabled:opacity-60
              sm:mx-auto
              sm:max-w-[260px]
            "
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Send message
              </>
            )}
          </button>

          <p className="text-center text-[11px] leading-5 text-slate-400">
            We usually respond as soon as
            possible.
          </p>
        </form>
      </div>
    </main>
  );
}
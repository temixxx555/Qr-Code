"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Check, ShieldCheck, CreditCard, ArrowRight } from "lucide-react";
import api from "@/lib/axios";
import { money } from "@/lib/billing-rules";
import { toast } from "sonner";
import { Card, Field, Notice, DateText, input, button, secondary } from "./ui";
export default function BillingDashboard() {
  const [data, setData] = useState(null),
    [error, setError] = useState(""),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  const [plan, setPlan] = useState("annual"),
    [code, setCode] = useState(() =>
      typeof window !== "undefined"
        ? window.localStorage.getItem("referralCode") || ""
        : "",
    ),
    [recurring, setRecurring] = useState(false),
    [quote, setQuote] = useState(null);
  const load = useCallback(async () => {
    const response = await api.get("/billing");
    setData(response.data);
  }, []);
  useEffect(() => {
    let active = true;

    async function initialize() {
      try {
        const reference = new URLSearchParams(window.location.search).get(
          "reference",
        );
        if (reference) {
          await api.post("/billing", { action: "verify", reference });
          if (active)
            setMessage(
              "Payment verified. Your membership details have been refreshed.",
            );
          window.history.replaceState({}, "", window.location.pathname);
        }
        await load();
      } catch (e) {
        if (active)
          setError(e.response?.data?.message || "Could not load billing.");
        await load().catch(() => {});
      }
    }
    initialize();
    return () => {
      active = false;
    };
  }, [load]);
  async function run(task) {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await task();
    } catch (e) {
      const errorMessage =
        e.response?.data?.message || "This action could not be completed.";

      toast.error(errorMessage);
    } finally {
      setBusy(false);
    }
  }
  const selected = data?.plans.find((item) => item.key === plan);
  return (
    <div className='mx-auto max-w-6xl space-y-6'>
      <header className='flex flex-wrap items-end justify-between gap-4'>
        <div>
          <p className='text-sm font-semibold text-emerald-600'>
            YOUR PLAN, YOUR PACE
          </p>
          <h1 className='mt-2 text-3xl font-bold tracking-tight text-slate-900'>
            Billing & membership
          </h1>
          <p className='mt-2 text-slate-500'>
            Flexible plans for personal projects and growing businesses.
          </p>
        </div>
        <Link href='/dashboard/referrals' className={secondary}>
          Referral earnings <ArrowRight className='ml-2' size={16} />
        </Link>
      </header>
      {error && <Notice error>{error}</Notice>}
      {message && <Notice>{message}</Notice>}
      {!data ? (
        <Card>
          <p>Loading your membership…</p>
          <button className={`${secondary} mt-4`} onClick={() => run(load)}>
            Try again
          </button>
        </Card>
      ) : (
        <>
          {data.mode === "test" && (
            <Notice>
              Test environment — these payments and earnings have no cash value.
            </Notice>
          )}
          {!data.checkoutReady && (
            <Notice>
              Payments are not enabled yet. The administrator needs to connect
              Paystack before checkout can open.
            </Notice>
          )}
          <Card>
            <div className='flex flex-wrap justify-between gap-6'>
              <div>
                <span className='rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700'>
                  {data.premium ? "Premium" : "Free"} ·{" "}
                  {data.state.replaceAll("_", " ")}
                </span>
                <h2 className='mt-4 text-xl font-semibold'>
                  {data.workspace.name}
                </h2>
                <p className='mt-1 text-sm text-slate-500 capitalize'>
                  {data.workspace.type} account
                </p>
              </div>
              <div className='text-sm text-slate-600'>
                <p>
                  Paid access until{" "}
                  <strong>
                    <DateText value={data.subscription?.paidThrough} />
                  </strong>
                </p>
                <p className='mt-2'>
                  Renewal:{" "}
                  {data.subscription?.renewalState?.replaceAll("_", " ") ||
                    "manual"}
                </p>
                {data.subscription?.renewalState === "enabled" && (
                  <button
                    disabled={busy}
                    className={`${secondary} mt-3`}
                    onClick={() => {
                      if (
                        window.confirm(
                          "Cancel automatic renewal? Your access continues until the end of your paid period.",
                        )
                      )
                        run(async () => {
                          await api.post("/billing", { action: "cancel" });
                          await load();
                          setMessage(
                            "Renewal cancelled. Your current paid period remains available.",
                          );
                        });
                    }}
                  >
                    Cancel automatic renewal
                  </button>
                )}
              </div>
            </div>
          </Card>
          <div className='grid gap-6 lg:grid-cols-[1fr_320px]'>
            <Card title='Choose your Premium billing period'>
              <p className='mb-5 text-sm text-slate-500'>
                One payment for the full period. Same prices for Personal and
                Business.
              </p>
              <div className='grid gap-3 sm:grid-cols-2'>
                {data.plans.map((item) => (
                  <button
                    key={item.key}
                    aria-pressed={plan === item.key}
                    onClick={() => {
                      setPlan(item.key);
                      setQuote(null);
                    }}
                    className={`relative rounded-xl border-2 p-5 text-left transition ${plan === item.key ? "border-emerald-600 bg-emerald-50" : "border-slate-200 hover:border-emerald-300"}`}
                  >
                    <p className='text-sm font-medium text-slate-600'>
                      {item.label}
                    </p>
                    <p className='mt-2 text-2xl font-bold text-slate-900'>
                      {money(item.amount)}
                    </p>
                    <p className='mt-1 text-xs text-slate-500'>
                      Total for {item.months}{" "}
                      {item.months === 1 ? "month" : "months"}
                    </p>
                    {plan === item.key && (
                      <Check
                        size={18}
                        className='absolute right-4 top-4 text-emerald-600'
                      />
                    )}
                  </button>
                ))}
              </div>
              <div className='mt-6 grid gap-4'>
                <Field label='Referral code (optional)'>
                  <input
                    className={input}
                    value={code}
                    maxLength={32}
                    placeholder='Enter a friend’s code'
                    onChange={(e) => {
                      setCode(e.target.value.trim().toUpperCase());
                      setQuote(null);
                    }}
                  />
                </Field>
                <label className='flex items-start gap-3 rounded-xl bg-slate-50 p-4 text-sm'>
                  <input
                    type='checkbox'
                    checked={recurring}
                    disabled
                    onChange={(e) => {
                      setRecurring(e.target.checked);
                      setQuote(null);
                    }}
                    className='mt-1'
                  />
                  <span>
                    <strong>Enable automatic renewal</strong>
                    <span className='mt-1 block text-slate-500'>
                      Automatic renewal uses a reusable card. Choose a one-time
                      payment to use other available payment methods.
                    </span>
                    <span className='mt-1 block text-slate-500'>
                      I authorize{" "}
                      {selected
                        ? money(selected.amount)
                        : "the full plan price"}{" "}
                      every {selected?.months} month(s), starting after my first
                      paid period. I can cancel future renewals from Billing.
                      Leave unchecked for a one-time payment.
                    </span>
                  </span>
                </label>
                {!quote ? (
                  <button
                    className={button}
                    disabled={busy}
                    onClick={() =>
                      run(async () => {
                        const result = await api.post("/billing", {
                          action: "quote",
                          plan,
                          referralCode: code,
                        });
                        setQuote(result.data);
                      })
                    }
                  >
                    {busy ? "Checking…" : "Review payment"}
                  </button>
                ) : (
                  <div className='rounded-xl border border-emerald-200 p-5'>
                    <div className='flex justify-between font-semibold'>
                      <span>Due today</span>
                      <span>{money(quote.amount)}</span>
                    </div>
                    {quote.discount > 0 && (
                      <p className='mt-2 text-sm text-emerald-700'>
                        First-payment referral saving: {money(quote.discount)}
                      </p>
                    )}
                    <p className='mt-3 text-sm text-slate-500'>
                      {recurring
                        ? `Then ${money(quote.renewalAmount)} every ${quote.months} months. Your exact renewal date appears after payment.`
                        : "One-time purchase. No automatic renewal."}
                    </p>
                    <button
                      disabled={busy || !data.checkoutReady}
                      className={`${button} mt-4 w-full`}
                      onClick={() =>
                        run(async () => {
                          const response = await api.post("/billing", {
                            action: "checkout",
                            plan,
                            referralCode: code,
                            recurring,
                            amount: quote.amount,
                            version: quote.version,
                          });
                          window.location.assign(response.data.url);
                        })
                      }
                    >
                      <CreditCard size={17} className='mr-2' />
                      {busy
                        ? "Opening checkout…"
                        : `Pay ${money(quote.amount)} with Paystack`}
                    </button>
                  </div>
                )}
              </div>
            </Card>
            <div className='space-y-5'>
              <Card title='Everything in Premium'>
                {[
                  "Publish dynamic QR codes",
                  "Update content after printing",
                  "Full QR design tools",
                  "Scan analytics and exports",
                  "Folders and hosted media",
                ].map((text) => (
                  <p
                    key={text}
                    className='my-3 flex gap-3 text-sm text-slate-600'
                  >
                    <Check className='shrink-0 text-emerald-600' size={17} />
                    {text}
                  </p>
                ))}
              </Card>
              <Card title='Free stays useful'>
                <p className='text-sm leading-6 text-slate-500'>
                  Create static WiFi codes, preview dynamic designs, manage your
                  account, and earn referrals. Existing printed dynamic codes
                  keep working if Premium expires.
                </p>
                <Link href='/qr' className={`${secondary} mt-4`}>
                  Create a QR
                </Link>
              </Card>
              <p className='flex gap-2 px-2 text-xs leading-5 text-slate-500'>
                <ShieldCheck size={22} className='shrink-0' />
                Payments are securely handled by Paystack. We never store your
                card number.
              </p>
            </div>
          </div>
          <Card title='Payment history'>
            <div className='space-y-3'>
              {!data.orders.length && (
                <p className='py-8 text-center text-sm text-slate-500'>
                  Your payments and receipts will appear here.
                </p>
              )}
              {data.orders.map((order) => (
                <div
                  key={order._id}
                  className='flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4'
                >
                  <div>
                    <p className='font-medium'>
                      {order.plan?.label || "Premium membership"} ·{" "}
                      {money(order.amount)}
                    </p>
                    <p className='mt-1 break-all text-xs text-slate-500'>
                      {order.reference}
                    </p>
                    <p className='mt-1 text-xs text-slate-500'>
                      <DateText value={order.paidAt || order.createdAt} /> ·{" "}
                      {order.status}
                      {order.refundedAmount > 0 &&
                        ` · Refunded ${money(order.refundedAmount)}`}
                    </p>
                  </div>
                  {order.status === "pending" ? (
                    <button
                      disabled={busy}
                      className={secondary}
                      onClick={() =>
                        run(async () => {
                          await api.post("/billing", {
                            action: "verify",
                            reference: order.reference,
                          });
                          await load();
                          setMessage("Payment verified.");
                        })
                      }
                    >
                      Check payment
                    </button>
                  ) : (
                    <a
                      className={secondary}
                      href={`/api/billing/receipt?reference=${encodeURIComponent(order.reference)}`}
                      target='_blank'
                      rel='noreferrer'
                    >
                      View receipt
                    </a>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

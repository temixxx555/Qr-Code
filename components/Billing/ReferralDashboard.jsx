"use client";
import { useCallback, useEffect, useState } from "react";
import api from "@/lib/axios";
import { money } from "@/lib/billing-rules";
import { Card, Field, Notice, DateText, input, button, secondary } from "./ui";
export default function ReferralDashboard() {
  const [data, setData] = useState(null),
    [error, setError] = useState(""),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  const [banks, setBanks] = useState([]),
    [bankCode, setBankCode] = useState(""),
    [accountNumber, setAccountNumber] = useState("");
  const load = useCallback(async () => {
    const { data } = await api.get("/referrals");
    setData(data);
  }, []);
  useEffect(() => {
    api
      .get("/referrals")
      .then(({ data }) => setData(data))
      .catch(() => setError("Could not load earnings. Please try again."));
  }, []);
  async function run(task) {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await task();
      await load();
    } catch (e) {
      setError(
        e.response?.data?.message || "This action could not be completed.",
      );
    } finally {
      setBusy(false);
    }
  }
  const total = (state) => data?.totals?.[state] || 0;
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <p className="text-sm font-semibold text-emerald-600">GROW TOGETHER</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Referral earnings
        </h1>
        <p className="mt-2 text-slate-500">
          Share Smart QR. Earn when someone makes a qualifying purchase.
        </p>
      </header>
      {error && <Notice error>{error}</Notice>}
      {message && <Notice>{message}</Notice>}
      {!data ? (
        <Card>
          <p>Loading earnings…</p>
          <button className={`${secondary} mt-4`} onClick={() => run(load)}>
            Try again
          </button>
        </Card>
      ) : (
        <>
          <Card title="Your invitation">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-2xl font-bold tracking-widest text-emerald-700">
                  {data.code}
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Your friend saves {data.policy.discountBps / 100}% on their
                  first payment. You earn {data.policy.commissionBps / 100}% of
                  the discounted amount.
                </p>
              </div>
              <button
                disabled={!data.enabled || busy}
                className={button}
                onClick={() =>
                  run(async () => {
                    await navigator.clipboard.writeText(
                      `${window.location.origin}/signup?ref=${data.code}`,
                    );
                    setMessage("Referral link copied.");
                  })
                }
              >
                Copy referral link
              </button>
            </div>
            <p className="mt-5 text-xs leading-5 text-slate-500">
              Earnings become available after {data.policy.holdDays} days.
              Refunds adjust commissions.{" "}
              {data.policy.renewalCommissions
                ? "Qualifying renewals also earn commission."
                : "Renewals do not earn commission."}{" "}
              {data.conversions} qualifying payment(s).{" "}
              {data.enabled
                ? ""
                : "Your code is currently disabled. Contact support."}
            </p>
          </Card>
          <div className="grid gap-4 sm:grid-cols-4">
            {[
              ["Pending", "pending"],
              ["Available before adjustments", "available"],
              ["Reserved", "reserved"],
              ["Paid, net of reversals", "paid"],
            ].map(([label, state]) => (
              <Card key={state}>
                <p className="text-xs text-slate-500">{label}</p>
                <p className="mt-3 text-2xl font-bold">{money(total(state))}</p>
              </Card>
            ))}
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Card title="Receive your earnings">
              <p className="text-sm text-slate-500">
                {data.bank?.label || "Add a verified Nigerian bank account."}
              </p>
              {!banks.length ? (
                <button
                  className={`${secondary} mt-4`}
                  disabled={busy}
                  onClick={() =>
                    run(async () => {
                      const { data } = await api.post("/referrals", {
                        action: "banks",
                      });
                      setBanks(data.banks);
                    })
                  }
                >
                  {data.bank ? "Change bank account" : "Add bank account"}
                </button>
              ) : (
                <form
                  className="mt-4 space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    run(async () => {
                      await api.post("/referrals", {
                        action: "bank",
                        bankCode,
                        accountNumber,
                      });
                      setAccountNumber("");
                      setBanks([]);
                      setMessage("Bank account verified and saved.");
                    });
                  }}
                >
                  <Field label="Bank">
                    <select
                      className={input}
                      value={bankCode}
                      onChange={(e) => setBankCode(e.target.value)}
                      required
                    >
                      <option value="">Choose your bank</option>
                      {banks.map((bank) => (
                        <option value={bank.code} key={bank.code}>
                          {bank.name}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Account number">
                    <input
                      className={input}
                      inputMode="numeric"
                      pattern="[0-9]{10}"
                      maxLength={10}
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      required
                    />
                  </Field>
                  <button className={button} disabled={busy}>
                    {busy ? "Verifying…" : "Verify and save"}
                  </button>
                </form>
              )}
            </Card>
            <Card title="Request a withdrawal">
              <p className="text-sm leading-6 text-slate-500">
                {data.policy.minimumWithdrawal
                  ? `Minimum: ${money(data.policy.minimumWithdrawal)}. Requests are reviewed before payout. Any outstanding refund adjustments are deducted first.`
                  : "Withdrawals open once the administrator sets the minimum payout. Your earnings remain recorded."}
              </p>
              <button
                className={`${button} mt-5`}
                disabled={busy || !data.policy.minimumWithdrawal || !data.bank}
                onClick={() =>
                  run(async () => {
                    await api.post("/referrals", { action: "withdraw" });
                    setMessage(
                      "Withdrawal submitted for review. Your eligible earnings are reserved.",
                    );
                  })
                }
              >
                {busy ? "Submitting…" : "Withdraw eligible earnings"}
              </button>
            </Card>
          </div>
          <Card title="Earnings ledger">
            <div className="divide-y">
              {!data.ledger.length && (
                <p className="py-7 text-center text-sm text-slate-500">
                  Your first referral payment will appear here.
                </p>
              )}
              {data.ledger.map((row) => (
                <div
                  key={row._id}
                  className="flex flex-wrap justify-between gap-3 py-4 text-sm"
                >
                  <div>
                    <p className="font-medium">
                      Referral payment · {money(row.amount)}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      <DateText value={row.createdAt} /> · Available{" "}
                      <DateText value={row.availableAt} />
                    </p>
                    {row.reversedAmount > 0 && (
                      <p className="mt-1 text-red-700">
                        Refund adjustment: −{money(row.reversedAmount)}
                      </p>
                    )}
                  </div>
                  <span className="capitalize text-emerald-700">
                    {row.state}
                  </span>
                </div>
              ))}
            </div>
          </Card>
          <Card title="Withdrawal history">
            {!data.withdrawals.length && (
              <p className="text-sm text-slate-500">No withdrawals yet.</p>
            )}
            {data.withdrawals.map((row) => (
              <div
                className="flex flex-wrap justify-between gap-3 border-b py-4 text-sm"
                key={row._id}
              >
                <div>
                  <p className="font-medium">
                    {money(row.amount)} · {row.bankLabel}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    <DateText value={row.createdAt} />
                  </p>
                  {row.reason && (
                    <p className="mt-1 text-slate-500">{row.reason}</p>
                  )}
                </div>
                <span className="capitalize">{row.state}</span>
              </div>
            ))}
          </Card>
        </>
      )}
    </div>
  );
}

"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import { money } from "@/lib/billing-rules";
import { Card, Field, Notice, DateText, input, button, secondary } from "./ui";
const sections = [
  ["overview", "Overview"],
  ["users", "People"],
  ["workspaces", "Businesses & referrals"],
  ["subscriptions", "Subscriptions"],
  ["orders", "Payments"],
  ["commissions", "Commissions"],
  ["withdrawals", "Withdrawals"],
  ["events", "Payment operations"],
  ["audit", "Audit trail"],
  ["settings", "Plans & settings"],
];
export default function AdminDashboard() {
  const [overview, setOverview] = useState(null),
    [section, setSection] = useState("overview"),
    [rows, setRows] = useState([]),
    [page, setPage] = useState(1),
    [total, setTotal] = useState(0),
    [query, setQuery] = useState(""),
    [search, setSearch] = useState("");
  const [error, setError] = useState(""),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false),
    [loading, setLoading] = useState(true),
    [action, setAction] = useState(null),
    [reason, setReason] = useState(""),
    [password, setPassword] = useState("");
  const [policy, setPolicy] = useState(null),
    [maintenance, setMaintenance] = useState(false),
    [plan, setPlan] = useState({
      key: "monthly",
      amount: 300000,
      effectiveAt: "",
      testPlanCode: "",
      livePlanCode: "",
    });
  const load = useCallback(async () => {
    const { data } = await api.get("/admin/billing");
    setOverview(data);
    setPolicy(data.settings.referral);
    setMaintenance(data.settings.maintenance);
    if (!["overview", "settings"].includes(section)) {
      const result = await api.get("/admin/billing", {
        params: { resource: section, page, q: search },
      });
      setRows(result.data.records);
      setTotal(result.data.total);
    }
  }, [section, page, search]);
  useEffect(() => {
    let active = true;
    const start = async () => {
      try {
        await load();
      } catch (e) {
        if (active)
          setError(
            e.response?.data?.message || "Could not load administration.",
          );
      } finally {
        if (active) setLoading(false);
      }
    };
    start();
    return () => {
      active = false;
    };
  }, [load]);
  
  const superadmin = overview?.role === "superadmin",
    finance = superadmin || overview?.role === "finance";
  function choose(value) {
    setAction(value);
    setPassword("");
    setReason("");
    setError("");
  }
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api.post("/admin/billing", { ...action, reason, password });
      setAction(null);
      setPassword("");
      setMessage("Operation recorded. Review the updated status below.");
      await load();
    } catch (e) {
      setError(
        e.response?.data?.message || "Could not complete this operation.",
      );
    } finally {
      setBusy(false);
    }
  }
  function exportRows() {
    const keys = [
      "_id",
      "name",
      "reference",
      "state",
      "status",
      "amount",
      "createdAt",
    ];
    const cell = (v) =>
      `"${String(v ?? "")
        .replace(/^[=+@-]/, "'$&")
        .replaceAll('"', '""')}"`;
    const csv = [
      keys.join(","),
      ...rows.map((row) => keys.map((key) => cell(row[key])).join(",")),
    ].join("\r\n");
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `${section}-page-${page}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white px-6 py-5">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-widest text-emerald-600">
              SMART QR ADMINISTRATION
            </p>
            <h1 className="mt-1 text-2xl font-bold">Business control centre</h1>
          </div>
          <Link href="/dashboard/billing" className={secondary}>
            Back to my account
          </Link>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl gap-6 p-4 sm:p-6 lg:grid-cols-[210px_1fr]">
        <nav
          aria-label="Administration"
          className="flex gap-2 overflow-auto lg:block"
        >
          {sections
            .filter(
              ([key]) => overview?.role !== "analyst" || key === "overview",
            )
            .filter(
              ([key]) =>
                overview?.role !== "support" ||
                ["overview", "users", "workspaces", "subscriptions"].includes(
                  key,
                ),
            )
            .map(([key, label]) => (
              <button
                key={key}
                onClick={() => {
                  setSection(key);
                  setPage(1);
                  setSearch("");
                  setQuery("");
                  setRows([]);
                  setLoading(true);
                  setError("");
                }}
                className={`mb-1 shrink-0 rounded-xl px-4 py-3 text-left text-sm font-medium lg:w-full ${section === key ? "bg-emerald-600 text-white" : "text-slate-600 hover:bg-white"}`}
              >
                {label}
              </button>
            ))}
        </nav>
        <main className="min-w-0 space-y-5">
          {error && <Notice error>{error}</Notice>}
          {message && <Notice>{message}</Notice>}
          {overview?.mode === "test" && (
            <Notice>
              Test environment. Financial totals below exclude live payments.
            </Notice>
          )}
          {loading ? (
            <Card>
              <p>Loading administration…</p>
            </Card>
          ) : (
            overview && (
              <>
                {section === "overview" && (
                  <>
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                      {[
                        ["Registered users", overview.metrics.users],
                        [
                          "Paid subscriptions",
                          overview.metrics.paidSubscriptions,
                        ],
                        ["QR codes", overview.metrics.qrCodes],
                        ["Collected payments", money(overview.metrics.gross)],
                        ["Refunds", money(overview.metrics.refunds)],
                        [
                          "Recurring monthly value",
                          money(overview.metrics.mrr),
                        ],
                        [
                          "Events needing attention",
                          overview.metrics.failedEvents,
                        ],
                        [
                          "Withdrawals to review",
                          overview.metrics.pendingWithdrawals,
                        ],
                      ].map(([label, value]) => (
                        <Card key={label}>
                          <p className="text-xs text-slate-500">{label}</p>
                          <p className="mt-3 text-2xl font-bold">{value}</p>
                        </Card>
                      ))}
                    </div>
                    <Card title="How these totals work">
                      <p className="text-sm leading-7 text-slate-500">
                        Collected payments are verified successful charges
                        before processing fees; refunds are shown separately.
                        Recurring monthly value normalizes active, automatically
                        renewing subscriptions by their billing period. It
                        excludes manual purchases, cancelled renewals,
                        complimentary access, and the other payment environment.
                        Referral commissions are separate from subscription
                        revenue.
                      </p>
                    </Card>
                  </>
                )}
                {section === "settings" && policy && (
                  <>
                    <Card title="Referral programme">
                      <div className="grid gap-4 sm:grid-cols-2">
                        {[
                          ["discountBps", "First payment discount (%)", 100],
                          ["commissionBps", "Commission (%)", 100],
                          ["holdDays", "Earnings hold (days)", 1],
                          [
                            "attributionDays",
                            "Link attribution window (days)",
                            1,
                          ],
                          ["minimumWithdrawal", "Minimum withdrawal (₦)", 100],
                        ].map(([key, label, divisor]) => (
                          <Field key={key} label={label}>
                            <input
                              className={input}
                              type="number"
                              min="0"
                              step={divisor === 100 ? "0.01" : "1"}
                              value={
                                policy[key] === null
                                  ? ""
                                  : policy[key] / divisor
                              }
                              onChange={(e) =>
                                setPolicy({
                                  ...policy,
                                  [key]:
                                    e.target.value === "" &&
                                    key === "minimumWithdrawal"
                                      ? null
                                      : Math.round(
                                          Number(e.target.value) * divisor,
                                        ),
                                })
                              }
                            />
                          </Field>
                        ))}
                      </div>
                      <label className="mt-5 flex gap-3 text-sm">
                        <input
                          type="checkbox"
                          checked={policy.renewalCommissions}
                          onChange={(e) =>
                            setPolicy({
                              ...policy,
                              renewalCommissions: e.target.checked,
                            })
                          }
                        />
                        Enable commissions on future customers’ renewals
                      </label>
                      <label className="mt-4 flex gap-3 text-sm">
                        <input
                          type="checkbox"
                          checked={maintenance}
                          onChange={(e) => setMaintenance(e.target.checked)}
                        />
                        Pause new checkouts for maintenance
                      </label>
                      <p className="mt-4 text-xs text-slate-500">
                        Changes apply to new orders. Existing commission
                        agreements keep their saved settings.
                      </p>
                      <button
                        disabled={!superadmin}
                        className={`${button} mt-5`}
                        onClick={() =>
                          choose({
                            action: "settings",
                            referral: policy,
                            maintenance,
                          })
                        }
                      >
                        Review settings change
                      </button>
                    </Card>
                    <Card title="Publish a new price version">
                      <div className="mb-6 grid gap-3 sm:grid-cols-2">
                        {overview.plans.map((item) => (
                          <div
                            key={item.key}
                            className="rounded-xl bg-slate-50 p-4 text-sm"
                          >
                            <strong>{item.label}</strong>
                            <p className="mt-1">
                              {money(item.amount)} · version {item.version}
                            </p>
                          </div>
                        ))}
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Billing period">
                          <select
                            className={input}
                            value={plan.key}
                            onChange={(e) =>
                              setPlan({ ...plan, key: e.target.value })
                            }
                          >
                            {overview.plans.map((item) => (
                              <option value={item.key} key={item.key}>
                                {item.label}
                              </option>
                            ))}
                          </select>
                        </Field>
                        <Field label="Full period price (₦)">
                          <input
                            className={input}
                            type="number"
                            min="1"
                            step="0.01"
                            value={plan.amount / 100}
                            onChange={(e) =>
                              setPlan({
                                ...plan,
                                amount: Math.round(
                                  Number(e.target.value) * 100,
                                ),
                              })
                            }
                          />
                        </Field>
                        <Field label="Effective from">
                          <input
                            className={input}
                            type="datetime-local"
                            value={plan.effectiveAt}
                            onChange={(e) =>
                              setPlan({ ...plan, effectiveAt: e.target.value })
                            }
                          />
                        </Field>
                        {[
                          ["testPlanCode", "Paystack test plan code"],
                          ["livePlanCode", "Paystack live plan code"],
                        ].map(([key, label]) => (
                          <Field label={label} key={key}>
                            <input
                              className={input}
                              placeholder="PLN_…"
                              value={plan[key]}
                              onChange={(e) =>
                                setPlan({ ...plan, [key]: e.target.value })
                              }
                            />
                          </Field>
                        ))}
                      </div>
                      <p className="mt-4 text-xs leading-6 text-slate-500">
                        Create matching new plans in Paystack first. Existing
                        subscriptions keep their original price. A blank
                        provider plan code means manual renewal only for this
                        version.
                      </p>
                      <button
                        className={`${button} mt-5`}
                        disabled={!superadmin || !plan.effectiveAt}
                        onClick={() =>
                          choose({
                            action: "plan",
                            ...plan,
                            effectiveAt: new Date(
                              plan.effectiveAt,
                            ).toISOString(),
                          })
                        }
                      >
                        Review new price version
                      </button>
                    </Card>
                  </>
                )}
                {!["overview", "settings"].includes(section) && (
                  <Card title={sections.find(([key]) => key === section)?.[1]}>
                    <form
                      className="mb-5 flex gap-2"
                      onSubmit={(e) => {
                        e.preventDefault();
                        setPage(1);
                        setSearch(query);
                      }}
                    >
                      <input
                        aria-label="Search records"
                        className={input}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={
                          section === "users"
                            ? "Search by name or email"
                            : section === "workspaces"
                              ? "Search workspace name"
                              : "Search record ID or payment reference"
                        }
                      />
                      <button className={secondary}>Search</button>
                      <button
                        type="button"
                        className={secondary}
                        onClick={exportRows}
                      >
                        Export page
                      </button>
                    </form>
                    <div className="space-y-3">
                      {!rows.length && (
                        <p className="py-10 text-center text-slate-500">
                          No records to show.
                        </p>
                      )}
                      {rows.map((row) => (
                        <article
                          key={row._id}
                          className="rounded-xl border border-slate-200 p-4"
                        >
                          <div className="flex flex-wrap justify-between gap-3">
                            <div className="min-w-0">
                              <h3 className="break-all font-semibold">
                                {row.name ||
                                  row.email ||
                                  row.reference ||
                                  row.type ||
                                  row.action ||
                                  row.plan?.label ||
                                  `Record ${String(row._id).slice(-8)}`}
                              </h3>
                              <p className="mt-1 break-all text-xs text-slate-500">
                                {row.email ||
                                  row.workspaceId ||
                                  row.ownerId ||
                                  row.resource ||
                                  row._id}
                              </p>
                              <p className="mt-2 text-xs text-slate-500">
                                <DateText value={row.createdAt} /> ·{" "}
                                {row.state ||
                                  row.status ||
                                  row.adminRole ||
                                  row.type ||
                                  "Recorded"}
                                {row.amount !== undefined &&
                                  ` · ${money(row.amount)}`}
                                {row.paidThrough && (
                                  <>
                                    {" "}
                                    · Paid until{" "}
                                    <DateText value={row.paidThrough} />
                                  </>
                                )}
                              </p>
                              {row.reason && (
                                <p className="mt-2 text-sm text-slate-600">
                                  {row.reason}
                                </p>
                              )}
                              {row.error && (
                                <p className="mt-2 text-sm text-red-700">
                                  {row.error}
                                </p>
                              )}
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                              {section === "users" && superadmin && (
                                <>
                                  <button
                                    className={secondary}
                                    onClick={() =>
                                      choose({
                                        action: "suspend",
                                        id: row._id,
                                        value: !row.suspended,
                                      })
                                    }
                                  >
                                    {row.suspended ? "Reactivate" : "Suspend"}
                                  </button>
                                  <button
                                    className={secondary}
                                    onClick={() =>
                                      choose({
                                        action: "role",
                                        id: row._id,
                                        value: row.adminRole || "none",
                                      })
                                    }
                                  >
                                    Change admin role
                                  </button>
                                </>
                              )}
                              {section === "workspaces" && superadmin && (
                                <>
                                  <button
                                    className={secondary}
                                    onClick={() =>
                                      choose({
                                        action: "complimentary",
                                        id: row._id,
                                        until: "",
                                      })
                                    }
                                  >
                                    Grant access
                                  </button>
                                  <button
                                    className={secondary}
                                    onClick={() =>
                                      choose({
                                        action: "referral-toggle",
                                        id: row._id,
                                        value: !row.referralEnabled,
                                      })
                                    }
                                  >
                                    {row.referralEnabled
                                      ? "Disable referrals"
                                      : "Enable referrals"}
                                  </button>
                                </>
                              )}
                              {section === "orders" && finance && (
                                <button
                                  className={secondary}
                                  onClick={() =>
                                    choose({
                                      action: "verify",
                                      reference: row.reference,
                                    })
                                  }
                                >
                                  Verify with Paystack
                                </button>
                              )}
                              {section === "subscriptions" && finance && (
                                <>
                                  <button
                                    className={secondary}
                                    onClick={() =>
                                      choose({
                                        action: "cancel",
                                        id: row.workspaceId,
                                      })
                                    }
                                  >
                                    Cancel renewal
                                  </button>
                                  <button
                                    className={secondary}
                                    onClick={() =>
                                      choose({
                                        action: "reconcile-subscription",
                                        id: row.workspaceId,
                                        providerCode: row.providerCode || "",
                                      })
                                    }
                                  >
                                    Reconcile provider
                                  </button>
                                </>
                              )}
                              {section === "events" &&
                                finance &&
                                row.status !== "processed" && (
                                  <button
                                    className={secondary}
                                    onClick={() =>
                                      choose({ action: "event", id: row._id })
                                    }
                                  >
                                    Retry processing
                                  </button>
                                )}
                              {section === "withdrawals" && finance && (
                                <>
                                  {row.state === "requested" ? (
                                    <>
                                      <button
                                        className={secondary}
                                        onClick={() =>
                                          choose({
                                            action: "approve-withdrawal",
                                            id: row._id,
                                            amount: row.amount,
                                          })
                                        }
                                      >
                                        Approve payout
                                      </button>
                                      <button
                                        className={secondary}
                                        onClick={() =>
                                          choose({
                                            action: "reject-withdrawal",
                                            id: row._id,
                                          })
                                        }
                                      >
                                        Reject
                                      </button>
                                    </>
                                  ) : (
                                    <button
                                      className={secondary}
                                      onClick={() =>
                                        choose({
                                          action: "reconcile-withdrawal",
                                          id: row._id,
                                        })
                                      }
                                    >
                                      Check transfer
                                    </button>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                    <div className="mt-5 flex items-center justify-between text-sm">
                      <button
                        className={secondary}
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                      >
                        Previous
                      </button>
                      <span>
                        {total} records · Page {page}
                      </span>
                      <button
                        className={secondary}
                        disabled={page * 25 >= total}
                        onClick={() => setPage(page + 1)}
                      >
                        Next
                      </button>
                    </div>
                  </Card>
                )}
              </>
            )
          )}
          {action && (
            <Card title="Review and authorize">
              <form className="space-y-4" onSubmit={submit}>
                <p className="text-sm text-slate-600">
                  {action.action.replaceAll("-", " ")}
                  {action.amount !== undefined
                    ? ` · ${money(action.amount)}`
                    : ""}
                  . This action will be added to the audit trail.
                </p>
                {action.action === "role" && (
                  <Field label="Administrator role">
                    <select
                      className={input}
                      value={action.value}
                      onChange={(e) =>
                        setAction({ ...action, value: e.target.value })
                      }
                    >
                      {[
                        "none",
                        "superadmin",
                        "finance",
                        "support",
                        "analyst",
                      ].map((role) => (
                        <option key={role}>{role}</option>
                      ))}
                    </select>
                  </Field>
                )}
                {action.action === "complimentary" && (
                  <Field label="Access expires">
                    <input
                      type="date"
                      className={input}
                      required
                      value={action.until}
                      onChange={(e) =>
                        setAction({ ...action, until: e.target.value })
                      }
                    />
                  </Field>
                )}
                {action.action === "reconcile-subscription" && (
                  <Field label="Paystack subscription code">
                    <input
                      className={input}
                      required
                      value={action.providerCode}
                      onChange={(e) =>
                        setAction({ ...action, providerCode: e.target.value })
                      }
                    />
                  </Field>
                )}
                <Field label="Reason">
                  <textarea
                    className={input}
                    required
                    minLength={5}
                    maxLength={500}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </Field>
                <Field label="Your administrator password">
                  <input
                    type="password"
                    autoComplete="current-password"
                    className={input}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Field>
                <div className="flex gap-3">
                  <button disabled={busy} className={button}>
                    {busy ? "Processing…" : "Confirm action"}
                  </button>
                  <button
                    className={secondary}
                    type="button"
                    onClick={() => setAction(null)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}

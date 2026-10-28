"use client";
import { Section, Fields, Field } from "../controls";
import MediaUploader from "../../MediaUploader";
import { Ticket, Gift, Clock } from "lucide-react";

const DURATIONS = [
  ["1 day", 1],
  ["3 days", 3],
  ["1 week", 7],
  ["2 weeks", 14],
  ["30 days", 30],
];

// <input type="datetime-local"> works in local time without a zone; the
// content stores UTC ISO strings so every visitor sees the same deadline.
function toLocalInput(iso) {
  const date = new Date(iso);
  if (!iso || isNaN(date)) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
function fromLocalInput(value) {
  const date = new Date(value);
  return value && !isNaN(date) ? date.toISOString() : "";
}
function describe(ms) {
  const total = Math.round(ms / 3600000);
  const days = Math.floor(total / 24);
  const hours = total % 24;
  return (
    [
      days && `${days} day${days === 1 ? "" : "s"}`,
      hours && `${hours} hour${hours === 1 ? "" : "s"}`,
    ]
      .filter(Boolean)
      .join(" ") || "less than an hour"
  );
}

function Validity({ value, onChange }) {
  // Older coupons only stored an end date; treat it as end of that day (UTC).
  const expiresAt =
    value.expiresAt ||
    (value.expiration ? `${value.expiration}T23:59:59.000Z` : "");
  const set = (patch) => onChange({ ...value, expiration: "", ...patch });
  const span =
    expiresAt && Date.parse(expiresAt) - Date.parse(value.startsAt || new Date());
  const inputClass =
    "h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 shadow-sm focus:border-[#20c75a] focus:outline-none focus:ring-2 focus:ring-emerald-100";
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Starts
          <input
            type="datetime-local"
            className={`mt-2 ${inputClass}`}
            value={toLocalInput(value.startsAt)}
            onChange={(e) => set({ startsAt: fromLocalInput(e.target.value) })}
          />
          <span className="mt-1 block text-xs font-normal text-slate-400">
            Leave empty to start immediately.
          </span>
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Expires
          <input
            type="datetime-local"
            className={`mt-2 ${inputClass}`}
            value={toLocalInput(expiresAt)}
            onChange={(e) => set({ expiresAt: fromLocalInput(e.target.value) })}
          />
          <span className="mt-1 block text-xs font-normal text-slate-400">
            Leave empty for no expiry.
          </span>
        </label>
      </div>
      <div>
        <p className="mb-2 text-sm font-medium text-slate-700">
          Or run it for
        </p>
        <div className="flex flex-wrap gap-2">
          {DURATIONS.map(([label, days]) => (
            <button
              key={days}
              type="button"
              onClick={() =>
                set({
                  expiresAt: new Date(
                    Date.parse(value.startsAt || new Date()) + days * 86400000,
                  ).toISOString(),
                })
              }
              className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-emerald-400 hover:text-emerald-700"
            >
              {label}
            </button>
          ))}
          {expiresAt && (
            <button
              type="button"
              onClick={() => set({ expiresAt: "" })}
              className="rounded-full px-3.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
            >
              No expiry
            </button>
          )}
        </div>
      </div>
      {expiresAt && (
        <p
          className={`flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-medium ${span > 0 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}
        >
          <Clock size={14} />
          {span > 0
            ? `Runs for ${describe(span)} — ends ${new Date(expiresAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}`
            : "The expiry is before the start, so this coupon shows as expired."}
        </p>
      )}
    </div>
  );
}

const kinds = [
  ["discount", "Discount", Ticket, "Money or percentage off"],
  ["free", "Free gift", Gift, "A free item or service"],
];

export default function Form({ value = {}, onChange }) {
  const kind = value.kind || "discount";
  return (
    <div className="space-y-4">
      <Section title="Coupon type">
        <div className="grid gap-3 sm:grid-cols-2">
          {kinds.map(([id, label, Icon, hint]) => (
            <button
              key={id}
              type="button"
              aria-pressed={kind === id}
              onClick={() =>
                onChange({
                  ...value,
                  kind: id,
                  // Pre-fill the headline for free gifts so it validates.
                  discount:
                    id === "free" && !value.discount?.trim()
                      ? "FREE"
                      : value.discount,
                })
              }
              className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                kind === id
                  ? "border-emerald-500 bg-emerald-50/60"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                <Icon size={19} />
              </span>
              <span>
                <span className="block text-sm font-semibold text-slate-800">
                  {label}
                </span>
                <span className="block text-xs text-slate-500">{hint}</span>
              </span>
            </button>
          ))}
        </div>
      </Section>
      <Section title="Offer">
        <Fields
          value={value}
          onChange={onChange}
          fields={[
            ["merchant", "Business name"],
            ["title", "Coupon title *"],
            [
              "discount",
              kind === "free" ? "Headline (e.g. FREE coffee) *" : "Discount (e.g. 20% OFF) *",
            ],
            ["code", "Coupon code"],
            ["description", "Description", "textarea"],
          ]}
        />
      </Section>
      <Section title="Offer period">
        <Validity value={value} onChange={onChange} />
      </Section>
      <Section title="Redemption">
        <Fields
          value={value}
          onChange={onChange}
          fields={[
            ["howToRedeem", "How to redeem", "textarea"],
            ["terms", "Terms & conditions", "textarea"],
            ["ctaUrl", "Online redeem URL", "url"],
            ["phone", "Phone", "tel"],
            ["address", "Store address"],
          ]}
        />
      </Section>
      <Section title="Images">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-3">
            <MediaUploader
              label="Upload logo"
              onUpload={(file) => onChange({ ...value, logo: file.url })}
            />
            <Field
              label="Logo URL"
              type="url"
              value={value.logo || ""}
              onChange={(next) => onChange({ ...value, logo: next })}
            />
          </div>
          <div className="space-y-3">
            <MediaUploader
              label="Upload offer image"
              onUpload={(file) => onChange({ ...value, cover: file.url })}
            />
            <Field
              label="Offer image URL"
              type="url"
              value={value.cover || ""}
              onChange={(next) => onChange({ ...value, cover: next })}
            />
          </div>
        </div>
      </Section>
    </div>
  );
}

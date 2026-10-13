"use client";
import { Section, Fields, Field } from "../controls";
import MediaUploader from "../../MediaUploader";
import { Ticket, Gift } from "lucide-react";

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
            ["expiration", "Expires on", "date"],
          ]}
        />
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

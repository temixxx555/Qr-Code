"use client";
import Link from "next/link";
import { SOCIAL_PLATFORMS, SITE_TEXT_FIELDS } from "@/lib/site-content";
import { Card, Field, input, button, secondary } from "./ui";

export default function SiteContentEditor({
  value,
  onChange,
  plans,
  disabled,
  onReview,
}) {
  const set = (patch) => onChange({ ...value, ...patch });
  return (
    <>
      <Card title="Social media links">
        <p className="mb-4 text-sm text-slate-500">
          Shown in the website footer. Paste the full profile link. Leave a
          field blank to hide that icon.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {SOCIAL_PLATFORMS.map(([key, label]) => (
            <Field key={key} label={label}>
              <input
                className={input}
                type="url"
                placeholder={
                  key === "whatsapp"
                    ? "https://wa.me/2348012345678"
                    : `https://${key === "x" ? "x" : key}.com/yourbrand`
                }
                value={value.socials[key]}
                onChange={(e) =>
                  set({ socials: { ...value.socials, [key]: e.target.value } })
                }
              />
            </Field>
          ))}
        </div>
      </Card>

      {Object.entries(SITE_TEXT_FIELDS).map(([group, fields]) => (
        <Card key={group} title={group}>
          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map(([key, label, max, kind]) => {
              const wide = ["textarea", "list"].includes(kind);
              return (
                <div key={key} className={wide ? "sm:col-span-2" : ""}>
                  <Field label={label}>
                    {wide ? (
                      <textarea
                        className={`${input} min-h-24`}
                        maxLength={kind === "list" ? undefined : max}
                        value={
                          kind === "list" ? value[key].join("\n") : value[key]
                        }
                        onChange={(e) =>
                          set({
                            [key]:
                              kind === "list"
                                ? e.target.value.split("\n")
                                : e.target.value,
                          })
                        }
                      />
                    ) : (
                      <input
                        className={input}
                        type={
                          kind === "url"
                            ? "url"
                            : kind === "email"
                              ? "email"
                              : "text"
                        }
                        maxLength={max}
                        value={value[key]}
                        onChange={(e) => set({ [key]: e.target.value })}
                      />
                    )}
                  </Field>
                </div>
              );
            })}
            {group === "Pricing page" && (
              <Field label="Highlighted plan">
                <select
                  className={input}
                  value={value.featuredPlan}
                  onChange={(e) => set({ featuredPlan: e.target.value })}
                >
                  {plans.map((plan) => (
                    <option key={plan.key} value={plan.key}>
                      {plan.label}
                    </option>
                  ))}
                </select>
              </Field>
            )}
          </div>
          {group === "Pricing page" && (
            <p className="mt-4 text-xs text-slate-500">
              Plan prices are managed under “Pricing & settings” so checkout
              always charges the price customers see.
            </p>
          )}
        </Card>
      ))}

      <div className="sticky bottom-4 z-10 flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur">
        <button disabled={disabled} className={button} onClick={onReview}>
          Review & publish content
        </button>
        <Link href="/pricing" target="_blank" className={secondary}>
          View pricing page
        </Link>
        {disabled && (
          <p className="text-xs text-slate-500">
            Only superadmins can publish content changes.
          </p>
        )}
      </div>
    </>
  );
}

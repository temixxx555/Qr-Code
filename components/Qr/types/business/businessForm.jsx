"use client";

import { Section, Fields, Field, ListEditor } from "../controls";
import MediaUploader from "../../MediaUploader";
import {
  Building2,
  MapPin,
  ImagePlus,
  Link2,
  Clock3,
  Phone,
} from "lucide-react";

export default function Form({ value = {}, onChange }) {
  return (
    <div className="space-y-5">
      {/* Business information */}
      <Section title="Business information">
        <div className="mb-4 flex items-start gap-3 rounded-xl bg-slate-50 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
            <Building2 size={19} />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-800">
              Business profile
            </p>

            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              Add the basic information visitors should see about your
              business.
            </p>
          </div>
        </div>

        <Fields
          value={value}
          onChange={onChange}
          fields={[
            ["name", "Business name *"],
            ["category", "Category"],
            ["description", "About", "textarea"],
          ]}
        />
      </Section>

      {/* Contact & Location */}
      <Section title="Contact & location">
        <div className="mb-4 flex items-start gap-3 rounded-xl bg-slate-50 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
            <Phone size={19} />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-800">
              Contact and location details
            </p>

            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              Help customers contact you, visit your website, or find your
              business location.
            </p>
          </div>
        </div>

        <Fields
          value={value}
          onChange={onChange}
          fields={[
            ["phone", "Phone", "tel"],
            ["email", "Email", "email"],
            ["websiteUrl", "Website", "url"],
            ["address", "Address"],
            ["mapUrl", "Map URL", "url"],
            ["ctaLabel", "Button label"],
            ["ctaUrl", "Button URL", "url"],
          ]}
        />

        {(value.address || value.mapUrl) && (
          <div className="mt-4 flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <MapPin size={17} />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-800">
                Location preview
              </p>

              {value.address && (
                <p className="mt-1 text-xs text-slate-500">
                  {value.address}
                </p>
              )}

              {value.mapUrl && (
                <p className="mt-1 truncate text-xs text-slate-400">
                  {value.mapUrl}
                </p>
              )}
            </div>
          </div>
        )}
      </Section>

      {/* Images */}
      <Section title="Images">
        <div className="space-y-6">
          {/* Logo */}
          <div>
            <div className="mb-4 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <ImagePlus size={19} />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Business logo
                </p>

                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  Upload your logo or paste a logo URL below.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-4">
              <MediaUploader
                label="Upload logo"
                onUpload={(file) =>
                  onChange({
                    ...value,
                    logo: file.url,
                  })
                }
              />
            </div>

            <div className="mt-4">
              <div className="mb-3 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200" />

                <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  or use URL
                </span>

                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <Field
                label="Logo URL"
                type="url"
                value={value.logo || ""}
                onChange={(next) =>
                  onChange({
                    ...value,
                    logo: next,
                  })
                }
                placeholder="https://example.com/logo.png"
              />
            </div>

            {value.logo && (
              <div className="mt-4 flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                  <img
                    src={value.logo}
                    alt=""
                    className="h-full w-full object-contain"
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800">
                    Current logo
                  </p>

                  <p className="truncate text-xs text-slate-500">
                    {value.logo}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-slate-200" />

          {/* Cover */}
          <div>
            <div className="mb-4">
              <p className="text-sm font-semibold text-slate-800">
                Cover image
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Add a cover image for the top of your business page.
              </p>
            </div>

            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-4">
              <MediaUploader
                label="Upload cover"
                onUpload={(file) =>
                  onChange({
                    ...value,
                    cover: file.url,
                  })
                }
              />
            </div>

            {value.cover && (
              <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                <img
                  src={value.cover}
                  alt=""
                  className="h-36 w-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* Social links */}
      <Section title="Social links">
        <div className="mb-4 flex items-start gap-3 rounded-xl bg-slate-50 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
            <Link2 size={19} />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-800">
              Social profiles
            </p>

            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              Add Instagram, Facebook, LinkedIn, X, TikTok, or other links
              customers can visit.
            </p>
          </div>
        </div>

        <ListEditor
          label="link"
          value={value.links || []}
          onChange={(links) =>
            onChange({
              ...value,
              links,
            })
          }
          fields={[
            ["label", "Label"],
            ["url", "URL", "url"],
          ]}
        />
      </Section>

      {/* Opening hours */}
      <Section title="Opening hours">
        <div className="mb-4 flex items-start gap-3 rounded-xl bg-slate-50 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
            <Clock3 size={19} />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-800">
              Business hours
            </p>

            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              Enter the opening hours for each day. You can also type
              &quot;Closed&quot; when the business is not open.
            </p>
          </div>
        </div>

        <Fields
          value={value.hours || {}}
          onChange={(hours) =>
            onChange({
              ...value,
              hours,
            })
          }
          fields={[
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ].map((day) => [
            day,
            `${day} (e.g. 09:00–18:00 or Closed)`,
          ])}
        />
      </Section>
    </div>
  );
}
"use client";

import { Section, Fields, Field, ListEditor } from "../controls";
import MediaUploader from "../../MediaUploader";
import {
  UserRound,
  ContactRound,
  MapPin,
  ImagePlus,
  Link2,
  BriefcaseBusiness,
} from "lucide-react";

export default function Form({ value = {}, onChange }) {
  return (
    <div className="space-y-5">
      {/* Identity */}
      <Section title="Identity">
        <div className="mb-4 flex items-start gap-3 rounded-xl bg-slate-50 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
            <UserRound size={19} />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-800">
              Personal information
            </p>

            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              Add the name and professional information people will see on
              your contact page.
            </p>
          </div>
        </div>

        <Fields
          value={value}
          onChange={onChange}
          fields={[
            ["firstName", "First name *"],
            ["lastName", "Last name"],
            ["headline", "Job title"],
            ["company", "Company"],
            ["description", "About", "textarea"],
          ]}
        />
      </Section>

      {/* Contact */}
      <Section title="Contact">
        <div className="mb-4 flex items-start gap-3 rounded-xl bg-slate-50 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
            <ContactRound size={19} />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-800">
              Contact details
            </p>

            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              Add the ways people can contact or find you online.
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
          ]}
        />
      </Section>

      {/* Address */}
      <Section title="Address">
        <div className="mb-4 flex items-start gap-3 rounded-xl bg-slate-50 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
            <MapPin size={19} />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-800">
              Location
            </p>

            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              Add your business or personal address information.
            </p>
          </div>
        </div>

        <Fields
          value={value}
          onChange={onChange}
          fields={[
            ["street", "Street"],
            ["city", "City"],
            ["state", "State"],
            ["postalCode", "Postal code"],
            ["country", "Country"],
          ]}
        />
      </Section>

      {/* Images */}
      <Section title="Images">
        <div className="space-y-6">
          {/* Avatar */}
          <div>
            <div className="mb-4 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <ImagePlus size={19} />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Profile image
                </p>

                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  Upload an avatar or paste an image URL.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-4">
              <MediaUploader
                label="Upload avatar"
                onUpload={(file) =>
                  onChange({
                    ...value,
                    avatar: file.url,
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
                label="Avatar URL"
                type="url"
                value={value.avatar || ""}
                onChange={(next) =>
                  onChange({
                    ...value,
                    avatar: next,
                  })
                }
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            {value.avatar && (
              <div className="mt-4 flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                  <img
                    src={value.avatar}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800">
                    Current avatar
                  </p>

                  <p className="truncate text-xs text-slate-500">
                    {value.avatar}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-slate-200" />

          {/* Cover */}
          <div>
            <div className="mb-4 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <BriefcaseBusiness size={19} />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Cover image
                </p>

                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  Upload a cover image for the top of your contact page.
                </p>
              </div>
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
                  className="h-32 w-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* Social Links */}
      <Section title="Social links">
        <div className="mb-4 flex items-start gap-3 rounded-xl bg-slate-50 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
            <Link2 size={19} />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-800">
              Add social profiles
            </p>

            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              Add LinkedIn, Instagram, X, GitHub, portfolio links, or any other
              profiles you want to share.
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
    </div>
  );
}
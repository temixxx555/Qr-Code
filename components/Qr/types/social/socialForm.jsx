"use client";

import { Section, Fields, Field, ListEditor } from "../controls";
import MediaUploader from "../../MediaUploader";
import { UserRound, ImagePlus, Share2 } from "lucide-react";

export default function Form({ value = {}, onChange }) {
  return (
    <div className="space-y-5">
      {/* Profile information */}
      <Section title="Your profile">
        <div className="mb-4 flex items-start gap-3 rounded-xl bg-slate-50 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
            <UserRound size={19} />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-800">
              Profile information
            </p>

            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              Add your display name and a short bio for your social profile
              page.
            </p>
          </div>
        </div>

        <Fields
          value={value}
          onChange={onChange}
          fields={[
            ["title", "Display name"],
            ["description", "Bio", "textarea"],
          ]}
        />

        {(value.title || value.description) && (
          <div className="mt-4 flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-50 text-emerald-600">
              {value.avatar ? (
                <img
                  src={value.avatar}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <UserRound size={18} />
              )}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800">
                {value.title || "Your profile"}
              </p>

              {value.description && (
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">
                  {value.description}
                </p>
              )}
            </div>
          </div>
        )}
      </Section>

      {/* Profile image */}
      <Section title="Images">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <ImagePlus size={19} />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-800">
                Profile image
              </p>

              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                Upload an avatar or paste an image URL below.
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

          <div>
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
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
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
      </Section>

      {/* Social links */}
      <Section title="Social links">
        <div className="mb-4 flex items-start gap-3 rounded-xl bg-slate-50 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
            <Share2 size={19} />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-800">
              Add your social profiles
            </p>

            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              Add Instagram, Facebook, LinkedIn, X, TikTok, GitHub, or any
              other profile links.
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
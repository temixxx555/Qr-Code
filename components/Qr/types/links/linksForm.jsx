"use client";

import { Section, Fields, Field, ListEditor } from "../controls";
import MediaUploader from "../../MediaUploader";
import { UserRound, ImagePlus, Link2 } from "lucide-react";

export default function Form({ value = {}, onChange }) {
  return (
    <div className="space-y-5">
      <Section title="Your page">
        <div className="mb-4 flex items-start gap-3 rounded-xl bg-slate-50 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
            <UserRound size={19} />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-800">
              Page information
            </p>

            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              Add a title and short bio that visitors will see when they open
              your page.
            </p>
          </div>
        </div>

        <Fields
          value={value}
          onChange={onChange}
          fields={[
            ["title", "Page title"],
            ["description", "Bio", "textarea"],
          ]}
        />
      </Section>

      <Section title="Profile image">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <ImagePlus size={19} />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-800">
                Add an avatar
              </p>

              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                Upload an image or paste an image URL below.
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

          <div className="relative">
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
              placeholder="https://example.com/profile.jpg"
            />
          </div>

          {value.avatar && (
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
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

      <Section title="Links">
        <div className="mb-4 flex items-start gap-3 rounded-xl bg-slate-50 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
            <Link2 size={19} />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-800">
              Add your links
            </p>

            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              Add websites, social profiles, portfolios, or any other links
              you want visitors to open.
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
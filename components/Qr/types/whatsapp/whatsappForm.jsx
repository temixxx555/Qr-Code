"use client";

import { Section, Fields, Field } from "../controls";
import MediaUploader from "../../MediaUploader";
import { MessageCircle, Phone, ImagePlus } from "lucide-react";
import Image from "next/image";

export default function Form({ value = {}, onChange }) {
  return (
    <div className="space-y-5">
      {/* Conversation details */}
      <Section title="Start a conversation">
        <div className="mb-4 flex items-start gap-3 rounded-xl bg-slate-50 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
            <MessageCircle size={19} />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-800">
              WhatsApp conversation
            </p>

            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              Add the phone number people should message and optionally include
              a pre-filled message.
            </p>
          </div>
        </div>

        <Fields
          value={value}
          onChange={onChange}
          fields={[
            ["phone", "International phone number *", "tel"],
            ["title", "Business / display name"],
            ["message", "Pre-filled message", "textarea"],
          ]}
        />

        {value.phone && (
          <div className="mt-4 flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Phone size={18} />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-800">
                Conversation preview
              </p>

              <p className="mt-1 truncate text-xs text-slate-500">
                {value.title || "WhatsApp contact"}
              </p>

              <p className="mt-1 truncate text-xs font-medium text-slate-700">
                {value.phone}
              </p>

              {value.message && (
                <div className="mt-3 max-w-full rounded-xl rounded-tl-sm bg-emerald-50 px-3 py-2">
                  <p className="break-words text-xs leading-relaxed text-slate-700">
                    {value.message}
                  </p>
                </div>
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
                Contact avatar
              </p>

              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                Upload an image or paste an image URL for the contact profile.
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
                <Image
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
    </div>
  );
}
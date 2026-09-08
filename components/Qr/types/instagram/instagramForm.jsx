"use client";

import { Section, Fields, Field } from "../controls";
import MediaUploader from "../../MediaUploader";
import {  ImagePlus } from "lucide-react";
import {  FaInstagram as Instagram  } from "react-icons/fa";
import Image from "next/image";

export default function Form({ value = {}, onChange }) {
  return (
    <div className="space-y-5">
      {/* Instagram profile */}
      <Section title="Instagram profile">
        <div className="mb-4 flex items-start gap-3 rounded-xl bg-slate-50 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-pink-600 shadow-sm">
            <Instagram size={19} />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-800">
              Instagram information
            </p>

            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              Add your Instagram username or profile URL and customize the
              profile information visitors will see.
            </p>
          </div>
        </div>

        <Fields
          value={value}
          onChange={onChange}
          fields={[
            ["username", "Username or Instagram URL *"],
            ["title", "Display name"],
            ["description", "Bio", "textarea"],
          ]}
        />

        {(value.username || value.title) && (
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-purple-500 via-pink-500 to-orange-400 text-white">
              <Instagram size={18} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800">
                {value.title || "Instagram profile"}
              </p>

              {value.username && (
                <p className="mt-0.5 truncate text-xs text-slate-500">
                  {value.username}
                </p>
              )}
            </div>
          </div>
        )}
      </Section>

      {/* Profile image */}
      <Section title="Profile image">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
              <ImagePlus size={19} />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-800">
                Add an avatar
              </p>

              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                Upload a profile picture or paste an image URL below.
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
"use client";

import { Section, Fields, Field } from "../controls";
import MediaUploader from "../../MediaUploader";
import {
  AppWindow,
  Store,
  Smartphone,
  Globe2,
  ImagePlus,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";

export default function Form({ value = {}, onChange }) {
  return (
    <div className="space-y-5">
      {/* App details */}
      <Section title="App details">
        <div className="mb-4 flex items-start gap-3 rounded-xl bg-slate-50 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
            <AppWindow size={19} />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-800">
              App information
            </p>

            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              Add your app name and a short description for the page people
              will see after scanning the QR code.
            </p>
          </div>
        </div>

        <Fields
          value={value}
          onChange={onChange}
          fields={[
            ["title", "App name"],
            ["description", "Description", "textarea"],
          ]}
        />

        {(value.title || value.description) && (
          <div className="mt-4 flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
              {value.logo ? (
                <img
                  src={value.logo}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <AppWindow size={21} className="text-slate-400" />
              )}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800">
                {value.title || "Your app"}
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

      {/* Store links */}
      <Section title="Stores">
        <div className="mb-4 flex items-start gap-3 rounded-xl bg-slate-50 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
            <Store size={19} />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-800">
              Download destinations
            </p>

            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              Add links to the stores where your app is available. You can
              also provide a website as a fallback destination.
            </p>
          </div>
        </div>

        <Fields
          value={value}
          onChange={onChange}
          fields={[
            ["iosUrl", "App Store URL", "url"],
            ["androidUrl", "Google Play URL", "url"],
            ["alternativeUrl", "Alternative store", "url"],
            ["websiteUrl", "Website / fallback", "url"],
          ]}
        />

        {(value.iosUrl ||
          value.androidUrl ||
          value.alternativeUrl ||
          value.websiteUrl) && (
          <div className="mt-5 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Connected destinations
            </p>

            {value.iosUrl && (
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-600">
                  <Smartphone size={17} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-800">
                    App Store
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {value.iosUrl}
                  </p>
                </div>

                <ExternalLink
                  size={15}
                  className="shrink-0 text-slate-400"
                />
              </div>
            )}

            {value.androidUrl && (
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-600">
                  <Smartphone size={17} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-800">
                    Google Play
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {value.androidUrl}
                  </p>
                </div>

                <ExternalLink
                  size={15}
                  className="shrink-0 text-slate-400"
                />
              </div>
            )}

            {value.alternativeUrl && (
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-600">
                  <Store size={17} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-800">
                    Alternative store
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {value.alternativeUrl}
                  </p>
                </div>

                <ExternalLink
                  size={15}
                  className="shrink-0 text-slate-400"
                />
              </div>
            )}

            {value.websiteUrl && (
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-600">
                  <Globe2 size={17} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-800">
                    Website fallback
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {value.websiteUrl}
                  </p>
                </div>

                <ExternalLink
                  size={15}
                  className="shrink-0 text-slate-400"
                />
              </div>
            )}
          </div>
        )}
      </Section>

      {/* Logo */}
      <Section title="Images">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <ImagePlus size={19} />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-800">
                App logo
              </p>

              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                Upload your app icon or paste an image URL below.
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

          <div>
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
            <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-3">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                <Image
                width={100}
                height={100}
                  src={value.logo}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-800">
                  Current app logo
                </p>

                <p className="mt-1 truncate text-xs text-slate-500">
                  {value.logo}
                </p>
              </div>
            </div>
          )}
        </div>
      </Section>
    </div>
  );
}
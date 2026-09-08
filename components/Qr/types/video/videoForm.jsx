"use client";

import { Section, Fields, Field } from "../controls";
import MediaUploader from "../../MediaUploader";
import {
  Video,
  ImagePlus,
  Upload,
  ExternalLink,
} from "lucide-react";

export default function Form({ value = {}, onChange }) {
  return (
    <div className="space-y-5">
      {/* Video information */}
      <Section title="Video">
        <div className="mb-4 flex items-start gap-3 rounded-xl bg-slate-50 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
            <Video size={19} />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-800">
              Video information
            </p>

            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              Add your video link and customize the information visitors will
              see after scanning the QR code.
            </p>
          </div>
        </div>

        <Fields
          value={value}
          onChange={onChange}
          fields={[
            ["url", "Video URL *", "url"],
            ["title", "Video title"],
            ["description", "Description", "textarea"],
            ["ctaLabel", "Button label"],
            ["ctaUrl", "Button URL", "url"],
          ]}
        />

        {(value.url || value.ctaUrl) && (
          <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <ExternalLink size={17} />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-800">
                  Link preview
                </p>

                {value.url && (
                  <p className="mt-1 truncate text-xs text-slate-500">
                    Video: {value.url}
                  </p>
                )}

                {value.ctaUrl && (
                  <p className="mt-1 truncate text-xs text-slate-500">
                    Button: {value.ctaUrl}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </Section>

      {/* Thumbnail */}
      <Section title="Thumbnail">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <ImagePlus size={19} />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-800">
                Video thumbnail
              </p>

              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                Upload a thumbnail image or paste an image URL.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-4">
            <MediaUploader
              label="Upload thumbnail"
              onUpload={(file) =>
                onChange({
                  ...value,
                  thumbnail: file.url,
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
              label="Thumbnail URL"
              type="url"
              value={value.thumbnail || ""}
              onChange={(next) =>
                onChange({
                  ...value,
                  thumbnail: next,
                })
              }
              placeholder="https://example.com/thumbnail.jpg"
            />
          </div>

          {value.thumbnail && (
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
              <img
                src={value.thumbnail}
                alt=""
                className="aspect-video w-full object-cover"
              />
            </div>
          )}
        </div>
      </Section>

      {/* Video upload */}
      <Section title="Upload">
        <div className="mb-4 flex items-start gap-3 rounded-xl bg-slate-50 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
            <Upload size={19} />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-800">
              Upload a video
            </p>

            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              Upload a video file directly instead of using an external video
              URL.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-4">
          <MediaUploader
            kind="video"
            onUpload={(file) =>
              onChange({
                ...value,
                ...file,
              })
            }
          />
        </div>
      </Section>
    </div>
  );
}
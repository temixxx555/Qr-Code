"use client";

import { Section, Fields, Field } from "../controls";
import MediaUploader from "../../MediaUploader";
import { Music2, ImagePlus, Upload, Disc3 } from "lucide-react";

export default function Form({ value = {}, onChange }) {
  return (
    <div className="space-y-5">
      {/* Track information */}
      <Section title="Track">
        <div className="mb-4 flex items-start gap-3 rounded-xl bg-slate-50 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
            <Music2 size={19} />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-800">
              Track information
            </p>

            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              Add your audio link and the information listeners will see after
              scanning the QR code.
            </p>
          </div>
        </div>

        <Fields
          value={value}
          onChange={onChange}
          fields={[
            ["url", "Audio URL *", "url"],
            ["title", "Track title"],
            ["artist", "Artist"],
            ["description", "Description", "textarea"],
          ]}
        />

        {(value.title || value.artist || value.url) && (
          <div className="mt-4 flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100">
              {value.cover ? (
                <img
                  src={value.cover}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <Disc3 size={25} className="text-slate-400" />
              )}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800">
                {value.title || "Untitled track"}
              </p>

              {value.artist && (
                <p className="mt-0.5 truncate text-xs text-slate-500">
                  {value.artist}
                </p>
              )}

              {value.url && (
                <p className="mt-1 truncate text-xs text-slate-400">
                  {value.url}
                </p>
              )}
            </div>
          </div>
        )}
      </Section>

      {/* Cover image */}
      <Section title="Cover image">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <ImagePlus size={19} />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-800">
                Track artwork
              </p>

              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                Upload artwork for your track or paste an image URL below.
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

          <div>
            <div className="mb-3 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200" />

              <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                or use URL
              </span>

              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <Field
              label="Cover URL"
              type="url"
              value={value.cover || ""}
              onChange={(next) =>
                onChange({
                  ...value,
                  cover: next,
                })
              }
              placeholder="https://example.com/cover.jpg"
            />
          </div>

          {value.cover && (
            <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-3">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                <img
                  src={value.cover}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-800">
                  Current artwork
                </p>

                <p className="mt-1 truncate text-xs text-slate-500">
                  {value.cover}
                </p>
              </div>
            </div>
          )}
        </div>
      </Section>

      {/* Audio upload */}
      <Section title="Upload">
        <div className="mb-4 flex items-start gap-3 rounded-xl bg-slate-50 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
            <Upload size={19} />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-800">
              Upload audio
            </p>

            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              Upload an audio file directly instead of using an external audio
              URL.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-4">
          <MediaUploader
            kind="audio"
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
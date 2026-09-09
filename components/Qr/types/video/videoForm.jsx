"use client";

import { Section, Field } from "../controls";
import MediaUploader from "../../MediaUploader";
import {
  Video,
  ImagePlus,
  Upload,
  ExternalLink,
  Link2,
  Play,
  CheckCircle2,
  X,
} from "lucide-react";

export default function Form({ value = {}, onChange }) {
  const update = (patch) => {
    onChange({
      ...value,
      ...patch,
    });
  };

  const hasVideo = Boolean(value.url);
  const hasThumbnail = Boolean(value.thumbnail);

  return (
    <div className="space-y-5">
      {/* VIDEO SOURCE */}
      <Section title="Video source">
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Video size={20} />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900">
                  Add your video
                </p>

                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  Upload a video directly or paste a link from another platform.
                </p>
              </div>
            </div>
          </div>

          {/* Upload */}
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-4 transition hover:border-emerald-300 hover:bg-emerald-50/30">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Upload size={17} className="text-emerald-600" />
              Upload video
            </div>

            <MediaUploader
              kind="video"
              onUpload={(file) =>
                update({
                  ...file,
                  url: file.url,
                })
              }
            />
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
              or
            </span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {/* URL */}
          <Field
            label="Video URL"
            type="url"
            value={value.url || ""}
            onChange={(next) =>
              update({
                url: next,
              })
            }
            placeholder="https://youtube.com/... or https://example.com/video.mp4"
          />

          {hasVideo && (
            <div className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50/70 p-3">
              <CheckCircle2
                size={17}
                className="mt-0.5 shrink-0 text-emerald-600"
              />

              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-emerald-800">
                  Video added
                </p>

                <p className="mt-1 truncate text-xs text-emerald-700/70">
                  {value.url}
                </p>
              </div>

              <button
                type="button"
                onClick={() => update({ url: "" })}
                className="rounded-lg p-1 text-emerald-700 transition hover:bg-emerald-100"
                aria-label="Remove video"
              >
                <X size={15} />
              </button>
            </div>
          )}
        </div>
      </Section>

      {/* CONTENT */}
      <Section title="Video details">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
              <Play size={18} />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-900">
                Customize what visitors see
              </p>

              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                Add a title and short description to make your video page clearer.
              </p>
            </div>
          </div>

          <Field
            label="Video title"
            value={value.title || ""}
            onChange={(next) => update({ title: next })}
            placeholder="e.g. Product demo"
          />

          <Field
            label="Description"
            type="textarea"
            value={value.description || ""}
            onChange={(next) => update({ description: next })}
            placeholder="Tell viewers what this video is about..."
          />
        </div>
      </Section>

      {/* THUMBNAIL */}
      <Section title="Thumbnail">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <ImagePlus size={18} />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-900">
                Cover image
              </p>

              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                Add a thumbnail so your video looks polished before it starts playing.
              </p>
            </div>
          </div>

          {hasThumbnail ? (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="relative aspect-video overflow-hidden bg-slate-100">
                <img
                  src={value.thumbnail}
                  alt="Video thumbnail"
                  className="h-full w-full object-cover"
                />

                <button
                  type="button"
                  onClick={() => update({ thumbnail: "" })}
                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition hover:bg-black/75"
                  aria-label="Remove thumbnail"
                >
                  <X size={15} />
                </button>
              </div>

              <div className="flex items-center gap-2 px-4 py-3 text-xs text-slate-500">
                <CheckCircle2 size={15} className="text-emerald-600" />
                Thumbnail added
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-4 transition hover:border-emerald-300 hover:bg-emerald-50/30">
              <MediaUploader
                label="Upload thumbnail"
                onUpload={(file) =>
                  update({
                    thumbnail: file.url,
                  })
                }
              />
            </div>
          )}

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />

            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
              or use image url
            </span>

            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <Field
            label="Thumbnail URL"
            type="url"
            value={value.thumbnail || ""}
            onChange={(next) =>
              update({
                thumbnail: next,
              })
            }
            placeholder="https://example.com/thumbnail.jpg"
          />
        </div>
      </Section>

      {/* CTA */}
      <Section title="Call to action">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <ExternalLink size={18} />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-900">
                Optional button
              </p>

              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                Add a button below the video to send viewers to another page.
              </p>
            </div>
          </div>

          <Field
            label="Button label"
            value={value.ctaLabel || ""}
            onChange={(next) =>
              update({
                ctaLabel: next,
              })
            }
            placeholder="e.g. Visit website"
          />

          <Field
            label="Button URL"
            type="url"
            value={value.ctaUrl || ""}
            onChange={(next) =>
              update({
                ctaUrl: next,
              })
            }
            placeholder="https://example.com"
          />

          {value.ctaUrl && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm">
                  <Link2 size={15} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-700">
                    Button destination
                  </p>

                  <p className="mt-0.5 truncate text-xs text-slate-500">
                    {value.ctaUrl}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Section>
    </div>
  );
}
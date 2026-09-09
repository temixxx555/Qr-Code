"use client";

import { Section, Field } from "../controls";
import MediaUploader from "../../MediaUploader";
import {
  Music2,
  ImagePlus,
  Upload,
  Disc3,
  CheckCircle2,
  X,
  Link2,
  Headphones,
} from "lucide-react";

export default function Form({ value = {}, onChange }) {
  const update = (patch) => {
    onChange({
      ...value,
      ...patch,
    });
  };

  const hasAudio = Boolean(value.url);
  const hasCover = Boolean(value.cover);

  return (
    <div className="space-y-5">
      {/* AUDIO SOURCE */}
      <Section title="Audio source">
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Headphones size={20} />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900">
                  Add your audio
                </p>

                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  Upload an audio file directly or paste a link to an existing
                  track.
                </p>
              </div>
            </div>
          </div>

          {/* Upload audio */}
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-4 transition hover:border-emerald-300 hover:bg-emerald-50/30">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Upload size={17} className="text-emerald-600" />
              Upload audio
            </div>

            <MediaUploader
              kind="audio"
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

          {/* Audio URL */}
          <Field
            label="Audio URL"
            type="url"
            value={value.url || ""}
            onChange={(next) =>
              update({
                url: next,
              })
            }
            placeholder="https://example.com/audio.mp3"
          />

          {hasAudio && (
            <div className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50/70 p-3">
              <CheckCircle2
                size={17}
                className="mt-0.5 shrink-0 text-emerald-600"
              />

              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-emerald-800">
                  Audio added
                </p>

                <p className="mt-1 truncate text-xs text-emerald-700/70">
                  {value.filename || value.url}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  update({
                    url: "",
                    filename: "",
                    size: undefined,
                    mimeType: "",
                  })
                }
                className="rounded-lg p-1 text-emerald-700 transition hover:bg-emerald-100"
                aria-label="Remove audio"
              >
                <X size={15} />
              </button>
            </div>
          )}
        </div>
      </Section>

      {/* TRACK DETAILS */}
      <Section title="Track details">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
              <Music2 size={18} />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-900">
                Track information
              </p>

              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                Add the title, artist name, and a short description listeners
                will see after scanning.
              </p>
            </div>
          </div>

          <Field
            label="Track title"
            value={value.title || ""}
            onChange={(next) =>
              update({
                title: next,
              })
            }
            placeholder="e.g. Midnight Drive"
          />

          <Field
            label="Artist"
            value={value.artist || ""}
            onChange={(next) =>
              update({
                artist: next,
              })
            }
            placeholder="e.g. Liberty"
          />

          <Field
            label="Description"
            type="textarea"
            value={value.description || ""}
            onChange={(next) =>
              update({
                description: next,
              })
            }
            placeholder="Tell listeners a little about this track..."
          />
        </div>
      </Section>

      {/* COVER ART */}
      <Section title="Cover artwork">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <ImagePlus size={18} />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-900">
                Track artwork
              </p>

              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                Add a cover image so your audio page feels more polished.
              </p>
            </div>
          </div>

          {hasCover ? (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="relative aspect-square max-h-[260px] w-full overflow-hidden bg-slate-100">
                <img
                  src={value.cover}
                  alt="Track cover"
                  className="h-full w-full object-cover"
                />

                <button
                  type="button"
                  onClick={() =>
                    update({
                      cover: "",
                    })
                  }
                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition hover:bg-black/75"
                  aria-label="Remove cover"
                >
                  <X size={15} />
                </button>
              </div>

              <div className="flex items-center gap-2 px-4 py-3 text-xs text-slate-500">
                <CheckCircle2
                  size={15}
                  className="text-emerald-600"
                />
                Cover artwork added
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-4 transition hover:border-emerald-300 hover:bg-emerald-50/30">
              <MediaUploader
                label="Upload cover"
                onUpload={(file) =>
                  update({
                    cover: file.url,
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
            label="Cover URL"
            type="url"
            value={value.cover || ""}
            onChange={(next) =>
              update({
                cover: next,
              })
            }
            placeholder="https://example.com/cover.jpg"
          />
        </div>
      </Section>

      {/* TRACK PREVIEW */}
      {(value.title ||
        value.artist ||
        value.url ||
        value.cover) && (
        <Section title="Preview">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200">
                {value.cover ? (
                  <img
                    src={value.cover}
                    alt="Track artwork"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Disc3
                    size={30}
                    className="text-slate-400"
                  />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <Music2
                    size={13}
                    className="shrink-0 text-emerald-600"
                  />

                  <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-emerald-600">
                    Audio
                  </span>
                </div>

                <p className="truncate text-sm font-semibold text-slate-900">
                  {value.title || "Untitled track"}
                </p>

                <p className="mt-0.5 truncate text-xs text-slate-500">
                  {value.artist || "Unknown artist"}
                </p>

                {value.filename && (
                  <div className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-400">
                    <Link2 size={11} />

                    <span className="truncate">
                      {value.filename}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {value.description && (
              <p className="mt-4 line-clamp-3 border-t border-slate-100 pt-3 text-xs leading-5 text-slate-500">
                {value.description}
              </p>
            )}
          </div>
        </Section>
      )}
    </div>
  );
}
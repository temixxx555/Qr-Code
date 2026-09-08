"use client";

import { Section, Fields, ListEditor } from "../controls";
import MediaUploader from "../../MediaUploader";
import { Images, ImagePlus } from "lucide-react";

export default function Form({ value = {}, onChange }) {
  return (
    <div className="space-y-5">
      {/* Gallery information */}
      <Section title="Gallery">
        <div className="mb-4 flex items-start gap-3 rounded-xl bg-slate-50 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
            <Images size={19} />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-800">
              Gallery information
            </p>

            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              Add a title and description for the image gallery people will
              see after scanning your QR code.
            </p>
          </div>
        </div>

        <Fields
          value={value}
          onChange={onChange}
          fields={[
            ["title", "Gallery title"],
            ["description", "Description", "textarea"],
          ]}
        />
      </Section>

      {/* Images */}
      <Section title="Images">
        <div className="space-y-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <ImagePlus size={19} />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-800">
                Add gallery images
              </p>

              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                Upload images to your gallery, then add captions or change
                their order below.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-4">
            <MediaUploader
              label="Add image"
              onUpload={(file) =>
                onChange({
                  ...value,
                  images: [
                    ...(value.images || []),
                    {
                      ...file,
                      caption: "",
                    },
                  ],
                })
              }
            />
          </div>

          {value.images?.length > 0 && (
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Gallery images
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {value.images.length}{" "}
                    {value.images.length === 1 ? "image" : "images"} added
                  </p>
                </div>

                <span className="flex h-8 min-w-8 items-center justify-center rounded-lg bg-emerald-50 px-2 text-xs font-semibold text-emerald-700">
                  {value.images.length}
                </span>
              </div>

              {/* Visual preview only */}
              <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {value.images.slice(0, 6).map((image, index) => (
                  <div
                    key={index}
                    className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
                  >
                    {image.url ? (
                      <img
                        src={image.url}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-300">
                        <Images size={24} />
                      </div>
                    )}

                    <div className="absolute left-2 top-2 flex h-6 min-w-6 items-center justify-center rounded-md bg-black/60 px-1.5 text-[10px] font-semibold text-white">
                      {index + 1}
                    </div>

                    {image.caption && (
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-2 pb-2 pt-6">
                        <p className="truncate text-xs font-medium text-white">
                          {image.caption}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {value.images.length > 6 && (
                <p className="mb-4 text-xs text-slate-500">
                  + {value.images.length - 6} more{" "}
                  {value.images.length - 6 === 1 ? "image" : "images"}
                </p>
              )}

              <ListEditor
                label="image"
                value={value.images || []}
                onChange={(images) =>
                  onChange({
                    ...value,
                    images,
                  })
                }
                fields={[
                  ["url", "Image URL", "url"],
                  ["caption", "Caption"],
                ]}
              />
            </div>
          )}

          {!value.images?.length && (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm">
                <Images size={20} />
              </div>

              <p className="mt-3 text-sm font-medium text-slate-700">
                No images added yet
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Upload your first image above to start building the gallery.
              </p>
            </div>
          )}
        </div>
      </Section>
    </div>
  );
}
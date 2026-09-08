"use client";

import { Section, Fields, Field, ListEditor } from "../controls";
import MediaUploader from "../../MediaUploader";
import {
  UtensilsCrossed,
  FileText,
  Link2,
  Store,
  ImagePlus,
  Layers3,
  Plus,
  ArrowUp,
  Trash2,
} from "lucide-react";

export default function MenuForm({ value, onChange }) {
  const categories = value.categories || [];

  const update = (index, next) =>
    onChange({
      ...value,
      categories: categories.map((cat, i) => (i === index ? next : cat)),
    });

  return (
    <div className="space-y-5">
      {/* Menu format */}
      <Section title="Menu format">
        <div className="mb-4 flex items-start gap-3 rounded-xl bg-slate-50 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
            <UtensilsCrossed size={19} />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-800">
              Choose how your menu works
            </p>

            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              Create a digital menu, upload a PDF menu, or link to an existing
              menu online.
            </p>
          </div>
        </div>

        <label className="block text-sm font-medium text-slate-700">
          Choose your menu

          <select
            className="mt-2 block h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 shadow-sm transition hover:border-slate-300 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            value={value.mode || "digital"}
            onChange={(e) =>
              onChange({
                ...value,
                mode: e.target.value,
              })
            }
          >
            <option value="digital">Digital menu</option>
            <option value="pdf">PDF menu</option>
            <option value="url">External menu URL</option>
          </select>
        </label>
      </Section>

      {/* PDF / URL menu */}
      {["pdf", "url"].includes(value.mode) ? (
        <Section title="Menu source">
          <div className="mb-4 flex items-start gap-3 rounded-xl bg-slate-50 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
              {value.mode === "pdf" ? (
                <FileText size={19} />
              ) : (
                <Link2 size={19} />
              )}
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-800">
                {value.mode === "pdf"
                  ? "PDF menu"
                  : "External menu"}
              </p>

              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {value.mode === "pdf"
                  ? "Paste the URL of your PDF menu or upload a PDF file below."
                  : "Paste the link to the menu you want customers to open."}
              </p>
            </div>
          </div>

          <Field
            label="Menu URL *"
            type="url"
            value={value.url}
            onChange={(url) =>
              onChange({
                ...value,
                url,
              })
            }
            placeholder="https://example.com/menu"
          />

          {value.mode === "pdf" && (
            <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-4">
              <MediaUploader
                kind="pdf"
                onUpload={(file) =>
                  onChange({
                    ...value,
                    ...file,
                  })
                }
              />
            </div>
          )}
        </Section>
      ) : (
        <>
          {/* Restaurant */}
          <Section title="Restaurant">
            <div className="mb-4 flex items-start gap-3 rounded-xl bg-slate-50 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                <Store size={19} />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Restaurant information
                </p>

                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  Add the restaurant details customers will see at the top of
                  your digital menu.
                </p>
              </div>
            </div>

            <Fields
              value={value}
              onChange={onChange}
              fields={[
                ["name", "Restaurant name *"],
                ["description", "Description", "textarea"],
                ["currency", "Currency (e.g. NGN)"],
                ["phone", "Phone", "tel"],
                ["address", "Address"],
              ]}
            />

            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <ImagePlus size={17} className="text-emerald-600" />

                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Restaurant cover
                    </p>
                    <p className="text-xs text-slate-500">
                      Upload a wide cover image.
                    </p>
                  </div>
                </div>

                <MediaUploader
                  label="Restaurant cover"
                  onUpload={(file) =>
                    onChange({
                      ...value,
                      cover: file.url,
                    })
                  }
                />
              </div>

              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <ImagePlus size={17} className="text-emerald-600" />

                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Restaurant logo
                    </p>
                    <p className="text-xs text-slate-500">
                      Upload your restaurant logo.
                    </p>
                  </div>
                </div>

                <MediaUploader
                  label="Restaurant logo"
                  onUpload={(file) =>
                    onChange({
                      ...value,
                      logo: file.url,
                    })
                  }
                />
              </div>
            </div>

            {(value.cover || value.logo) && (
              <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
                {value.cover && (
                  <div className="h-32 overflow-hidden bg-slate-100">
                    <img
                      src={value.cover}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}

                {value.logo && (
                  <div className="flex items-center gap-3 p-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white">
                      <img
                        src={value.logo}
                        alt=""
                        className="h-full w-full object-contain"
                      />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        Current logo
                      </p>

                      <p className="text-xs text-slate-500">
                        This image will be shown with your restaurant menu.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Section>

          {/* Categories */}
          {categories.map((category, index) => (
            <Section key={index} title={`Category ${index + 1}`}>
              <div className="mb-4 flex items-start justify-between gap-4 rounded-xl bg-slate-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                    <Layers3 size={19} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {category.name || `Category ${index + 1}`}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {(category.items || []).length}{" "}
                      {(category.items || []).length === 1
                        ? "dish"
                        : "dishes"}
                    </p>
                  </div>
                </div>

                <span className="flex h-8 min-w-8 items-center justify-center rounded-lg bg-white px-2 text-xs font-semibold text-slate-500 shadow-sm">
                  {index + 1}
                </span>
              </div>

              <Field
                label="Category name *"
                value={category.name}
                onChange={(name) =>
                  update(index, {
                    ...category,
                    name,
                  })
                }
              />

              <div className="mt-5">
                <ListEditor
                  label="dish"
                  value={category.items || []}
                  onChange={(items) =>
                    update(index, {
                      ...category,
                      items,
                    })
                  }
                  defaults={{ available: true }}
                  fields={[
                    ["name", "Dish name *"],
                    ["price", "Price *", "number"],
                    ["description", "Description"],
                    ["image", "Image URL", "url"],
                    ["tags", "Dietary tags"],
                  ]}
                />
              </div>

              {(category.items || []).length > 0 && (
                <div className="mt-5 space-y-2 border-t border-slate-200 pt-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Availability
                  </p>

                  {(category.items || []).map((item, i) => (
                    <label
                      key={i}
                      className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-3 transition hover:border-slate-300"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-800">
                          {item.name || `Dish ${i + 1}`}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-500">
                          {item.available !== false
                            ? "Available to customers"
                            : "Currently unavailable"}
                        </p>
                      </div>

                      <input
                        type="checkbox"
                        checked={item.available !== false}
                        onChange={(e) =>
                          update(index, {
                            ...category,
                            items: category.items.map((v, n) =>
                              n === i
                                ? {
                                    ...v,
                                    available: e.target.checked,
                                  }
                                : v,
                            ),
                          })
                        }
                        className="h-4 w-4 shrink-0 accent-emerald-600"
                      />
                    </label>
                  ))}
                </div>
              )}

              <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-200 pt-4">
                <button
                  type="button"
                  disabled={!index}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  onClick={() => {
                    const next = [...categories];

                    [next[index - 1], next[index]] = [
                      next[index],
                      next[index - 1],
                    ];

                    onChange({
                      ...value,
                      categories: next,
                    });
                  }}
                >
                  <ArrowUp size={14} />
                  Move up
                </button>

                <button
                  type="button"
                  className="ml-auto inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50"
                  onClick={() =>
                    onChange({
                      ...value,
                      categories: categories.filter(
                        (_, i) => i !== index,
                      ),
                    })
                  }
                >
                  <Trash2 size={14} />
                  Remove category
                </button>
              </div>
            </Section>
          ))}

          {/* Add category */}
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-emerald-400 bg-emerald-50/40 px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:border-emerald-500 hover:bg-emerald-50"
            onClick={() =>
              onChange({
                ...value,
                categories: [
                  ...categories,
                  {
                    name: "",
                    items: [],
                  },
                ],
              })
            }
          >
            <Plus size={17} />
            Add category
          </button>
        </>
      )}
    </div>
  );
}
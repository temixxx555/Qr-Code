"use client";

import { useId } from "react";

export function Section({ title, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-4">
        <h2 className="text-base font-semibold text-slate-900">{title}</h2>
      </div>

      <div className="space-y-4 p-5">
        {children}
      </div>
    </section>
  );
}

export function Field({
  label,
  value = "",
  onChange,
  type = "text",
  ...props
}) {
  const id = useId();

  const baseClassName =
    "w-full rounded-xl border border-slate-200 bg-white text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 hover:border-slate-300 focus:border-[#20c75a] focus:outline-none focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500";

  return (
    <div className="min-w-0">
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-slate-700"
      >
        {label}
      </label>

      {type === "textarea" ? (
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${baseClassName} min-h-11 h-11 resize-y px-3.5 py-3 leading-relaxed`}
          {...props}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${baseClassName} h-11 px-3.5`}
          {...props}
        />
      )}
    </div>
  );
}

export function Fields({ value, onChange, fields }) {
  return (
    <div className="grid min-w-0 gap-4 sm:grid-cols-2">
      {fields.map(([key, label, type]) => (
        <Field
          key={key}
          label={label}
          type={type}
          value={value[key] || ""}
          onChange={(next) =>
            onChange({
              ...value,
              [key]: next,
            })
          }
        />
      ))}
    </div>
  );
}

export function ListEditor({
  value = [],
  onChange,
  fields,
  label = "item",
  defaults = {},
}) {
  return (
    <div className="space-y-4">
      {value.map((item, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/70"
        >
          <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-slate-800">
                {label.charAt(0).toUpperCase() + label.slice(1)} {index + 1}
              </p>

              <p className="mt-0.5 text-xs text-slate-400">
                Edit or reorder this {label}
              </p>
            </div>

            <span className="flex h-7 min-w-7 items-center justify-center rounded-lg bg-slate-100 px-2 text-xs font-semibold text-slate-500">
              {index + 1}
            </span>
          </div>

          <div className="space-y-4 p-4">
            <Fields
              fields={fields}
              value={item}
              onChange={(next) =>
                onChange(
                  value.map((v, i) =>
                    i === index ? next : v,
                  ),
                )
              }
            />

            <div className="flex flex-wrap items-center gap-2 border-t border-slate-200 pt-3">
              <button
                type="button"
                disabled={index === 0}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                onClick={() => {
                  const next = [...value];

                  [next[index - 1], next[index]] = [
                    next[index],
                    next[index - 1],
                  ];

                  onChange(next);
                }}
              >
                ↑ Move up
              </button>

              <button
                type="button"
                disabled={index === value.length - 1}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                onClick={() => {
                  const next = [...value];

                  [next[index + 1], next[index]] = [
                    next[index],
                    next[index + 1],
                  ];

                  onChange(next);
                }}
              >
                ↓ Move down
              </button>

              <button
                type="button"
                className="ml-auto rounded-lg px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50"
                onClick={() =>
                  onChange(
                    value.filter((_, i) => i !== index),
                  )
                }
              >
                Remove {label}
              </button>
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        className="flex w-full items-center justify-center rounded-xl border border-dashed border-emerald-400 bg-emerald-50/40 px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:border-emerald-500 hover:bg-emerald-50"
        onClick={() =>
          onChange([
            ...value,
            { ...defaults },
          ])
        }
      >
        + Add {label}
      </button>
    </div>
  );
}
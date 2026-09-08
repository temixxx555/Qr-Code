"use client";
import { useId } from "react";
export function Section({ title, children }) {
  return (
    <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="font-semibold text-slate-900">{title}</h2>
      {children}
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
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium text-slate-700"
      >
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-24 w-full rounded-xl border border-slate-200 p-3 text-sm focus:outline-emerald-500"
          {...props}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm focus:outline-emerald-500"
          {...props}
        />
      )}
    </div>
  );
}
export function Fields({ value, onChange, fields }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {fields.map(([key, label, type]) => (
        <Field
          key={key}
          label={label}
          type={type}
          value={value[key] || ""}
          onChange={(next) => onChange({ ...value, [key]: next })}
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
    <div className="space-y-3">
      {value.map((item, index) => (
        <div
          key={index}
          className="space-y-3 rounded-xl border bg-slate-50 p-3"
        >
          <Fields
            fields={fields}
            value={item}
            onChange={(next) =>
              onChange(value.map((v, i) => (i === index ? next : v)))
            }
          />
          <div className="flex gap-3 text-xs">
            <button
              type="button"
              disabled={index === 0}
              className="disabled:opacity-30"
              onClick={() => {
                const next = [...value];
                [next[index - 1], next[index]] = [next[index], next[index - 1]];
                onChange(next);
              }}
            >
              Move up
            </button>
            <button
              type="button"
              disabled={index === value.length - 1}
              className="disabled:opacity-30"
              onClick={() => {
                const next = [...value];
                [next[index + 1], next[index]] = [next[index], next[index + 1]];
                onChange(next);
              }}
            >
              Move down
            </button>
            <button
              type="button"
              className="text-red-600"
              onClick={() => onChange(value.filter((_, i) => i !== index))}
            >
              Remove {label}
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        className="rounded-lg border border-dashed border-emerald-400 px-4 py-2 text-sm font-semibold text-emerald-700"
        onClick={() => onChange([...value, { ...defaults }])}
      >
        + Add {label}
      </button>
    </div>
  );
}

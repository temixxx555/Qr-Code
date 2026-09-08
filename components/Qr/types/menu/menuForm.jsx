"use client";
import { Section, Fields, Field, ListEditor } from "../controls";
import MediaUploader from "../../MediaUploader";
export default function MenuForm({ value, onChange }) {
  const categories = value.categories || [];
  const update = (index, next) =>
    onChange({
      ...value,
      categories: categories.map((cat, i) => (i === index ? next : cat)),
    });
  return (
    <div className="space-y-4">
      <Section title="Menu format">
        <label className="text-sm">
          Choose your menu
          <select
            className="mt-2 block w-full rounded-xl border p-3"
            value={value.mode || "digital"}
            onChange={(e) => onChange({ ...value, mode: e.target.value })}
          >
            <option value="digital">Digital menu</option>
            <option value="pdf">PDF menu</option>
            <option value="url">External menu URL</option>
          </select>
        </label>
      </Section>
      {["pdf", "url"].includes(value.mode) ? (
        <Section title="Menu source">
          <Field
            label="Menu URL *"
            type="url"
            value={value.url}
            onChange={(url) => onChange({ ...value, url })}
          />
          {value.mode === "pdf" && (
            <MediaUploader
              kind="pdf"
              onUpload={(file) => onChange({ ...value, ...file })}
            />
          )}
        </Section>
      ) : (
        <>
          <Section title="Restaurant">
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
            <MediaUploader
              label="Restaurant cover"
              onUpload={(file) => onChange({ ...value, cover: file.url })}
            />
            <MediaUploader
              label="Restaurant logo"
              onUpload={(file) => onChange({ ...value, logo: file.url })}
            />
          </Section>
          {categories.map((category, index) => (
            <Section key={index} title={`Category ${index + 1}`}>
              <Field
                label="Category name *"
                value={category.name}
                onChange={(name) => update(index, { ...category, name })}
              />
              <ListEditor
                label="dish"
                value={category.items || []}
                onChange={(items) => update(index, { ...category, items })}
                defaults={{ available: true }}
                fields={[
                  ["name", "Dish name *"],
                  ["price", "Price *", "number"],
                  ["description", "Description"],
                  ["image", "Image URL", "url"],
                  ["tags", "Dietary tags"],
                ]}
              />
              {(category.items || []).map((item, i) => (
                <label key={i} className="flex gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={item.available !== false}
                    onChange={(e) =>
                      update(index, {
                        ...category,
                        items: category.items.map((v, n) =>
                          n === i ? { ...v, available: e.target.checked } : v,
                        ),
                      })
                    }
                  />
                  {item.name || `Dish ${i + 1}`} available
                </label>
              ))}
              <div className="flex gap-4 text-sm">
                <button
                  disabled={!index}
                  onClick={() => {
                    const next = [...categories];
                    [next[index - 1], next[index]] = [
                      next[index],
                      next[index - 1],
                    ];
                    onChange({ ...value, categories: next });
                  }}
                >
                  Move up
                </button>
                <button
                  className="text-red-600"
                  onClick={() =>
                    onChange({
                      ...value,
                      categories: categories.filter((_, i) => i !== index),
                    })
                  }
                >
                  Remove category
                </button>
              </div>
            </Section>
          ))}
          <button
            className="action"
            onClick={() =>
              onChange({
                ...value,
                categories: [...categories, { name: "", items: [] }],
              })
            }
          >
            + Add category
          </button>
        </>
      )}
    </div>
  );
}

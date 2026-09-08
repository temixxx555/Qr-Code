"use client";
import { Section, Fields, Field, ListEditor } from "../controls";
import MediaUploader from "../../MediaUploader";
export default function Form({ value = {}, onChange }) {
  return (
    <div className="space-y-4">
      <Section title="Gallery">
        <Fields
          value={value}
          onChange={onChange}
          fields={[
            ["title", "Gallery title"],
            ["description", "Description", "textarea"],
          ]}
        />
      </Section>
      <Section title="Images">
        <MediaUploader
          label="Add image"
          onUpload={(file) =>
            onChange({
              ...value,
              images: [...(value.images || []), { ...file, caption: "" }],
            })
          }
        />
        <ListEditor
          label="image"
          value={value.images || []}
          onChange={(images) => onChange({ ...value, images })}
          fields={[
            ["url", "Image URL", "url"],
            ["caption", "Caption"],
          ]}
        />
      </Section>
    </div>
  );
}

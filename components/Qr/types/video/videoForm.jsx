"use client";
import { Section, Fields, Field, ListEditor } from "../controls";
import MediaUploader from "../../MediaUploader";
export default function Form({ value = {}, onChange }) {
  return (
    <div className="space-y-4">
      <Section title="Video">
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
      </Section>
      <Section title="Images">
        <MediaUploader
          label="Upload thumbnail"
          onUpload={(file) => onChange({ ...value, thumbnail: file.url })}
        />
        <Field
          label="thumbnail URL"
          type="url"
          value={value.thumbnail || ""}
          onChange={(next) => onChange({ ...value, thumbnail: next })}
        />
      </Section>
      <Section title="Upload">
        <MediaUploader
          kind="video"
          onUpload={(file) => onChange({ ...value, ...file })}
        />
      </Section>
    </div>
  );
}

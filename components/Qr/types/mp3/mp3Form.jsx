"use client";
import { Section, Fields, Field, ListEditor } from "../controls";
import MediaUploader from "../../MediaUploader";
export default function Form({ value = {}, onChange }) {
  return (
    <div className="space-y-4">
      <Section title="Track">
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
      </Section>
      <Section title="Images">
        <MediaUploader
          label="Upload cover"
          onUpload={(file) => onChange({ ...value, cover: file.url })}
        />
        <Field
          label="cover URL"
          type="url"
          value={value.cover || ""}
          onChange={(next) => onChange({ ...value, cover: next })}
        />
      </Section>
      <Section title="Upload">
        <MediaUploader
          kind="audio"
          onUpload={(file) => onChange({ ...value, ...file })}
        />
      </Section>
    </div>
  );
}

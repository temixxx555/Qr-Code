"use client";
import { Section, Fields, Field, ListEditor } from "../controls";
import MediaUploader from "../../MediaUploader";
export default function Form({ value = {}, onChange }) {
  return (
    <div className="space-y-4">
      <Section title="Your page">
        <Fields
          value={value}
          onChange={onChange}
          fields={[
            ["title", "Page title"],
            ["description", "Bio", "textarea"],
          ]}
        />
      </Section>
      <Section title="Images">
        <MediaUploader
          label="Upload avatar"
          onUpload={(file) => onChange({ ...value, avatar: file.url })}
        />
        <Field
          label="avatar URL"
          type="url"
          value={value.avatar || ""}
          onChange={(next) => onChange({ ...value, avatar: next })}
        />
      </Section>
      <Section title="Links">
        <ListEditor
          label="link"
          value={value.links || []}
          onChange={(links) => onChange({ ...value, links })}
          fields={[
            ["label", "Label"],
            ["url", "URL", "url"],
          ]}
        />
      </Section>
    </div>
  );
}

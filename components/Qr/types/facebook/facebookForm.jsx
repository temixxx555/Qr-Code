"use client";
import { Section, Fields, Field, ListEditor } from "../controls";
import MediaUploader from "../../MediaUploader";
export default function Form({ value = {}, onChange }) {
  return (
    <div className="space-y-4">
      <Section title="Facebook profile">
        <Fields
          value={value}
          onChange={onChange}
          fields={[
            ["url", "Facebook URL *", "url"],
            ["title", "Display name"],
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
        <MediaUploader
          label="Upload cover"
          onUpload={(file) => onChange({ ...value, cover: file.url })}
        />
      </Section>
    </div>
  );
}

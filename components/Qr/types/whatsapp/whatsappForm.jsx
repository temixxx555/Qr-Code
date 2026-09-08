"use client";
import { Section, Fields, Field, ListEditor } from "../controls";
import MediaUploader from "../../MediaUploader";
export default function Form({ value = {}, onChange }) {
  return (
    <div className="space-y-4">
      <Section title="Start a conversation">
        <Fields
          value={value}
          onChange={onChange}
          fields={[
            ["phone", "International phone number *", "tel"],
            ["title", "Business / display name"],
            ["message", "Pre-filled message", "textarea"],
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
    </div>
  );
}

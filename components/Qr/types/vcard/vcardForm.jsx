"use client";
import { Section, Fields, Field, ListEditor } from "../controls";
import MediaUploader from "../../MediaUploader";
export default function Form({ value = {}, onChange }) {
  return (
    <div className="space-y-4">
      <Section title="Identity">
        <Fields
          value={value}
          onChange={onChange}
          fields={[
            ["firstName", "First name *"],
            ["lastName", "Last name"],
            ["headline", "Job title"],
            ["company", "Company"],
            ["description", "About", "textarea"],
          ]}
        />
      </Section>
      <Section title="Contact">
        <Fields
          value={value}
          onChange={onChange}
          fields={[
            ["phone", "Phone", "tel"],
            ["email", "Email", "email"],
            ["websiteUrl", "Website", "url"],
          ]}
        />
      </Section>
      <Section title="Address">
        <Fields
          value={value}
          onChange={onChange}
          fields={[
            ["street", "Street"],
            ["city", "City"],
            ["state", "State"],
            ["postalCode", "Postal code"],
            ["country", "Country"],
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
      <Section title="Social links">
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

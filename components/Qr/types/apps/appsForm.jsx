"use client";
import { Section, Fields, Field, ListEditor } from "../controls";
import MediaUploader from "../../MediaUploader";
export default function Form({ value = {}, onChange }) {
  return (
    <div className="space-y-4">
      <Section title="App details">
        <Fields
          value={value}
          onChange={onChange}
          fields={[
            ["title", "App name"],
            ["description", "Description", "textarea"],
          ]}
        />
      </Section>
      <Section title="Stores">
        <Fields
          value={value}
          onChange={onChange}
          fields={[
            ["iosUrl", "App Store URL", "url"],
            ["androidUrl", "Google Play URL", "url"],
            ["alternativeUrl", "Alternative store", "url"],
            ["websiteUrl", "Website / fallback", "url"],
          ]}
        />
      </Section>
      <Section title="Images">
        <MediaUploader
          label="Upload logo"
          onUpload={(file) => onChange({ ...value, logo: file.url })}
        />
        <Field
          label="logo URL"
          type="url"
          value={value.logo || ""}
          onChange={(next) => onChange({ ...value, logo: next })}
        />
      </Section>
    </div>
  );
}

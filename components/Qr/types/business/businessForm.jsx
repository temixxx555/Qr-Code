"use client";
import { Section, Fields, Field, ListEditor } from "../controls";
import MediaUploader from "../../MediaUploader";
export default function Form({ value = {}, onChange }) {
  return (
    <div className="space-y-4">
      <Section title="Business information">
        <Fields
          value={value}
          onChange={onChange}
          fields={[
            ["name", "Business name *"],
            ["category", "Category"],
            ["description", "About", "textarea"],
          ]}
        />
      </Section>
      <Section title="Contact & location">
        <Fields
          value={value}
          onChange={onChange}
          fields={[
            ["phone", "Phone", "tel"],
            ["email", "Email", "email"],
            ["websiteUrl", "Website", "url"],
            ["address", "Address"],
            ["mapUrl", "Map URL", "url"],
            ["ctaLabel", "Button label"],
            ["ctaUrl", "Button URL", "url"],
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
      <Section title="Opening hours">
        <Fields
          value={value.hours || {}}
          onChange={(hours) => onChange({ ...value, hours })}
          fields={[
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ].map((day) => [day, day + " (e.g. 09:00–18:00 or Closed)"])}
        />
      </Section>
    </div>
  );
}

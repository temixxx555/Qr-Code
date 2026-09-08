"use client";
import { Section, Fields, Field, ListEditor } from "../controls";
import MediaUploader from "../../MediaUploader";
export default function Form({ value = {}, onChange }) {
  return (
    <div className="space-y-4">
      <Section title="Offer">
        <Fields
          value={value}
          onChange={onChange}
          fields={[
            ["merchant", "Merchant"],
            ["title", "Coupon title *"],
            ["discount", "Discount *"],
            ["description", "Description", "textarea"],
            ["code", "Coupon code"],
            ["expiration", "Expires on", "date"],
          ]}
        />
      </Section>
      <Section title="Redemption">
        <Fields
          value={value}
          onChange={onChange}
          fields={[
            ["ctaUrl", "Redeem URL", "url"],
            ["terms", "Terms", "textarea"],
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

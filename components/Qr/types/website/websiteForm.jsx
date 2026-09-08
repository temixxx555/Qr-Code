"use client";
import WebsiteForm from "../../WebsiteForm";
export default function Form({ value, onChange }) {
  return (
    <WebsiteForm
      embedded
      value={value}
      onChange={(updater) =>
        onChange(typeof updater === "function" ? updater(value) : updater)
      }
    />
  );
}

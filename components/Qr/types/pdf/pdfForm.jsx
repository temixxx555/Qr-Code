
"use client";

import { useState } from "react";
import { FileText, Link2, Upload } from "lucide-react";
import { Section, Fields } from "../controls";
import MediaUploader from "../../MediaUploader";

export default function Form({ value = {}, onChange }) {
  const [sourceType, setSourceType] = useState(
    value?.url ? "url" : value?.fileUrl ? "upload" : "url",
  );

  const handleSourceChange = (type) => {
    setSourceType(type);

    if (type === "url") {
      onChange({
        ...value,
        fileUrl: "",
        fileName: "",
      });
    } else {
      onChange({
        ...value,
        url: "",
      });
    }
  };

  return (
    <div className="space-y-5">
      {/* PDF Source */}
      <Section title="PDF source">
        <p className="mb-4 text-sm text-slate-500">
          Choose how you want to add your PDF document.
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => handleSourceChange("url")}
            className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all ${
              sourceType === "url"
                ? "border-[#20c75a] bg-emerald-50/60 ring-1 ring-[#20c75a]"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                sourceType === "url"
                  ? "bg-[#20c75a] text-white"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              <Link2 size={18} />
            </div>

            <div>
              <p className="font-semibold text-slate-900">
                PDF URL
              </p>

              <p className="mt-0.5 text-xs text-slate-500">
                Link to an existing PDF
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleSourceChange("upload")}
            className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all ${
              sourceType === "upload"
                ? "border-[#20c75a] bg-emerald-50/60 ring-1 ring-[#20c75a]"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                sourceType === "upload"
                  ? "bg-[#20c75a] text-white"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              <Upload size={18} />
            </div>

            <div>
              <p className="font-semibold text-slate-900">
                Upload PDF
              </p>

              <p className="mt-0.5 text-xs text-slate-500">
                Upload a document from your device
              </p>
            </div>
          </button>
        </div>

        <div className="mt-5">
          {sourceType === "url" ? (
            <Fields
              value={value}
              onChange={onChange}
              fields={[
                ["url", "PDF URL *", "url"],
              ]}
            />
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-4">
              <MediaUploader
                kind="pdf"
                onUpload={(file) =>
                  onChange({
                    ...value,
                    ...file,
                    url: file.url || file.fileUrl || "",
                  })
                }
              />
            </div>
          )}
        </div>
      </Section>

      {/* Document Details */}
      <Section title="Document details">
        <div className="mb-4 flex items-start gap-3 rounded-xl bg-slate-50 p-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#20c75a] shadow-sm">
            <FileText size={18} />
          </div>

          <div>
            <p className="text-sm font-medium text-slate-800">
              Customize how your PDF appears
            </p>

            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              These details can be shown on the page people see after scanning
              your QR code.
            </p>
          </div>
        </div>

        <Fields
          value={value}
          onChange={onChange}
          fields={[
            ["title", "Document title"],
            ["description", "Description", "textarea"],
            ["ctaLabel", "Button label"],
          ]}
        />
      </Section>
    </div>
  );
}


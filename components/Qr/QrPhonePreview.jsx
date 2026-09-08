"use client";
import { useState } from "react";
import PhoneMockup from "./PhoneMockup";
import QrLandingContent from "./QrLandingContent";
import QrGraphic from "./QrGraphic";
export default function QrPhonePreview({
  type,
  content,
  design,
  qrUrl,
  valid,
  onPrepare,
  busy,
}) {
  const [mode, setMode] = useState("preview");
  return (
    <div className="space-y-5">
      <div className="mx-auto flex w-fit rounded-full border bg-white p-1 text-sm">
        <button
          className={`rounded-full px-5 py-2 ${mode === "preview" ? "bg-slate-900 text-white" : ""}`}
          onClick={() => setMode("preview")}
        >
          Preview
        </button>
        <button
          disabled={!valid || busy}
          className={`rounded-full px-5 py-2 disabled:opacity-40 ${mode === "qr" ? "bg-slate-900 text-white" : ""}`}
          onClick={async () => {
            if (type !== "wifi" && onPrepare) {
              if (!(await onPrepare())) return;
            }
            setMode("qr");
          }}
        >
          QR Code
        </button>
      </div>
      <PhoneMockup>
        {mode === "preview" ? (
          <QrLandingContent type={type} content={content} />
        ) : (
          <div className="flex min-h-full flex-col justify-center px-1 py-6">
            <QrGraphic data={qrUrl} design={design} size={220} />
            <p className="mt-5 px-5 text-center text-xs text-slate-500">
              Scan with your phone camera
              {type !== "wifi" && ". Saving changes updates the live page."}
            </p>
          </div>
        )}
      </PhoneMockup>
      <p className="text-center text-xs text-slate-400">
        Live preview · scroll inside the phone
      </p>
    </div>
  );
}

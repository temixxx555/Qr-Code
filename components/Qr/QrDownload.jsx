"use client";
import { useState } from "react";
import Link from "next/link";
import QrGraphic from "./QrGraphic";
import { downloadQr } from "@/lib/download-qr";
import { contrastWarning } from "@/lib/qr-design";
export default function QrDownload({ qr, data, design }) {
  const [extension, setExtension] = useState("png");
  const [size, setSize] = useState(1000);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function download() {
    setBusy(true);
    setMessage("");
    try {
      await downloadQr({ data, design, name: qr.name, extension, size });
    } catch {
      setMessage(
        "Download failed. Check that your logo URL allows image access, then try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(data);
      setMessage("Copied!");
    } catch {
      setMessage("Copy the URL shown below.");
    }
  }
  return (
    <section className="mx-auto max-w-xl space-y-5 rounded-2xl border bg-white p-6 text-center">
      <span className="inline-block rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
        ✓ Saved to your account
      </span>
      <h2 className="text-2xl font-bold">{qr.name}</h2>
      <QrGraphic data={data} design={design} />
      <p className="text-sm text-amber-700">{contrastWarning(design)}</p>
      <div className="flex justify-center gap-3">
        <label className="text-sm">
          Format
          <select
            className="ml-2 rounded-lg border p-2"
            value={extension}
            onChange={(e) => setExtension(e.target.value)}
          >
            <option value="png">PNG</option>
            <option value="svg">SVG</option>
            <option value="jpg">JPG</option>
          </select>
        </label>
        <label className="text-sm">
          QR size
          <select
            className="ml-2 rounded-lg border p-2"
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
          >
            {[500, 1000, 2000].map((n) => (
              <option key={n} value={n}>
                {n}px
              </option>
            ))}
          </select>
        </label>
      </div>
      {extension === "jpg" && (
        <p className="text-xs text-slate-500">
          JPG exports use a white background.
        </p>
      )}
      <button
        disabled={busy}
        onClick={download}
        className="w-full rounded-xl bg-[#20c75a] p-3 font-semibold text-white disabled:opacity-50"
      >
        {busy ? "Downloading…" : "Download QR code"}
      </button>
      {qr.type !== "wifi" && (
        <>
          <p className="break-all text-xs text-slate-500">{data}</p>
          <div className="flex justify-center gap-3">
            <button className="action" onClick={copy}>
              Copy QR URL
            </button>
            <button
              className="action"
              onClick={async () => {
                if (navigator.share) {
                  try {
                    await navigator.share({ title: qr.name, url: data });
                  } catch (e) {
                    if (e.name !== "AbortError") await copy();
                  }
                } else await copy();
              }}
            >
              Share
            </button>
          </div>
        </>
      )}
      <p role="status" className="text-sm">
        {message}
      </p>
      <Link
        href="/dashboard/qrcodes"
        className="block text-sm font-semibold text-emerald-700"
      >
        Go to My QR Codes →
      </Link>
    </section>
  );
}

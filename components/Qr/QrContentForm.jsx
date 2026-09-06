"use client";

import { FileText, QrCode } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const urlTypes = new Set(["website", "pdf", "links", "business", "video", "images", "facebook", "instagram", "social", "menu", "mp3"]);

const copy = {
  whatsapp: { label: "WhatsApp number", placeholder: "2348012345678", hint: "Use an international number without + or spaces." },
  wifi: { label: "Network name (SSID)", placeholder: "Guest Wi-Fi", hint: "Enter your Wi-Fi details below." },
  vcard: { label: "Full name", placeholder: "Jane Doe", hint: "Add contact details people can save." },
};

export default function QrContentForm({ type, value = {}, onChange }) {
  const update = (field, nextValue) => onChange((current) => ({ ...current, [field]: nextValue }));
  const urlBased = urlTypes.has(type);
  const details = copy[type] || { label: "Content", placeholder: "Enter the content for this QR code", hint: "This content will be available when the QR code is scanned." };

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-xl bg-emerald-50 p-3 text-[#20c75a]"><FileText size={22} /></div>
          <div><h2 className="font-semibold text-gray-900">QR code content</h2><p className="text-sm text-gray-500">{urlBased ? "Enter the destination URL for this dynamic QR code." : details.hint}</p></div>
        </div>
        {urlBased ? (
          <div>
            <Label htmlFor="destination">Destination URL <span className="text-red-500">*</span></Label>
            <Input id="destination" type="url" value={value.url || ""} onChange={(event) => update("url", event.target.value)} placeholder="https://example.com" className="mt-2 h-12" />
          </div>
        ) : type === "wifi" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Network name (SSID)" value={value.ssid || ""} onChange={(next) => update("ssid", next)} placeholder="Guest Wi-Fi" />
            <Field label="Password" value={value.password || ""} onChange={(next) => update("password", next)} placeholder="Leave blank for open networks" />
            <div className="sm:col-span-2"><Label htmlFor="encryption">Security</Label><select id="encryption" value={value.encryption || "WPA"} onChange={(event) => update("encryption", event.target.value)} className="mt-2 h-12 w-full rounded-md border border-input bg-transparent px-3 text-sm"><option value="WPA">WPA/WPA2</option><option value="WEP">WEP</option><option value="nopass">No password</option></select></div>
          </div>
        ) : type === "vcard" ? (
          <div className="grid gap-4 sm:grid-cols-2"><Field label="Full name" value={value.name || ""} onChange={(next) => update("name", next)} placeholder="Jane Doe" /><Field label="Phone" value={value.phone || ""} onChange={(next) => update("phone", next)} placeholder="+234 801 234 5678" /><div className="sm:col-span-2"><Field label="Email" value={value.email || ""} onChange={(next) => update("email", next)} placeholder="jane@example.com" /></div></div>
        ) : type === "whatsapp" ? (
          <div className="space-y-4"><Field label={details.label} value={value.phone || ""} onChange={(next) => update("phone", next)} placeholder={details.placeholder} /><div><Label htmlFor="message">Pre-filled message</Label><textarea id="message" value={value.message || ""} onChange={(event) => update("message", event.target.value)} placeholder="Hello, I found you through your QR code." className="mt-2 min-h-24 w-full rounded-md border border-input p-3 text-sm" /></div></div>
        ) : (
          <div><Label htmlFor="text">{details.label} <span className="text-red-500">*</span></Label><textarea id="text" value={value.text || ""} onChange={(event) => update("text", event.target.value)} placeholder={details.placeholder} className="mt-2 min-h-28 w-full rounded-md border border-input p-3 text-sm" /></div>
        )}
      </section>
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"><div className="flex items-center gap-3"><div className="rounded-xl bg-emerald-50 p-3 text-[#20c75a]"><QrCode size={22} /></div><div className="flex-1"><Label htmlFor="qr-name">Name your QR code</Label><Input id="qr-name" value={value.qrName || ""} onChange={(event) => update("qrName", event.target.value)} placeholder="e.g. September campaign" className="mt-2 h-11" /></div></div></section>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }) { return <div><Label>{label}</Label><Input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="mt-2 h-11" /></div>; }

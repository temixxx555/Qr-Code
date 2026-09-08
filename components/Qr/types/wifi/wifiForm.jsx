"use client";
import { Section, Fields } from "../controls";
export default function WifiForm({ value, onChange }) {
  return (
    <Section title="Network details">
      <Fields
        value={value}
        onChange={onChange}
        fields={[
          ["ssid", "Network name *"],
          ["password", "Network password", "password"],
        ]}
      />
      <label className="block text-sm">
        Encryption
        <select
          className="mt-2 block w-full rounded-xl border p-3"
          value={value.encryption || "WPA"}
          onChange={(e) => onChange({ ...value, encryption: e.target.value })}
        >
          <option value="WPA">WPA / WPA2</option>
          <option value="WEP">WEP</option>
          <option value="nopass">None</option>
        </select>
      </label>
      <label className="flex gap-2 text-sm">
        <input
          type="checkbox"
          checked={!!value.hidden}
          onChange={(e) => onChange({ ...value, hidden: e.target.checked })}
        />
        Hidden network
      </label>
      <p className="text-sm text-slate-500">
        WiFi codes store the connection details directly. Changing this network
        requires printing a new QR. Scan analytics are unavailable.
      </p>
    </Section>
  );
}

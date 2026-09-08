import { Picture, Intro, Action } from "../presentation";

export default function Preview({ content: c }) {
  return (
    <article className="flex min-h-full flex-col items-center justify-center bg-cyan-50 px-5 py-16 text-center">
      <div className="mb-8 rounded-full bg-cyan-100 p-8 text-5xl text-cyan-700">
        ⌁
      </div>
      <Intro
        title={c.ssid || "Your WiFi network"}
        description="Scan to connect. No typing needed."
      />
      <p className="mt-6 rounded-full bg-white px-4 py-2 text-xs">
        {c.encryption === "nopass"
          ? "Open network"
          : c.encryption || "WPA / WPA2"}
        {c.hidden ? " · Hidden" : ""}
      </p>
    </article>
  );
}

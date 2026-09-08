"use client";
import { useEffect, useRef, useState } from "react";
import QrFrame from "./QrFrame";
import { qrOptions, editorDesign } from "@/lib/qr-design";
export default function QrGraphic({ data, design = {}, size = 230 }) {
  const ref = useRef(null);
  const [error, setError] = useState("");
  const options = JSON.stringify(qrOptions(data, design, size));
  const d = editorDesign(design);
  useEffect(() => {
    let active = true;
    let instance;
    const host = ref.current;
    if (!data) return;
    const timer = setTimeout(async () => {
      try {
        const { default: QR } = await import("qr-code-styling");
        if (!active) return;
        instance = new QR(JSON.parse(options));
        host.replaceChildren();
        instance.append(host);
        setError("");
      } catch {
        if (active)
          setError(
            "This QR could not be rendered. Check its content and design.",
          );
      }
    }, 120);
    return () => {
      active = false;
      clearTimeout(timer);
      host?.replaceChildren();
    };
  }, [data, options]);
  return (
    <div className="mx-auto w-fit max-w-full">
      <QrFrame
        frame={d.selectedFrame}
        frameColor={d.frameColor || "#000000"}
        frameText={d.frameText || "Scan me!"}
        qrRef={ref}
      />
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

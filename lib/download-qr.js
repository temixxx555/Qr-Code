import { qrOptions, editorDesign } from "./qr-design";
export async function downloadQr({
  data,
  design,
  name,
  extension = "png",
  size = 1000,
}) {
  const { default: QR } = await import("qr-code-styling");
  const d = editorDesign(design);
  const qr = new QR(qrOptions(data, design, size));
  const raw = await qr.getRawData("svg");
  const source = await raw.text();
  const doc = new DOMParser().parseFromString(source, "image/svg+xml");
  const ns = "http://www.w3.org/2000/svg";
  const outer = document.createElementNS(ns, "svg");
  const framed = d.selectedFrame !== "none";
  const pad = framed ? Math.round(size * 0.04) : 0;
  const text =
    framed && !["simple", "rounded", "shadow"].includes(d.selectedFrame);
  const footer = text ? Math.round(size * 0.14) : 0;
  const width = size + 2 * pad;
  const height = width + footer;
  outer.setAttribute("xmlns", ns);
  outer.setAttribute("width", width);
  outer.setAttribute("height", height);
  outer.setAttribute("viewBox", `0 0 ${width} ${height}`);
  if (framed) {
    const rect = document.createElementNS(ns, "rect");
    rect.setAttribute("width", width);
    rect.setAttribute("height", height);
    rect.setAttribute(
      "rx",
      ["rounded", "badge"].includes(d.selectedFrame)
        ? size * 0.1
        : size * 0.025,
    );
    rect.setAttribute("fill", d.frameColor || "#000000");
    outer.append(rect);
  }
  const inner = doc.documentElement;
  inner.setAttribute("x", pad);
  inner.setAttribute("y", pad);
  outer.append(document.importNode(inner, true));
  if (text) {
    const label = document.createElementNS(ns, "text");
    label.setAttribute("x", width / 2);
    label.setAttribute("y", width + footer * 0.58);
    label.setAttribute("text-anchor", "middle");
    label.setAttribute("fill", "white");
    label.setAttribute("font-family", "Arial, sans-serif");
    label.setAttribute("font-weight", "bold");
    label.setAttribute(
      "font-size",
      Math.min(
        size * 0.055,
        (size * 1.5) / Math.max((d.frameText || "Scan me!").length, 1),
      ),
    );
    label.textContent = d.frameText || "Scan me!";
    outer.append(label);
  }
  const svg = new Blob([new XMLSerializer().serializeToString(outer)], {
    type: "image/svg+xml",
  });
  let blob = svg;
  if (extension !== "svg") {
    const sourceUrl = URL.createObjectURL(svg);
    try {
      const image = new Image();
      image.src = sourceUrl;
      await image.decode();
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (extension === "jpg") {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, width, height);
      }
      ctx.drawImage(image, 0, 0);
      blob = await new Promise((resolve, reject) =>
        canvas.toBlob(
          (b) =>
            b ? resolve(b) : reject(new Error("Could not export image.")),
          extension === "jpg" ? "image/jpeg" : "image/png",
          0.95,
        ),
      );
    } finally {
      URL.revokeObjectURL(sourceUrl);
    }
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${(name || "qr-code")
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase()}-qr.${extension}`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

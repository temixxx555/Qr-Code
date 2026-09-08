export function editorDesign(d = {}) {
  return {
    ...d,
    selectedFrame: d.selectedFrame || d.frame || "scan",
    selectedPattern: d.selectedPattern || d.pattern || "square",
    selectedCornerSquare:
      d.selectedCornerSquare || d.cornerSquareStyle || "square",
    selectedCornerDot: d.selectedCornerDot || d.cornerDotStyle || "square",
  };
}
export function storedDesign(d = {}) {
  const {
    selectedFrame,
    selectedPattern,
    selectedCornerSquare,
    selectedCornerDot,
    ...rest
  } = editorDesign(d);
  return {
    ...rest,
    frame: selectedFrame,
    pattern: selectedPattern,
    cornerSquareStyle: selectedCornerSquare,
    cornerDotStyle: selectedCornerDot,
  };
}
export function qrOptions(data, design = {}, size = 280) {
  const d = editorDesign(design);
  const gradient = (color, color2, enabled) =>
    enabled
      ? {
          gradient: {
            type: "linear",
            rotation: Math.PI / 4,
            colorStops: [
              { offset: 0, color },
              { offset: 1, color: color2 },
            ],
          },
        }
      : { color };
  return {
    width: size,
    height: size,
    type: "svg",
    data,
    margin: Math.round(size * 0.06),
    qrOptions: { errorCorrectionLevel: "H" },
    image: d.logo || undefined,
    imageOptions: {
      crossOrigin: "anonymous",
      hideBackgroundDots: true,
      imageSize: 0.25,
      margin: 5,
      saveAsBlob: true,
    },
    dotsOptions: {
      type: d.selectedPattern,
      ...gradient(
        d.patternColor || "#000000",
        d.patternColor2 || "#20c75a",
        d.patternGradientEnabled,
      ),
    },
    backgroundOptions: d.transparentBackground
      ? { color: "transparent" }
      : gradient(
          d.backgroundColor || "#ffffff",
          d.backgroundColor2 || "#effcf4",
          d.backgroundGradientEnabled,
        ),
    cornersSquareOptions: {
      type: d.selectedCornerSquare,
      color: d.cornerSquareColor || "#000000",
    },
    cornersDotOptions: {
      type: d.selectedCornerDot,
      color: d.cornerDotColor || "#000000",
    },
  };
}
export function contrastWarning(d = {}) {
  const luminance = (hex) => {
    if (!/^#[0-9a-f]{6}$/i.test(hex)) return 0;
    const rgb = [1, 3, 5]
      .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
      .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
    return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
  };
  const front = [
    d.patternColor || "#000000",
    d.cornerSquareColor || "#000000",
    d.cornerDotColor || "#000000",
    ...(d.patternGradientEnabled ? [d.patternColor2 || "#20c75a"] : []),
  ];
  const back = [
    d.backgroundColor || "#ffffff",
    ...(d.backgroundGradientEnabled ? [d.backgroundColor2 || "#effcf4"] : []),
  ];
  if (
    front.some((f) =>
      back.some((b) => (luminance(b) + 0.05) / (luminance(f) + 0.05) < 3),
    )
  )
    return "Low contrast: use darker patterns and corners on a lighter background before printing.";
  if (d.transparentBackground)
    return "Place transparent QR codes on a plain light surface and test a printed sample.";
  return "";
}

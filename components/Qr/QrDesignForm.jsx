"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import api from "@/lib/axios";
import QrFrame from "./QrFrame";
import QRCodeStyling from "qr-code-styling";
import {
  Frame,
  Grid3X3,
  SquareDashed,
  Check,
  ChevronDown,
  ArrowLeftRight,
  ScanLine,
  Ticket,
  Gift,
  Badge,
  Square,
  Ban,
  QrCode,
  ImagePlus,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

/* ============================================================
   OPTIONS
============================================================ */

const frameStyles = [
  { id: "none", label: "No Frame" },
  { id: "simple", label: "Simple Box" },
  { id: "scan", label: "Scan Me" },
  { id: "bottom", label: "Bottom Text" },
  { id: "rounded", label: "Rounded" },
  { id: "ticket", label: "Ticket" },
  { id: "ribbon", label: "Ribbon" },
  { id: "badge", label: "Badge" },
  { id: "shadow", label: "Shadow Box" },
  { id: "gift", label: "Gift" },
];

const patternStyles = [
  { id: "square", label: "Square" },
  { id: "dots", label: "Dots" },
  { id: "rounded", label: "Rounded" },
  { id: "extra-rounded", label: "Extra Round" },
  { id: "classy", label: "Classy" },
  { id: "classy-rounded", label: "Classy Round" },
];

const cornerSquareStyles = [
  { id: "square", label: "Square" },
  { id: "dot", label: "Circle" },
  { id: "extra-rounded", label: "Rounded" },
];

const cornerDotStyles = [
  { id: "square", label: "Square" },
  { id: "dot", label: "Circle" },
];

/* ============================================================
   SAMPLE QR MODULES
============================================================ */

const SAMPLE_MODULES = [
  [1, 1, 1, 0, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1],
  [0, 0, 1, 0, 1, 0, 0],
  [1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 0, 1, 1, 1],
];

/* ============================================================
   MAIN COMPONENT
============================================================ */

const QrDesignForm = ({ url = "", value = "", onChange }) => {
  const qrRef = useRef(null);
  const qrCodeRef = useRef(null);

  /* QR DESIGN STATES */

  /* QR DESIGN VALUES */

  const selectedFrame = value.selectedFrame || "scan";
  const selectedPattern = value.selectedPattern || "square";

  const selectedCornerSquare = value.selectedCornerSquare || "square";

  const selectedCornerDot = value.selectedCornerDot || "square";

  /* COLORS */

  const patternColor = value.patternColor || "#000000";

  const patternGradientEnabled = value.patternGradientEnabled || false;

  const patternColor2 = value.patternColor2 || "#20c75a";

  const backgroundColor = value.backgroundColor || "#ffffff";

  const backgroundGradientEnabled = value.backgroundGradientEnabled || false;

  const backgroundColor2 = value.backgroundColor2 || "#effcf4";

  const transparentBackground = value.transparentBackground || false;

  const frameColor = value.frameColor || "#000000";

  const cornerSquareColor = value.cornerSquareColor || "#000000";

  const cornerDotColor = value.cornerDotColor || "#000000";

  const frameText = value.frameText || "Scan me!";

  const logo = value.logo || "";

  const setSelectedFrame = (newValue) => {
    updateDesign("selectedFrame", newValue);
  };

  const setSelectedPattern = (newValue) => {
    updateDesign("selectedPattern", newValue);
  };

  const setSelectedCornerSquare = (newValue) => {
    updateDesign("selectedCornerSquare", newValue);
  };

  const setSelectedCornerDot = (newValue) => {
    updateDesign("selectedCornerDot", newValue);
  };

  const setPatternColor = (newValue) => {
    updateDesign("patternColor", newValue);
  };

  const setPatternGradientEnabled = (newValue) => {
    updateDesign("patternGradientEnabled", newValue);
  };

  const setPatternColor2 = (newValue) => {
    updateDesign("patternColor2", newValue);
  };

  const setBackgroundColor = (newValue) => {
    updateDesign("backgroundColor", newValue);
  };

  const setBackgroundGradientEnabled = (newValue) => {
    updateDesign("backgroundGradientEnabled", newValue);
  };

  const setBackgroundColor2 = (newValue) => {
    updateDesign("backgroundColor2", newValue);
  };

  const setTransparentBackground = (newValue) => {
    updateDesign("transparentBackground", newValue);
  };

  const setFrameColor = (newValue) => {
    updateDesign("frameColor", newValue);
  };

  const setCornerSquareColor = (newValue) => {
    updateDesign("cornerSquareColor", newValue);
  };

  const setCornerDotColor = (newValue) => {
    updateDesign("cornerDotColor", newValue);
  };

  const setFrameText = (newValue) => {
    updateDesign("frameText", newValue);
  };

  const setLogo = (newValue) => {
    updateDesign("logo", newValue);
  };

  /* ACCORDION */

  const [openSections, setOpenSections] = useState({
    frame: true,
    pattern: true,
    corners: false,
    image: false,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const updateDesign = (field, newValue) => {
    onChange({
      ...value,
      [field]: newValue,
    });
  };
  /* ============================================================
     QR OPTIONS
  ============================================================ */

  const dotsColorOption = patternGradientEnabled
    ? {
        gradient: {
          type: "linear",
          rotation: Math.PI / 4,
          colorStops: [
            {
              offset: 0,
              color: patternColor,
            },
            {
              offset: 1,
              color: patternColor2,
            },
          ],
        },
      }
    : {
        color: patternColor,
      };

  const backgroundColorOption = transparentBackground
    ? {
        color: "transparent",
      }
    : backgroundGradientEnabled
      ? {
          gradient: {
            type: "linear",
            rotation: Math.PI / 4,
            colorStops: [
              {
                offset: 0,
                color: backgroundColor,
              },
              {
                offset: 1,
                color: backgroundColor2,
              },
            ],
          },
        }
      : {
          color: backgroundColor,
        };

  // upload image
  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1024 * 1024) {
      alert("Logo must be less than 1 MB.");
      return;
    }
    const body = new FormData();
    body.append("file", file);
    body.append("kind", "image");
    try {
      const { data } = await api.post("/uploads", body, {
        headers: { "Content-Type": undefined },
      });
      setLogo(data.file.url);
    } catch (error) {
      alert(error.response?.data?.message || "Logo upload failed.");
    }
  };
  /* ============================================================
     CREATE QR
  ============================================================ */

  useEffect(() => {
    if (!qrRef.current) return;

    qrCodeRef.current = new QRCodeStyling({
      width: 190,
      height: 190,
      type: "svg",
      data: url,
      margin: 12,

      qrOptions: {
        errorCorrectionLevel: "H",
      },

      image: logo,

      imageOptions: {
        hideBackgroundDots: true,
        imageSize: 0.25,
        margin: 5,
      },

      dotsOptions: {
        ...dotsColorOption,
        type: selectedPattern,
      },

      backgroundOptions: backgroundColorOption,

      cornersSquareOptions: {
        color: cornerSquareColor,
        type: selectedCornerSquare,
      },

      cornersDotOptions: {
        color: cornerDotColor,
        type: selectedCornerDot,
      },
    });

    qrRef.current.replaceChildren();
    qrCodeRef.current.append(qrRef.current);
    const host = qrRef.current;
    return () => {
      host.replaceChildren();
      qrCodeRef.current = null;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ============================================================
     UPDATE QR LIVE
  ============================================================ */

  useEffect(() => {
    if (!qrCodeRef.current) return;

    qrCodeRef.current.update({
      data: url,

      image: logo,

      imageOptions: {
        hideBackgroundDots: true,
        imageSize: 0.25,
        margin: 5,
      },

      dotsOptions: {
        ...dotsColorOption,
        type: selectedPattern,
      },

      backgroundOptions: backgroundColorOption,

      cornersSquareOptions: {
        color: cornerSquareColor,
        type: selectedCornerSquare,
      },

      cornersDotOptions: {
        color: cornerDotColor,
        type: selectedCornerDot,
      },
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    value,
    logo,
    selectedPattern,
    selectedCornerSquare,
    selectedCornerDot,
    patternColor,
    patternColor2,
    patternGradientEnabled,
    backgroundColor,
    backgroundColor2,
    backgroundGradientEnabled,
    transparentBackground,
    cornerSquareColor,
    cornerDotColor,
  ]);
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_420px]">
      {/* ======================================================
          LEFT SETTINGS
      ====================================================== */}

      <div className="space-y-4">
        {/* ====================================================
            FRAME
        ==================================================== */}

        <DesignSection
          icon={Frame}
          title="Frame"
          description="Frames make your QR code stand out and inspire more scans."
          open={openSections.frame}
          onClick={() => toggleSection("frame")}
        >
          <Label className="mb-3 block text-xs font-semibold text-gray-700">
            Frame style
          </Label>

          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
            {frameStyles.map((frame) => (
              <StyleButton
                key={frame.id}
                active={selectedFrame === frame.id}
                onClick={() => setSelectedFrame(frame.id)}
              >
                <FramePreviewIcon type={frame.id} color={frameColor} />

                <span className="mt-2 text-[9px] font-medium text-gray-500">
                  {frame.label}
                </span>
              </StyleButton>
            ))}
          </div>

          <div className="my-5 h-px bg-gray-100" />

          {/* FRAME TEXT */}

          {selectedFrame !== "none" && (
            <div className="mb-4">
              <Label className="mb-2 block text-xs font-medium text-gray-600">
                Frame text
              </Label>

              <Input
                value={frameText}
                onChange={(e) => setFrameText(e.target.value)}
                placeholder="Scan me!"
                className="h-10 text-sm"
              />
            </div>
          )}

          {/* FRAME COLOR */}

          <div>
            <Label className="mb-2 block text-xs font-medium text-gray-600">
              Frame color
            </Label>

            <ColorPicker value={frameColor} onChange={setFrameColor} />
          </div>
        </DesignSection>

        {/* ====================================================
            QR PATTERN
        ==================================================== */}

        <DesignSection
          icon={Grid3X3}
          title="QR Code Pattern"
          description="Choose a pattern for your QR code and select colors."
          open={openSections.pattern}
          onClick={() => toggleSection("pattern")}
        >
          <Label className="mb-3 block text-xs font-semibold text-gray-700">
            Pattern style
          </Label>

          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {patternStyles.map((pattern) => (
              <PatternButton
                key={pattern.id}
                active={selectedPattern === pattern.id}
                onClick={() => setSelectedPattern(pattern.id)}
                type={pattern.id}
                label={pattern.label}
              />
            ))}
          </div>

          <div className="my-5 h-px bg-gray-100" />

          {/* PATTERN COLOR */}

          <div className="rounded-xl border border-gray-100 bg-[#f8fafc] p-4">
            <div className="flex items-center justify-between gap-3">
              <Label className="text-xs font-medium text-[#475467]">
                Use a gradient pattern color
              </Label>

              <Switch
                checked={patternGradientEnabled}
                onCheckedChange={setPatternGradientEnabled}
                className="data-[state=checked]:bg-[#20c75a]"
              />
            </div>

            <div className="mt-4 flex flex-wrap items-end gap-3">
              <div>
                <Label className="mb-1.5 block text-[10px] text-gray-500">
                  Pattern color
                </Label>

                <ColorPicker value={patternColor} onChange={setPatternColor} />
              </div>

              {patternGradientEnabled && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      const first = patternColor;

                      setPatternColor(patternColor2);

                      setPatternColor2(first);
                    }}
                    className="mb-1 flex h-9 w-9 items-center justify-center rounded-full border border-[#20c75a] bg-white text-[#20c75a] transition hover:bg-[#effcf4]"
                  >
                    <ArrowLeftRight className="h-4 w-4" />
                  </button>

                  <div>
                    <Label className="mb-1.5 block text-[10px] text-gray-500">
                      Second color
                    </Label>

                    <ColorPicker
                      value={patternColor2}
                      onChange={setPatternColor2}
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* BACKGROUND */}

          <div className="my-4 h-px bg-gray-100" />

          <div className="rounded-xl border border-gray-100 bg-[#f8fafc] p-4">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium text-[#475467]">
                Transparent background
              </Label>

              <Switch
                checked={transparentBackground}
                onCheckedChange={setTransparentBackground}
                className="data-[state=checked]:bg-[#20c75a]"
              />
            </div>

            {!transparentBackground && (
              <>
                <div className="mt-4 flex items-center justify-between">
                  <Label className="text-xs font-medium text-[#475467]">
                    Use a gradient background
                  </Label>

                  <Switch
                    checked={backgroundGradientEnabled}
                    onCheckedChange={setBackgroundGradientEnabled}
                    className="data-[state=checked]:bg-[#20c75a]"
                  />
                </div>

                <div className="mt-4 flex flex-wrap items-end gap-3">
                  <div>
                    <Label className="mb-1.5 block text-[10px] text-gray-500">
                      Background color
                    </Label>

                    <ColorPicker
                      value={backgroundColor}
                      onChange={setBackgroundColor}
                    />
                  </div>

                  {backgroundGradientEnabled && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          const first = backgroundColor;

                          setBackgroundColor(backgroundColor2);

                          setBackgroundColor2(first);
                        }}
                        className="mb-1 flex h-9 w-9 items-center justify-center rounded-full border border-[#20c75a] bg-white text-[#20c75a] transition hover:bg-[#effcf4]"
                      >
                        <ArrowLeftRight className="h-4 w-4" />
                      </button>

                      <div>
                        <Label className="mb-1.5 block text-[10px] text-gray-500">
                          Second color
                        </Label>

                        <ColorPicker
                          value={backgroundColor2}
                          onChange={setBackgroundColor2}
                        />
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="mt-4 flex items-start gap-2 rounded-lg bg-gray-50 p-3 text-[11px] text-gray-500">
            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-[9px]">
              !
            </span>

            <p>
              For optimal scanning results, use strong contrast between the QR
              pattern and background.
            </p>
          </div>
        </DesignSection>

        {/* ====================================================
            CORNERS
        ==================================================== */}

        <DesignSection
          icon={SquareDashed}
          title="QR Code Corners"
          description="Customize the finder patterns of your QR code."
          open={openSections.corners}
          onClick={() => toggleSection("corners")}
        >
          <div className="grid gap-6 md:grid-cols-2">
            {/* CORNER SQUARE */}

            <div>
              <Label className="mb-3 block text-xs font-semibold text-gray-700">
                Frame around corner dots style
              </Label>

              <div className="grid grid-cols-3 gap-2">
                {cornerSquareStyles.map((corner) => (
                  <CornerButton
                    key={corner.id}
                    active={selectedCornerSquare === corner.id}
                    onClick={() => setSelectedCornerSquare(corner.id)}
                    type={corner.id}
                    label={corner.label}
                  />
                ))}
              </div>

              <div className="mt-4">
                <Label className="mb-2 block text-[11px] text-gray-500">
                  Corner frame color
                </Label>

                <ColorPicker
                  value={cornerSquareColor}
                  onChange={setCornerSquareColor}
                />
              </div>
            </div>

            {/* CORNER DOT */}

            <div>
              <Label className="mb-3 block text-xs font-semibold text-gray-700">
                Corner dots style
              </Label>

              <div className="grid grid-cols-2 gap-2">
                {cornerDotStyles.map((corner) => (
                  <CornerDotButton
                    key={corner.id}
                    active={selectedCornerDot === corner.id}
                    onClick={() => setSelectedCornerDot(corner.id)}
                    type={corner.id}
                    label={corner.label}
                  />
                ))}
              </div>

              <div className="mt-4">
                <Label className="mb-2 block text-[11px] text-gray-500">
                  Corner dot color
                </Label>

                <ColorPicker
                  value={cornerDotColor}
                  onChange={setCornerDotColor}
                />
              </div>
            </div>
          </div>
        </DesignSection>

        <DesignSection
          icon={ImagePlus}
          title="Add Logo"
          description="Make your QR code unique by adding a logo or image."
          open={openSections.image}
          onClick={() => toggleSection("image")}
        >
          <div>
            <Label className="mb-3 block text-xs font-semibold text-gray-700">
              Upload your logo
            </Label>

            <div className="flex items-center gap-4">
              {/* Hidden file input */}
              <input
                id="qr-logo-upload"
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                onChange={handleLogoUpload}
                className="hidden"
              />

              {/* Upload button */}
              <label
                htmlFor="qr-logo-upload"
                className="flex h-28 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 transition hover:border-[#20c75a] hover:bg-[#effcf4]"
              >
                <ImagePlus className="mb-2 h-7 w-7 text-gray-400" />

                <span className="text-xs font-medium text-gray-600">
                  {logo ? "Change logo" : "Click to upload"}
                </span>

                <span className="mt-1 text-[10px] text-gray-400">
                  PNG, JPG, WEBP or SVG · Max 1MB
                </span>
              </label>
            </div>

            {/* Logo preview + remove */}
            {logo && (
              <div className="mt-4 flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-gray-200 bg-white p-1">
                    <img
                      src={logo}
                      alt="QR logo preview"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-gray-700">
                      Logo added
                    </p>

                    <p className="text-[10px] text-gray-400">
                      Your logo appears in the center of the QR code.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setLogo("")}
                  className="text-xs font-medium text-red-500 transition hover:text-red-600"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </DesignSection>
      </div>

      {/* ======================================================
          PHONE PREVIEW
      ====================================================== */}

      <div className="flex justify-center lg:sticky lg:top-25 lg:h-fit">
        <QrPhonePreview
          qrRef={qrRef}
          frame={selectedFrame}
          frameColor={frameColor}
          frameText={frameText}
        />
      </div>
    </div>
  );
};

export default QrDesignForm;

/* ============================================================
   DESIGN SECTION
============================================================ */

function DesignSection({
  icon: Icon,
  title,
  description,
  open,
  onClick,
  children,
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={onClick}
        className="flex w-full items-center justify-between px-4 py-4 text-left transition hover:bg-gray-50"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#f8fafc] text-[#667085]">
            <Icon className="h-5 w-5" strokeWidth={1.8} />
          </div>

          <div>
            <h3 className="text-[15px] font-semibold text-[#344054]">
              {title}
            </h3>

            <p className="mt-0.5 text-[11px] text-[#98a2b3]">{description}</p>
          </div>
        </div>

        <ChevronDown
          className={`h-5 w-5 transition-transform ${
            open ? "rotate-0" : "-rotate-90"
          }`}
        />
      </button>

      {open && (
        <div className="border-t border-gray-200 px-4 pb-5 pt-4">
          {children}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   STYLE BUTTON
============================================================ */

function StyleButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex min-h-22 flex-col items-center justify-center rounded-xl border p-2 transition-all duration-200 ${
        active
          ? "border-[#20c75a] bg-[#effcf4] shadow-sm ring-1 ring-[#20c75a]"
          : "border-gray-200 bg-white hover:-translate-y-0.5 hover:border-[#20c75a]/50 hover:shadow-sm"
      }`}
    >
      {active && (
        <div className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#20c75a]">
          <Check className="h-2.5 w-2.5 text-white" />
        </div>
      )}

      {children}
    </button>
  );
}

/* ============================================================
   FRAME PREVIEW ICONS
============================================================ */

function FramePreviewIcon({ type, color }) {
  if (type === "none") {
    return (
      <div className="flex h-12 w-12 items-center justify-center">
        <Ban size={30} />
      </div>
    );
  }

  if (type === "simple") {
    return (
      <div
        className="flex h-12 w-12 items-center justify-center rounded border-[3px] bg-white"
        style={{ borderColor: color }}
      >
        <QrCode size={30} />
      </div>
    );
  }

  if (type === "scan") {
    return (
      <div className="flex h-12 w-12 flex-col overflow-hidden rounded bg-white shadow">
        <div className="flex flex-1 items-center justify-center">
          <QrCode size={30} />
        </div>

        <div
          className="py-0.5 text-center text-[5px] font-bold text-white"
          style={{ backgroundColor: color }}
        >
          SCAN ME
        </div>
      </div>
    );
  }

  if (type === "bottom") {
    return (
      <div className="flex h-12 w-12 flex-col overflow-hidden rounded bg-white shadow">
        <div className="flex flex-1 items-center justify-center">
          <QrCode size={30} />
        </div>

        <div
          className="h-3 text-white p-1 text-center text-[5px] "
          style={{ backgroundColor: color }}
        >
          {" "}
          SCAN
        </div>
      </div>
    );
  }

  if (type === "rounded") {
    return (
      <div
        className="flex h-12 w-12 items-center justify-center rounded-2xl border-[3px] bg-white"
        style={{ borderColor: color }}
      >
        <QrCode size={30} />
      </div>
    );
  }

  if (type === "ticket") {
    return (
      <div
        className="flex h-12 w-12 flex-col overflow-hidden rounded-lg border-[3px] bg-white"
        style={{ borderColor: color }}
      >
        <div className="flex flex-1 items-center justify-center">
          <QrCode size={30} />
        </div>

        <div
          className="border-t border-dashed py-0.5 text-center text-[5px]"
          style={{
            borderColor: color,
            color,
          }}
        >
          SCAN
        </div>
      </div>
    );
  }

  if (type === "ribbon") {
    return (
      <div className="relative flex h-12 w-12 items-center justify-center rounded bg-white shadow">
        <div
          className="absolute -top-1 left-1/2 -translate-x-1/2 px-2 py-0.5 text-[5px] font-bold text-white"
          style={{ backgroundColor: color }}
        >
          SCAN
        </div>
        <QrCode size={30} />
      </div>
    );
  }

  if (type === "badge") {
    return (
      <div
        className="flex h-12 w-12 items-center justify-center rounded-full border-4 bg-white"
        style={{ borderColor: color }}
      >
        <QrCode size={30} />
      </div>
    );
  }

  if (type === "shadow") {
    return (
      <div
        className="flex h-12 w-12 items-center justify-center rounded bg-white border"
        style={{
          borderColor: color,
          boxShadow: `4px 4px 0 ${color}`,
        }}
      >
        <QrCode size={30} />
      </div>
    );
  }

  if (type === "gift") {
    return (
      <div
        className="relative flex h-12 w-12 items-center justify-center rounded bg-white border-[3px]"
        style={{ borderColor: color }}
      >
        <QrCode size={30} />

        <div
          className="absolute left-1/2 top-0 h-full w-0.75 -translate-x-1/2"
          style={{ backgroundColor: color }}
        />

        <div
          className="absolute left-0 top-1/2 h-0.75 w-full -translate-y-1/2"
          style={{ backgroundColor: color }}
        />
      </div>
    );
  }

  return null;
}
/* ============================================================
   PATTERN BUTTON
============================================================ */

function moduleShapeClass(type) {
  switch (type) {
    case "dots":
      return "rounded-full";

    case "rounded":
      return "rounded-[3px]";

    case "extra-rounded":
      return "rounded-[6px]";

    case "classy":
      return "rounded-tl-[6px] rounded-br-[6px]";

    case "classy-rounded":
      return "rounded-tl-full rounded-br-full";

    default:
      return "";
  }
}

function PatternButton({ active, onClick, type, label }) {
  const shape = moduleShapeClass(type);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex h-19.5 flex-col items-center justify-center gap-2 rounded-xl border transition-all ${
        active
          ? "border-[#20c75a] bg-[#effcf4] ring-1 ring-[#20c75a]"
          : "border-gray-200 bg-white hover:-translate-y-0.5 hover:border-[#20c75a]/50"
      }`}
    >
      {active && (
        <div className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#20c75a]">
          <Check className="h-2.5 w-2.5 text-white" />
        </div>
      )}

      <div
        className="grid grid-cols-7 grid-rows-7 gap-0.5"
        style={{
          width: 34,
          height: 34,
        }}
      >
        {SAMPLE_MODULES.flat().map((cell, i) => (
          <span
            key={i}
            className={cell ? `bg-gray-900 ${shape}` : "bg-transparent"}
          />
        ))}
      </div>

      <span className="text-[9px] text-gray-500">{label}</span>
    </button>
  );
}

/* ============================================================
   CORNER BUTTON
============================================================ */

function CornerButton({ active, onClick, type, label }) {
  const shape =
    type === "dot"
      ? "rounded-full"
      : type === "extra-rounded"
        ? "rounded-xl"
        : "";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-22 flex-col items-center justify-center gap-2 rounded-xl border transition ${
        active
          ? "border-[#20c75a] bg-[#effcf4] ring-1 ring-[#20c75a]"
          : "border-gray-200 bg-white hover:border-[#20c75a]/50"
      }`}
    >
      <div
        className={`flex h-10 w-10 items-center justify-center border-[5px] border-gray-900 ${shape}`}
      >
        <div className={`h-4 w-4 bg-gray-900 ${shape}`} />
      </div>

      <span className="text-[9px] text-gray-500">{label}</span>
    </button>
  );
}

/* ============================================================
   CORNER DOT BUTTON
============================================================ */

function CornerDotButton({ active, onClick, type, label }) {
  const shape = type === "dot" ? "rounded-full" : "";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-22 flex-col items-center justify-center gap-2 rounded-xl border transition ${
        active
          ? "border-[#20c75a] bg-[#effcf4] ring-1 ring-[#20c75a]"
          : "border-gray-200 bg-white hover:border-[#20c75a]/50"
      }`}
    >
      <div className="flex h-10 w-10 items-center justify-center border-[5px] border-gray-900">
        <div className={`h-5 w-5 bg-gray-900 ${shape}`} />
      </div>

      <span className="text-[9px] text-gray-500">{label}</span>
    </button>
  );
}

/* ============================================================
   COLOR PICKER
============================================================ */

function ColorPicker({ value, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-10 cursor-pointer rounded-lg border border-gray-200 bg-white p-1"
        />
      </div>

      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-27.5 text-xs uppercase"
      />
    </div>
  );
}

/* ============================================================
   PHONE PREVIEW
============================================================ */

function QrPhonePreview({ qrRef, frame, frameColor, frameText }) {
  return (
    <div className="relative">
      {/* TOP TOGGLE */}

      <div className="absolute -top-10 right-0 flex overflow-hidden rounded-full border border-[#20c75a] bg-white p-0.5 shadow-sm">
        <button
          type="button"
          className="px-5 py-1.5 text-xs font-semibold text-gray-400"
        >
          Preview
        </button>

        <button
          type="button"
          className="rounded-full bg-[#20c75a] px-5 py-1.5 text-xs font-semibold text-white"
        >
          QR code
        </button>
      </div>

      {/* PHONE */}

      <div
        className={[
          "relative",
          "h-105.75 w-61.5",
          "rounded-[47px]",
          "border-[5px] border-[#191919]",
          "bg-[#050505]",
          "p-1",
          "shadow-[0_18px_45px_rgba(0,0,0,0.18)]",
        ].join(" ")}
      >
        {/* subtle metallic edge */}
        <div className="pointer-events-none absolute -inset-0.5 rounded-[49px] border border-white/20" />

        {/* SIDE BUTTONS */}
        <div className="absolute -left-2 top-26.25 h-7 w-0.75 rounded-l-full bg-[#3b3b3b]" />
        <div className="absolute -left-2 top-35.5 h-11.5 w-0.75 rounded-l-full bg-[#3b3b3b]" />

        <div className="absolute -right-2 top-32.5 h-13.75 w-0.75 rounded-r-full bg-[#3b3b3b]" />

        {/* SCREEN */}
        <div className="relative flex h-full w-full flex-col items-center overflow-hidden rounded-[40px] bg-white">
          {/* Dynamic island */}
          <div className="absolute left-1/2 top-3 z-30 h-5.5 w-19.5 -translate-x-1/2 rounded-full bg-black">
            <div className="absolute right-2.25 top-1/2 h-1.25 w-1.25 -translate-y-1/2 rounded-full bg-[#172554]" />
          </div>

          {/* Status bar */}
          <div className="absolute inset-x-0 top-3.5 z-20 flex items-center justify-between px-6.75 text-[8px] font-bold text-black">
            <span>9:41</span>

            <div className="flex items-center gap-1">
              <span className="text-[7px] ">▰</span>
              <span className="text-[8px]">◒</span>
              <span className="text-[9px]">▰</span>
            </div>
          </div>

          {/* Preview area */}
          <div className="flex h-full w-50 items-center justify-center px-5 pb-8 pt-1">
            <QrFrame
              frame={frame}
              frameColor={frameColor}
              frameText={frameText}
              qrRef={qrRef}
            />
          </div>

          {/* Home indicator */}
          <div className="absolute bottom-2.25 left-1/2 h-1 w-21.5 -translate-x-1/2 rounded-full bg-black" />
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   QR FRAME

   IMPORTANT:
   qrRef stays in the same DOM structure.
   This means changing the frame will NOT destroy the QR.
============================================================ */

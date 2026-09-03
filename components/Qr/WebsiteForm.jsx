"use client";

import React, { useState } from "react";
import {
  Globe,
  QrCode,
  Lock,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const WebsiteForm = ({ value, onChange }) => {
  const {
    websiteUrl = "",
    qrName = "",
    passwordEnabled = false,
    password = "",
  } = value;

  const [openSections, setOpenSections] = useState({
    website: true,
    name: true,
    password: false,
  });

  const [urlTouched, setUrlTouched] = useState(false);

  // ============================================================
  // UPDATE FORM DATA
  // ============================================================

  const updateField = (field, newValue) => {
    onChange((prev) => ({
      ...prev,
      [field]: newValue,
    }));
  };

  // ============================================================
  // URL VALIDATION
  // ============================================================

  const isValidUrl = (url) => {
    if (!url.trim()) return false;

    try {
      const parsedUrl = new URL(url);

      return (
        parsedUrl.protocol === "http:" ||
        parsedUrl.protocol === "https:"
      );
    } catch {
      return false;
    }
  };

  const urlIsValid = isValidUrl(websiteUrl);

  // ============================================================
  // SECTION TOGGLE
  // ============================================================

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_430px]">
      {/* ======================================================
          LEFT — FORM
      ====================================================== */}

      <div className="space-y-3">
        {/* ====================================================
            WEBSITE INFORMATION
        ==================================================== */}

        <FormSection
          icon={Globe}
          title="Website Information"
          description="Input the URL this QR will redirect to."
          required
          open={openSections.website}
          onClick={() => toggleSection("website")}
        >
          <div className="border-t border-gray-200 px-4 pb-4 pt-3">
            <div className="rounded-lg bg-[#f8fafc] p-3 sm:p-4">
              <Label
                htmlFor="website-url"
                className="mb-2 block text-sm font-medium text-[#475467]"
              >
                Website URL{" "}
                <span className="text-red-500">*</span>
              </Label>

              <div className="relative">
                <Input
                  id="website-url"
                  type="url"
                  value={websiteUrl}
                  onChange={(e) =>
                    updateField("websiteUrl", e.target.value)
                  }
                  onBlur={() => setUrlTouched(true)}
                  placeholder="E.g. https://www.mywebsite.com/"
                  className={`h-11 bg-white pr-10 text-sm shadow-none placeholder:text-gray-400 focus-visible:ring-[#20c75a] ${
                    urlTouched && !urlIsValid
                      ? "border-red-500 focus-visible:ring-red-500"
                      : urlTouched && urlIsValid
                        ? "border-[#20c75a]"
                        : "border-gray-200"
                  }`}
                />

                {/* Validation icon */}
                {urlTouched && websiteUrl && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {urlIsValid ? (
                      <CheckCircle2 className="h-5 w-5 text-[#20c75a]" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                )}
              </div>

              {/* Required */}
              {urlTouched && !websiteUrl && (
                <p className="mt-2 text-xs text-red-500">
                  This field is required.
                </p>
              )}

              {/* Invalid URL */}
              {urlTouched && websiteUrl && !urlIsValid && (
                <p className="mt-2 text-xs text-red-500">
                  Enter a valid URL starting with http:// or https://
                </p>
              )}

              {/* Valid URL */}
              {urlTouched && websiteUrl && urlIsValid && (
                <p className="mt-2 text-xs text-[#20c75a]">
                  Valid website URL.
                </p>
              )}
            </div>
          </div>
        </FormSection>

        {/* ====================================================
            NAME OF QR CODE
        ==================================================== */}

        <FormSection
          icon={QrCode}
          title="Name of the QR Code"
          description="Give a name to your QR code."
          open={openSections.name}
          onClick={() => toggleSection("name")}
        >
          <div className="border-t border-gray-200 px-4 pb-4 pt-3">
            <div className="rounded-lg bg-[#f8fafc] p-3 sm:p-4">
              <Label
                htmlFor="qr-name"
                className="mb-2 block text-sm font-medium text-[#475467]"
              >
                Name
              </Label>

              <Input
                id="qr-name"
                value={qrName}
                onChange={(e) =>
                  updateField("qrName", e.target.value)
                }
                placeholder="E.g. My QR code"
                className="h-11 border-gray-200 bg-white text-sm shadow-none placeholder:text-gray-400 focus-visible:ring-[#20c75a]"
              />
            </div>
          </div>
        </FormSection>

        {/* ====================================================
            PASSWORD
        ==================================================== */}

        <FormSection
          icon={Lock}
          title={
            <div className="flex items-center gap-1.5">
              <span>Password</span>

              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-gray-200 text-[10px] font-bold text-gray-500">
                ?
              </span>
            </div>
          }
          open={openSections.password}
          onClick={() => toggleSection("password")}
        >
          <div className="border-t border-gray-200 px-4 pb-4 pt-3">
            <div className="flex min-h-[52px] items-center gap-3 rounded-lg bg-[#f8fafc] px-3 sm:px-4">
              <Switch
                checked={passwordEnabled}
                onCheckedChange={(checked) =>
                  updateField("passwordEnabled", checked)
                }
                className="data-[state=checked]:bg-[#20c75a]"
              />

              <div>
                <p className="text-sm font-medium text-[#475467]">
                  Activate password to access the QR code.
                </p>
              </div>
            </div>

            {passwordEnabled && (
              <div className="mt-3">
                <Label
                  htmlFor="website-password"
                  className="mb-2 block text-sm font-medium text-[#475467]"
                >
                  Password
                </Label>

                <Input
                  id="website-password"
                  type="password"
                  value={password}
                  onChange={(e) =>
                    updateField("password", e.target.value)
                  }
                  placeholder="Enter a password"
                  className="h-11 border-gray-200 bg-white focus-visible:ring-[#20c75a]"
                />
              </div>
            )}
          </div>
        </FormSection>

      </div>

      {/* ======================================================
          RIGHT — PHONE PREVIEW
      ====================================================== */}

      <div className="flex justify-center lg:sticky lg:top-[100px] lg:h-fit">
        <WebsitePhonePreview websiteUrl={websiteUrl} />
      </div>
    </div>
  );
};

export default WebsiteForm;

/* ============================================================
   REUSABLE FORM SECTION
============================================================ */

function FormSection({
  icon: Icon,
  title,
  description,
  required,
  open,
  onClick,
  children,
  arrowRight,
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={onClick}
        className="flex w-full items-center justify-between px-4 py-4 text-left transition hover:bg-gray-50"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#f8fafc] text-[#667085]">
            <Icon className="h-5 w-5" strokeWidth={1.8} />
          </div>

          <div>
            <div className="flex items-center gap-1">
              <h3 className="text-[15px] font-semibold text-[#344054]">
                {title}
              </h3>

              {required && (
                <span className="text-sm font-semibold text-red-500">
                  *
                </span>
              )}
            </div>

            {description && (
              <p className="mt-0.5 text-[11px] text-[#98a2b3]">
                {description}
              </p>
            )}
          </div>
        </div>

        {arrowRight ? (
          <ChevronRight className="h-5 w-5 text-[#344054]" />
        ) : (
          <ChevronDown
            className={`h-5 w-5 text-[#344054] transition-transform duration-200 ${
              open ? "rotate-0" : "-rotate-90"
            }`}
          />
        )}
      </button>

      {open && children}
    </div>
  );
}

/* ============================================================
   WEBSITE PHONE PREVIEW
============================================================ */

function WebsitePhonePreview({ websiteUrl }) {
  const displayUrl =
    websiteUrl || "https://online-qr-generator.com";

  return (
    <div className="relative">
      {/* ======================================================
          PREVIEW / QR TOGGLE
      ====================================================== */}

      <div className="absolute -top-10 right-0 z-40 flex overflow-hidden rounded-full border border-[#20c75a] bg-white p-0.5 shadow-sm">
        <button
          type="button"
          className="rounded-full bg-[#20c75a] px-5 py-1.5 text-xs font-semibold text-white shadow-sm"
        >
          Preview
        </button>

        <button
          type="button"
          className="px-5 py-1.5 text-xs font-semibold text-gray-400"
        >
          QR code
        </button>
      </div>

      {/* ======================================================
          PHONE WRAPPER
      ====================================================== */}

      <div className="relative">
        {/* Soft phone shadow */}
        <div className="absolute inset-x-6 -bottom-3 h-7 rounded-full bg-black/10 blur-xl" />

        {/* ====================================================
            LEFT SIDE BUTTONS
        ==================================================== */}

        {/* Mute / action button */}
        <div
          className="
            absolute -left-[4px] top-[82px] z-0
            h-[22px] w-[3px]
            rounded-l-full
            bg-[#303030]
            shadow-[-1px_0_1px_rgba(255,255,255,0.15)]
          "
        />

        {/* Volume button 1 */}
        <div
          className="
            absolute -left-[4px] top-[115px] z-0
            h-[36px] w-[3px]
            rounded-l-full
            bg-[#303030]
            shadow-[-1px_0_1px_rgba(255,255,255,0.15)]
          "
        />

        {/* Volume button 2 */}
        <div
          className="
            absolute -left-[4px] top-[158px] z-0
            h-[36px] w-[3px]
            rounded-l-full
            bg-[#303030]
            shadow-[-1px_0_1px_rgba(255,255,255,0.15)]
          "
        />

        {/* ====================================================
            RIGHT POWER BUTTON
        ==================================================== */}

        <div
          className="
            absolute -right-[4px] top-[120px] z-0
            h-[48px] w-[3px]
            rounded-r-full
            bg-[#303030]
            shadow-[1px_0_1px_rgba(255,255,255,0.15)]
          "
        />

        {/* ====================================================
            PHONE BODY

            KEEPING YOUR ORIGINAL:
            420px HEIGHT
            240px WIDTH
        ==================================================== */}

        <div
          className="
            relative z-10
            h-[420px] w-[240px]
            rounded-[46px]
            border-[6px] border-[#252525]
            bg-[#0d0d0d]
            p-[4px]
            shadow-[0_18px_45px_rgba(0,0,0,0.18)]
          "
        >
          {/* Outer metallic edge */}
          <div
            className="
              pointer-events-none
              absolute -inset-[2px]
              rounded-[48px]
              border border-white/[0.18]
            "
          />

          {/* Inner dark edge */}
          <div
            className="
              pointer-events-none
              absolute inset-[2px]
              rounded-[41px]
              border border-black
            "
          />

          {/* ==================================================
              SCREEN
          ================================================== */}

          <div
            className="
              relative
              h-full w-full
              overflow-hidden
              rounded-[38px]
              bg-[#f8f8f8]
            "
          >
            {/* Subtle screen edge */}
            <div
              className="
                pointer-events-none
                absolute inset-0 z-50
                rounded-[38px]
                ring-1 ring-black/[0.04]
              "
            />

            {/* =================================================
                ORANGE HEADER
            ================================================= */}

            <div
              className="
                absolute inset-x-0 top-0
                h-[205px]
                bg-[#ff913f]
              "
            />

            {/* =================================================
                DYNAMIC ISLAND
            ================================================= */}

            <div
              className="
                absolute left-1/2 top-[8px] z-40
                h-[20px] w-[73px]
                -translate-x-1/2
                rounded-full
                bg-black
                shadow-[inset_0_1px_2px_rgba(255,255,255,0.08)]
              "
            >
              {/* Camera */}
              <div
                className="
                  absolute right-[8px] top-1/2
                  h-[4px] w-[4px]
                  -translate-y-1/2
                  rounded-full
                  bg-[#172554]
                "
              />
            </div>

            {/* =================================================
                STATUS
            ================================================= */}

            <div
              className="
                absolute inset-x-0 top-[11px] z-30
                flex items-center justify-between
                px-[22px]
                text-[7px]
                font-semibold
                text-black
              "
            >
              <span>9:41</span>

              <div className="flex items-center gap-[3px]">
                <span>▰</span>
                <span>◒</span>
                <span>━</span>
              </div>
            </div>

            {/* =================================================
                BROWSER URL
            ================================================= */}

            <div
              className="
                absolute left-4 right-4 top-10 z-20
                flex h-11
                items-center gap-2
                rounded-full
                border border-white/40
                bg-white/10
                px-4
                text-[9px]
                text-white
                backdrop-blur-sm
              "
            >
              <Globe className="h-4 w-4 shrink-0" />

              <span className="truncate">
                {displayUrl.replace(/^https?:\/\//, "")}
              </span>
            </div>

            {/* =================================================
                MAIN WEBSITE CARD

                CONTENT IS UNCHANGED
            ================================================= */}

            <div
              className="
                absolute
                bottom-3
                left-3
                right-3
                top-[100px]
                rounded-sm
                bg-white
                px-3
                pb-4
                pt-3
                shadow-sm
              "
            >
              {/* Image placeholder */}
              <div
                className="
                  h-[168px]
                  w-full
                  rounded-sm
                  bg-gradient-to-br
                  from-gray-200
                  to-gray-300
                "
              />

              {/* Text placeholders */}
              <div className="mt-6 space-y-3 px-1">
                <div className="h-3 w-full rounded-full bg-gray-200" />

                <div className="h-3 w-full rounded-full bg-gray-200" />

                <div className="mx-auto h-3 w-[75%] rounded-full bg-gray-200" />
              </div>

              {/* Button */}
              <div className="mt-10 rounded-sm bg-[#e5e7eb] p-3">
                <div className="mx-auto h-3 w-[75%] rounded-full bg-gray-400" />
              </div>

              {/* Actual URL */}
              {websiteUrl && (
                <div className="mt-4 flex items-center justify-center gap-1 text-[8px] text-[#20c75a]">
                  <span className="max-w-[150px] truncate">
                    {displayUrl}
                  </span>

                  <ExternalLink className="h-3 w-3 shrink-0" />
                </div>
              )}
            </div>

            {/* =================================================
                HOME INDICATOR
            ================================================= */}

            <div
              className="
                absolute bottom-[7px] left-1/2 z-40
                h-[3px] w-[73px]
                -translate-x-1/2
                rounded-full
                bg-black
              "
            />
          </div>
        </div>
      </div>
    </div>
  );
}
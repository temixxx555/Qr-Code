"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import api from "@/lib/axios";
import { qrTypes } from "./type-catalog";
import QrContentForm from "./QrContentForm";
import QrPhonePreview from "./QrPhonePreview";
import QrDownload from "./QrDownload";
import MobilePreview from "./MobilePreview";
import { Field } from "./types/controls";
import { validateContent, wifiPayload } from "@/lib/qr-content";
import {
  editorDesign,
  storedDesign,
  contrastWarning,
} from "@/lib/qr-design";

const QrDesignForm = dynamic(() => import("./QrDesignForm"), {
  ssr: false,
  loading: () => <p className="p-10 text-center">Loading designer…</p>,
});

export default function QrBuilder({ id }) {
  const [type, setType] = useState("website");
  const [hoveredType, setHoveredType] = useState(null);
  const [step, setStep] = useState(1);
  const [drafts, setDrafts] = useState({});
  const [design, setDesign] = useState({});
  const [name, setName] = useState("");
  const [folderId, setFolderId] = useState("");
  const [folders, setFolders] = useState([]);
  const [saved, setSaved] = useState(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState("");
  const saving = useRef(false);

  useEffect(() => {
    let alive = true;

    api
      .get("/folders")
      .then(({ data }) => {
        if (alive) setFolders(data.folders || []);
      })
      .catch(() => {});

    if (id) {
      api
        .get(`/qr/${id}`)
        .then(({ data }) => {
          if (!alive) return;

          const q = data.qrCode;
          const t = q.type === "app" ? "apps" : q.type;

          setSaved(q);
          setType(t);
          setName(q.name);
          setFolderId(q.folderId || "");

          setDrafts({
            [t]: {
              ...q.content,
              websiteUrl:
                q.content.websiteUrl ||
                (t === "website" ? q.content.url : undefined),
              qrName: q.name,
            },
          });

          setDesign(editorDesign(q.design));
          setStep(2);
        })
        .catch((e) => {
          if (alive) {
            setError(
              e.response?.data?.message || "Could not load QR code.",
            );
          }
        })
        .finally(() => {
          if (alive) setLoading(false);
        });
    }

    return () => {
      alive = false;
    };
  }, [id]);

  const content = drafts[type] || {};

  const validation =
    validateContent(type, content) ||
    (content.passwordEnabled &&
    !saved?.content?.passwordEnabled &&
    (!content.password || content.password.length < 8)
      ? "Enter a protection password with at least 8 characters."
      : null);

  const selected =
    qrTypes.find((t) => t.id === type) || qrTypes[0];

  /*
   * Hovering a QR type only changes what is shown in the phone preview.
   * Clicking the button is what actually changes the selected QR type
   * and moves the user to Step 2.
   */
  const previewType = hoveredType || type;
  const previewContent = drafts[previewType] || {};

  const previewItem =
    qrTypes.find((t) => t.id === previewType) || selected;

  const update = (next) => {
    setDrafts((prev) => ({
      ...prev,
      [type]: next,
    }));

    if (
      next.qrName !== undefined &&
      next.qrName !== content.qrName
    ) {
      setName(next.qrName);
    }
  };

  const payload =
    type === "wifi" && !validation
      ? wifiPayload(content)
      : saved
        ? new URL(
            saved.qrUrl,
            typeof window !== "undefined"
              ? window.location.origin
              : "https://example.invalid",
          ).href
        : "";

  async function save() {
    if (saving.current || validation) return null;

    saving.current = true;
    setBusy(true);
    setError("");

    try {
      const clean = { ...content };

      delete clean.qrName;
      delete clean.design;

      const body = {
        name: name.trim() || `${selected.label} QR`,
        type,
        content: clean,
        design: storedDesign(design),
        folderId: folderId || null,
      };

      const response = saved
        ? await api.patch(
            `/qr/${saved._id || saved.id}`,
            body,
          )
        : await api.post("/qr", body);

      setSaved(response.data.qrCode);

      return response.data.qrCode;
    } catch (e) {
      setError(
        e.response?.data?.message ||
          "Could not save. Check your connection and try again.",
      );

      return null;
    } finally {
      saving.current = false;
      setBusy(false);
    }
  }

  async function select(next) {
    if (saved && next !== type) {
      if (next === "wifi" || type === "wifi") {
        setError("Static WiFi codes cannot change type.");
        return;
      }

      if (
        !window.confirm(
          "Change this QR's content type? The printed URL stays the same. Incompatible content will be replaced when you save.",
        )
      ) {
        return;
      }
    }

    setType(next);
    setStep(2);
    setError("");
  }

  if (loading) {
    return (
      <p className="p-20 text-center">
        Loading your QR code…
      </p>
    );
  }

  if (id && !saved) {
    return (
      <p
        role="alert"
        className="p-10 text-red-600"
      >
        {error || "QR not found."}
      </p>
    );
  }

  /*
   * Normal preview used throughout Steps 2–4.
   */
  const preview = (
    <QrPhonePreview
      type={type}
      content={content}
      design={design}
      valid={!validation}
      qrUrl={payload}
      busy={busy}
      onPrepare={save}
    />
  );

  return (
    <main className="min-h-screen bg-[#f8faf9] text-slate-900">

      {/* Header */}
      <header className="border-b bg-white px-5 py-3">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link
            href="/dashboard/qrcodes"
            className="font-bold text-emerald-700"
          >
            ▦ QR Generator
          </Link>

          <Link
            href="/dashboard/qrcodes"
            className="text-sm text-slate-500"
          >
            My QR Codes
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-2 sm:px-7">

        {/* Progress */}
        <ol
          aria-label="Builder progress"
          className="mb-5 grid grid-cols-4 gap-2"
        >
          {[
            "QR Type",
            "Content",
            "Design",
            "Download",
          ].map((label, i) => (
            <li
              key={label}
              aria-current={
                step === i + 1 ? "step" : undefined
              }
              className={`border-b-2 pb-3 text-center text-xs font-semibold sm:text-sm ${
                step >= i + 1
                  ? "border-emerald-500 text-emerald-700"
                  : "border-slate-200 text-slate-400"
              }`}
            >
              <span className="mr-1">
                {step > i + 1 ? "✓" : i + 1}.
              </span>

              {label}
            </li>
          ))}
        </ol>

        {/* Page title */}
        <div className="mb-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
            {saved
              ? "Your QR workspace"
              : "Create something worth scanning"}
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            {step === 1
              ? "What would you like to share?"
              : step === 2
                ? `Create your ${selected.label} experience`
                : step === 3
                  ? "Make your QR your own"
                  : "Ready to share"}
          </h1>
        </div>

        {/* Error */}
        {error && (
          <p
            role="alert"
            className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        {/* =========================================================
            STEP 1 — QR TYPE SELECTION
            ========================================================= */}

        {step === 1 && (
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_390px]">

            {/* QR TYPE BUTTONS */}
            <div className="grid content-start grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">

              {qrTypes.map((item) => {
                const Icon = item.icon;

                const isSelected =
                  item.id === type;

                const isHovered =
                  item.id === hoveredType;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => select(item.id)}
                    onMouseEnter={() =>
                      setHoveredType(item.id)
                    }
                    onMouseLeave={() =>
                      setHoveredType(null)
                    }
                    onFocus={() =>
                      setHoveredType(item.id)
                    }
                    onBlur={() =>
                      setHoveredType(null)
                    }
                    aria-pressed={isSelected}
                    className={`group relative flex min-h-24 flex-col items-center justify-center overflow-hidden rounded-2xl border bg-white px-3 py-4 text-center transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 ${
                      isSelected
                        ? "border-emerald-500 bg-emerald-50/50 shadow-sm"
                        : "border-slate-200"
                    }`}
                  >

                    {/* Green top indicator */}
                    <span
                      className={`absolute inset-x-0 top-0 h-1 bg-[#20c75a] transition-opacity ${
                        isSelected || isHovered
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                    />

                    {/* Icon */}
                    <span
                      className={`mb-2 flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 ${
                        isSelected || isHovered
                          ? "scale-105 bg-emerald-100 text-[#20c75a]"
                          : "bg-emerald-50 text-emerald-600"
                      }`}
                    >
                      <Icon
                        size={20}
                        strokeWidth={2}
                      />
                    </span>

                    {/* Label only — no long description */}
                    <span
                      className={`text-sm font-bold leading-tight ${
                        isSelected
                          ? "text-[#20c75a]"
                          : "text-slate-900"
                      }`}
                    >
                      {item.label}
                    </span>
                  </button>
                );
              })}

            </div>

            {/* =====================================================
                DESKTOP PHONE PREVIEW
                ===================================================== */}

            <aside className="hidden lg:sticky lg:top-6 lg:block">

              <div className="flex justify-center overflow-hidden rounded-[28px] border border-slate-100 bg-white/70 px-2 py-4 shadow-sm">

                {/*
                 * Scale the existing phone preview slightly so it
                 * doesn't make the page too tall on laptop screens.
                 */}
                <div className="origin-top scale-[0.88] xl:scale-[0.94]">

                  <QrPhonePreview
                    type={previewType}
                    content={previewContent}
                    design={
                      previewType === type
                        ? design
                        : {}
                    }
                    valid={
                      previewType === type
                        ? !validation
                        : false
                    }
                    qrUrl={
                      previewType === type
                        ? payload
                        : ""
                    }
                    busy={busy}
                    onPrepare={
                      previewType === type
                        ? save
                        : undefined
                    }
                  />

                </div>
              </div>

              {/* Currently previewed type */}
              <p className="mt-2 text-center text-sm font-semibold text-slate-700">
                {previewItem.label}
              </p>

            </aside>

            {/* =====================================================
                MOBILE / TABLET PREVIEW
                ===================================================== */}

            {/* <div className="lg:hidden">
              {preview}
            </div> */}

          </div>
        )}

        {/* =========================================================
            STEP 2 — CONTENT
            ========================================================= */}

        {step === 2 && (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">

            <div className="space-y-4">

              <QrContentForm
                type={type}
                value={content}
                onChange={update}
              />

              <section className="space-y-4 rounded-2xl border bg-white p-5">

                <Field
                  label="QR code name"
                  value={name}
                  onChange={setName}
                />

                <label className="block text-sm font-medium">
                  Folder

                  <select
                    value={folderId}
                    onChange={(e) =>
                      setFolderId(e.target.value)
                    }
                    className="mt-2 block w-full rounded-xl border p-3"
                  >
                    <option value="">
                      No folder
                    </option>

                    {folders.map((f) => (
                      <option
                        key={f._id}
                        value={f._id}
                      >
                        {f.name}
                      </option>
                    ))}
                  </select>
                </label>

              </section>

              {validation && (
                <p
                  role="status"
                  className="text-sm text-slate-500"
                >
                  {validation}
                </p>
              )}

              {saved && (
                <button
                  disabled={busy || !!validation}
                  onClick={save}
                  className="action"
                >
                  {busy
                    ? "Saving…"
                    : "Save content for live scans"}
                </button>
              )}

            </div>

            {/* Desktop preview */}
            <aside className="hidden self-start lg:sticky lg:top-6 lg:block">
              {preview}
            </aside>

            {/* Mobile preview */}
            <MobilePreview>
              {preview}
            </MobilePreview>

          </div>
        )}

        {/* =========================================================
            STEP 3 — DESIGN
            ========================================================= */}

        {step === 3 && (
          <>
            <p className="mb-4 text-sm text-amber-700">
              {contrastWarning(design)}
            </p>

            <QrDesignForm
              url={payload}
              value={design}
              onChange={setDesign}
            />
          </>
        )}

        {/* =========================================================
            STEP 4 — DOWNLOAD
            ========================================================= */}

        {step === 4 && saved && (
          <QrDownload
            qr={saved}
            data={payload}
            design={design}
          />
        )}

        {/* =========================================================
            BOTTOM NAVIGATION
            ========================================================= */}

        {step > 1 && (
          <div className="mt-8 flex items-center justify-between border-t pt-6">

            <button
              disabled={busy}
              className="action"
              onClick={() =>
                setStep(step - 1)
              }
            >
              Back
            </button>

            {step < 4 && (
              <button
                disabled={busy || !!validation}
                className="rounded-xl bg-[#20c75a] px-6 py-3 font-semibold text-white disabled:opacity-40"
                onClick={async () => {
                  if (await save()) {
                    setStep(step + 1);
                  }
                }}
              >
                {busy
                  ? "Saving…"
                  : step === 2
                    ? "Continue to Design"
                    : "Save & Download"}
              </button>
            )}

          </div>
        )}

      </div>
    </main>
  );
}
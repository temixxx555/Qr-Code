"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import QrGraphic from "@/components/Qr/QrGraphic";
import FolderManager from "@/components/Qr/FolderManager";
import { QR_TYPES, typeLabel, wifiPayload } from "@/lib/qr-content";
import { downloadQr } from "@/lib/download-qr";
export default function Page() {
  const [codes, setCodes] = useState([]),
    [folders, setFolders] = useState([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [query, setQuery] = useState(""),
    [status, setStatus] = useState("all"),
    [type, setType] = useState("all"),
    [folder, setFolder] = useState("all"),
    [sort, setSort] = useState("newest"),
    [page, setPage] = useState(1),
    [busy, setBusy] = useState("");
  useEffect(() => {
    let alive = true;
    Promise.all([api.get("/qr"), api.get("/folders")])
      .then(([q, f]) => {
        if (alive) {
          setCodes(q.data.qrCodes);
          setFolders(f.data.folders);
        }
      })
      .catch(() => {
        if (alive)
          setError("Could not load your QR workspace. Please refresh.");
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);
  const visible = useMemo(
    () =>
      codes
        .filter(
          (c) =>
            (status === "all" ||
              c.status === status ||
              (status === "paused" && c.status === "inactive")) &&
            (type === "all" || c.type === type) &&
            (folder === "all" || (c.folderId || "") === folder) &&
            (c.name + " " + c.type).toLowerCase().includes(query.toLowerCase()),
        )
        .sort((a, b) =>
          sort === "scans"
            ? (b.scanCount || 0) - (a.scanCount || 0)
            : sort === "name"
              ? a.name.localeCompare(b.name)
              : sort === "updated"
                ? new Date(b.updatedAt) - new Date(a.updatedAt)
                : new Date(b.createdAt) - new Date(a.createdAt),
        ),
    [codes, status, type, folder, query, sort],
  );
  const currentPage = Math.min(
    page,
    Math.max(1, Math.ceil(visible.length / 12)),
  );
  const dataFor = (c) =>
    c.type === "wifi"
      ? wifiPayload(c.content)
      : new URL(c.qrUrl || "/q/" + c.shortCode, window.location.origin).href;
  async function action(c, work) {
    if (busy) return;
    setBusy(c._id);
    setError("");
    try {
      await work();
    } catch (e) {
      setError(
        e.response?.data?.message || e.message || "Action failed. Try again.",
      );
    } finally {
      setBusy("");
    }
  }
  async function update(c, body) {
    const { data } = await api.patch("/qr/" + c._id, body);
    setCodes((prev) => prev.map((q) => (q._id === c._id ? data.qrCode : q)));
  }
  return (
    <main className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-emerald-600">Your workspace</p>
          <h1 className="text-3xl font-bold">My QR Codes</h1>
          <p className="mt-1 text-sm text-slate-500">
            Update what you share. Keep the QR you printed.
          </p>
        </div>
        <Link
          href="/qr"
          className="rounded-xl bg-[#20c75a] px-5 py-3 font-semibold text-white"
        >
          + Create QR code
        </Link>
      </div>
      <FolderManager folders={folders} onChange={setFolders} />
      <div className="flex flex-wrap gap-3 rounded-xl border bg-white p-4">
        <input
          aria-label="Search QR codes"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          placeholder="Search QR codes…"
          className="h-10 min-w-40 flex-1 rounded-lg border px-3"
        />
        {[
          [
            "Status",
            status,
            setStatus,
            [
              ["all", "All statuses"],
              ["active", "Active"],
              ["paused", "Paused"],
              ["archived", "Archived"],
            ],
          ],
          [
            "Type",
            type,
            setType,
            [["all", "All types"], ...QR_TYPES.map((t) => [t, typeLabel(t)])],
          ],
          [
            "Folder",
            folder,
            setFolder,
            [
              ["all", "All folders"],
              ["", "No folder"],
              ...folders.map((f) => [f._id, f.name]),
            ],
          ],
          [
            "Sort",
            sort,
            setSort,
            [
              ["newest", "Newest"],
              ["updated", "Last updated"],
              ["scans", "Most scans"],
              ["name", "Name"],
            ],
          ],
        ].map(([label, value, setter, options]) => (
          <select
            key={label}
            aria-label={label}
            className="rounded-lg border p-2 text-sm"
            value={value}
            onChange={(e) => {
              setter(e.target.value);
              setPage(1);
            }}
          >
            {options.map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        ))}
      </div>
      {error && (
        <p
          role="alert"
          className="rounded-xl bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </p>
      )}
      {loading ? (
        <p className="py-20 text-center">Loading QR codes…</p>
      ) : visible.length ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {visible.slice((currentPage - 1) * 12, currentPage * 12).map((c) => (
            <article
              key={c._id}
              className="rounded-2xl border bg-white p-5 shadow-sm"
            >
              <div className="flex gap-3">
                <div className="hidden shrink-0 sm:block">
                  <QrGraphic data={dataFor(c)} design={c.design} size={100} />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-semibold text-emerald-600">
                    {typeLabel(c.type)}
                  </span>
                  <h2 className="mt-1 break-words text-lg font-bold">
                    {c.name}
                  </h2>
                  <p className="mt-2 truncate text-xs text-slate-500">
                    {c.content?.websiteUrl ||
                      c.content?.url ||
                      c.content?.title ||
                      c.content?.name ||
                      c.content?.ssid ||
                      "Hosted landing page"}
                  </p>
                  <p className="mt-2 text-xs text-slate-500">
                    {folders.find((f) => f._id === c.folderId)?.name ||
                      "No folder"}{" "}
                    · {c.status === "inactive" ? "Paused" : c.status}
                  </p>
                  <p className="mt-3 text-xs">
                    {c.type === "wifi"
                      ? "Static WiFi code"
                      : (c.scanCount || 0) + " scans"}
                  </p>
                </div>
              </div>
              <div className="my-3 flex justify-between gap-2 border-t pt-3 text-[11px] text-slate-400">
                <span>
                  Created {new Date(c.createdAt).toLocaleDateString()}
                </span>
                <span>
                  Updated {new Date(c.updatedAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <a
                  href={"/q/" + c.shortCode}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="action"
                >
                  View
                </a>
                <Link
                  href={"/dashboard/qrcodes/" + c._id + "/edit"}
                  className="action"
                >
                  Edit content / design
                </Link>
                {c.type !== "wifi" && (
                  <Link
                    href={"/dashboard/qrcodes/" + c._id + "/analytics"}
                    className="action"
                  >
                    Analytics
                  </Link>
                )}
                <button
                  disabled={!!busy}
                  className="action"
                  onClick={() =>
                    action(c, () =>
                      downloadQr({
                        data: dataFor(c),
                        design: c.design,
                        name: c.name,
                      }),
                    )
                  }
                >
                  Download PNG
                </button>
                <button
                  disabled={!!busy}
                  className="action"
                  onClick={() =>
                    action(c, () =>
                      update(c, {
                        status: c.status === "active" ? "paused" : "active",
                      }),
                    )
                  }
                >
                  {c.status === "active" ? "Pause" : "Activate"}
                </button>
                <button
                  disabled={!!busy || c.content?.passwordEnabled}
                  title={
                    c.content?.passwordEnabled
                      ? "Remove password protection before duplicating"
                      : ""
                  }
                  className="action"
                  onClick={() =>
                    action(c, async () => {
                      const { data } = await api.post("/qr", {
                        name: (c.name + " copy").slice(0, 100),
                        type: c.type,
                        content: c.content,
                        design: c.design,
                        folderId: c.folderId,
                      });
                      setCodes((prev) => [data.qrCode, ...prev]);
                    })
                  }
                >
                  Duplicate
                </button>
                <button
                  disabled={!!busy}
                  className="action"
                  onClick={() =>
                    action(c, () => update(c, { status: "archived" }))
                  }
                >
                  Archive
                </button>
                <button
                  disabled={!!busy}
                  className="action"
                  onClick={() => {
                    if (
                      window.confirm(
                        "Permanently delete " +
                          c.name +
                          "? Printed QR codes will stop working.",
                      )
                    )
                      action(c, async () => {
                        await api.delete("/qr/" + c._id);
                        setCodes((prev) => prev.filter((q) => q._id !== c._id));
                      });
                  }}
                >
                  Delete
                </button>
                <select
                  disabled={!!busy}
                  aria-label={"Move " + c.name + " to folder"}
                  value={c.folderId || ""}
                  onChange={(e) =>
                    action(c, () => update(c, { folderId: e.target.value }))
                  }
                  className="rounded-lg border p-2 text-xs"
                >
                  <option value="">No folder</option>
                  {folders.map((f) => (
                    <option key={f._id} value={f._id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>
              {busy === c._id && (
                <p role="status" className="mt-2 text-xs text-emerald-600">
                  Working…
                </p>
              )}
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed p-16 text-center">
          <h2 className="text-xl font-semibold">
            {codes.length
              ? "No matching QR codes"
              : "Your QR collection starts here"}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            {codes.length
              ? "Try another search or filter."
              : "Create your first QR and share something useful."}
          </p>
        </div>
      )}
      <div className="flex items-center justify-center gap-4 text-sm">
        <button
          disabled={currentPage === 1}
          className="action disabled:opacity-30"
          onClick={() => setPage(currentPage - 1)}
        >
          Previous
        </button>
        <span>
          {currentPage} / {Math.max(1, Math.ceil(visible.length / 12))}
        </span>
        <button
          disabled={currentPage * 12 >= visible.length}
          className="action disabled:opacity-30"
          onClick={() => setPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </main>
  );
}

"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";

import api from "@/lib/axios";
import QrGraphic from "@/components/Qr/QrGraphic";
import FolderManager from "@/components/Qr/FolderManager";

import { QR_TYPES, typeLabel, wifiPayload } from "@/lib/qr-content";

import { downloadQr } from "@/lib/download-qr";

const ITEMS_PER_PAGE = 12;

/* -------------------------------------------------------
   QR CARD SKELETON
------------------------------------------------------- */

function QrCardSkeleton() {
  return (
    <div className='animate-pulse rounded-2xl border bg-white p-4 shadow-sm sm:p-5'>
      <div className='flex gap-3 sm:gap-4'>
        <div className='h-18 w-18 shrink-0 rounded-xl bg-slate-200 sm:h-25 sm:w-25' />

        <div className='min-w-0 flex-1'>
          <div className='h-3 w-20 rounded bg-slate-200' />

          <div className='mt-3 h-5 w-32 rounded bg-slate-200 sm:w-40' />

          <div className='mt-4 h-3 w-2/3 rounded bg-slate-100' />

          <div className='mt-3 h-3 w-28 rounded bg-slate-100 sm:w-32' />

          <div className='mt-3 h-3 w-20 rounded bg-slate-100' />
        </div>
      </div>

      <div className='my-4 border-t' />

      <div className='grid grid-cols-2 gap-2 sm:flex sm:flex-wrap'>
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className='h-8 w-full rounded-lg bg-slate-100 sm:w-20'
          />
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------
   MAIN PAGE
------------------------------------------------------- */

export default function Page() {
  const [codes, setCodes] = useState([]);
  const [folders, setFolders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [foldersLoading, setFoldersLoading] = useState(true);

  const [error, setError] = useState("");

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");
  const [folder, setFolder] = useState("all");
  const [sort, setSort] = useState("newest");

  const [page, setPage] = useState(1);

  const [busy, setBusy] = useState("");

  /* -------------------------------------------------------
     LOAD QR CODES
  ------------------------------------------------------- */

  useEffect(() => {
    let alive = true;

    async function loadQrCodes() {
      try {
        setLoading(true);
        setError("");

        const { data } = await api.get("/qr");

        if (!alive) return;

        setCodes(data?.qrCodes || []);
      } catch (err) {
        if (!alive) return;

        console.error("Failed to load QR codes:", err);

        setError(
          err?.response?.data?.message ||
            "Could not load your QR codes. Please refresh.",
        );
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    }

    loadQrCodes();

    return () => {
      alive = false;
    };
  }, []);

  /* -------------------------------------------------------
     LOAD FOLDERS
  ------------------------------------------------------- */

  useEffect(() => {
    let alive = true;

    async function loadFolders() {
      try {
        setFoldersLoading(true);

        const { data } = await api.get("/folders");

        if (!alive) return;

        setFolders(data?.folders || []);
      } catch (err) {
        console.error("Failed to load folders:", err);
      } finally {
        if (alive) {
          setFoldersLoading(false);
        }
      }
    }

    loadFolders();

    return () => {
      alive = false;
    };
  }, []);

  /* -------------------------------------------------------
     FOLDER LOOKUP
  ------------------------------------------------------- */

  const folderMap = useMemo(() => {
    const map = new Map();

    folders.forEach((item) => {
      map.set(item._id, item.name);
    });

    return map;
  }, [folders]);

  /* -------------------------------------------------------
     FILTER + SORT
  ------------------------------------------------------- */

  const visible = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const filtered = codes.filter((c) => {
      const matchesStatus =
        status === "all" ||
        c.status === status ||
        (status === "paused" && c.status === "inactive");

      const matchesType = type === "all" || c.type === type;

      const matchesFolder = folder === "all" || (c.folderId || "") === folder;

      const searchableText = `${c.name || ""} ${c.type || ""}`.toLowerCase();

      const matchesQuery =
        !normalizedQuery || searchableText.includes(normalizedQuery);

      return matchesStatus && matchesType && matchesFolder && matchesQuery;
    });

    return filtered.sort((a, b) => {
      switch (sort) {
        case "scans":
          return (b.scanCount || 0) - (a.scanCount || 0);

        case "name":
          return (a.name || "").localeCompare(b.name || "");

        case "updated":
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );

        case "newest":
        default:
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      }
    });
  }, [codes, status, type, folder, query, sort]);

  /* -------------------------------------------------------
     PAGINATION
  ------------------------------------------------------- */

  const totalPages = Math.max(1, Math.ceil(visible.length / ITEMS_PER_PAGE));

  const currentPage = Math.min(page, totalPages);

  const paginatedCodes = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;

    const end = start + ITEMS_PER_PAGE;

    return visible.slice(start, end);
  }, [visible, currentPage]);

  /* -------------------------------------------------------
     GENERATE QR PAYLOAD
  ------------------------------------------------------- */

  const dataFor = useCallback((c) => {
    if (c.type === "wifi") {
      return wifiPayload(c.content);
    }

    const path = c.qrUrl || `/q/${c.shortCode}`;

    return new URL(path, window.location.origin).href;
  }, []);

  /* -------------------------------------------------------
     RUN CARD ACTION
  ------------------------------------------------------- */

  async function action(c, work) {
    if (busy) return;

    try {
      setBusy(c._id);
      setError("");

      await work();
    } catch (err) {
      console.error("QR action failed:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Action failed. Try again.",
      );
    } finally {
      setBusy("");
    }
  }

  /* -------------------------------------------------------
     UPDATE QR CODE
  ------------------------------------------------------- */

  async function update(c, body) {
    const { data } = await api.patch(`/qr/${c._id}`, body);

    setCodes((previous) =>
      previous.map((qr) => (qr._id === c._id ? data.qrCode : qr)),
    );
  }

  /* -------------------------------------------------------
     FILTER CHANGE HELPER
  ------------------------------------------------------- */

  function changeFilter(setter, value) {
    setter(value);
    setPage(1);
  }

  /* -------------------------------------------------------
     RENDER
  ------------------------------------------------------- */

  return (
    <main className='mx-auto w-full max-w-6xl space-y-5 px-3 pb-6 sm:space-y-6 sm:px-4 lg:px-0'>
      {/* HEADER */}

      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='min-w-0'>
          <p className='text-sm font-medium text-emerald-600'>Your workspace</p>

          <h1 className='text-2xl font-bold sm:text-3xl'>My QR Codes</h1>

          <p className='mt-1 text-sm text-slate-500'>
            Update what you share. Keep the QR you printed.
          </p>
        </div>

        <Link
          href='/qr'
          className='inline-flex w-full shrink-0 items-center justify-center rounded-xl bg-[#20c75a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1bb34f] sm:w-auto'
        >
          + Create QR code
        </Link>
      </div>

      {/* FOLDER MANAGER */}

      <div className='relative min-w-0'>
        <FolderManager folders={folders} onChange={setFolders} />

        {foldersLoading && (
          <p className='mt-2 text-xs text-slate-400'>Loading folders…</p>
        )}
      </div>

      {/* FILTERS */}

      <div className='grid grid-cols-1 gap-3 rounded-xl border bg-white p-3 sm:grid-cols-2 sm:p-4 lg:grid-cols-5'>
        <input
          aria-label='Search QR codes'
          value={query}
          onChange={(event) => changeFilter(setQuery, event.target.value)}
          placeholder='Search QR codes…'
          className='h-10 w-full min-w-0 rounded-lg border px-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 sm:col-span-2 lg:col-span-1'
        />

        {/* Status */}

        <select
          aria-label='Status'
          value={status}
          onChange={(event) => changeFilter(setStatus, event.target.value)}
          className='h-10 w-full min-w-0 rounded-lg border px-2 text-sm outline-none focus:border-emerald-500'
        >
          <option value='all'>All statuses</option>

          <option value='active'>Active</option>

          <option value='paused'>Paused</option>

          <option value='archived'>Archived</option>
        </select>

        {/* Type */}

        <select
          aria-label='Type'
          value={type}
          onChange={(event) => changeFilter(setType, event.target.value)}
          className='h-10 w-full min-w-0 rounded-lg border px-2 text-sm outline-none focus:border-emerald-500'
        >
          <option value='all'>All types</option>

          {QR_TYPES.map((qrType) => (
            <option key={qrType} value={qrType}>
              {typeLabel(qrType)}
            </option>
          ))}
        </select>

        {/* Folder */}

        <select
          aria-label='Folder'
          value={folder}
          disabled={foldersLoading}
          onChange={(event) => changeFilter(setFolder, event.target.value)}
          className='h-10 w-full min-w-0 rounded-lg border px-2 text-sm outline-none focus:border-emerald-500 disabled:cursor-not-allowed disabled:opacity-50'
        >
          <option value='all'>
            {foldersLoading ? "Loading folders..." : "All folders"}
          </option>

          <option value=''>No folder</option>

          {folders.map((item) => (
            <option key={item._id} value={item._id}>
              {item.name}
            </option>
          ))}
        </select>

        {/* Sort */}

        <select
          aria-label='Sort'
          value={sort}
          onChange={(event) => changeFilter(setSort, event.target.value)}
          className='h-10 w-full min-w-0 rounded-lg border px-2 text-sm outline-none focus:border-emerald-500'
        >
          <option value='newest'>Newest</option>

          <option value='updated'>Last updated</option>

          <option value='scans'>Most scans</option>

          <option value='name'>Name</option>
        </select>
      </div>

      {/* ERROR */}

      {error && (
        <div
          role='alert'
          className='flex items-start justify-between gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700 sm:items-center'
        >
          <span className='min-w-0 wrap-break-word'>{error}</span>

          <button
            onClick={() => setError("")}
            className='shrink-0 font-semibold'
          >
            ×
          </button>
        </div>
      )}

      {/* LOADING */}

      {loading ? (
        <div className='grid gap-4 xl:grid-cols-2'>
          {Array.from({ length: 6 }).map((_, index) => (
            <QrCardSkeleton key={index} />
          ))}
        </div>
      ) : paginatedCodes.length ? (
        /* QR LIST */

        <div className='grid gap-4 xl:grid-cols-2'>
          {paginatedCodes.map((c) => {
            const isBusy = busy === c._id;

            const folderName = folderMap.get(c.folderId) || "No folder";

            return (
              <article
                key={c._id}
                className='min-w-0 rounded-2xl border bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5'
              >
                {/* MAIN CONTENT */}

                <div className='flex min-w-0 gap-3'>
                  {/* QR */}

                  <div className='shrink-0 sm:hidden'>
                    <QrGraphic data={dataFor(c)} design={c.design} size={72} />
                  </div>

                  <div className='hidden shrink-0 sm:block'>
                    <QrGraphic data={dataFor(c)} design={c.design} size={100} />
                  </div>

                  {/* INFORMATION */}

                  <div className='min-w-0 flex-1'>
                    <span className='text-xs font-semibold text-emerald-600'>
                      {typeLabel(c.type)}
                    </span>

                    <h2 className='mt-1 wrap-break-word text-base font-bold sm:text-lg'>
                      {c.name}
                    </h2>

                    <p
                      className='mt-2 max-w-full truncate text-xs text-slate-500'
                      title={
                        c.content?.websiteUrl ||
                        c.content?.url ||
                        c.content?.title ||
                        c.content?.name ||
                        c.content?.ssid ||
                        "Hosted landing page"
                      }
                    >
                      {c.content?.websiteUrl ||
                        c.content?.url ||
                        c.content?.title ||
                        c.content?.name ||
                        c.content?.ssid ||
                        "Hosted landing page"}
                    </p>

                    <p className='mt-2 wrap-break-word text-xs text-slate-500'>
                      {folderName}
                      {" · "}
                      {c.status === "inactive" ? "Paused" : c.status}
                    </p>

                    <p className='mt-3 text-xs'>
                      {c.type === "wifi"
                        ? "Static WiFi code"
                        : `${c.scanCount || 0} scans`}
                    </p>
                  </div>
                </div>

                {/* DATES */}

                <div className='my-3 flex flex-col gap-1 border-t pt-3 text-[11px] text-slate-400 sm:flex-row sm:justify-between sm:gap-2'>
                  <span>
                    Created {new Date(c.createdAt).toLocaleDateString()}
                  </span>

                  <span>
                    Updated {new Date(c.updatedAt).toLocaleDateString()}
                  </span>
                </div>

                {/* ACTIONS */}

                <div className='grid grid-cols-2 gap-2 sm:flex sm:flex-wrap'>
                  {/* View */}

                  <a
                    href={`/q/${c.shortCode}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='action w-full justify-center text-center sm:w-auto'
                  >
                    View
                  </a>

                  {/* Edit */}

                  <Link
                    href={`/dashboard/qrcodes/${c._id}/edit`}
                    className='action w-full justify-center text-center sm:w-auto'
                  >
                    Edit content / design
                  </Link>

                  {/* Analytics */}

                  {c.type !== "wifi" && (
                    <Link
                      href={`/dashboard/qrcodes/${c._id}/analytics`}
                      className='action w-full justify-center text-center sm:w-auto'
                    >
                      Analytics
                    </Link>
                  )}

                  {/* Download */}

                  <button
                    disabled={!!busy}
                    className='action w-full justify-center disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto'
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

                  {/* Pause / Activate */}

                  <button
                    disabled={!!busy}
                    className='action w-full justify-center disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto'
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

                  {/* Duplicate */}

                  <button
                    disabled={!!busy || c.content?.passwordEnabled}
                    title={
                      c.content?.passwordEnabled
                        ? "Remove password protection before duplicating"
                        : ""
                    }
                    className='action w-full justify-center disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto'
                    onClick={() =>
                      action(c, async () => {
                        const { data } = await api.post("/qr", {
                          name: `${c.name} copy`.slice(0, 100),
                          type: c.type,
                          content: c.content,
                          design: c.design,
                          folderId: c.folderId,
                        });

                        setCodes((previous) => [data.qrCode, ...previous]);
                      })
                    }
                  >
                    Duplicate
                  </button>

                  {/* Archive */}

                  <button
                    disabled={!!busy}
                    className='action w-full justify-center disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto'
                    onClick={() =>
                      action(c, () =>
                        update(c, {
                          status: "archived",
                        }),
                      )
                    }
                  >
                    Archive
                  </button>

                  {/* Delete */}

                  <button
                    disabled={!!busy}
                    className='action w-full justify-center disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto'
                    onClick={() => {
                      const confirmed = window.confirm(
                        `Permanently delete ${c.name}? Printed QR codes will stop working.`,
                      );

                      if (!confirmed) {
                        return;
                      }

                      action(c, async () => {
                        await api.delete(`/qr/${c._id}`);

                        setCodes((previous) =>
                          previous.filter((qr) => qr._id !== c._id),
                        );
                      });
                    }}
                  >
                    Delete
                  </button>

                  {/* MOVE FOLDER */}

                  <select
                    disabled={!!busy || foldersLoading}
                    aria-label={`Move ${c.name} to folder`}
                    value={c.folderId || ""}
                    onChange={(event) =>
                      action(c, () =>
                        update(c, {
                          folderId: event.target.value,
                        }),
                      )
                    }
                    className='col-span-2 h-9 w-full min-w-0 rounded-lg border px-2 text-xs disabled:cursor-not-allowed disabled:opacity-50 sm:col-span-1 sm:w-auto'
                  >
                    <option value=''>No folder</option>

                    {folders.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* BUSY */}

                {isBusy && (
                  <p
                    role='status'
                    className='mt-2 text-xs font-medium text-emerald-600'
                  >
                    Working…
                  </p>
                )}
              </article>
            );
          })}
        </div>
      ) : (
        /* EMPTY STATE */

        <div className='rounded-2xl border border-dashed px-4 py-10 text-center sm:p-16'>
          <h2 className='text-lg font-semibold sm:text-xl'>
            {codes.length
              ? "No matching QR codes"
              : "Your QR collection starts here"}
          </h2>

          <p className='mt-2 text-sm text-slate-500'>
            {codes.length
              ? "Try another search or filter."
              : "Create your first QR and share something useful."}
          </p>

          {!codes.length && (
            <Link
              href='/qr'
              className='mt-6 inline-flex w-full items-center justify-center rounded-xl bg-[#20c75a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1bb34f] sm:w-auto'
            >
              Create your first QR
            </Link>
          )}
        </div>
      )}

      {/* PAGINATION */}

      {!loading && visible.length > 0 && (
        <div className='flex flex-col items-center justify-center gap-3 text-sm sm:flex-row sm:gap-4'>
          <button
            disabled={currentPage === 1}
            className='action w-full justify-center disabled:cursor-not-allowed disabled:opacity-30 sm:w-auto'
            onClick={() => setPage((previous) => Math.max(1, previous - 1))}
          >
            Previous
          </button>

          <span className='text-center text-slate-500'>
            Page <strong className='text-slate-800'>{currentPage}</strong> of{" "}
            <strong className='text-slate-800'>{totalPages}</strong>
          </span>

          <button
            disabled={currentPage >= totalPages}
            className='action w-full justify-center disabled:cursor-not-allowed disabled:opacity-30 sm:w-auto'
            onClick={() =>
              setPage((previous) => Math.min(totalPages, previous + 1))
            }
          >
            Next
          </button>
        </div>
      )}
    </main>
  );
}

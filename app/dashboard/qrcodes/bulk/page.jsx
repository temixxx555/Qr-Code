"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Download, Upload, CheckCircle2, AlertCircle } from "lucide-react";

import api from "@/lib/axios";
import { typeLabel } from "@/lib/qr-content";
import {
  BULK_TYPES,
  BULK_COLUMNS,
  BULK_LIMIT,
  templateCsv,
  rowsFromCsv,
} from "@/lib/bulk-qr";

const card = "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6";
const select =
  "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100";

export default function Page() {
  const [type, setType] = useState("website");
  const [folders, setFolders] = useState([]);
  const [folderId, setFolderId] = useState("");
  const [fileName, setFileName] = useState("");
  const [parsed, setParsed] = useState(null);
  const [results, setResults] = useState(null);
  const [busy, setBusy] = useState(false);
  const fileInput = useRef(null);

  useEffect(() => {
    api
      .get("/folders")
      .then(({ data }) => setFolders(data.folders || []))
      .catch(() => {});
  }, []);

  function reset(nextType = type) {
    setType(nextType);
    setParsed(null);
    setResults(null);
    setFileName("");
    if (fileInput.current) fileInput.current.value = "";
  }

  function downloadTemplate() {
    const blob = new Blob([templateCsv(type)], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${type}-qr-template.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  async function onFile(file) {
    setResults(null);
    if (!file) return;
    setFileName(file.name);
    if (file.size > 2 * 1024 * 1024) {
      setParsed({ error: "Use a CSV file under 2 MB." });
      return;
    }
    setParsed(rowsFromCsv(type, await file.text()));
  }

  const valid = parsed?.rows?.filter((r) => !r.error) || [];
  const invalid = parsed?.rows?.filter((r) => r.error) || [];

  async function create() {
    setBusy(true);
    try {
      const { data } = await api.post("/qr/bulk", {
        type,
        folderId: folderId || null,
        rows: valid.map(({ name, content }) => ({ name, content })),
      });
      const created = data.results.filter((r) => r.ok).length;
      setResults(data.results.map((r, i) => ({ ...r, row: valid[i] })));
      if (created) toast.success(`Created ${created} QR code${created === 1 ? "" : "s"}.`);
      else toast.error("No QR codes were created.");
    } catch (e) {
      toast.error(e.response?.data?.message || "Could not create QR codes.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className='mx-auto w-full max-w-5xl space-y-5 px-3 pb-6 sm:space-y-6 sm:px-4 lg:px-0'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='min-w-0'>
          <p className='text-sm font-medium text-emerald-600'>Your workspace</p>
          <h1 className='text-2xl font-bold sm:text-3xl'>Bulk create QR codes</h1>
          <p className='mt-1 text-sm text-slate-500'>
            Upload a CSV and create up to {BULK_LIMIT} QR codes of one type at
            once. You can restyle each one afterwards.
          </p>
        </div>
        <Link
          href='/dashboard/qrcodes'
          className='inline-flex shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50'
        >
          Back to my QR codes
        </Link>
      </div>

      <section className={card}>
        <h2 className='text-base font-semibold'>1. Choose a QR type</h2>
        <div className='mt-4 grid gap-4 sm:grid-cols-2'>
          <label className='block text-sm font-medium text-slate-700'>
            QR type
            <select
              className={`mt-2 ${select}`}
              value={type}
              onChange={(e) => reset(e.target.value)}
            >
              {BULK_TYPES.map((t) => (
                <option key={t} value={t}>
                  {typeLabel(t)}
                </option>
              ))}
            </select>
          </label>
          <label className='block text-sm font-medium text-slate-700'>
            Save into folder (optional)
            <select
              className={`mt-2 ${select}`}
              value={folderId}
              onChange={(e) => setFolderId(e.target.value)}
            >
              <option value=''>No folder</option>
              {folders.map((f) => (
                <option key={f._id} value={f._id}>
                  {f.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className='mt-5 rounded-xl bg-slate-50 p-4'>
          <p className='text-sm font-semibold text-slate-800'>
            Columns for {typeLabel(type)}
          </p>
          <p className='mt-1 text-xs text-slate-500'>
            The header row must use these names (any order). Columns marked *
            are required. <code>qrName</code> is optional and names each code.
          </p>
          <div className='mt-3 flex flex-wrap gap-2'>
            {[["qrName", false], ...BULK_COLUMNS[type]].map(([key, required]) => (
              <span
                key={key}
                className={`rounded-full px-3 py-1 font-mono text-xs ${required ? "bg-emerald-100 text-emerald-800" : "bg-white text-slate-600 ring-1 ring-slate-200"}`}
              >
                {key}
                {required && " *"}
              </span>
            ))}
          </div>
          <button
            type='button'
            onClick={downloadTemplate}
            className='mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200 transition hover:bg-emerald-50'
          >
            <Download size={16} /> Download CSV template
          </button>
        </div>
      </section>

      <section className={card}>
        <h2 className='text-base font-semibold'>2. Upload your CSV</h2>
        <label className='mt-4 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/60 px-4 py-8 text-center transition hover:border-emerald-400'>
          <Upload className='text-emerald-600' />
          <span className='text-sm font-semibold text-slate-700'>
            {fileName || "Choose a .csv file"}
          </span>
          <span className='text-xs text-slate-500'>
            Save from Excel or Google Sheets as “CSV (comma separated)”.
          </span>
          <input
            ref={fileInput}
            type='file'
            accept='.csv,text/csv'
            className='sr-only'
            onChange={(e) => onFile(e.target.files?.[0])}
          />
        </label>

        {parsed?.error && (
          <p className='mt-4 flex items-start gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-700'>
            <AlertCircle size={18} className='mt-0.5 shrink-0' />
            {parsed.error}
          </p>
        )}

        {parsed?.rows && (
          <div className='mt-5 space-y-4'>
            <p className='text-sm text-slate-600'>
              <strong className='text-emerald-700'>{valid.length} ready</strong>
              {invalid.length > 0 && (
                <>
                  {" · "}
                  <strong className='text-red-600'>
                    {invalid.length} with errors
                  </strong>{" "}
                  (fix them in the CSV and upload again, or create the valid
                  ones now)
                </>
              )}
            </p>
            {parsed.ignored?.length > 0 && (
              <p className='text-xs text-amber-700'>
                Ignored unknown columns: {parsed.ignored.join(", ")}
              </p>
            )}
            <div className='max-h-96 overflow-auto rounded-xl border border-slate-200'>
              <table className='w-full text-left text-sm'>
                <thead className='sticky top-0 bg-slate-50 text-xs uppercase text-slate-500'>
                  <tr>
                    <th className='px-4 py-3'>Row</th>
                    <th className='px-4 py-3'>QR name</th>
                    <th className='px-4 py-3'>Status</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-slate-100'>
                  {parsed.rows.map((row) => {
                    const result = results?.find((r) => r.row === row);
                    const error = row.error || (result && !result.ok && result.message);
                    return (
                      <tr key={row.line}>
                        <td className='px-4 py-3 text-slate-400'>{row.line}</td>
                        <td className='max-w-60 truncate px-4 py-3 font-medium'>
                          {row.name}
                        </td>
                        <td className='px-4 py-3'>
                          {error ? (
                            <span className='text-red-600'>{error}</span>
                          ) : result?.ok ? (
                            <Link
                              href={`/dashboard/qrcodes/${result.qrCode.id}/edit`}
                              className='inline-flex items-center gap-1 font-semibold text-emerald-700 hover:underline'
                            >
                              <CheckCircle2 size={15} /> Created — edit
                            </Link>
                          ) : (
                            <span className='text-emerald-700'>Ready</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {results ? (
              <Link
                href='/dashboard/qrcodes'
                className='inline-flex w-full items-center justify-center rounded-xl bg-[#20c75a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1bb34f] sm:w-auto'
              >
                View my QR codes
              </Link>
            ) : (
              <button
                type='button'
                disabled={busy || !valid.length}
                onClick={create}
                className='inline-flex w-full items-center justify-center rounded-xl bg-[#20c75a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1bb34f] disabled:opacity-50 sm:w-auto'
              >
                {busy
                  ? "Creating…"
                  : `Create ${valid.length} QR code${valid.length === 1 ? "" : "s"}`}
              </button>
            )}
          </div>
        )}
      </section>
    </main>
  );
}

"use client";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import * as XLSX from "xlsx";
function Bars({ title, rows = [] }) {
  const max = Math.max(1, ...rows.map((r) => r.count));
  return (
    <section className="rounded-2xl border bg-white p-5">
      <h2 className="mb-5 font-semibold">{title}</h2>
      {rows.length ? (
        rows.map((r, i) => (
          <div key={i} className="mb-4">
            <div className="mb-1 flex justify-between gap-3 text-xs">
              <span className="truncate">
                {String(r.label || r._id || "Unknown")}
              </span>
              <span>{r.count}</span>
            </div>
            <div className="h-2 rounded bg-slate-100">
              <div
                className="h-2 rounded bg-emerald-500"
                style={{ width: (r.count / max) * 100 + "%" }}
              />
            </div>
          </div>
        ))
      ) : (
        <p className="py-6 text-sm text-slate-400">No scans in this period.</p>
      )}
    </section>
  );
}
export default function AnalyticsDashboard({ qrId = "" }) {
  const [data, setData] = useState(null),
    [error, setError] = useState(""),
    [days, setDays] = useState("30"),
    [qr, setQr] = useState(qrId),
    [from, setFrom] = useState(""),
    [to, setTo] = useState(""),
    [loading, setLoading] = useState(true);
  useEffect(() => {
    let alive = true;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const params = { days, qr };
        if (days === "custom") {
          if (!from || !to) {
            setLoading(false);
            return;
          }
          params.from = from;
          params.to = to;
        }
        const r = await api.get("/analytics", { params });
        if (alive) setData(r.data);
      } catch (e) {
        if (alive)
          setError(e.response?.data?.message || "Could not load analytics.");
      } finally {
        if (alive) setLoading(false);
      }
    }
    load();
    return () => {
      alive = false;
    };
  }, [days, qr, from, to]);
 function exportExcel() {
  if (!data) return;

  const workbook = XLSX.utils.book_new();

  // -------------------------
  // SUMMARY
  // -------------------------
  const summary = [
    ["QR Analytics Report"],
    [],
    ["Metric", "Value"],
    ["QR Codes", data.totals?.codes || 0],
    ["Scans in period", data.totals?.scans || 0],
    ["Unique visitors", data.totals?.unique || 0],
    ["Scans today", data.totals?.today || 0],
    ["Scans this week", data.totals?.week || 0],
    ["Scans this month", data.totals?.month || 0],
    [],
    [
      "First scan",
      data.first
        ? new Date(data.first).toLocaleString()
        : "No scans",
    ],
    [
      "Last scan",
      data.last
        ? new Date(data.last).toLocaleString()
        : "No scans",
    ],
    [],
    [
      "Report period",
      `${new Date(data.from).toLocaleDateString()} - ${new Date(
        data.to,
      ).toLocaleDateString()}`,
    ],
  ];

  const summarySheet =
    XLSX.utils.aoa_to_sheet(summary);

  summarySheet["!cols"] = [
    { wch: 25 },
    { wch: 35 },
  ];

  XLSX.utils.book_append_sheet(
    workbook,
    summarySheet,
    "Summary",
  );

  // -------------------------
  // TIMELINE
  // -------------------------
  const timelineRows = [
    ["Date (UTC)", "Scans"],
    ...(data.timeline || []).map((row) => [
      row._id,
      row.count,
    ]),
  ];

  const timelineSheet =
    XLSX.utils.aoa_to_sheet(timelineRows);

  timelineSheet["!cols"] = [
    { wch: 18 },
    { wch: 12 },
  ];

  XLSX.utils.book_append_sheet(
    workbook,
    timelineSheet,
    "Timeline",
  );

  // -------------------------
  // QR CODES
  // -------------------------
  const qrRows = [
    [
      "QR Code",
      "Type",
      "Status",
      "Total Scans",
      "Unique Scans",
    ],
    ...(data.codes || []).map((code) => [
      code.name || "Untitled QR",
      code.type || "",
      code.status || "",
      code.scanCount || 0,
      code.uniqueScanCount || 0,
    ]),
  ];

  const qrSheet =
    XLSX.utils.aoa_to_sheet(qrRows);

  qrSheet["!cols"] = [
    { wch: 30 },
    { wch: 18 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
  ];

  XLSX.utils.book_append_sheet(
    workbook,
    qrSheet,
    "QR Codes",
  );

  // -------------------------
  // DEVICES
  // -------------------------
  const deviceRows = [
    ["Device", "Scans"],
    ...(data.devices || []).map((row) => [
      row._id || "Unknown",
      row.count,
    ]),
  ];

  const deviceSheet =
    XLSX.utils.aoa_to_sheet(deviceRows);

  deviceSheet["!cols"] = [
    { wch: 25 },
    { wch: 12 },
  ];

  XLSX.utils.book_append_sheet(
    workbook,
    deviceSheet,
    "Devices",
  );

  // -------------------------
  // OPERATING SYSTEMS
  // -------------------------
  const osRows = [
    ["Operating System", "Scans"],
    ...(data.os || []).map((row) => [
      row._id || "Unknown",
      row.count,
    ]),
  ];

  const osSheet =
    XLSX.utils.aoa_to_sheet(osRows);

  osSheet["!cols"] = [
    { wch: 25 },
    { wch: 12 },
  ];

  XLSX.utils.book_append_sheet(
    workbook,
    osSheet,
    "Operating Systems",
  );

  // -------------------------
  // BROWSERS
  // -------------------------
  const browserRows = [
    ["Browser", "Scans"],
    ...(data.browsers || []).map((row) => [
      row._id || "Unknown",
      row.count,
    ]),
  ];

  const browserSheet =
    XLSX.utils.aoa_to_sheet(browserRows);

  browserSheet["!cols"] = [
    { wch: 25 },
    { wch: 12 },
  ];

  XLSX.utils.book_append_sheet(
    workbook,
    browserSheet,
    "Browsers",
  );

  // -------------------------
  // COUNTRIES
  // -------------------------
  const countryRows = [
    ["Country", "Scans"],
    ...(data.countries || []).map((row) => [
      row._id || "Unknown",
      row.count,
    ]),
  ];

  const countrySheet =
    XLSX.utils.aoa_to_sheet(countryRows);

  countrySheet["!cols"] = [
    { wch: 25 },
    { wch: 12 },
  ];

  XLSX.utils.book_append_sheet(
    workbook,
    countrySheet,
    "Countries",
  );

  // -------------------------
  // RECENT SCANS
  // -------------------------
  const recentRows = [
    [
      "Date",
      "Time",
      "Device",
      "Operating System",
      "Browser",
      "Country",
    ],

    ...(data.recent || []).map((scan) => {
      const date = new Date(scan.scannedAt);

      return [
        date.toLocaleDateString(),
        date.toLocaleTimeString(),
        scan.deviceType || "Unknown",
        scan.os || "Unknown",
        scan.browser || "Unknown",
        scan.country || "Unknown",
      ];
    }),
  ];

  const recentSheet =
    XLSX.utils.aoa_to_sheet(recentRows);

  recentSheet["!cols"] = [
    { wch: 15 },
    { wch: 15 },
    { wch: 18 },
    { wch: 22 },
    { wch: 18 },
    { wch: 18 },
  ];

  XLSX.utils.book_append_sheet(
    workbook,
    recentSheet,
    "Recent Scans",
  );

  // -------------------------
  // DOWNLOAD
  // -------------------------
  const selectedQr = qr
    ? data.codes?.find(
        (code) => String(code._id) === String(qr),
      )
    : null;

  const safeName = (
    selectedQr?.name || "qr-analytics"
  )
    .replace(/[^a-zA-Z0-9-_ ]/g, "")
    .replace(/\s+/g, "-")
    .toLowerCase();

  const today = new Date()
    .toISOString()
    .slice(0, 10);

  XLSX.writeFile(
    workbook,
    `${safeName}-${today}.xlsx`,
  );
}
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap justify-between gap-4">
        <div>
          <p className="text-sm text-emerald-600">Understand your audience</p>
          <h1 className="text-3xl font-bold">Scan analytics</h1>
        </div>
        <button disabled={!data || loading} onClick={exportExcel} className="action">
          Export timeline CSV
        </button>
      </div>
      <div className="flex flex-wrap gap-3 rounded-xl border bg-white p-4">
        <label className="text-sm">
          Period
          <select
            className="ml-2 rounded-lg border p-2"
            value={days}
            onChange={(e) => setDays(e.target.value)}
          >
            <option value="1">Today</option>
            <option value="7">7 days</option>
            <option value="30">30 days</option>
            <option value="90">90 days</option>
            <option value="custom">Custom</option>
          </select>
        </label>
        {!qrId && (
          <label className="text-sm">
            QR code
            <select
              className="ml-2 rounded-lg border p-2"
              value={qr}
              onChange={(e) => setQr(e.target.value)}
            >
              <option value="">All QR codes</option>
              {data?.codes.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
        )}
        {days === "custom" && (
          <>
            <label className="text-sm">
              From
              <input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="ml-2 rounded border p-2"
              />
            </label>
            <label className="text-sm">
              To
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="ml-2 rounded border p-2"
              />
            </label>
          </>
        )}
      </div>
      {error && (
        <p role="alert" className="rounded-xl bg-red-50 p-4 text-red-700">
          {error}
        </p>
      )}
      {loading ? (
        <p className="p-12 text-center text-slate-500">
          Loading scan activity…
        </p>
      ) : (
        data && (
          <>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-6">
              {[
                ["QR codes", data.totals.codes],
                ["Scans in period", data.totals.scans],
                ["Unique visitors", data.totals.unique],
                ["Today", data.totals.today],
                ["This week", data.totals.week],
                ["This month", data.totals.month],
              ].map(([label, n]) => (
                <div key={label} className="rounded-xl border bg-white p-4">
                  <p className="text-2xl font-bold">{n}</p>
                  <p className="mt-1 text-xs text-slate-500">{label}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500">
              Dates use UTC. Unique visitors use anonymous cookies; clearing
              cookies can count a visitor again. Historical scans without
              identifiers are excluded from unique counts.
            </p>
            {qrId && (
              <p className="text-sm text-slate-500">
                First scan in period:{" "}
                {data.first ? new Date(data.first).toLocaleString() : "—"} ·
                Last: {data.last ? new Date(data.last).toLocaleString() : "—"}
              </p>
            )}
            <div className="grid gap-4 md:grid-cols-2">
              <Bars title="Scans over time" rows={data.timeline} />
              <Bars
                title="Top QR codes"
                rows={data.byCode.map((r) => ({
                  ...r,
                  label:
                    data.codes.find((c) => c._id === r._id)?.name || "QR code",
                }))}
              />
              <Bars title="Devices" rows={data.devices} />
              <Bars title="Operating systems" rows={data.os} />
              <Bars title="Browsers" rows={data.browsers} />
              <Bars title="Countries" rows={data.countries} />
            </div>
          </>
        )
      )}
    </div>
  );
}

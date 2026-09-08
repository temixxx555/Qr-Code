"use client";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
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
  function csv() {
    const rows = [
      ["Date (UTC)", "Scans"],
      ...(data?.timeline || []).map((r) => [r._id, r.count]),
    ];
    const blob = new Blob(
      [
        rows
          .map((row) =>
            row.map((v) => '"' + String(v).replace(/"/g, '""') + '"').join(","),
          )
          .join("\r\n"),
      ],
      { type: "text/csv;charset=utf-8" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "qr-scan-timeline.csv";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap justify-between gap-4">
        <div>
          <p className="text-sm text-emerald-600">Understand your audience</p>
          <h1 className="text-3xl font-bold">Scan analytics</h1>
        </div>
        <button disabled={!data || loading} onClick={csv} className="action">
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

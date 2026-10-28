"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import api from "@/lib/axios";
import * as XLSX from "xlsx";
import { MapPin, ExternalLink } from "lucide-react";

const ScanMap = dynamic(() => import("./ScanMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[360px] animate-pulse rounded-xl bg-slate-100" />
  ),
});

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

let regionNames;
function countryName(code) {
  if (!code || code === "Unknown" || !/^[A-Z]{2}$/.test(code)) return "Unknown";
  try {
    regionNames ||= new Intl.DisplayNames(["en"], { type: "region" });
    return regionNames.of(code) || code;
  } catch {
    return code;
  }
}
function flag(code) {
  return /^[A-Z]{2}$/.test(code || "")
    ? String.fromCodePoint(...[...code].map((c) => 127397 + c.charCodeAt(0)))
    : "🌐";
}
function place({ city, region, country } = {}) {
  return (
    [city, region, country && country !== "Unknown" ? countryName(country) : ""]
      .filter(Boolean)
      .join(", ") || "Unknown location"
  );
}
// Module-level so the map does not redraw on every render.
const describePoint = (p) => place(p);
const mapsLink = (lat, lng) =>
  `https://www.google.com/maps?q=${lat},${lng}`;
const coords = (lat, lng) =>
  Number.isFinite(lat) && Number.isFinite(lng)
    ? `${lat.toFixed(2)}, ${lng.toFixed(2)}`
    : "";

function Card({ title, subtitle, children, className = "" }) {
  return (
    <section className={`rounded-2xl border bg-white p-5 ${className}`}>
      <h2 className="font-semibold">{title}</h2>
      {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}
function Empty() {
  return <p className="py-6 text-sm text-slate-400">No scans in this period.</p>;
}
function Bars({ title, subtitle, rows = [], limit = 8 }) {
  const shown = rows.slice(0, limit);
  const total = rows.reduce((sum, r) => sum + r.count, 0);
  const max = Math.max(1, ...shown.map((r) => r.count));
  return (
    <Card title={title} subtitle={subtitle}>
      {shown.length ? (
        shown.map((r, i) => (
          <div key={i} className="mb-4">
            <div className="mb-1 flex justify-between gap-3 text-xs">
              <span className="truncate">
                {String(r.label || r._id || "Unknown")}
              </span>
              <span className="shrink-0 text-slate-500">
                {r.count}
                <span className="ml-1 text-slate-400">
                  ({Math.round((r.count / Math.max(1, total)) * 100)}%)
                </span>
              </span>
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
        <Empty />
      )}
    </Card>
  );
}
function Columns({ title, subtitle, labels, values }) {
  const max = Math.max(1, ...values);
  const peak = values.indexOf(Math.max(...values));
  return (
    <Card title={title} subtitle={subtitle}>
      {values.some(Boolean) ? (
        <>
          <div className="flex h-36 items-end gap-[3px]">
            {values.map((v, i) => (
              <div
                key={i}
                title={`${labels[i]}: ${v} scans`}
                className={`flex-1 rounded-t ${i === peak ? "bg-emerald-600" : "bg-emerald-300"}`}
                style={{ height: `${Math.max(2, (v / max) * 100)}%` }}
              />
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-slate-400">
            <span>{labels[0]}</span>
            <span>{labels[Math.floor(labels.length / 2)]}</span>
            <span>{labels[labels.length - 1]}</span>
          </div>
          <p className="mt-3 text-sm">
            Busiest: <strong>{labels[peak]}</strong> ({values[peak]} scans)
          </p>
        </>
      ) : (
        <Empty />
      )}
    </Card>
  );
}

const hourLabel = (h) => `${h % 12 || 12}${h < 12 ? "am" : "pm"}`;

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

  const codeName = (id) =>
    data?.codes.find((c) => String(c._id) === String(id))?.name || "QR code";
  const hours = Array.from(
    { length: 24 },
    (_, h) => data?.hours?.find((r) => r._id === h)?.count || 0,
  );
  const weekdays = WEEKDAYS.map(
    (_, i) => data?.weekdays?.find((r) => r._id === i + 1)?.count || 0,
  );

  function exportExcel() {
    if (!data) return;
    const workbook = XLSX.utils.book_new();
    const sheet = (name, rows, widths) => {
      const ws = XLSX.utils.aoa_to_sheet(rows);
      ws["!cols"] = widths.map((wch) => ({ wch }));
      XLSX.utils.book_append_sheet(workbook, ws, name);
    };
    const counts = (heading, rows, label = (r) => r._id || "Unknown") => [
      [heading, "Scans"],
      ...(rows || []).map((r) => [label(r), r.count]),
    ];
    sheet(
      "Summary",
      [
        ["QR Analytics Report"],
        [],
        ["Metric", "Value"],
        ["QR Codes", data.totals.codes],
        ["Scans in period", data.totals.scans],
        ["Unique visitors", data.totals.unique],
        ["Scans with location", data.locatedScans],
        ["Countries", data.countries.filter((c) => c._id !== "Unknown").length],
        ["Cities", data.cities.length],
        ["Scans today", data.totals.today],
        ["Scans this week", data.totals.week],
        ["Scans this month", data.totals.month],
        [],
        ["First scan", data.first ? new Date(data.first).toLocaleString() : "No scans"],
        ["Last scan", data.last ? new Date(data.last).toLocaleString() : "No scans"],
        [
          "Report period",
          `${new Date(data.from).toLocaleDateString()} - ${new Date(data.to).toLocaleDateString()}`,
        ],
      ],
      [25, 35],
    );
    sheet("Timeline", counts("Date (UTC)", data.timeline), [18, 12]);
    sheet(
      "QR Codes",
      [
        ["QR Code", "Type", "Status", "Total Scans", "Unique Scans"],
        ...data.codes.map((c) => [
          c.name || "Untitled QR",
          c.type || "",
          c.status || "",
          c.scanCount || 0,
          c.uniqueScanCount || 0,
        ]),
      ],
      [30, 18, 15, 15, 15],
    );
    sheet(
      "Countries",
      [
        ["Country", "Code", "Scans"],
        ...data.countries.map((r) => [countryName(r._id), r._id, r.count]),
      ],
      [28, 8, 12],
    );
    sheet(
      "Regions",
      [
        ["Region", "Country", "Scans"],
        ...data.regions.map((r) => [r._id.region, countryName(r._id.country), r.count]),
      ],
      [24, 28, 12],
    );
    sheet(
      "Cities",
      [
        ["City", "Region", "Country", "Latitude", "Longitude", "Scans", "Last scan"],
        ...data.cities.map((r) => [
          r._id.city,
          r._id.region || "",
          countryName(r._id.country),
          r.latitude ?? "",
          r.longitude ?? "",
          r.count,
          r.last ? new Date(r.last).toLocaleString() : "",
        ]),
      ],
      [22, 16, 24, 12, 12, 10, 22],
    );
    sheet(
      "Peak hours",
      [["Hour (scanner's local time)", "Scans"], ...hours.map((v, h) => [hourLabel(h), v])],
      [28, 12],
    );
    sheet(
      "Weekdays",
      [["Day", "Scans"], ...weekdays.map((v, i) => [WEEKDAYS[i], v])],
      [12, 12],
    );
    sheet("Devices", counts("Device", data.devices), [25, 12]);
    sheet("Brands", counts("Phone brand", data.brands), [25, 12]);
    sheet("Operating Systems", counts("Operating System", data.os), [25, 12]);
    sheet("Browsers", counts("Browser", data.browsers), [25, 12]);
    sheet("Languages", counts("Language", data.languages), [28, 12]);
    sheet("Visitors", counts("Visitor", data.visitorTypes), [18, 12]);
    sheet(
      "Recent Scans",
      [
        [
          "Date",
          "Time",
          "QR Code",
          "City",
          "Region",
          "Country",
          "Latitude",
          "Longitude",
          "Timezone",
          "Device",
          "Brand",
          "Operating System",
          "Browser",
          "Language",
          "Visitor",
        ],
        ...data.recent.map((s) => {
          const date = new Date(s.scannedAt);
          return [
            date.toLocaleDateString(),
            date.toLocaleTimeString(),
            codeName(s.qrCodeId),
            s.city || "",
            s.region || "",
            countryName(s.country),
            s.latitude ?? "",
            s.longitude ?? "",
            s.timezone || "",
            s.deviceType || "Unknown",
            s.brand || "Unknown",
            s.os || "Unknown",
            s.browser || "Unknown",
            s.language || "Unknown",
            s.isNewVisitor === true ? "New" : s.isNewVisitor === false ? "Returning" : "",
          ];
        }),
      ],
      [12, 12, 22, 16, 12, 20, 10, 10, 18, 10, 14, 16, 12, 16, 10],
    );
    const selected = qr ? data.codes.find((c) => String(c._id) === String(qr)) : null;
    const safeName = (selected?.name || "qr-analytics")
      .replace(/[^a-zA-Z0-9-_ ]/g, "")
      .replace(/\s+/g, "-")
      .toLowerCase();
    XLSX.writeFile(workbook, `${safeName}-${new Date().toISOString().slice(0, 10)}.xlsx`);
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap justify-between gap-4">
        <div>
          <p className="text-sm text-emerald-600">Understand your audience</p>
          <h1 className="text-3xl font-bold">Scan analytics</h1>
        </div>
        <button
          disabled={!data || loading}
          onClick={exportExcel}
          className="action"
        >
          Export Excel report
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
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {[
                ["Scans in period", data.totals.scans],
                ["Unique visitors", data.totals.unique],
                [
                  "Countries",
                  data.countries.filter((c) => c._id !== "Unknown").length,
                ],
                ["Cities", data.cities.length],
                [
                  "Scans with location",
                  data.totals.scans
                    ? `${Math.round((data.locatedScans / data.totals.scans) * 100)}%`
                    : "—",
                ],
                ["QR codes", data.totals.codes],
                ["Today", data.totals.today],
                ["This week", data.totals.week],
                ["This month", data.totals.month],
                [
                  "Last scan",
                  data.last
                    ? new Date(data.last).toLocaleDateString(undefined, {
                        day: "numeric",
                        month: "short",
                      })
                    : "—",
                ],
              ].map(([label, n]) => (
                <div key={label} className="rounded-xl border bg-white p-4">
                  <p className="text-2xl font-bold">{n}</p>
                  <p className="mt-1 text-xs text-slate-500">{label}</p>
                </div>
              ))}
            </div>

            <Card
              title="Where people scan"
              subtitle="Approximate locations from the scanner's network — accurate to roughly city level, not GPS. Tap a circle for details."
            >
              {data.points.length ? (
                <ScanMap points={data.points} describe={describePoint} />
              ) : (
                <p className="rounded-xl bg-slate-50 p-6 text-sm text-slate-500">
                  No scans with location data in this period yet. Location is
                  recorded for new scans on your live site.
                </p>
              )}
              <p className="mt-2 text-xs text-slate-400">
                IP location by{" "}
                <a href="https://ipdata.co" target="_blank" rel="noopener noreferrer" className="underline">
                  ipdata.co
                </a>
              </p>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Bars
                title="Countries"
                rows={data.countries.map((r) => ({
                  ...r,
                  label: `${flag(r._id)}  ${countryName(r._id)}`,
                }))}
              />
              <Bars
                title="States / regions"
                rows={data.regions.map((r) => ({
                  ...r,
                  label: `${flag(r._id.country)}  ${r._id.region} · ${countryName(r._id.country)}`,
                }))}
              />
            </div>

            <Card
              title="Top cities"
              subtitle="Coordinates are the approximate centre of each city's scans."
            >
              {data.cities.length ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[560px] text-left text-sm">
                    <thead className="text-xs text-slate-500">
                      <tr className="border-b">
                        <th className="py-2 pr-3 font-medium">City</th>
                        <th className="py-2 pr-3 font-medium">Region</th>
                        <th className="py-2 pr-3 font-medium">Country</th>
                        <th className="py-2 pr-3 font-medium">Coordinates</th>
                        <th className="py-2 pr-3 text-right font-medium">Scans</th>
                        <th className="py-2 text-right font-medium">Last scan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.cities.slice(0, 20).map((r, i) => (
                        <tr key={i} className="border-b last:border-0">
                          <td className="py-2.5 pr-3 font-medium">{r._id.city}</td>
                          <td className="py-2.5 pr-3 text-slate-600">
                            {r._id.region || "—"}
                          </td>
                          <td className="py-2.5 pr-3 text-slate-600">
                            {flag(r._id.country)} {countryName(r._id.country)}
                          </td>
                          <td className="py-2.5 pr-3">
                            {coords(r.latitude, r.longitude) ? (
                              <a
                                href={mapsLink(r.latitude, r.longitude)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 font-mono text-xs text-emerald-700 hover:underline"
                              >
                                {coords(r.latitude, r.longitude)}
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            ) : (
                              "—"
                            )}
                          </td>
                          <td className="py-2.5 pr-3 text-right font-semibold">
                            {r.count}
                          </td>
                          <td className="py-2.5 text-right text-xs text-slate-500">
                            {new Date(r.last).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <Empty />
              )}
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Columns
                title="Peak scan hours"
                subtitle="In each scanner's local time"
                labels={hours.map((_, h) => hourLabel(h))}
                values={hours}
              />
              <Columns
                title="Busiest days"
                subtitle="In each scanner's local time"
                labels={WEEKDAYS}
                values={weekdays}
              />
              <Bars title="Scans over time (UTC)" rows={data.timeline} limit={31} />
              <Bars
                title="Top QR codes"
                rows={data.byCode.map((r) => ({ ...r, label: codeName(r._id) }))}
              />
              <Bars title="New vs returning visitors" rows={data.visitorTypes} />
              <Bars title="Devices" rows={data.devices} />
              <Bars
                title="Phone brands"
                subtitle="Best effort — some browsers hide the brand"
                rows={data.brands}
              />
              <Bars title="Operating systems" rows={data.os} />
              <Bars title="Browsers" rows={data.browsers} />
              <Bars title="Languages" rows={data.languages} />
            </div>

            <Card title="Recent scans" subtitle="Latest 50 scans in this period">
              {data.recent.length ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[720px] text-left text-sm">
                    <thead className="text-xs text-slate-500">
                      <tr className="border-b">
                        <th className="py-2 pr-3 font-medium">Time</th>
                        {!qrId && <th className="py-2 pr-3 font-medium">QR code</th>}
                        <th className="py-2 pr-3 font-medium">Location</th>
                        <th className="py-2 pr-3 font-medium">Device</th>
                        <th className="py-2 pr-3 font-medium">Language</th>
                        <th className="py-2 font-medium">Visitor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.recent.map((s) => (
                        <tr key={s._id} className="border-b align-top last:border-0">
                          <td className="py-2.5 pr-3 text-xs text-slate-600">
                            {new Date(s.scannedAt).toLocaleString()}
                          </td>
                          {!qrId && (
                            <td className="py-2.5 pr-3">{codeName(s.qrCodeId)}</td>
                          )}
                          <td className="py-2.5 pr-3">
                            <span className="flex items-start gap-1.5">
                              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                              <span>
                                {flag(s.country)} {place(s)}
                                {coords(s.latitude, s.longitude) && (
                                  <a
                                    href={mapsLink(s.latitude, s.longitude)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block font-mono text-[11px] text-emerald-700 hover:underline"
                                  >
                                    {coords(s.latitude, s.longitude)}
                                  </a>
                                )}
                              </span>
                            </span>
                          </td>
                          <td className="py-2.5 pr-3 text-xs text-slate-600">
                            {[s.brand !== "Other" && s.brand, s.deviceType, s.os, s.browser]
                              .filter(Boolean)
                              .join(" · ")}
                          </td>
                          <td className="py-2.5 pr-3 text-xs text-slate-600">
                            {s.language || "—"}
                          </td>
                          <td className="py-2.5 text-xs">
                            {s.isNewVisitor === true ? (
                              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700">
                                New
                              </span>
                            ) : s.isNewVisitor === false ? (
                              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-600">
                                Returning
                              </span>
                            ) : (
                              "—"
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <Empty />
              )}
            </Card>

            <p className="text-xs leading-5 text-slate-500">
              Locations are estimated from the scanner&apos;s internet
              connection and are usually accurate to the city; mobile networks
              can place people in a nearby city. Scans recorded before this
              update only have a country. Unique visitors use anonymous
              cookies; clearing cookies can count a visitor again. Timeline
              dates use UTC.
            </p>
          </>
        )
      )}
    </div>
  );
}

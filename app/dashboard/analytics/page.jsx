"use client";

import { useEffect, useState } from "react";
import { BarChart3, QrCode, ScanLine, ShieldCheck } from "lucide-react";
import api from "@/lib/axios";

export default function AnalyticsPage() {
  const [data, setData] = useState(null); const [error, setError] = useState("");
  useEffect(() => { api.get("/analytics").then((response) => setData(response.data)).catch((err) => setError(err.response?.data?.message || "Could not load analytics.")); }, []);
  if (error) return <p className="rounded-xl bg-red-50 p-4 text-red-700">{error}</p>;
  if (!data) return <p className="py-20 text-center text-slate-500">Loading analytics…</p>;
  const maximum = Math.max(...data.codes.map((code) => code.scanCount), 1);
  return <div className="mx-auto max-w-6xl space-y-7"><div><p className="text-sm font-medium text-emerald-600">Dashboard</p><h1 className="text-3xl font-bold text-slate-900">Analytics</h1><p className="mt-1 text-slate-500">A simple view of how your active QR codes are being scanned.</p></div><div className="grid gap-4 sm:grid-cols-3"><Stat icon={QrCode} label="QR codes" value={data.totals.codes} /><Stat icon={ScanLine} label="Total scans" value={data.totals.scans} /><Stat icon={ShieldCheck} label="Active codes" value={data.totals.active} /></div><section className="rounded-2xl border bg-white p-6 shadow-sm"><div className="mb-6 flex items-center gap-2"><BarChart3 className="text-emerald-600" /><h2 className="font-semibold text-slate-900">Scans by QR code</h2></div>{data.codes.length ? <div className="space-y-5">{data.codes.sort((a, b) => b.scanCount - a.scanCount).map((code) => <div key={code._id}><div className="mb-2 flex justify-between text-sm"><span className="font-medium text-slate-700">{code.name}</span><span className="text-slate-500">{code.scanCount} scans</span></div><div className="h-3 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${(code.scanCount / maximum) * 100}%` }} /></div></div>)}</div> : <p className="py-10 text-center text-slate-500">Create and share a QR code to see its activity here.</p>}</section><section className="rounded-2xl border bg-white p-6 shadow-sm"><h2 className="font-semibold text-slate-900">Recent scans</h2><p className="mt-1 text-sm text-slate-500">We record the scan time and basic technical information to help you measure activity.</p><div className="mt-5 divide-y">{data.scans.length ? data.scans.map((scan) => <div key={scan._id} className="flex justify-between gap-4 py-3 text-sm"><span className="truncate text-slate-600">{scan.userAgent || "Unknown device"}</span><time className="shrink-0 text-slate-400">{new Date(scan.scannedAt).toLocaleString()}</time></div>) : <p className="py-8 text-center text-sm text-slate-500">No scans recorded yet.</p>}</div></section></div>;
}

function Stat({ icon: Icon, label, value }) { return <div className="rounded-2xl border bg-white p-5 shadow-sm"><Icon className="mb-3 text-emerald-600" size={22} /><p className="text-3xl font-bold text-slate-900">{value}</p><p className="mt-1 text-sm text-slate-500">{label}</p></div>; }

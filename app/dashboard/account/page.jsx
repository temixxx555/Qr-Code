"use client";

import { useEffect, useState } from "react";
import { LogOut, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

export default function AccountPage() {
  const [user, setUser] = useState(null); const [error, setError] = useState(""); const router = useRouter();
  useEffect(() => { api.get("/auth/me").then(({ data }) => setUser(data.user)).catch(() => setError("Could not load your account.")); }, []);
  const logout = async () => { await api.post("/auth/logout"); router.push("/login"); };
  return <div className="mx-auto max-w-2xl"><p className="text-sm font-medium text-emerald-600">Dashboard</p><h1 className="mt-1 text-3xl font-bold text-slate-900">My account</h1><section className="mt-7 rounded-2xl border bg-white p-6 shadow-sm">{error ? <p className="text-red-600">{error}</p> : !user ? <p className="text-slate-500">Loading account…</p> : <><div className="flex items-center gap-4"><div className="rounded-full bg-emerald-100 p-4 text-emerald-700"><UserRound size={28} /></div><div><h2 className="font-semibold text-slate-900">{user.name}</h2><p className="text-sm text-slate-500">{user.email}</p></div></div><div className="mt-6 border-t pt-6"><p className="text-sm text-slate-500">Account status</p><p className="mt-1 font-medium text-slate-800">{user.isVerified ? "Verified" : "Active"}</p></div><button onClick={logout} className="mt-7 inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"><LogOut size={16} /> Sign out</button></>}</section></div>;
}

"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import { Card, button } from "./ui";
export default function PremiumGate({ children }) {
  const path = usePathname();
  const operational =
    path === "/dashboard" ||
    path.startsWith("/dashboard/qrcodes") ||
    path.startsWith("/dashboard/analytics");
  const [result, setResult] = useState(null);
  useEffect(() => {
    let alive = true;
    if (operational)
      api
        .get("/billing")
        .then(({ data }) => {
          if (alive) setResult({ path, ...data });
        })
        .catch(() => {
          if (alive) setResult({ path, error: true });
        });
    return () => {
      alive = false;
    };
  }, [path, operational]);
  if (!operational) return children;
  if (result?.path !== path)
    return (
      <p className="p-10 text-center text-slate-500">
        Checking your membership…
      </p>
    );
  if (result.error)
    return (
      <Card title="Could not check your membership">
        <p className="text-sm text-slate-500">
          Open Billing to sign in or check your account.
        </p>
        <Link href="/dashboard/billing" className={`${button} mt-5`}>
          Open billing
        </Link>
      </Card>
    );
  if (result.premium) return children;
  return (
    <div className="mx-auto mt-10 max-w-xl">
      <Card title="Bring your QR codes to life">
        <p className="leading-7 text-slate-500">
          Upgrade to Premium to manage dynamic QR codes, update printed
          destinations, and understand your scans. Your existing codes and data
          are preserved.
        </p>
        <Link className={`${button} mt-6`} href="/dashboard/billing">
          Explore Premium · from ₦3,000
        </Link>
        <Link className="mt-5 block text-sm text-emerald-700" href="/qr">
          Create a free static QR
        </Link>
      </Card>
    </div>
  );
}

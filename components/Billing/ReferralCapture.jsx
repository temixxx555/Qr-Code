"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import api from "@/lib/axios";
export default function ReferralCapture() {
  const path = usePathname();
  useEffect(() => {
    try {
      const code = new URLSearchParams(window.location.search).get("ref");
      if (code && /^[A-Z0-9]{6,32}$/i.test(code))
        localStorage.setItem(
          "qr-referral",
          JSON.stringify({ code, capturedAt: Date.now() }),
        );
      const value = JSON.parse(localStorage.getItem("qr-referral") || "null");
      if (path.startsWith("/dashboard") && value)
        api
          .post("/referrals", {
            action: "attribute",
            code: value.code,
            capturedAt: value.capturedAt,
          })
          .then(() => localStorage.removeItem("qr-referral"))
          .catch(() => {});
    } catch {
      /* Browsers may disable local storage. Explicit checkout codes still work. */
    }
  }, [path]);
  return null;
}

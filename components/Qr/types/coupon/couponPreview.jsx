"use client";
import { useState, useEffect } from "react";
import { Picture, Intro, Action } from "../presentation";
export default function CouponPreview({ content: c }) {
  const [copied, setCopied] = useState("");
  const [expired, setExpired] = useState(false);
  useEffect(() => {
    const refresh = () =>
      setExpired(
        !!c.expiration &&
          Date.now() > new Date(`${c.expiration}T23:59:59Z`).getTime(),
      );
    refresh();
    const timer = setInterval(refresh, 60000);
    return () => clearInterval(timer);
  }, [c.expiration]);
  return (
    <article className="min-h-full bg-orange-50 p-5">
      <Picture
        src={c.logo}
        alt={c.merchant || "Offer"}
        className="mx-auto my-5 h-16 w-16 rounded-full"
      />
      <p className="mb-5 text-center text-sm">{c.merchant}</p>
      <div className="rounded-2xl bg-white p-5 text-center shadow-sm">
        <p className="text-4xl font-black text-orange-600">
          {c.discount || "Your offer"}
        </p>
        <div className="my-5">
          <Intro
            title={c.title || "Something special"}
            description={c.description}
          />
        </div>
        <div className="border-y-2 border-dashed border-orange-100 py-5">
          <p className="font-mono text-xl font-bold">{c.code}</p>
          {c.code && !expired && (
            <button
              className="mt-2 text-xs text-orange-700"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(c.code);
                  setCopied("Copied!");
                } catch {
                  setCopied("Select and copy the code above.");
                }
              }}
            >
              {copied || "Copy code"}
            </button>
          )}
        </div>
        <p className="my-4 text-xs">
          {expired
            ? "This offer has expired"
            : c.expiration
              ? `Valid through ${c.expiration} (UTC)`
              : "Limited-time offer"}
        </p>
        {!expired && <Action href={c.ctaUrl}>Redeem offer</Action>}
      </div>
      <p className="mt-5 whitespace-pre-line text-xs leading-relaxed text-slate-500">
        {c.terms}
      </p>
    </article>
  );
}

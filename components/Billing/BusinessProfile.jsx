"use client";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Card, Field, Notice, input, button } from "./ui";
export default function BusinessProfile() {
  const [form, setForm] = useState(null),
    [error, setError] = useState(""),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    api
      .get("/billing")
      .then(({ data }) =>
        setForm({
          type: data.workspace.type,
          name: data.workspace.name || "",
          contactEmail: data.workspace.contactEmail || "",
          billingAddress: data.workspace.billingAddress || "",
          logo: data.workspace.logo || "",
        }),
      )
      .catch(() => setError("Could not load your workspace."));
  }, []);
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header>
        <p className="text-sm font-semibold text-emerald-600">YOUR WORKSPACE</p>
        <h1 className="mt-2 text-3xl font-bold">Personal & Business</h1>
        <p className="mt-3 text-slate-500">
          Choose the profile that fits you. Your membership and referral
          earnings stay with your account.
        </p>
      </header>
      {error && <Notice error>{error}</Notice>}
      {message && <Notice>{message}</Notice>}
      {form && (
        <Card title="Profile details">
          <form
            className="space-y-5"
            onSubmit={async (e) => {
              e.preventDefault();
              setBusy(true);
              setError("");
              try {
                await api.patch("/workspace", form);
                setMessage("Workspace profile saved.");
              } catch (e) {
                setError(e.response?.data?.message || "Could not save.");
              } finally {
                setBusy(false);
              }
            }}
          >
            <Field label="Account type">
              <select
                className={input}
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="personal">Personal</option>
                <option value="business">Business</option>
              </select>
            </Field>
            {[
              ["name", "Display or business name", "text"],
              ["contactEmail", "Billing contact email", "email"],
              ["logo", "Logo URL (HTTPS)", "url"],
            ].map(([key, label, type]) => (
              <Field key={key} label={label}>
                <input
                  className={input}
                  type={type}
                  value={form[key]}
                  required={key === "name"}
                  maxLength={key === "name" ? 120 : 2000}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                />
              </Field>
            ))}
            <Field label="Billing address">
              <textarea
                className={input}
                rows={3}
                maxLength={1000}
                value={form.billingAddress}
                onChange={(e) =>
                  setForm({ ...form, billingAddress: e.target.value })
                }
              />
            </Field>
            <p className="text-xs text-slate-500">
              This workspace has one owner. Personal and Business use the same
              Premium prices.
            </p>
            <button className={button} disabled={busy}>
              {busy ? "Saving…" : "Save profile"}
            </button>
          </form>
        </Card>
      )}
    </div>
  );
}

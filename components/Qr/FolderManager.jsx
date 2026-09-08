"use client";
import { useState } from "react";
import api from "@/lib/axios";
export default function FolderManager({ folders, onChange }) {
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function create(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const { data } = await api.post("/folders", { name });
      onChange([...folders, data.folder]);
      setName("");
    } catch (e) {
      setError(e.response?.data?.message || "Could not create folder.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <details className="rounded-xl border bg-white p-4">
      <summary className="cursor-pointer text-sm font-semibold">
        Manage folders ({folders.length})
      </summary>
      <form onSubmit={create} className="mt-4 flex gap-2">
        <input
          aria-label="New folder name"
          maxLength={80}
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New folder name"
          className="min-w-0 flex-1 rounded-lg border p-2 text-sm"
        />
        <button disabled={busy} className="action">
          {busy ? "Creating…" : "Create folder"}
        </button>
      </form>
      {folders.map((f) => (
        <div
          key={f._id}
          className="mt-3 flex items-center justify-between gap-2 text-sm"
        >
          <span>{f.name}</span>
          <div className="flex gap-2">
            <button
              disabled={busy}
              className="action"
              onClick={async () => {
                const next = window.prompt("Folder name", f.name);
                if (!next) return;
                setBusy(true);
                try {
                  const { data } = await api.patch("/folders", {
                    id: f._id,
                    name: next,
                  });
                  onChange(
                    folders.map((x) => (x._id === f._id ? data.folder : x)),
                  );
                } catch (e) {
                  setError(
                    e.response?.data?.message || "Could not rename folder.",
                  );
                } finally {
                  setBusy(false);
                }
              }}
            >
              Rename
            </button>
            <button
              disabled={busy}
              className="action"
              onClick={async () => {
                setBusy(true);
                try {
                  await api.delete("/folders", { params: { id: f._id } });
                  onChange(folders.filter((x) => x._id !== f._id));
                } catch (e) {
                  setError(
                    e.response?.data?.message || "Could not delete folder.",
                  );
                } finally {
                  setBusy(false);
                }
              }}
            >
              Delete empty folder
            </button>
          </div>
        </div>
      ))}
      {error && (
        <p role="alert" className="mt-3 text-sm text-red-600">
          {error}
        </p>
      )}
    </details>
  );
}

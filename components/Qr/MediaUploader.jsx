"use client";
import { useState } from "react";
import api from "@/lib/axios";
export default function MediaUploader({
  kind = "image",
  onUpload,
  label = "Upload file",
}) {
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState("");
  async function upload(file) {
    if (!file) return;
    setError("");
    setProgress(0);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("kind", kind);
      const { data } = await api.post("/uploads", body, {
        headers: { "Content-Type": undefined },
        onUploadProgress: (e) =>
          setProgress(Math.round((e.loaded / (e.total || e.loaded)) * 100)),
      });
      onUpload(data.file);
    } catch (e) {
      setError(e.response?.data?.message || "Upload failed. Please try again.");
    } finally {
      setProgress(null);
    }
  }
  return (
    <div>
      <label className="block cursor-pointer rounded-xl border-2 border-dashed border-emerald-200 bg-emerald-50/40 p-4 text-center text-sm font-medium text-emerald-800">
        {progress !== null ? `Uploading… ${progress}%` : label}
        <input
          aria-label={label}
          type="file"
          disabled={progress !== null}
          accept={
            {
              image: "image/png,image/jpeg,image/webp",
              pdf: "application/pdf",
              video: "video/mp4,video/webm",
              audio: "audio/mpeg,audio/wav,audio/ogg",
            }[kind]
          }
          onChange={(e) => {
            upload(e.target.files?.[0]);
            e.target.value = "";
          }}
          className="mt-2 block w-full text-xs"
        />
      </label>
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

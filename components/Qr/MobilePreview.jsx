"use client";
import { useRef } from "react";
export default function MobilePreview({ children }) {
  const ref = useRef(null);
  return (
    <div className="lg:hidden">
      <button
        className="fixed bottom-5 right-5 z-30 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-xl"
        onClick={() => ref.current.showModal()}
      >
        Preview
      </button>
      <dialog
        ref={ref}
        aria-label="Live phone preview"
        className="m-auto max-h-[95dvh] w-87.5 max-w-[95vw] overflow-y-auto rounded-2xl border bg-slate-50 p-4 backdrop:bg-slate-900/50"
      >
        <form method="dialog" className="mb-3 text-right">
          <button className="action">Close preview</button>
        </form>
        {children}
      </dialog>
    </div>
  );
}

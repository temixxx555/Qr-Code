"use client";
import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

const escape = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );

// Approximate scan locations as circles sized by scan count.
export default function ScanMap({ points = [], describe }) {
  const element = useRef(null);
  useEffect(() => {
    let map;
    let cancelled = false;
    import("leaflet").then(({ default: L }) => {
      if (cancelled || !element.current) return;
      map = L.map(element.current, { scrollWheelZoom: false, worldCopyJump: true });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);
      const max = Math.max(1, ...points.map((p) => p.count));
      const markers = points.map((p) =>
        L.circleMarker([p._id.lat, p._id.lng], {
          radius: 6 + Math.sqrt(p.count / max) * 18,
          color: "#047857",
          weight: 1.5,
          fillColor: "#10b981",
          fillOpacity: 0.45,
        })
          .bindPopup(
            `<strong>${escape(describe(p))}</strong><br/>${p.count} scan${p.count === 1 ? "" : "s"}<br/><span style="color:#64748b">${p._id.lat.toFixed(2)}, ${p._id.lng.toFixed(2)}</span>`,
          )
          .addTo(map),
      );
      if (markers.length)
        map.fitBounds(L.featureGroup(markers).getBounds().pad(0.3), {
          maxZoom: 10,
        });
      else map.setView([9.08, 8.68], 5);
    });
    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [points, describe]);
  return (
    <div
      ref={element}
      className="h-[360px] w-full overflow-hidden rounded-xl bg-slate-100"
      aria-label="Map of approximate scan locations"
      role="region"
    />
  );
}

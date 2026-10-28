import "server-only";
import { isIP } from "node:net";
import { lookupLocation } from "@/lib/scan-details";

const FIELDS = "country_code,region,city,postal,latitude,longitude,time_zone";

function isPublic(ip) {
  if (isIP(ip) === 4)
    return !/^(10|127|0)\.|^169\.254\.|^192\.168\.|^172\.(1[6-9]|2\d|3[01])\.|^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./.test(ip);
  if (isIP(ip) === 6) return !/^(::1?$|f[cd]|fe[89ab]|::ffff:)/i.test(ip);
  return false;
}

// Looks up the scanner's IP with ipdata.co when the host adds no location
// headers (e.g. Hostinger). Returns null if not configured or on failure.
export async function lookupIp(ip) {
  const key = process.env.IPDATA_API_KEY;
  ip = ip?.replace(/^::ffff:/i, "");
  if (!key || !ip || !isPublic(ip)) return null;
  try {
    const res = await fetch(
      `https://api.ipdata.co/${encodeURIComponent(ip)}?api-key=${encodeURIComponent(key)}&fields=${FIELDS}`,
      { signal: AbortSignal.timeout(4000), cache: "no-store" },
    );
    if (!res.ok) {
      console.error("IP lookup failed", res.status);
      return null;
    }
    const location = lookupLocation(await res.json());
    return location.country === "Unknown" ? null : location;
  } catch (error) {
    console.error("IP lookup unavailable", error.message);
    return null;
  }
}

import test from "node:test";
import assert from "node:assert/strict";
import { scanLocation, deviceBrand, language } from "../lib/scan-details.js";

const request = (headers) => new Request("https://example.com", { headers });

test("reads and sanitizes Vercel location headers", () => {
  assert.deepEqual(
    scanLocation(
      request({
        "x-vercel-ip-country": "NG",
        "x-vercel-ip-country-region": "LA",
        "x-vercel-ip-city": "Ikeja%20GRA",
        "x-vercel-ip-latitude": "6.58123",
        "x-vercel-ip-longitude": "3.35678",
        "x-vercel-ip-timezone": "Africa/Lagos",
        "x-vercel-ip-postal-code": "100271",
      }),
    ),
    {
      country: "NG",
      region: "LA",
      city: "Ikeja GRA",
      postalCode: "100271",
      latitude: 6.58,
      longitude: 3.36,
      timezone: "Africa/Lagos",
    },
  );
});
test("falls back to Cloudflare and rejects bad values", () => {
  const location = scanLocation(
    request({
      "cf-ipcountry": "XX",
      "cf-iplatitude": "999",
      "cf-iplongitude": "abc",
      "cf-timezone": "Not/AZone",
      "cf-ipcity": "%E0%A4%A",
    }),
  );
  assert.equal(location.country, "Unknown");
  assert.equal(location.latitude, null);
  assert.equal(location.longitude, null);
  assert.equal(location.timezone, null);
  assert.equal(location.city, "%E0%A4%A");
  assert.equal(scanLocation(request({})).country, "Unknown");
});
test("detects common phone brands and languages", () => {
  assert.equal(deviceBrand("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)"), "Apple iPhone");
  assert.equal(deviceBrand("Mozilla/5.0 (Linux; Android 13; SM-A145F)"), "Samsung");
  assert.equal(deviceBrand("Mozilla/5.0 (Linux; Android 12; TECNO KI5k)"), "Tecno");
  assert.equal(deviceBrand("Mozilla/5.0 (Linux; Android 10; K)"), "Other");
  assert.equal(language(request({ "accept-language": "en-NG,en;q=0.9" })), "English (Nigeria)");
  assert.equal(language(request({ "accept-language": "yo" })), "Yoruba");
  assert.equal(language(request({ "accept-language": "<script>" })), "Unknown");
});

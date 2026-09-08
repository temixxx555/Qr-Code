import test from "node:test";
import assert from "node:assert/strict";
import {
  QR_TYPES,
  validateContent,
  safeUrl,
  wifiPayload,
  vcardText,
} from "../lib/qr-content.js";
import { fixtures } from "./fixtures.mjs";

for (const type of QR_TYPES)
  test(`${type}: accepts meaningful content and rejects empty content`, () => {
    assert.equal(validateContent(type, fixtures[type]), null);
    assert.ok(validateContent(type, {}));
  });
test("rejects unsafe schemes, credentials, and nested malicious links", () => {
  for (const url of [
    "javascript:alert(1)",
    "data:text/html,test",
    "ftp://example.com",
    "https://user:secret@example.com",
  ])
    assert.equal(safeUrl(url), "");
  assert.ok(
    validateContent("links", {
      links: [{ label: "Attack", url: "javascript:alert(1)" }],
    }),
  );
  assert.ok(
    validateContent("vcard", {
      firstName: "Test",
      avatar: "data:image/svg+xml,<svg/>",
    }),
  );
});
test("malformed content returns an error without throwing", () => {
  for (const input of [
    null,
    [],
    "text",
    { links: "bad" },
    { firstName: {} },
    { hours: { Monday: {} } },
  ])
    assert.ok(validateContent("vcard", input));
});
test("WiFi escapes punctuation and backslashes and includes hidden flag", () => {
  assert.equal(
    wifiPayload(fixtures.wifi),
    "WIFI:T:WPA;S:Guest\\;WiFi;P:p\\:ass\\\\word;H:true;;",
  );
  assert.ok(
    !wifiPayload({
      ssid: "Open",
      encryption: "nopass",
      password: "private",
    }).includes("private"),
  );
});
test("vCard fields cannot inject a new property", () => {
  const card = vcardText({ firstName: "Name\nTEL:attack", company: "A;B,C" });
  assert.ok(card.includes("Name\\nTEL:attack"));
  assert.ok(card.includes("A\\;B\\,C"));
  assert.ok(!card.includes("\r\nTEL:attack"));
});
test("menu modes and unavailable item validation", () => {
  assert.ok(
    validateContent("images", {
      images: [
        { url: "https://example.com/photo.png", caption: { invalid: true } },
      ],
    }),
  );
  assert.equal(
    validateContent("menu", {
      mode: "pdf",
      url: "https://example.com/menu.pdf",
    }),
    null,
  );
  assert.ok(
    validateContent("menu", {
      name: "Menu",
      categories: [{ name: "Meals", items: [{ name: "Meal", price: -2 }] }],
    }),
  );
});

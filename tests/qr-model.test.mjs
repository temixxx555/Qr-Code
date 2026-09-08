import test from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import QRCode from "../app/models/QrCode.js";
import { fixtures } from "./fixtures.mjs";

for (const [type, content] of Object.entries(fixtures)) {
  test(`Mongo schema accepts ${type} without a database connection`, () => {
    const qr = new QRCode({
      userId: new mongoose.Types.ObjectId(),
      name: "Schema test",
      shortCode: "schema-test",
      type,
      content,
      isDynamic: type !== "wifi",
    });
    assert.equal(qr.validateSync(), undefined);
    assert.equal(qr.shortCode, "schema-test");
    if (type === "wifi") assert.equal(qr.content.password, content.password);
  });
}
test("legacy records receive safe defaults and inactive remains valid", () => {
  const qr = new QRCode({
    userId: new mongoose.Types.ObjectId(),
    name: "Legacy",
    shortCode: "old-code",
    type: "website",
    content: { url: "https://example.com" },
    status: "inactive",
  });
  assert.equal(qr.validateSync(), undefined);
  assert.equal(qr.scanCount, 0);
  assert.equal(qr.uniqueScanCount, 0);
  assert.equal(qr.folderId, null);
  qr.content = fixtures.links;
  qr.type = "links";
  assert.equal(qr.shortCode, "old-code");
});
test("password hashes are excluded from normal queries", () => {
  assert.equal(QRCode.schema.path("passwordHash").options.select, false);
});

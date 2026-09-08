// Runs against the local development server. Creates only disposable test users
// and removes records belonging to those exact users in finally.
import assert from "node:assert/strict";
import crypto from "node:crypto";
import mongoose from "mongoose";
import { fixtures } from "./fixtures.mjs";
process.loadEnvFile(".env");
const base = process.env.TEST_BASE_URL || "http://localhost:3000";
assert.ok(
  ["localhost", "127.0.0.1"].includes(new URL(base).hostname),
  "Only run against a local test server",
);
const users = [];
async function request(
  path,
  { method = "GET", body, cookie = "", headers = {} } = {},
) {
  const r = await fetch(base + path, {
    method,
    redirect: "manual",
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      Cookie: cookie,
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(45000),
  });
  const raw = await r.text();
  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    data = raw;
  }
  return { status: r.status, headers: r.headers, data };
}
async function account() {
  const email = `qr-test-${crypto.randomUUID()}@example.invalid`;
  const password = crypto.randomBytes(20).toString("hex");
  const r = await request("/api/auth/register", {
    method: "POST",
    body: { name: "Disposable QR test", email, password },
  });
  assert.equal(r.status, 201, "Test registration: " + JSON.stringify(r.data));
  users.push({ id: r.data.user.id, email });
  const login = await request("/api/auth/login", {
    method: "POST",
    body: { email, password },
  });
  assert.equal(login.status, 200);
  return login.headers
    .getSetCookie()
    .map((c) => c.split(";")[0])
    .join("; ");
}
try {
  assert.equal((await request("/api/qr")).status, 401);
  const cookie = await account();
  const otherCookie = await account();
  const saved = {};
  const f = await request("/api/folders", {
    method: "POST",
    cookie,
    body: { name: "Test folder" },
  });
  assert.equal(f.status, 201);
  for (const [type, content] of Object.entries(fixtures)) {
    const r = await request("/api/qr", {
      method: "POST",
      cookie,
      body: {
        name: "Test " + type,
        type,
        content,
        folderId: f.data.folder._id,
      },
    });
    assert.equal(r.status, 201, type + ": " + JSON.stringify(r.data));
    saved[type] = r.data.qrCode;
    assert.equal(r.data.qrCode.isDynamic, type !== "wifi");
    if (type === "wifi")
      assert.equal(
        r.data.qrCode.content.password,
        content.password,
        "WiFi credentials must survive save for future downloads",
      );
    const read = await request("/api/qr/" + saved[type]._id, { cookie });
    assert.equal(read.status, 200);
    if (type !== "wifi") {
      const scan = await request("/q/" + saved[type].shortCode, {
        headers: {
          "User-Agent": "QR Test Desktop",
          Cookie: "qr-visitor=test-visitor",
        },
      });
      assert.equal(scan.status, 307, type + " scan route");
      if (!["website", "whatsapp"].includes(type)) {
        const view = await request("/q/" + saved[type].shortCode + "/view");
        assert.equal(view.status, 200, type + " landing");
      }
    }
    console.log("PASS create/read/scan", type);
  }
  const q = saved.website;
  for (const method of ["GET", "PATCH", "DELETE"])
    assert.equal(
      (
        await request("/api/qr/" + q._id, {
          cookie: otherCookie,
          method,
          ...(method === "PATCH"
            ? { body: { name: "Should not change" } }
            : {}),
        })
      ).status,
      404,
    );
  assert.equal(
    (await request("/api/analytics?qr=" + q._id, { cookie: otherCookie }))
      .status,
    404,
  );
  const edit = await request("/api/qr/" + q._id, {
    method: "PATCH",
    cookie,
    body: { content: { websiteUrl: "https://example.com/updated" } },
  });
  assert.equal(edit.data.qrCode.shortCode, q.shortCode);
  assert.equal(
    (await request("/q/" + q.shortCode)).headers.get("location"),
    "https://example.com/updated",
  );
  assert.equal(
    (await request("/r/" + q.shortCode)).headers.get("location"),
    "https://example.com/updated",
  );
  const change = await request("/api/qr/" + q._id, {
    method: "PATCH",
    cookie,
    body: { type: "links", content: fixtures.links },
  });
  assert.equal(change.status, 200);
  assert.equal(change.data.qrCode.shortCode, q.shortCode);
  await request("/api/qr/" + q._id, {
    method: "PATCH",
    cookie,
    body: { status: "paused" },
  });
  assert.equal((await request("/q/" + q.shortCode)).status, 404);
  assert.equal(
    (
      await request("/api/qr", {
        method: "POST",
        cookie,
        body: {
          name: "Unsafe",
          type: "website",
          content: { websiteUrl: "javascript:alert(1)" },
        },
      })
    ).status,
    400,
  );
  const protectedQr = await request("/api/qr", {
    method: "POST",
    cookie,
    body: {
      name: "Protected",
      type: "website",
      content: {
        websiteUrl: "https://example.com/private",
        passwordEnabled: true,
        password: "test-protection-123",
      },
    },
  });
  assert.equal(protectedQr.status, 201);
  assert.ok(!JSON.stringify(protectedQr.data).includes("test-protection-123"));
  assert.ok(!JSON.stringify(protectedQr.data).includes("passwordHash"));
  const protectedCode = protectedQr.data.qrCode.shortCode;
  assert.ok(
    (await request("/q/" + protectedCode)).headers
      .get("location")
      .endsWith("/unlock"),
  );
  const lockedView = await request("/q/" + protectedCode + "/view");
  assert.ok(!String(lockedView.data).includes("example.com/private"));
  const unlock = await fetch(base + "/q/" + protectedCode + "/unlock/verify", {
    method: "POST",
    redirect: "manual",
    body: new URLSearchParams({ password: "test-protection-123" }),
  });
  assert.equal(unlock.status, 303);
  const gateCookie = unlock.headers
    .getSetCookie()
    .map((c) => c.split(";")[0])
    .join("; ");
  assert.equal(
    (await request("/q/" + protectedCode, { cookie: gateCookie })).headers.get(
      "location",
    ),
    "https://example.com/private",
  );
  const analytics = await request("/api/analytics?days=30", { cookie });
  assert.equal(analytics.status, 200);
  assert.ok(analytics.data.totals.scans > 0);
  assert.equal(
    (
      await request("/api/folders?id=" + f.data.folder._id, {
        method: "DELETE",
        cookie,
      })
    ).status,
    400,
  );
  console.log(
    "PASS stable edits, type changes, legacy URLs, ownership, protection, analytics, folder safeguards",
  );
} finally {
  if (users.length) {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 15000,
    });
    const ids = users.map((u) => new mongoose.Types.ObjectId(u.id));
    const codes = await mongoose.connection
      .collection("qrcodes")
      .find({ userId: { $in: ids } })
      .project({ _id: 1 })
      .toArray();
    const qrIds = codes.map((q) => q._id);
    for (const collection of ["scans", "scanvisitors"])
      await mongoose.connection
        .collection(collection)
        .deleteMany({ qrCodeId: { $in: qrIds } });
    await mongoose.connection
      .collection("qrcodes")
      .deleteMany({ userId: { $in: ids } });
    await mongoose.connection
      .collection("folders")
      .deleteMany({ userId: { $in: ids } });
    await mongoose.connection.collection("users").deleteMany({
      _id: { $in: ids },
      email: { $in: users.map((u) => u.email) },
    });
    await mongoose.disconnect();
    console.log("Removed disposable test records.");
  }
}

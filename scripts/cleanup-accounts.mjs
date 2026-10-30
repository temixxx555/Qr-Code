// Removes test / abandoned accounts and everything that belongs to them.
//
// Dry run by default: it only lists what matches. Nothing is deleted unless
// --delete is passed, and even then every removed document is first written
// to backups/cleanup-<timestamp>.json so it can be restored.
//
// Never touched, whatever the filters say:
//   - admins (any adminRole other than "none")
//   - accounts with a paid LIVE order, live commissions or withdrawals
//   - accounts with live Premium access that hasn't ended yet
//
// Filters (combine as needed; at least one is required):
//   --email a@x.com,b@y.com   exact accounts
//   --before 2026-10-15       created before this date
//   --after 2026-10-01        created on/after this date
//   --unverified              email never verified
//   --no-qr                   never created a QR code
//   --no-scans                none of their QR codes were ever scanned
//
// Examples:
//   node scripts/cleanup-accounts.mjs --before 2026-10-15
//   node scripts/cleanup-accounts.mjs --before 2026-10-15 --no-scans --delete
import fs from "node:fs";
import path from "node:path";
import mongoose from "mongoose";

process.loadEnvFile(".env");

const args = process.argv.slice(2);
const option = (name) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? undefined : args[i + 1];
};
const flag = (name) => args.includes(`--${name}`);
const date = (name) => {
  const value = option(name);
  if (value === undefined) return undefined;
  const parsed = new Date(value);
  if (isNaN(parsed)) throw new Error(`--${name} needs a date like 2026-10-15`);
  return parsed;
};

const emails = option("email")
  ?.split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);
const before = date("before");
const after = date("after");
const filters = { emails, before, after };
if (
  !emails?.length &&
  !before &&
  !after &&
  !["unverified", "no-qr", "no-scans"].some(flag)
) {
  console.error(
    "Add at least one filter, e.g. --before 2026-10-15 or --email a@x.com. See the top of this file.",
  );
  process.exit(1);
}

await mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 15000,
});
const db = mongoose.connection;
const col = (name) => db.collection(name);
const ids = (docs) => docs.map((d) => d._id);

try {
  const query = { adminRole: { $in: [null, "none"] } };
  if (emails?.length) query.email = { $in: emails };
  if (before || after)
    query.createdAt = {
      ...(before && { $lt: before }),
      ...(after && { $gte: after }),
    };
  if (flag("unverified")) query.isVerified = { $ne: true };
  const users = await col("users")
    .find(query)
    .project({ password: 0, refreshToken: 0 })
    .sort({ createdAt: 1 })
    .toArray();

  const now = new Date();
  const plan = [];
  for (const user of users) {
    const workspaces = await col("workspaces")
      .find({ ownerId: user._id })
      .toArray();
    const wsIds = ids(workspaces);
    const qrcodes = await col("qrcodes").find({ userId: user._id }).toArray();
    const qrIds = ids(qrcodes);
    const scanCount = await col("scans").countDocuments({
      qrCodeId: { $in: qrIds },
    });

    const [liveOrders, liveCommissions, liveWithdrawals, liveSubs] =
      await Promise.all([
        col("billingorders").countDocuments({
          $or: [{ userId: user._id }, { workspaceId: { $in: wsIds } }],
          mode: "live",
          status: "paid",
        }),
        col("referralcommissions").countDocuments({
          workspaceId: { $in: wsIds },
          mode: "live",
        }),
        col("affiliatewithdrawals").countDocuments({
          workspaceId: { $in: wsIds },
          mode: "live",
        }),
        col("billingsubscriptions").countDocuments({
          workspaceId: { $in: wsIds },
          mode: "live",
          $or: [
            { paidThrough: { $gt: now } },
            { complimentaryThrough: { $gt: now } },
          ],
        }),
      ]);
    const protectedBy = [
      liveOrders && "paid live order",
      liveCommissions && "live referral commissions",
      liveWithdrawals && "live withdrawals",
      liveSubs && "active live Premium",
    ].filter(Boolean);
    if (flag("no-qr") && qrcodes.length) continue;
    if (flag("no-scans") && scanCount) continue;
    plan.push({ user, wsIds, qrIds, qrcodes, scanCount, protectedBy });
  }

  const doomed = plan.filter((p) => !p.protectedBy.length);
  console.table(
    plan.map((p) => ({
      email: p.user.email,
      name: p.user.name,
      created: p.user.createdAt?.toISOString().slice(0, 10),
      verified: Boolean(p.user.isVerified),
      qrCodes: p.qrcodes.length,
      scans: p.scanCount,
      action: p.protectedBy.length
        ? `KEEP (${p.protectedBy.join(", ")})`
        : "remove",
    })),
  );
  console.log(
    `${doomed.length} account(s) would be removed, ${plan.length - doomed.length} kept. Admins are never listed.`,
  );

  if (!flag("delete")) {
    console.log("Dry run only. Re-run with --delete to remove them.");
  } else if (doomed.length) {
    const userIds = doomed.map((p) => p.user._id);
    const wsIds = doomed.flatMap((p) => p.wsIds);
    const qrIds = doomed.flatMap((p) => p.qrIds);
    const userEmails = doomed.map((p) => p.user.email);
    const orderIds = ids(
      await col("billingorders")
        .find({ $or: [{ userId: { $in: userIds } }, { workspaceId: { $in: wsIds } }] })
        .project({ _id: 1 })
        .toArray(),
    );

    // Collection -> filter for every document that belongs to these accounts.
    const targets = {
      scans: { qrCodeId: { $in: qrIds } },
      scanvisitors: { qrCodeId: { $in: qrIds } },
      qrcodes: { _id: { $in: qrIds } },
      folders: { userId: { $in: userIds } },
      authchallenges: { userId: { $in: userIds } },
      passwordresets: { email: { $in: userEmails } },
      billingrefunds: { orderId: { $in: orderIds } },
      billingorders: { _id: { $in: orderIds } },
      billingsubscriptions: { workspaceId: { $in: wsIds } },
      referralcommissions: { workspaceId: { $in: wsIds } },
      affiliatewithdrawals: { workspaceId: { $in: wsIds } },
      billingbankrecipients: { workspaceId: { $in: wsIds } },
      workspaces: { _id: { $in: wsIds } },
      users: { _id: { $in: userIds } },
    };

    const backup = { createdAt: new Date(), filters, collections: {} };
    for (const [name, filter] of Object.entries(targets))
      backup.collections[name] = await col(name).find(filter).toArray();
    fs.mkdirSync("backups", { recursive: true });
    const file = path.join(
      "backups",
      `cleanup-${new Date().toISOString().replace(/[:.]/g, "-")}.json`,
    );
    // Extended JSON keeps ObjectIds and dates exact, so a restore is faithful.
    fs.writeFileSync(
      file,
      mongoose.mongo.BSON.EJSON.stringify(backup, null, 2, { relaxed: false }),
    );
    console.log(`Backup written to ${file}`);

    for (const [name, filter] of Object.entries(targets)) {
      const { deletedCount } = await col(name).deleteMany(filter);
      if (deletedCount) console.log(`  ${name}: ${deletedCount} removed`);
    }
    // Workspaces these accounts referred keep working; just drop the link.
    await col("workspaces").updateMany(
      { referredBy: { $in: wsIds } },
      { $unset: { referredBy: "" } },
    );
    console.log("Done.");
  }
} finally {
  await mongoose.disconnect();
}

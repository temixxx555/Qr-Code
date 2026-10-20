import nextEnv from "@next/env";
import mongoose from "mongoose";
import * as models from "../app/models/Billing.js";
import User from "../app/models/User.js";
import { PLANS, VAT_DEFAULT_BPS, withVat } from "../lib/billing-rules.js";
nextEnv.loadEnvConfig(process.cwd());
const command = process.argv[2];
if (!["indexes", "superadmin", "plans"].includes(command))
  throw new Error(
    "Usage: node scripts/billing-setup.mjs indexes | plans | superadmin existing-email@example.com",
  );
if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is required");
await mongoose.connect(process.env.MONGODB_URI);
try {
  if (command === "plans") {
    // Creates the full-price recurring plans in the current PAYSTACK_MODE and
    // records their codes so automatic renewal can be offered.
    const mode = process.env.PAYSTACK_MODE || "test";
    const key = process.env[`PAYSTACK_${mode.toUpperCase()}_SECRET_KEY`];
    if (!key?.startsWith(`sk_${mode}_`))
      throw new Error(`PAYSTACK_${mode.toUpperCase()}_SECRET_KEY is required`);
    const call = async (path, body) => {
      const response = await fetch(`https://api.paystack.co${path}`, {
        method: body ? "POST" : "GET",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        ...(body ? { body: JSON.stringify(body) } : {}),
      });
      const result = await response.json();
      if (!response.ok || !result.status) throw new Error(result.message);
      return result.data;
    };
    const settings = await models.BillingSettings.findById("global").lean();
    const vatBps = Number.isInteger(settings?.vatBps) ? settings.vatBps : VAT_DEFAULT_BPS;
    const existing = await call("/plan?perPage=100");
    for (const base of PLANS) {
      const row = await models.PlanVersion.findOne({ key: base.key }).sort({ version: -1 }).lean();
      const plan = row || base;
      const amount = withVat(plan.amount, vatBps).total;
      const name = `Smart QR Premium ${plan.label} v${plan.version}`;
      let remote = existing.find(
        (item) => item.name === name && item.amount === amount && item.interval === plan.interval && item.currency === "NGN",
      );
      if (!remote)
        remote = await call("/plan", { name, amount, interval: plan.interval, currency: "NGN" });
      await models.PlanVersion.updateOne(
        { key: plan.key, version: plan.version },
        {
          $set: { [`${mode}PlanCode`]: remote.plan_code },
          $setOnInsert: {
            label: plan.label,
            months: plan.months,
            interval: plan.interval,
            amount: plan.amount,
            effectiveAt: new Date(0),
            published: true,
          },
        },
        { upsert: true },
      );
      console.log(`${mode} ${plan.key} v${plan.version}: ${remote.plan_code} (${amount / 100} NGN ${plan.interval})`);
    }
  } else if (command === "indexes") {
    for (const model of Object.values(models)) await model.createIndexes();
    console.log(
      "Billing indexes are ready. Existing collections were not dropped.",
    );
  } else {
    const email = process.argv[3]?.trim().toLowerCase();
    if (!email || !email.includes("@"))
      throw new Error("Specify the existing account email to promote");
    const user = await User.findOne({ email });
    if (!user)
      throw new Error("Create the account normally before assigning the role");
    await mongoose.connection.transaction(async (session) => {
      await User.updateOne(
        { _id: user._id },
        { adminRole: "superadmin" },
        { session },
      );
      await models.AuditLog.create(
        [
          {
            actorId: user._id,
            action: "admin.bootstrap",
            resource: String(user._id),
            reason: "Explicit operator bootstrap command",
            before: { adminRole: user.adminRole },
            after: { adminRole: "superadmin" },
          },
        ],
        { session },
      );
    });
    console.log(
      "The specified account is now a superadmin. No other accounts changed.",
    );
  }
} finally {
  await mongoose.disconnect();
}

import nextEnv from "@next/env";
import mongoose from "mongoose";
import * as models from "../app/models/Billing.js";
import User from "../app/models/User.js";
nextEnv.loadEnvConfig(process.cwd());
const command = process.argv[2];
if (!["indexes", "superadmin"].includes(command))
  throw new Error(
    "Usage: node scripts/billing-setup.mjs indexes | superadmin existing-email@example.com",
  );
if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is required");
await mongoose.connect(process.env.MONGODB_URI);
try {
  if (command === "indexes") {
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

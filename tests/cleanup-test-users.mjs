// Recovery for interrupted integration runs. Only matches this suite's synthetic
// UUID email addresses and exact display name. No ordinary account is selected.
import mongoose from "mongoose";
process.loadEnvFile(".env");
await mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 15000,
});
try {
  const users = await mongoose.connection
    .collection("users")
    .find({
      name: "Disposable QR test",
      email:
        /^qr-test-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}@example\.invalid$/,
    })
    .project({ _id: 1, email: 1 })
    .toArray();
  console.log(
    "Disposable integration accounts:",
    users.map((u) => ({ id: String(u._id), email: u.email })),
  );
  if (process.argv.includes("--delete") && users.length) {
    const ids = users.map((u) => u._id);
    const codes = await mongoose.connection
      .collection("qrcodes")
      .find({ userId: { $in: ids } })
      .project({ _id: 1 })
      .toArray();
    for (const collection of ["scans", "scanvisitors"])
      await mongoose.connection
        .collection(collection)
        .deleteMany({ qrCodeId: { $in: codes.map((q) => q._id) } });
    for (const collection of ["qrcodes", "folders"])
      await mongoose.connection
        .collection(collection)
        .deleteMany({ userId: { $in: ids } });
    await mongoose.connection
      .collection("users")
      .deleteMany({ _id: { $in: ids } });
    console.log("Removed interrupted-run test records.");
  }
} finally {
  await mongoose.disconnect();
}

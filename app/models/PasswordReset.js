import mongoose from "mongoose";

const passwordResetSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  codeHash: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  lastSentAt: { type: Date, required: true },
  attempts: { type: Number, default: 0 },
});

passwordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.PasswordReset ||
  mongoose.model("PasswordReset", passwordResetSchema);

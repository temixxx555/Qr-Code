import mongoose from "mongoose";

const authChallengeSchema = new mongoose.Schema({
  challengeHash: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
  email: { type: String, required: true, lowercase: true },
  purpose: {
    type: String,
    enum: ["email-verification", "login-two-factor"],
    required: true,
  },
  codeHash: { type: String, required: true },
  rememberMe: { type: Boolean, default: false },
  attempts: { type: Number, default: 0 },
  expiresAt: { type: Date, required: true },
});

authChallengeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
authChallengeSchema.index({ userId: 1, purpose: 1 });

export default mongoose.models.AuthChallenge ||
  mongoose.model("AuthChallenge", authChallengeSchema);

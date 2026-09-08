import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {
    qrCodeId: { type: mongoose.Schema.Types.ObjectId, required: true },
    visitorId: { type: String, required: true },
  },
  { timestamps: true },
);
schema.index({ qrCodeId: 1, visitorId: 1 }, { unique: true });
export default mongoose.models.ScanVisitor ||
  mongoose.model("ScanVisitor", schema);

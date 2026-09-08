import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true, maxlength: 80 },
  },
  { timestamps: true },
);
schema.index({ userId: 1, name: 1 }, { unique: true });
export default mongoose.models.Folder || mongoose.model("Folder", schema);

import mongoose from "mongoose";

// Single document (_id "global") holding admin-editable public site content.
const SiteContentSchema = new mongoose.Schema(
  {
    _id: { type: String, default: "global" },
    content: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true, minimize: false },
);

const SiteContent =
  mongoose.models.SiteContent ||
  mongoose.model("SiteContent", SiteContentSchema);
export default SiteContent;

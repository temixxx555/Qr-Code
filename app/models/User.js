import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    adminRole: {
      type: String,
      enum: ["none", "superadmin", "finance", "support", "analyst"],
      default: "none",
    },
    suspended: { type: Boolean, default: false },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: false,
      minlength: 8,
      default: null,
    },

    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    googleUid: {
      type: String,
      default: null,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    refreshToken: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// const User = mongoose.models.User || mongoose.model("User", userSchema);
delete mongoose.models["User"];
const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;

import mongoose from "mongoose";

const QRCodeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    type: {
      type: String,
      required: true,
      enum: [
        "website",
        "whatsapp",
        "vcard",
        "pdf",
        "wifi",
        "email",
        "phone",
        "sms",
        "text",
        "social",
        "instagram",
        "facebook",
        "youtube",
        "menu",
        "business",
        "app",
        "apps",
        "coupon",
        "links",
        "video",
        "images",
        "mp3",
      ],
    },

    // Flexible content per QR type
    // website:   { url, passwordEnabled, password }
    // whatsapp:  { phone, message }
    // wifi:      { ssid, password, encryption }
    // vcard:     { firstName, lastName, phone, email, ... }
    content: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    shortCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },

    isDynamic: {
      type: Boolean,
      default: true,
    },

    design: {
      // ── Frame ──────────────────────────────────────
      frame: {
        type: String,
        default: "scan",
      },
      frameColor: {
        type: String,
        default: "#000000",
      },
      frameText: {
        type: String,
        default: "Scan me!",
      },

      // ── Pattern (dots) ─────────────────────────────
      pattern: {
        type: String,
        default: "square",
      },
      patternColor: {
        type: String,
        default: "#000000",
      },
      patternGradientEnabled: {
        type: Boolean,
        default: false,
      },
      patternColor2: {
        type: String,
        default: "#20c75a",
      },

      // ── Background ─────────────────────────────────
      backgroundColor: {
        type: String,
        default: "#ffffff",
      },
      backgroundGradientEnabled: {
        type: Boolean,
        default: false,
      },
      backgroundColor2: {
        type: String,
        default: "#effcf4",
      },
      transparentBackground: {
        type: Boolean,
        default: false,
      },

      // ── Corner squares (outer finder frames) ───────
      cornerSquareStyle: {
        type: String,
        default: "square",
      },
      cornerSquareColor: {
        type: String,
        default: "#000000",
      },

      // ── Corner dots (inner finder dots) ────────────
      cornerDotStyle: {
        type: String,
        default: "square",
      },
      cornerDotColor: {
        type: String,
        default: "#000000",
      },

      // ── Logo ───────────────────────────────────────
      logo: {
        type: String,
        default: null,
      },
    },

    folderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
      default: null,
    },
    passwordHash: { type: String, select: false },
    uniqueScanCount: { type: Number, default: 0 },
    publicOrigin: { type: String },
    scanCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: ["active", "inactive", "paused", "archived"],
      default: "active",
    },
  },
  {
    timestamps: true,
  },
);

const QRCode = mongoose.models.QRCode || mongoose.model("QRCode", QRCodeSchema);

//   // Replace with:
// delete mongoose.models["QRCode"];
// const QRCode = mongoose.model("QRCode", QRCodeSchema);
export default QRCode;

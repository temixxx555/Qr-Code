import mongoose from "mongoose";

const ScanSchema = new mongoose.Schema(
  {
    visitorId: { type: String, index: true },
    deviceType: String,
    os: String,
    browser: String,
    country: String,
    // Which QR code was scanned
    qrCodeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "QRCode",
      required: true,
      index: true,
    },

    // When the QR was scanned
    scannedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },

    // Basic device information
    userAgent: {
      type: String,
      default: null,
    },

    // IP address of the scanner
    ipAddress: {
      type: String,
      default: null,
    },

    // Referrer, if available
    referrer: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const Scan = mongoose.models.Scan || mongoose.model("Scan", ScanSchema);

export default Scan;

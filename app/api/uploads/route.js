import crypto from "node:crypto";

import { getAuthenticatedUser } from "@/app/lib/auth";
import { putFile } from "@/app/lib/storage";

const formats = {
  "image/png": ["image", 5, "png"],
  "image/jpeg": ["image", 5, "jpg"],
  "image/webp": ["image", 5, "webp"],

  "application/pdf": ["pdf", 20, "pdf"],

  "video/mp4": ["video", 50, "mp4"],
  "video/webm": ["video", 50, "webm"],

  "audio/mpeg": ["audio", 20, "mp3"],
  "audio/wav": ["audio", 20, "wav"],
  "audio/ogg": ["audio", 20, "ogg"],
};

export async function POST(request) {
  try {
    // ---------------------------------------------
    // Authentication
    // ---------------------------------------------

    if (!(await getAuthenticatedUser())) {
      return Response.json(
        { message: "Authentication required" },
        { status: 401 },
      );
    }

    // ---------------------------------------------
    // Request size protection
    // ---------------------------------------------

    const contentLength = Number(
      request.headers.get("content-length") || 0,
    );

    if (contentLength > 53 * 1048576) {
      return Response.json(
        { message: "File is too large" },
        { status: 413 },
      );
    }

    // ---------------------------------------------
    // Read form
    // ---------------------------------------------

    const form = await request.formData();

    const file = form.get("file");
    const kind = form.get("kind");

    if (!file || typeof file.arrayBuffer !== "function") {
      throw new Error("Choose a file.");
    }

    // ---------------------------------------------
    // Validate MIME type
    // ---------------------------------------------

    const format = formats[file.type];

    if (
      !format ||
      format[0] !== kind ||
      file.size > format[1] * 1048576 ||
      !file.size
    ) {
      throw new Error(
        "Unsupported file or size. Images: 5 MB, PDF/audio: 20 MB, video: 50 MB.",
      );
    }

    // ---------------------------------------------
    // Convert file to Buffer
    // ---------------------------------------------

    const bytes = Buffer.from(
      await file.arrayBuffer(),
    );

    // ---------------------------------------------
    // Validate actual file contents
    // ---------------------------------------------

    const head = bytes.subarray(0, 16);

    const valid = {
      png: head
        .subarray(0, 8)
        .equals(
          Buffer.from([
            137,
            80,
            78,
            71,
            13,
            10,
            26,
            10,
          ]),
        ),

      jpg:
        head[0] === 255 &&
        head[1] === 216 &&
        head[2] === 255,

      webp:
        head.toString("ascii", 0, 4) === "RIFF" &&
        head.toString("ascii", 8, 12) === "WEBP",

      pdf:
        head.toString("ascii", 0, 5) === "%PDF-",

      mp4:
        head.toString("ascii", 4, 8) === "ftyp",

      webm:
        head
          .subarray(0, 4)
          .equals(
            Buffer.from([
              26,
              69,
              223,
              163,
            ]),
          ),

      mp3:
        head.toString("ascii", 0, 3) === "ID3" ||
        (
          head[0] === 255 &&
          (head[1] & 224) === 224
        ),

      wav:
        head.toString("ascii", 0, 4) === "RIFF" &&
        head.toString("ascii", 8, 12) === "WAVE",

      ogg:
        head.toString("ascii", 0, 4) === "OggS",
    }[format[2]];

    if (!valid) {
      throw new Error(
        "File contents do not match the selected media format.",
      );
    }

    // ---------------------------------------------
    // Generate unique Cloudinary public ID
    // ---------------------------------------------

    const name =
      crypto.randomUUID() +
      "." +
      format[2];

    // ---------------------------------------------
    // Upload to Cloudinary
    // ---------------------------------------------

    const uploaded = await putFile(
      name,
      bytes,
    );

    // ---------------------------------------------
    // Return SAME structure your frontend expects
    // ---------------------------------------------

    return Response.json({
      file: {
        url: uploaded.secure_url,

        filename: file.name
          .replace(
            /[^a-zA-Z0-9 ._-]/g,
            "",
          )
          .slice(0, 150),

        size: file.size,

        mimeType: file.type,

        // Useful for deleting/replacing later
        publicId: uploaded.public_id,

        resourceType:
          uploaded.resource_type,
      },
    });
  } catch (e) {
    console.error(
      "Cloudinary upload error:",
      e,
    );

    return Response.json(
      {
        message:
          e.message ||
          "Upload failed",
      },
      {
        status: 400,
      },
    );
  }
}
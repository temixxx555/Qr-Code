import "server-only";
import bcrypt from "bcryptjs";
import { validateContent, safeUrl } from "@/lib/qr-content";
import Folder from "@/app/models/Folder";
export function publicOrigin(request) {
  const configured =
    process.env.QR_PUBLIC_ORIGIN || process.env.NEXT_PUBLIC_APP_URL;
  const url = safeUrl(
    configured ||
      (process.env.NODE_ENV !== "production"
        ? new URL(request.url).origin
        : ""),
  );
  if (
    !url ||
    (process.env.NODE_ENV === "production" &&
      (new URL(url).protocol !== "https:" ||
        /^(localhost|127\.|0\.0\.0\.0)/.test(new URL(url).hostname)))
  )
    throw new Error(
      "Configure QR_PUBLIC_ORIGIN with your public HTTPS domain.",
    );
  return new URL(url).origin;
}
export function serializeQr(doc) {
  const qr = doc.toObject ? doc.toObject() : { ...doc };
  qr.content = { ...qr.content };
  if (qr.type !== "wifi") delete qr.content.password;
  delete qr.passwordHash;
  return {
    ...qr,
    id: String(qr._id),
    qrUrl: (qr.publicOrigin || "") + "/q/" + qr.shortCode,
  };
}
export async function applyQrBody(qr, body, userId) {
  if (body.name !== undefined) {
    if (
      typeof body.name !== "string" ||
      !body.name.trim() ||
      body.name.length > 100
    )
      throw new Error("Use a QR name between 1 and 100 characters.");
    qr.name = body.name.trim();
  }
  const type = body.type || qr.type;
  if (qr.type && type !== qr.type && (type === "wifi" || qr.type === "wifi"))
    throw new Error("Static WiFi codes cannot change type.");
  if (body.content !== undefined || body.type !== undefined) {
    const content = { ...(body.content || qr.content) };
    const error = validateContent(type, content);
    if (error) throw new Error(error);
    if (type === "wifi" && content.passwordEnabled)
      throw new Error("Static WiFi codes cannot use page password protection.");
    if (content.passwordEnabled) {
      if (content.password) {
        if (
          typeof content.password !== "string" ||
          content.password.length < 8 ||
          Buffer.byteLength(content.password) > 72
        )
          throw new Error("Use a protection password of 8–72 bytes.");
        qr.passwordHash = await bcrypt.hash(content.password, 12);
      } else if (!qr.passwordHash)
        throw new Error("Enter a protection password.");
    } else qr.passwordHash = undefined;
    if (type !== "wifi") delete content.password;
    qr.content = content;
    qr.type = type;
    qr.isDynamic = type !== "wifi";
  }
  if (body.status !== undefined) {
    if (!["active", "inactive", "paused", "archived"].includes(body.status))
      throw new Error("Invalid status.");
    qr.status = body.status;
  }
  if (body.folderId !== undefined) {
    if (body.folderId && !(await Folder.exists({ _id: body.folderId, userId })))
      throw new Error("Folder not found.");
    qr.folderId = body.folderId || null;
  }
  if (body.design !== undefined) {
    const d = body.design;
    if (!d || typeof d !== "object" || Array.isArray(d))
      throw new Error("Invalid design.");
    const retainedLegacyLogo =
      d.logo &&
      d.logo === qr.design?.logo &&
      /^data:image\/(png|jpeg|webp);base64,/.test(d.logo);
    if (d.logo && !safeUrl(d.logo) && !retainedLegacyLogo)
      throw new Error("Upload a logo or use a valid image URL.");
    const allowed = {
      frame: [
        "none",
        "simple",
        "scan",
        "bottom",
        "rounded",
        "ticket",
        "ribbon",
        "badge",
        "shadow",
        "gift",
      ],
      pattern: [
        "square",
        "dots",
        "rounded",
        "extra-rounded",
        "classy",
        "classy-rounded",
      ],
      cornerSquareStyle: ["square", "dot", "extra-rounded"],
      cornerDotStyle: ["square", "dot"],
    };
    for (const [key, values] of Object.entries(allowed))
      if (d[key] !== undefined && !values.includes(d[key]))
        throw new Error("Invalid QR design style.");
    for (const [key, val] of Object.entries(d))
      if (/color/i.test(key) && !/^#[0-9a-f]{6}$/i.test(val))
        throw new Error("Use six-digit hex colors.");
    if (d.frameText?.length > 80)
      throw new Error("Frame text must be under 80 characters.");
    qr.design = d;
  }
}

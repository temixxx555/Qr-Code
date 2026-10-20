import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
  throw new Error("JWT secrets are missing from .env.local");
}

export function generateAccessToken(userId) {
  return jwt.sign(
    { userId },
    ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
}

export function generateRefreshToken(userId, rememberMe = false) {
  return jwt.sign(
    { userId, rememberMe },
    REFRESH_TOKEN_SECRET,
    { expiresIn: rememberMe ? "30d" : "7d" }
  );
}

export function verifyAccessToken(token) {
  return jwt.verify(token, ACCESS_TOKEN_SECRET);
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, REFRESH_TOKEN_SECRET);
}

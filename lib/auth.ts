import crypto from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "admin_session";

function sign(value: string) {
  const secret = process.env.ADMIN_SESSION_SECRET || "change-me";
  return crypto.createHmac("sha256", secret).update(value).digest("hex");
}

export function createAdminSession() {
  const value = `admin:${Date.now()}`;
  const token = `${value}.${sign(value)}`;
  cookies().set(COOKIE_NAME, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/" });
}

export function clearAdminSession() {
  cookies().delete(COOKIE_NAME);
}

export function isAdminAuthenticated() {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return false;
  const [value, signature] = token.split(".");
  return !!value && signature === sign(value);
}

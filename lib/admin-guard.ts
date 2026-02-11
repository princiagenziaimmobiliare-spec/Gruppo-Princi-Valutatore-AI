import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";

export function ensureAdmin() {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }
  return null;
}

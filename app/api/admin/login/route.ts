import { NextResponse } from "next/server";
import { adminLoginSchema } from "@/lib/schemas";
import { createAdminSession } from "@/lib/auth";

export async function POST(request: Request) {
  const parsed = adminLoginSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Credenziali non valide" }, { status: 400 });

  if (parsed.data.username !== process.env.ADMIN_USER || parsed.data.password !== process.env.ADMIN_PASS) {
    return NextResponse.json({ error: "Accesso negato" }, { status: 401 });
  }

  createAdminSession();
  return NextResponse.json({ ok: true });
}

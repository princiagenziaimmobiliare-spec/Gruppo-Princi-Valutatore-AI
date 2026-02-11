import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureAdmin } from "@/lib/admin-guard";

export async function GET() {
  const unauthorized = ensureAdmin();
  if (unauthorized) return unauthorized;
  const rows = await prisma.locality.findMany({ orderBy: [{ comune: "asc" }, { zona: "asc" }] });
  return NextResponse.json(rows);
}

export async function POST(request: NextRequest) {
  const unauthorized = ensureAdmin();
  if (unauthorized) return unauthorized;
  const body = await request.json();
  const created = await prisma.locality.create({ data: { comune: body.comune, zona: body.zona || null, basePriceEur: Number(body.basePriceEur), isActive: !!body.isActive } });
  return NextResponse.json(created);
}

export async function PUT(request: NextRequest) {
  const unauthorized = ensureAdmin();
  if (unauthorized) return unauthorized;
  const body = await request.json();
  const updated = await prisma.locality.update({ where: { id: body.id }, data: { comune: body.comune, zona: body.zona || null, basePriceEur: Number(body.basePriceEur), isActive: !!body.isActive } });
  return NextResponse.json(updated);
}

export async function DELETE(request: NextRequest) {
  const unauthorized = ensureAdmin();
  if (unauthorized) return unauthorized;
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id mancante" }, { status: 400 });
  await prisma.locality.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureAdmin } from "@/lib/admin-guard";

export async function GET() {
  const unauthorized = ensureAdmin();
  if (unauthorized) return unauthorized;
  const [settings, coefficients] = await Promise.all([
    prisma.settings.findUnique({ where: { id: "global" } }),
    prisma.coefficient.findMany({ orderBy: [{ group: "asc" }, { key: "asc" }] })
  ]);
  return NextResponse.json({ settings, coefficients });
}

export async function PUT(request: NextRequest) {
  const unauthorized = ensureAdmin();
  if (unauthorized) return unauthorized;
  const body = await request.json();

  const settings = await prisma.settings.update({
    where: { id: "global" },
    data: {
      rangePercentage: Number(body.settings.rangePercentage),
      provinceFallbackPrice: Number(body.settings.provinceFallbackPrice),
      ctaUrl: body.settings.ctaUrl,
      contactEmail: body.settings.contactEmail,
      contactPhone: body.settings.contactPhone
    }
  });

  if (Array.isArray(body.coefficients)) {
    for (const coeff of body.coefficients) {
      await prisma.coefficient.update({ where: { id: coeff.id }, data: { value: Number(coeff.value), label: coeff.label } });
    }
  }

  return NextResponse.json({ ok: true, settings });
}

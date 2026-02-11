import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureAdmin } from "@/lib/admin-guard";

export async function GET(request: NextRequest) {
  const unauthorized = ensureAdmin();
  if (unauthorized) return unauthorized;
  const q = request.nextUrl.searchParams;
  const comune = q.get("comune");
  const propertyType = q.get("tipologia");
  const from = q.get("from");
  const to = q.get("to");

  const rows = await prisma.valuationRequest.findMany({
    where: {
      comune: comune || undefined,
      propertyType: propertyType || undefined,
      createdAt: {
        gte: from ? new Date(from) : undefined,
        lte: to ? new Date(to) : undefined
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(rows);
}

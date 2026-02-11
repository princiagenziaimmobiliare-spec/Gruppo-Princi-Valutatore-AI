import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureAdmin } from "@/lib/admin-guard";

export async function GET() {
  const unauthorized = ensureAdmin();
  if (unauthorized) return unauthorized;
  const rows = await prisma.valuationRequest.findMany({ orderBy: { createdAt: "desc" } });
  const header = ["timestamp","nome","cognome","email","telefono","comune","tipologia","mq","valore_centrale","range_min","range_max"];
  const csv = [header.join(","), ...rows.map((r) => [r.createdAt.toISOString(), r.firstName, r.lastName, r.email, r.phone, r.comune, r.propertyType, r.mq, r.valuationCenter, r.valuationMin, r.valuationMax].join(","))].join("\n");
  return new NextResponse(csv, { headers: { "Content-Type": "text/csv", "Content-Disposition": "attachment; filename=richieste.csv" } });
}

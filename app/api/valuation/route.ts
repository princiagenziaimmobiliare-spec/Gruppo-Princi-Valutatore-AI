import { NextRequest, NextResponse } from "next/server";
import sanitizeHtml from "sanitize-html";
import { prisma } from "@/lib/prisma";
import { valuationSchema } from "@/lib/schemas";
import { checkRateLimit } from "@/lib/rate-limit";
import { calculateValuation } from "@/lib/valuation";
import { sendEmails } from "@/lib/mailer";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  if (!checkRateLimit(ip)) return NextResponse.json({ error: "Troppi tentativi, riprova più tardi." }, { status: 429 });

  const json = await request.json();
  const parsed = valuationSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Validazione fallita", details: parsed.error.flatten() }, { status: 400 });
  if (parsed.data.honeypot) return NextResponse.json({ error: "Bot rilevato" }, { status: 400 });

  const data = { ...parsed.data, notes: parsed.data.notes ? sanitizeHtml(parsed.data.notes, { allowedTags: [], allowedAttributes: {} }) : null };
  const [localities, coefficients, settings] = await Promise.all([
    prisma.locality.findMany(),
    prisma.coefficient.findMany(),
    prisma.settings.findUnique({ where: { id: "global" } })
  ]);

  if (!settings) return NextResponse.json({ error: "Configurazione mancante" }, { status: 500 });

  const result = calculateValuation({ ...data, localities, coefficients, settings });

  const saved = await prisma.valuationRequest.create({
    data: {
      ...data,
      features: data.features.join(","),
      valuationCenter: result.valueCenter,
      valuationMin: result.valueMin,
      valuationMax: result.valueMax,
      coefficientUsed: result.coefficientUsed,
      localityId: result.locality?.id
    }
  });

  const summary = `Comune: ${data.comune}\nTipologia: ${data.propertyType}\nMq: ${data.mq}\nValore centrale: €${Math.round(result.valueCenter)}\nRange: €${Math.round(result.valueMin)} - €${Math.round(result.valueMax)}\nValutazione automatica basata su parametri di mercato e informazioni fornite. Consigliato sopralluogo per una stima professionale gratuita.\nPowered by Gruppo PRINCI`;

  await sendEmails({
    userEmail: data.email,
    userSubject: "La tua valutazione gratuita – Gruppo PRINCI",
    userText: `${summary}\n\nContatti: ${settings.contactEmail} - ${settings.contactPhone}`,
    agencySubject: `Nuova richiesta valutazione – ${data.comune} – ${data.firstName} ${data.lastName} – ${data.phone}`,
    agencyText: `Lead completa\nTimestamp: ${saved.createdAt.toISOString()}\nNome: ${data.firstName} ${data.lastName}\nTelefono: ${data.phone}\nEmail: ${data.email}\nIndirizzo: ${data.street} ${data.streetNumber}, ${data.cap} ${data.comune} (${data.provincia})\nConsenso A: ${data.consentData}\nConsenso B: ${data.consentContact}\n${summary}`
  });

  return NextResponse.json({
    id: saved.id,
    valueCenter: result.valueCenter,
    valueMin: result.valueMin,
    valueMax: result.valueMax,
    ctaUrl: settings.ctaUrl
  });
}

import ValuationWizard from "@/components/valuation-wizard";
import { prisma } from "@/lib/prisma";

export default async function ValutazionePage() {
  const localities = await prisma.locality.findMany({ where: { isActive: true }, select: { id: true, comune: true, zona: true }, orderBy: [{ comune: "asc" }, { zona: "asc" }] });
  return (
    <section className="container-page py-10">
      <h1 className="mb-6 text-3xl font-bold">Valutazione gratuita immobile</h1>
      <ValuationWizard localities={localities} />
    </section>
  );
}

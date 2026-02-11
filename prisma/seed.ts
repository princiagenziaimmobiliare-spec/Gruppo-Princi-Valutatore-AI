import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const comuni = [
  "Monfalcone", "Gorizia", "Grado", "Ronchi dei Legionari", "Gradisca d'Isonzo", "Staranzano",
  "Turriaco", "San Canzian d'Isonzo", "Romans d'Isonzo", "Sagrado", "Savogna d'Isonzo",
  "Farra d'Isonzo", "Cormons", "Mariano del Friuli", "Mossa", "Medea", "Moraro", "Villesse",
  "Fogliano Redipuglia", "Capriva del Friuli", "San Floriano del Collio", "Doberdò del Lago", "Dolegna del Collio"
];

const coefficients = [
  ["condition", "da_ristrutturare", "Da ristrutturare", 0.82],
  ["condition", "discreto", "Discreto", 0.92],
  ["condition", "buono", "Buono", 1.0],
  ["condition", "ottimo", "Ottimo", 1.08],
  ["condition", "nuovo", "Nuovo", 1.14],
  ["floor", "terra", "Piano terra", 0.97],
  ["floor", "1", "Piano 1", 1.0],
  ["floor", "2", "Piano 2", 1.01],
  ["floor", "3", "Piano 3", 1.02],
  ["floor", "4_plus", "Piano 4+", 1.03],
  ["elevator", "no", "Senza ascensore", 0.98],
  ["elevator", "si", "Con ascensore", 1.0],
  ["feature", "garage", "Garage", 1.03],
  ["feature", "posto_auto", "Posto auto", 1.01],
  ["feature", "cantina", "Cantina", 1.01],
  ["feature", "giardino", "Giardino", 1.04],
  ["feature", "terrazzo_balcone", "Terrazzo/Balcone", 1.02],
  ["year", "lt_1970", "< 1970", 0.96],
  ["year", "1970_1999", "1970-1999", 0.99],
  ["year", "2000_2014", "2000-2014", 1.02],
  ["year", "gte_2015", ">= 2015", 1.04]
] as const;

async function main() {
  await prisma.settings.upsert({
    where: { id: "global" },
    create: {
      id: "global",
      provinceFallbackPrice: 1750,
      rangePercentage: 8,
      ctaUrl: "mailto:info@gruppoprinci.it",
      contactEmail: "info@gruppoprinci.it",
      contactPhone: "+39 000 0000000"
    },
    update: {}
  });

  for (const comune of comuni) {
    await prisma.locality.upsert({
      where: { comune_zona: { comune, zona: null } },
      create: { comune, zona: null, basePriceEur: comune === "Gorizia" ? 1850 : comune === "Grado" ? 2700 : 1700, isActive: true },
      update: {}
    });
  }

  for (const [group, key, label, value] of coefficients) {
    await prisma.coefficient.upsert({
      where: { group_key: { group, key } },
      create: { group, key, label, value },
      update: {}
    });
  }
}

main().finally(() => prisma.$disconnect());

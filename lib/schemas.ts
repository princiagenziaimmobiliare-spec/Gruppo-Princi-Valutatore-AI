import { z } from "zod";

export const valuationSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(6),
  street: z.string().min(2),
  streetNumber: z.string().min(1),
  cap: z.string().regex(/^\d{5}$/),
  comune: z.string().min(1),
  provincia: z.string().default("GO"),
  zona: z.string().optional().nullable(),
  propertyType: z.enum(["appartamento", "casa_singola", "bifamiliare", "villetta_schiera", "terreno", "locale_commerciale"]),
  mq: z.coerce.number().positive(),
  rooms: z.coerce.number().int().nonnegative(),
  bathrooms: z.coerce.number().int().nonnegative(),
  floor: z.coerce.number().int().optional().nullable(),
  hasElevator: z.boolean().optional().nullable(),
  condition: z.enum(["da_ristrutturare", "discreto", "buono", "ottimo", "nuovo"]),
  buildYear: z.coerce.number().int().optional().nullable(),
  features: z.array(z.enum(["garage", "posto_auto", "cantina", "soffitta", "giardino", "terrazzo_balcone"])),
  notes: z.string().optional().nullable(),
  consentData: z.literal(true),
  consentContact: z.literal(true),
  honeypot: z.string().optional().nullable()
});

export const adminLoginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1)
});

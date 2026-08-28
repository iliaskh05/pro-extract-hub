import { z } from "zod";
import { BUSINESS_TYPES } from "@/lib/site";

export const PHOTO_SLOTS = [
  { key: "hotte", label: "Photo hotte" },
  { key: "filtres", label: "Photo filtres" },
  { key: "conduit", label: "Photo conduit" },
  { key: "moteur", label: "Photo moteur" },
] as const;

export const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
export const MAX_PHOTOS = PHOTO_SLOTS.length;
export const ALLOWED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

const phoneRe = /^(?:\+33|0033|0)[1-9](?:[\s.-]?\d{2}){4}$|^\+[1-9]\d{7,14}$/;
const postalRe = /^\d{5}$/;

export const quoteSchema = z.object({
  business_type: z.enum(BUSINESS_TYPES),
  hood_length: z.string().max(80).optional().default(""),
  filter_count: z.string().max(10).optional().default(""),
  duct_present: z.boolean(),
  motor_present: z.boolean(),
  last_cleaning: z.string().max(80).optional().default(""),
  requested_frequency: z.string().max(80).optional().default(""),
  city: z.string().trim().min(2, "Indiquez la ville").max(80),
  postal_code: z
    .string()
    .trim()
    .refine((v) => v === "" || postalRe.test(v), "Code postal français à 5 chiffres"),
  contact_name: z.string().trim().min(2, "Indiquez votre nom").max(80),
  company_name: z.string().trim().max(120).optional().default(""),
  phone: z
    .string()
    .trim()
    .refine((v) => phoneRe.test(v.replace(/\s/g, "")), "Numéro de téléphone invalide"),
  email: z.string().trim().email("Adresse email invalide").max(120),
  message: z.string().max(2000).optional().default(""),
  preferred_contact: z.enum(["email", "phone", "whatsapp"]).optional(),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Le consentement est nécessaire pour traiter votre demande." }),
  }),
  website: z.string().max(0).optional().default(""),
  source: z.string().max(40).optional().default("website_form"),
  utm_source: z.string().max(80).optional().default(""),
  utm_medium: z.string().max(80).optional().default(""),
  utm_campaign: z.string().max(80).optional().default(""),
  uploads: z
    .array(
      z.object({
        slot: z.string().max(20),
        name: z.string().max(120),
        type: z.enum(ALLOWED_PHOTO_TYPES),
        size: z.number().int().positive().max(MAX_PHOTO_BYTES),
      }),
    )
    .max(MAX_PHOTOS)
    .optional()
    .default([]),
});

export type QuotePayload = z.infer<typeof quoteSchema>;

export type PhotoRecord = {
  slot: string;
  path: string;
  bucket: string;
  mime?: string | undefined;
  size?: number | undefined;
};

export const LEAD_PHOTOS_BUCKET = "lead-documents";

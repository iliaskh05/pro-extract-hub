import { z } from "zod";
import { BUSINESS_TYPES } from "@/lib/site";
import {
  ACCESSIBILITY_OPTIONS,
  DUCT_LENGTHS,
  HOOD_TYPES,
  INSTALLATION_TYPES,
  MAINTENANCE_FREQUENCIES,
  NEED_TYPES,
  REQUEST_TYPES,
  SCHEDULE_PREFERENCES,
  SOIL_LEVELS,
  URGENCY_LEVELS,
} from "@/lib/quote-options";

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

const needValues = NEED_TYPES.map((n) => n.value) as [string, ...string[]];
const urgencyValues = URGENCY_LEVELS.map((u) => u.value) as [string, ...string[]];
const requestValues = REQUEST_TYPES.map((r) => r.value) as [string, ...string[]];
const freqValues = MAINTENANCE_FREQUENCIES.map((f) => f.value) as [string, ...string[]];
const soilValues = SOIL_LEVELS.map((s) => s.value) as [string, ...string[]];
const accessValues = ACCESSIBILITY_OPTIONS.map((a) => a.value) as [string, ...string[]];

export const quoteSchema = z.object({
  business_type: z.enum(BUSINESS_TYPES),
  need_type: z.enum(needValues).optional().default("devis_classique"),
  city: z.string().trim().min(2, "Indiquez la ville").max(80),
  postal_code: z
    .string()
    .trim()
    .refine((v) => v === "" || postalRe.test(v), "Code postal français à 5 chiffres"),
  installation_type: z.enum(INSTALLATION_TYPES).optional().default("Autre / à préciser"),
  hood_type: z.enum(HOOD_TYPES).optional().default("Non précisé"),
  hood_length: z.string().max(80).optional().default(""),
  duct_length: z.enum(DUCT_LENGTHS).optional().default("Non précisé"),
  filter_count: z.string().max(10).optional().default(""),
  duct_present: z.boolean(),
  motor_present: z.boolean(),
  soil_level: z.enum(soilValues).optional().default("non_precise"),
  accessibility: z.enum(accessValues).optional().default("non_precise"),
  night_intervention: z.boolean().optional().default(false),
  schedule_preference: z.string().max(80).optional().default(""),
  request_type: z.enum(requestValues).optional().default("ponctuelle"),
  maintenance_frequency: z.enum(freqValues).optional().default("a_determiner"),
  urgency_level: z.enum(urgencyValues).optional().default("normal"),
  last_cleaning: z.string().max(80).optional().default(""),
  requested_frequency: z.string().max(80).optional().default(""),
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
  landing_page: z.string().max(200).optional().default(""),
  service_source: z.string().max(80).optional().default(""),
  zone_source: z.string().max(80).optional().default(""),
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

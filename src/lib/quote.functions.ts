import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { urgencyToPriority } from "@/lib/quote-options";
import { quoteSchema, LEAD_PHOTOS_BUCKET, type PhotoRecord } from "./quote-schema";

const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 6;
const attempts = new Map<string, number[]>();

async function clientKey() {
  try {
    const { getRequest } = await import("@tanstack/react-start/server");
    const req = getRequest();
    return (
      req.headers.get("cf-connecting-ip") ??
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      "unknown"
    );
  } catch {
    return "unknown";
  }
}

function rateLimited(key: string) {
  const now = Date.now();
  const recent = (attempts.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    attempts.set(key, recent);
    return true;
  }
  recent.push(now);
  attempts.set(key, recent);
  return false;
}

const UPLOAD_TOKEN_TTL_MS = 30 * 60 * 1000;

function tokenSecret() {
  const secret =
    process.env['SUPABASE_SERVICE_ROLE_KEY'] ?? process.env['SUPABASE_PUBLISHABLE_KEY'] ?? "";
  if (!secret) throw new Error("Configuration serveur incomplète.");
  return secret;
}

function b64url(bytes: Uint8Array) {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function signUploadToken(leadId: string, expiresAt: number) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(tokenSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`${leadId}.${expiresAt}`),
  );
  return `${expiresAt}.${b64url(new Uint8Array(sig))}`;
}

async function verifyUploadToken(leadId: string, token: string) {
  const [expRaw, sig] = token.split(".");
  const expiresAt = Number(expRaw);
  if (!expRaw || !sig || !Number.isFinite(expiresAt)) return false;
  if (Date.now() > expiresAt) return false;
  const expected = await signUploadToken(leadId, expiresAt);
  return expected === token;
}

function makeRef() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 6; i += 1) out += alphabet[Math.floor(Math.random() * alphabet.length)];
  return out;
}

export const submitQuote = createServerFn({ method: "POST" })
  .validator((data: unknown) => quoteSchema.parse(data))
  .handler(async ({ data }) => {
    if (data.website) {
      return { ok: true as const, reference: "XXXXXX", uploads: [] as never[], uploadToken: "" };
    }
    if (rateLimited(await clientKey())) {
      throw new Error("Trop de demandes depuis cette connexion. Réessayez dans une heure.");
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const reference = makeRef();
    const filterCount = data.filter_count ? Number(data.filter_count) : null;
    const urgency = data.need_type === "intervention_urgente" ? data.urgency_level : "normal";

    const core = {
      company_name: data.company_name || null,
      contact_name: data.contact_name,
      phone: data.phone,
      email: data.email,
      business_type: data.business_type,
      city: data.city,
      postal_code: data.postal_code || null,
      hood_length: data.hood_length || null,
      filter_count: Number.isFinite(filterCount) ? filterCount : null,
      duct_present: data.duct_present,
      motor_present: data.motor_present,
      last_cleaning: data.last_cleaning || null,
      requested_frequency: data.requested_frequency || null,
      photos: [] as PhotoRecord[],
      message: data.message || null,
      source: data.source || "website_form",
    };

    const extended = {
      ...core,
      reference,
      consent: true,
      preferred_contact: data.preferred_contact || null,
      priority: urgencyToPriority(urgency),
      utm_source: data.utm_source || null,
      utm_medium: data.utm_medium || null,
      utm_campaign: data.utm_campaign || null,
      need_type: data.need_type || null,
      installation_type: data.installation_type || null,
      hood_type: data.hood_type || null,
      duct_length: data.duct_length || null,
      soil_level: data.soil_level || null,
      accessibility: data.accessibility || null,
      night_intervention: data.night_intervention ?? false,
      schedule_preference: data.schedule_preference || null,
      request_type: data.request_type || null,
      maintenance_frequency: data.maintenance_frequency || null,
      urgency_level: urgency,
      landing_page: data.landing_page || null,
      service_source: data.service_source || null,
      zone_source: data.zone_source || null,
    };

    const full = await supabaseAdmin
      .from("leads")
      .insert(extended as never)
      .select("id")
      .single();
    let leadId = full.data?.id;
    if (full.error || !leadId) {
      const fallback = await supabaseAdmin.from("leads").insert(core).select("id").single();
      if (fallback.error || !fallback.data) {
        throw new Error("L'enregistrement de la demande a échoué.");
      }
      leadId = fallback.data.id;
    }

    const uploads: Array<{ slot: string; path: string; token: string }> = [];
    for (const file of data.uploads ?? []) {
      const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80);
      const path = `leads/${leadId}/documents/${file.slot}-${Date.now()}-${safe}`;
      const signed = await supabaseAdmin.storage
        .from(LEAD_PHOTOS_BUCKET)
        .createSignedUploadUrl(path);
      if (!signed.error && signed.data) {
        uploads.push({ slot: file.slot, path, token: signed.data.token });
      }
    }

    try {
      const { notifyNewLead } = await import("./notify-lead.server");
      await notifyNewLead({
        id: leadId,
        reference,
        company_name: data.company_name,
        contact_name: data.contact_name,
        phone: data.phone,
        email: data.email,
        city: data.city,
        business_type: data.business_type,
        source: data.source || "website_form",
        message: data.message,
        need_type: data.need_type,
        urgency_level: urgency,
        request_type: data.request_type,
        maintenance_frequency: data.maintenance_frequency,
        schedule_preference: data.schedule_preference,
        landing_page: data.landing_page,
        service_source: data.service_source,
        zone_source: data.zone_source,
      });
    } catch {
      /* La notification ne doit jamais bloquer l'enregistrement. */
    }

    const uploadToken = uploads.length
      ? await signUploadToken(leadId, Date.now() + UPLOAD_TOKEN_TTL_MS)
      : "";

    return { ok: true as const, id: leadId, reference, uploads, uploadToken };
  });

const attachSchema = z.object({
  leadId: z.string().uuid(),
  uploadToken: z.string().min(1).max(200),
  photos: z
    .array(
      z.object({
        slot: z.string().max(40),
        path: z.string().max(300),
        mime: z.string().max(100).optional(),
        size: z.number().int().nonnegative().optional(),
      }),
    )
    .max(8),
});

export const attachLeadPhotos = createServerFn({ method: "POST" })
  .validator((data: unknown) => attachSchema.parse(data))
  .handler(async ({ data }) => {
    if (!(await verifyUploadToken(data.leadId, data.uploadToken))) {
      throw new Error("Lien d'envoi de photos invalide ou expiré.");
    }
    const prefix = `leads/${data.leadId}/`;
    if (data.photos.some((p) => !p.path.startsWith(prefix))) {
      throw new Error("Chemin de fichier invalide.");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const photos: PhotoRecord[] = data.photos.map((p) => ({
      ...p,
      bucket: LEAD_PHOTOS_BUCKET,
    }));
    await supabaseAdmin.from("leads").update({ photos }).eq("id", data.leadId);
    return { ok: true as const };
  });

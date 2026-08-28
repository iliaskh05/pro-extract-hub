import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
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
      return { ok: true as const, reference: "XXXXXX", uploads: [] as never[] };
    }
    if (rateLimited(await clientKey())) {
      throw new Error("Trop de demandes depuis cette connexion. Réessayez dans une heure.");
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const reference = makeRef();
    const filterCount = data.filter_count ? Number(data.filter_count) : null;

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
      utm_source: data.utm_source || null,
      utm_medium: data.utm_medium || null,
      utm_campaign: data.utm_campaign || null,
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
      });
    } catch {
      /* La notification ne doit jamais bloquer l'enregistrement. */
    }

    return { ok: true as const, id: leadId, reference, uploads };
  });

const attachSchema = z.object({
  leadId: z.string().uuid(),
  photos: z
    .array(
      z.object({
        slot: z.string(),
        path: z.string(),
        mime: z.string().optional(),
        size: z.number().optional(),
      }),
    )
    .max(8),
});

export const attachLeadPhotos = createServerFn({ method: "POST" })
  .validator((data: unknown) => attachSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const photos: PhotoRecord[] = data.photos.map((p) => ({
      ...p,
      bucket: LEAD_PHOTOS_BUCKET,
    }));
    await supabaseAdmin.from("leads").update({ photos }).eq("id", data.leadId);
    return { ok: true as const };
  });

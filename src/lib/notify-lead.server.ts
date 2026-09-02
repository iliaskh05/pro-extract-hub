import { SITE, siteUrl } from "@/lib/site";
import {
  labelFor,
  MAINTENANCE_FREQUENCIES,
  NEED_TYPES,
  REQUEST_TYPES,
  URGENCY_LEVELS,
} from "@/lib/quote-options";

type LeadNotice = {
  id: string;
  reference: string;
  company_name?: string;
  contact_name: string;
  phone: string;
  email: string;
  city: string;
  business_type: string;
  source: string;
  message?: string;
  need_type?: string;
  urgency_level?: string;
  request_type?: string;
  maintenance_frequency?: string;
  schedule_preference?: string;
  landing_page?: string;
  service_source?: string;
  zone_source?: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

async function sendResend(to: string, subject: string, html: string, text: string) {
  const key = process.env["RESEND_API_KEY"];
  const from = process.env["RESEND_FROM"];
  if (!key || !from) return false;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to: [to], subject, html, text }),
  });
  return res.ok;
}

export async function notifyNewLead(lead: LeadNotice) {
  const adminTo = process.env["LEAD_NOTIFY_EMAIL"];
  const origin = siteUrl() || "https://localhost";
  const crmUrl = `${origin}/admin?lead=${lead.id}`;
  const brand = SITE.name;
  const urgencyLabel = labelFor(URGENCY_LEVELS, lead.urgency_level ?? "normal");
  const needLabel = labelFor(NEED_TYPES, lead.need_type ?? "devis_classique");
  const requestLabel = labelFor(REQUEST_TYPES, lead.request_type ?? "ponctuelle");
  const freqLabel = labelFor(MAINTENANCE_FREQUENCIES, lead.maintenance_frequency ?? "a_determiner");

  const summary = [
    `Référence : #${lead.reference}`,
    `Entreprise : ${lead.company_name || "—"}`,
    `Contact : ${lead.contact_name}`,
    `Téléphone : ${lead.phone}`,
    `Email : ${lead.email}`,
    `Ville : ${lead.city}`,
    `Établissement : ${lead.business_type}`,
    `Besoin : ${needLabel}`,
    `Urgence : ${urgencyLabel}`,
    `Type de demande : ${requestLabel}`,
    `Fréquence : ${freqLabel}`,
    `Préférence horaire : ${lead.schedule_preference || "—"}`,
    `Source : ${lead.source}`,
    lead.landing_page ? `Page d'origine : ${lead.landing_page}` : "",
    lead.service_source ? `Service source : ${lead.service_source}` : "",
    lead.zone_source ? `Zone source : ${lead.zone_source}` : "",
    `Date : ${new Date().toLocaleString("fr-FR")}`,
    lead.message ? `Message : ${lead.message}` : "",
    `CRM : ${crmUrl}`,
  ]
    .filter(Boolean)
    .join("\n");

  const clientSummary = [
    `Établissement : ${lead.business_type}`,
    `Ville : ${lead.city}`,
    `Besoin : ${needLabel}`,
    `Type de demande : ${requestLabel}`,
    urgencyLabel !== "Normale" ? `Urgence : ${urgencyLabel}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  if (adminTo) {
    await sendResend(
      adminTo,
      `[${brand}] Nouvelle demande #${lead.reference} — ${lead.city}${urgencyLabel !== "Normale" ? ` (${urgencyLabel})` : ""}`,
      `<p>Nouvelle demande de devis.</p><pre>${escapeHtml(summary)}</pre><p><a href="${crmUrl}">Ouvrir dans le CRM</a></p>`,
      summary,
    );
  }

  await sendResend(
    lead.email,
    `Votre demande est enregistrée — ${brand}`,
    `<p>Bonjour ${escapeHtml(lead.contact_name)},</p>
     <p>Votre demande a bien été enregistrée. Référence : <strong>#${escapeHtml(lead.reference)}</strong>.</p>
     <p><strong>Résumé :</strong></p>
     <pre>${escapeHtml(clientSummary)}</pre>
     <p>Notre équipe analyse votre demande et vous recontactera selon votre préférence de contact.</p>
     <p>Pour toute précision, vous pouvez nous joindre via la page contact du site.</p>
     <p>${escapeHtml(brand)}</p>`,
    `Bonjour ${lead.contact_name},\n\nVotre demande a bien été enregistrée. Référence : #${lead.reference}.\n\n${clientSummary}\n\nNotre équipe vous recontactera prochainement.\n\n${brand}`,
  );
}

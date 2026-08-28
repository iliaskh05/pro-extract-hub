import { SITE, siteUrl } from "@/lib/site";

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
  const summary = [
    `Référence : #${lead.reference}`,
    `Entreprise : ${lead.company_name || "—"}`,
    `Contact : ${lead.contact_name}`,
    `Téléphone : ${lead.phone}`,
    `Email : ${lead.email}`,
    `Ville : ${lead.city}`,
    `Établissement : ${lead.business_type}`,
    `Source : ${lead.source}`,
    `Date : ${new Date().toLocaleString("fr-FR")}`,
    lead.message ? `Message : ${lead.message}` : "",
    `CRM : ${crmUrl}`,
  ]
    .filter(Boolean)
    .join("\n");

  if (adminTo) {
    await sendResend(
      adminTo,
      `[${brand}] Nouvelle demande #${lead.reference} — ${lead.city}`,
      `<p>Nouvelle demande de devis.</p><pre>${escapeHtml(summary)}</pre><p><a href="${crmUrl}">Ouvrir dans le CRM</a></p>`,
      summary,
    );
  }

  await sendResend(
    lead.email,
    `Votre demande est enregistrée — ${brand}`,
    `<p>Bonjour ${escapeHtml(lead.contact_name)},</p>
     <p>Votre demande a bien été enregistrée. Référence : <strong>#${escapeHtml(lead.reference)}</strong>.</p>
     <p>Nous disposons maintenant des informations nécessaires pour analyser votre installation.</p>
     <p>${escapeHtml(brand)}</p>`,
    `Bonjour ${lead.contact_name},\n\nVotre demande a bien été enregistrée. Référence : #${lead.reference}.\n\n${brand}`,
  );
}

/** Préremplissage du formulaire devis (chat, secteurs, zones). */

const STORAGE_KEY = "s3h-quote-prefill";

export type QuotePrefill = {
  business_type?: string;
  city?: string;
  postal_code?: string;
  need_type?: string;
  request_type?: string;
  service_source?: string;
  zone_source?: string;
  landing_page?: string;
  message?: string;
};

export function saveQuotePrefill(data: QuotePrefill) {
  if (typeof window === "undefined") return;
  try {
    const existing = loadQuotePrefill();
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ ...existing, ...data }));
  } catch {
    /* ignore */
  }
}

export function loadQuotePrefill(): QuotePrefill {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as QuotePrefill) : {};
  } catch {
    return {};
  }
}

export function clearQuotePrefill() {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function readAttribution() {
  if (typeof window === "undefined") {
    return {
      utm_source: "",
      utm_medium: "",
      utm_campaign: "",
      landing_page: "",
      service_source: "",
      zone_source: "",
    };
  }
  const q = new URLSearchParams(window.location.search);
  const prefill = loadQuotePrefill();
  return {
    utm_source: q.get("utm_source") ?? "",
    utm_medium: q.get("utm_medium") ?? "",
    utm_campaign: q.get("utm_campaign") ?? "",
    landing_page: prefill.landing_page || window.location.pathname,
    service_source: prefill.service_source || q.get("service") || "",
    zone_source: prefill.zone_source || q.get("zone") || "",
  };
}

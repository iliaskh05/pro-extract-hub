/**
 * Consentement (RGPD / CNIL) et mesure d'audience.
 *
 * Quatre catégories : nécessaires (toujours actives), mesure d'audience,
 * marketing, services tiers. Aucun script soumis à consentement n'est chargé
 * avant l'accord correspondant — voir AnalyticsGate / ThirdPartyGate.
 */

export type ConsentCategory = "analytics" | "marketing" | "thirdParty";

export type Consent = {
  essential: true;
  analytics: boolean;
  marketing: boolean;
  thirdParty: boolean;
};

export const CONSENT_KEY = "s3h-consent";
/** Incrémenter pour redemander le consentement après un changement de traceurs. */
export const CONSENT_VERSION = 2;
/** Durée de validité du consentement : 6 mois (recommandation CNIL : 13 mois max). */
export const CONSENT_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 183;

export const CONSENT_EVENT = "s3h-consent";
export const OPEN_CONSENT_EVENT = "s3h-open-consent";

export const CONSENT_DENIED: Consent = {
  essential: true,
  analytics: false,
  marketing: false,
  thirdParty: false,
};

export const CONSENT_GRANTED: Consent = {
  essential: true,
  analytics: true,
  marketing: true,
  thirdParty: true,
};

export function readConsent(): Consent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Consent> & { at?: number; v?: number };
    if (parsed.essential !== true) return null;
    if (parsed.v !== CONSENT_VERSION) return null;
    if (typeof parsed.at === "number" && Date.now() - parsed.at > CONSENT_MAX_AGE_MS) return null;
    return {
      essential: true,
      analytics: !!parsed.analytics,
      marketing: !!parsed.marketing,
      thirdParty: !!parsed.thirdParty,
    };
  } catch {
    return null;
  }
}

export function writeConsent(consent: Consent) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      CONSENT_KEY,
      JSON.stringify({ ...consent, v: CONSENT_VERSION, at: Date.now() }),
    );
  } catch {
    /* stockage indisponible : le choix vaut pour la session en cours */
  }
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

/** Retire le consentement enregistré et rouvre le bandeau. */
export function resetConsent() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(CONSENT_KEY);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

/** Ouvre le panneau « Gérer mes cookies » (lien permanent du footer). */
export function openConsentManager() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(OPEN_CONSENT_EVENT));
}

export function hasConsent(category: ConsentCategory): boolean {
  const consent = readConsent();
  return !!consent?.[category];
}

export function track(event: string, props?: Record<string, string | number | boolean>) {
  if (typeof window === "undefined") return;
  if (!hasConsent("analytics")) return;
  const plausible = (
    window as Window & { plausible?: (n: string, o?: { props?: typeof props }) => void }
  ).plausible;
  if (typeof plausible === "function") {
    plausible(event, props ? { props } : undefined);
  }
}

export function plausibleDomain() {
  try {
    const value = import.meta.env["VITE_PLAUSIBLE_DOMAIN"];
    return typeof value === "string" ? value.trim() : "";
  } catch {
    return "";
  }
}

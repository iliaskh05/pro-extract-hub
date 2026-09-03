type Consent = {
  essential: true;
  analytics: boolean;
  marketing: boolean;
};

export const CONSENT_KEY = "s3h-consent";

export function readConsent(): Consent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Consent>;
    if (parsed.essential !== true) return null;
    return {
      essential: true,
      analytics: !!parsed.analytics,
      marketing: !!parsed.marketing,
    };
  } catch {
    return null;
  }
}

export function writeConsent(consent: Consent) {
  window.localStorage.setItem(CONSENT_KEY, JSON.stringify({ ...consent, at: Date.now() }));
  window.dispatchEvent(new Event("s3h-consent"));
}

export function track(event: string, props?: Record<string, string | number | boolean>) {
  if (typeof window === "undefined") return;
  const consent = readConsent();
  if (!consent?.analytics) return;
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

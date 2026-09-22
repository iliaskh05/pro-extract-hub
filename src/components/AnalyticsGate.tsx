import { useEffect } from "react";
import { plausibleDomain } from "@/lib/analytics";
import { useCategoryConsent } from "@/hooks/use-consent";

/**
 * Charge la mesure d'audience uniquement après consentement explicite.
 * Le refus (ou le retrait) empêche l'injection du script et le retire du DOM.
 */
export function AnalyticsGate() {
  const allowed = useCategoryConsent("analytics");
  const domain = plausibleDomain();

  useEffect(() => {
    const existing = document.querySelector("script[data-s3h-analytics]");

    if (!allowed || !domain) {
      existing?.remove();
      return;
    }
    if (existing) return;

    const script = document.createElement("script");
    script.defer = true;
    script.setAttribute("data-s3h-analytics", "true");
    script.setAttribute("data-domain", domain);
    script.src = "https://plausible.io/js/script.tagged-events.js";
    document.head.appendChild(script);
  }, [allowed, domain]);

  return null;
}

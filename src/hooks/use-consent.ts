import { useEffect, useState } from "react";
import {
  CONSENT_EVENT,
  type Consent,
  type ConsentCategory,
  readConsent,
} from "@/lib/analytics";

/** Consentement courant, resynchronisé à chaque changement de choix. */
export function useConsent(): Consent | null {
  const [consent, setConsent] = useState<Consent | null>(null);

  useEffect(() => {
    const sync = () => setConsent(readConsent());
    sync();
    window.addEventListener(CONSENT_EVENT, sync);
    return () => window.removeEventListener(CONSENT_EVENT, sync);
  }, []);

  return consent;
}

/** true uniquement après accord explicite pour la catégorie demandée. */
export function useCategoryConsent(category: ConsentCategory): boolean {
  const consent = useConsent();
  return !!consent?.[category];
}

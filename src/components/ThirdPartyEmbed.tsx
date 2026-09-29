import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { openConsentManager } from "@/lib/analytics";
import { useCategoryConsent } from "@/hooks/use-consent";

/**
 * Enveloppe tout contenu tiers (carte, vidéo, widget d'avis, iframe externe).
 * Rien n'est chargé tant que la catégorie « Services tiers » n'a pas été acceptée.
 */
export function ThirdPartyEmbed({
  provider,
  description,
  children,
}: {
  provider: string;
  description?: string;
  children: ReactNode;
}) {
  const allowed = useCategoryConsent("thirdParty");

  if (allowed) return <>{children}</>;

  return (
    <div className="flex flex-col items-start gap-3 rounded-2xl border border-border bg-secondary/40 p-5 text-sm">
      <p className="font-medium text-foreground">Contenu {provider} bloqué</p>
      <p className="text-muted-foreground">
        {description ??
          `Ce contenu est fourni par ${provider} et peut déposer des cookies. Il s'affichera après votre accord pour les services tiers.`}
      </p>
      <Button type="button" variant="outline" size="sm" onClick={() => openConsentManager()}>
        Autoriser les services tiers
      </Button>
    </div>
  );
}

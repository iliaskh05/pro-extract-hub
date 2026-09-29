import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  CONSENT_DENIED,
  CONSENT_GRANTED,
  OPEN_CONSENT_EVENT,
  plausibleDomain,
  readConsent,
  writeConsent,
} from "@/lib/analytics";

type CategoryKey = "analytics" | "marketing" | "thirdParty";

const CATEGORIES: Array<{ key: CategoryKey; label: string; help: string }> = [
  {
    key: "analytics",
    label: "Mesure d'audience / statistiques",
    help: "Fréquentation et pages consultées, sans publicité ni revente.",
  },
  {
    key: "marketing",
    label: "Marketing / publicité",
    help: "Mesure des campagnes et remarketing.",
  },
  {
    key: "thirdParty",
    label: "Services tiers",
    help: "Contenus externes (cartes, vidéos, avis) chargés depuis d'autres sites.",
  },
];

export function CookieConsent() {
  const [open, setOpen] = useState(false);
  const [manage, setManage] = useState(false);
  const [choices, setChoices] = useState({
    analytics: false,
    marketing: false,
    thirdParty: false,
  });
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const current = readConsent();
    if (!current) {
      setOpen(true);
      return;
    }
    setChoices({
      analytics: current.analytics,
      marketing: current.marketing,
      thirdParty: current.thirdParty,
    });
  }, []);

  useEffect(() => {
    const reopen = () => {
      const current = readConsent();
      setChoices({
        analytics: !!current?.analytics,
        marketing: !!current?.marketing,
        thirdParty: !!current?.thirdParty,
      });
      setManage(true);
      setOpen(true);
    };
    window.addEventListener(OPEN_CONSENT_EVENT, reopen);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, reopen);
  }, []);

  useEffect(() => {
    if (!open || !manage) return;
    panelRef.current?.focus();
  }, [open, manage]);

  function acceptAll() {
    writeConsent(CONSENT_GRANTED);
    setChoices({ analytics: true, marketing: true, thirdParty: true });
    setManage(false);
    setOpen(false);
  }

  function refuseAll() {
    writeConsent(CONSENT_DENIED);
    setChoices({ analytics: false, marketing: false, thirdParty: false });
    setManage(false);
    setOpen(false);
  }

  function save() {
    writeConsent({ essential: true, ...choices });
    setManage(false);
    setOpen(false);
  }

  if (!open) return null;

  const audienceHelp = plausibleDomain()
    ? "Statistiques de fréquentation (Plausible), sans publicité."
    : "Aucun outil de mesure n'est actif aujourd'hui ; ce choix s'appliquera s'il est ajouté.";

  return (
    <div
      role="region"
      aria-label="Consentement aux cookies"
      aria-live="polite"
      className="fixed inset-x-0 bottom-[calc(4.75rem+env(safe-area-inset-bottom))] z-[70] p-3 sm:bottom-0 sm:p-4 sm:pb-[calc(1rem+env(safe-area-inset-bottom))] lg:bottom-0"
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        className="mx-auto max-w-3xl rounded-2xl border border-border bg-background/95 p-4 shadow-lift backdrop-blur-xl outline-none sm:p-5"
      >
        <p className="text-sm font-semibold tracking-tight">Cookies et confidentialité</p>
        <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-muted-foreground sm:mt-2 sm:text-sm">
          Seuls les cookies nécessaires au fonctionnement du site sont déposés d'office. La mesure
          d'audience, le marketing et les services tiers ne sont activés qu'avec votre accord, que
          vous pouvez retirer à tout moment.{" "}
          <Link to="/confidentialite" className="underline-offset-4 hover:underline">
            Politique de confidentialité
          </Link>
          .
        </p>

        {manage && (
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-start gap-3 rounded-xl border border-border bg-secondary/40 p-3">
              <input
                type="checkbox"
                checked
                disabled
                className="mt-1"
                aria-label="Cookies nécessaires (toujours actifs)"
              />
              <span>
                <span className="font-medium text-foreground">Cookies nécessaires</span>
                <span className="block text-muted-foreground">
                  Sécurité, mémorisation de votre choix de cookies, envoi des formulaires. Toujours
                  actifs.
                </span>
              </span>
            </div>
            {CATEGORIES.map((category) => (
              <label
                key={category.key}
                className="flex items-start gap-3 rounded-xl border border-border p-3"
              >
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={choices[category.key]}
                  onChange={(e) =>
                    setChoices((prev) => ({ ...prev, [category.key]: e.target.checked }))
                  }
                />
                <span>
                  <span className="font-medium text-foreground">{category.label}</span>
                  <span className="block text-muted-foreground">
                    {category.key === "analytics" ? audienceHelp : category.help}
                  </span>
                </span>
              </label>
            ))}
          </div>
        )}

        <div className="mt-4 grid grid-cols-2 gap-2 sm:flex sm:flex-row sm:flex-wrap">
          <Button type="button" onClick={acceptAll} className="sm:flex-1">
            Tout accepter
          </Button>
          <Button type="button" variant="outline" onClick={refuseAll} className="sm:flex-1">
            Tout refuser
          </Button>
          {manage ? (
            <Button type="button" variant="ghost" onClick={save} className="col-span-2 sm:flex-1">
              Enregistrer mes choix
            </Button>
          ) : (
            <Button
              type="button"
              variant="ghost"
              onClick={() => setManage(true)}
              className="col-span-2 sm:flex-1"
            >
              Personnaliser
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

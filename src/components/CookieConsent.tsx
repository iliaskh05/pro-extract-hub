import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { plausibleDomain, readConsent, writeConsent } from "@/lib/analytics";

export function CookieConsent() {
  const [open, setOpen] = useState(false);
  const [manage, setManage] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    setOpen(!readConsent());
  }, []);

  function acceptAll() {
    writeConsent({ essential: true, analytics: true, marketing: true });
    setOpen(false);
  }

  function refuse() {
    writeConsent({ essential: true, analytics: false, marketing: false });
    setOpen(false);
  }

  function save() {
    writeConsent({ essential: true, analytics, marketing });
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-x-0 bottom-[calc(4.75rem+env(safe-area-inset-bottom))] z-[70] p-3 sm:bottom-0 sm:p-4 sm:pb-[calc(1rem+env(safe-area-inset-bottom))] lg:bottom-0">
      <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-background/95 p-4 shadow-lift backdrop-blur-xl sm:p-5">
        <p className="text-sm font-semibold tracking-tight">Cookies et confidentialité</p>
        <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-muted-foreground sm:mt-2 sm:text-sm">
          Les cookies essentiels assurent le fonctionnement du site.{" "}
          <span className="hidden sm:inline">
            Les mesures d'audience et les cookies marketing ne sont déposés qu'avec votre accord.{" "}
          </span>
          <Link to="/confidentialite" className="underline-offset-4 hover:underline">
            Politique de confidentialité
          </Link>
          .
        </p>


        {manage && (
          <div className="mt-4 space-y-3 text-sm">
            <label className="flex items-start gap-3">
              <input type="checkbox" checked disabled className="mt-1" />
              <span>
                <span className="font-medium">Essentiels</span>
                <span className="block text-muted-foreground">
                  Nécessaires au fonctionnement. Toujours actifs.
                </span>
              </span>
            </label>
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                className="mt-1"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
              />
              <span>
                <span className="font-medium">Mesure d'audience</span>
                <span className="block text-muted-foreground">
                  {plausibleDomain()
                    ? "Statistiques de fréquentation, sans publicité."
                    : "Aucun outil d'audience n'est encore configuré."}
                </span>
              </span>
            </label>
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                className="mt-1"
                checked={marketing}
                onChange={(e) => setMarketing(e.target.checked)}
              />
              <span>
                <span className="font-medium">Marketing</span>
                <span className="block text-muted-foreground">
                  Campagnes éventuelles. Inactif tant qu'aucun outil n'est branché.
                </span>
              </span>
            </label>
          </div>
        )}

        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <Button onClick={acceptAll} className="sm:flex-1">
            Tout accepter
          </Button>
          <Button variant="outline" onClick={refuse} className="sm:flex-1">
            Tout refuser
          </Button>
          {manage ? (
            <Button variant="ghost" onClick={save}>
              Enregistrer
            </Button>
          ) : (
            <Button variant="ghost" onClick={() => setManage(true)}>
              Personnaliser
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

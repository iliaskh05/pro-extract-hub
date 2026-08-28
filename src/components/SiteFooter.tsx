import { Link } from "@tanstack/react-router";
import { SERVICES, SITE, activeZones, displayValue, whatsappLink } from "@/lib/site";
import { BrandMark } from "@/components/BrandMark";

export function SiteFooter() {
  const wa = whatsappLink();
  const zones = activeZones();

  return (
    <footer className="surface-ink border-t border-ink-border">
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <BrandMark inverted />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-ink-muted">
              {SITE.tagline} pour les cuisines professionnelles.
            </p>
            <p className="mt-3 text-xs text-ink-muted/80">{SITE.launch}.</p>
          </div>

          <div className="lg:col-span-2">
            <h2 className="eyebrow text-accent">Services</h2>
            <ul className="mt-4 space-y-2.5">
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <Link
                    to="/services/$slug"
                    params={{ slug: s.slug }}
                    className="text-sm text-ink-muted transition-colors hover:text-ink-foreground"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h2 className="eyebrow text-accent">Zones</h2>
            <ul className="mt-4 space-y-2.5">
              {zones.map((z) => (
                <li key={z.slug}>
                  <Link
                    to="/zones/$slug"
                    params={{ slug: z.slug }}
                    className="text-sm text-ink-muted transition-colors hover:text-ink-foreground"
                  >
                    {z.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/zones"
                  className="text-sm text-ink-muted transition-colors hover:text-ink-foreground"
                >
                  Voir la carte
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h2 className="eyebrow text-accent">Entreprise</h2>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link
                  to="/methode"
                  className="text-sm text-ink-muted transition-colors hover:text-ink-foreground"
                >
                  Notre méthode
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-sm text-ink-muted transition-colors hover:text-ink-foreground"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-sm text-ink-muted transition-colors hover:text-ink-foreground"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/devis"
                  className="text-sm text-ink-muted transition-colors hover:text-ink-foreground"
                >
                  Demander un devis
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h2 className="eyebrow text-accent">Contact</h2>
            <ul className="mt-4 space-y-2.5 text-sm text-ink-muted">
              <li>Téléphone : {displayValue(SITE.phone, "À confirmer")}</li>
              <li>Email : {displayValue(SITE.email, "À confirmer")}</li>
              <li>{displayValue(SITE.address, "Adresse à confirmer")}</li>
              <li>
                {wa ? (
                  <a
                    href={wa}
                    target="_blank"
                    rel="noreferrer"
                    className="transition-colors hover:text-ink-foreground"
                  >
                    WhatsApp
                  </a>
                ) : (
                  <span>WhatsApp : numéro à confirmer</span>
                )}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-ink-border pt-8 text-xs text-ink-muted md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {displayValue(SITE.legalName, SITE.name)}.
          </p>
          <nav className="flex flex-wrap gap-5" aria-label="Liens légaux">
            <Link to="/mentions-legales" className="hover:text-ink-foreground">
              Mentions légales
            </Link>
            <Link to="/confidentialite" className="hover:text-ink-foreground">
              Confidentialité
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

import { Link } from "@tanstack/react-router";
import { SERVICES, SITE, ZONES, whatsappLink } from "@/lib/site";

export function SiteFooter() {
  const wa = whatsappLink();

  return (
    <footer className="surface-ink border-t border-ink-border">
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-ink-foreground/10 text-ink-foreground">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M3 9.5 12 4l9 5.5M5 11v8h14v-8M9 19v-4h6v4"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="text-[15px] font-extrabold tracking-tight text-ink-foreground">
                Extraction<span className="text-accent">Pro</span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-muted">
              {SITE.tagline} pour les cuisines professionnelles. {SITE.launch}.
            </p>
            <p className="mt-4 text-xs text-ink-muted/80">
              Prototype de présentation — contenus de démonstration.
            </p>
          </div>

          <div>
            <h2 className="eyebrow text-accent">Prestations</h2>
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

          <div>
            <h2 className="eyebrow text-accent">Zones d'intervention</h2>
            <ul className="mt-4 space-y-2.5">
              {ZONES.map((z) => (
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

          <div>
            <h2 className="eyebrow text-accent">Contact</h2>
            <ul className="mt-4 space-y-2.5 text-sm text-ink-muted">
              <li>Téléphone : {SITE.phonePlaceholder}</li>
              <li>Email : {SITE.emailPlaceholder}</li>
              <li>{SITE.addressPlaceholder}</li>
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
                  <span>WhatsApp : numéro à définir</span>
                )}
              </li>
              <li>
                <Link
                  to="/devis"
                  className="transition-colors hover:text-ink-foreground"
                >
                  Demander un devis
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-ink-border pt-8 text-xs text-ink-muted md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {SITE.legalName}. {SITE.siretPlaceholder}.
          </p>
          <nav className="flex flex-wrap gap-5" aria-label="Liens légaux">
            <Link to="/mentions-legales" className="hover:text-ink-foreground">
              Mentions légales
            </Link>
            <Link to="/confidentialite" className="hover:text-ink-foreground">
              Politique de confidentialité
            </Link>
            <Link to="/admin" className="hover:text-ink-foreground">
              Espace admin (démo)
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

import { Link } from "@tanstack/react-router";
import { SERVICES, SITE, activeZones, displayValue } from "@/lib/site";
import { BrandMark } from "@/components/BrandMark";

export function SiteFooter() {
  const zones = activeZones();

  return (
    <footer className="border-t border-border bg-background">
      <div className="shell py-14 lg:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <BrandMark className="w-[9rem]" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {SITE.tagline} pour les cuisines professionnelles.
            </p>
          </div>

          <div className="lg:col-span-3">
            <h2 className="eyebrow text-muted-foreground">Prestations</h2>
            <ul className="mt-4 space-y-2.5">
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <Link
                    to="/services/$slug"
                    params={{ slug: s.slug }}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h2 className="eyebrow text-muted-foreground">Zones</h2>
            <ul className="mt-4 space-y-2.5">
              {zones.map((z) => (
                <li key={z.slug}>
                  <Link
                    to="/zones/$slug"
                    params={{ slug: z.slug }}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {z.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h2 className="eyebrow text-muted-foreground">Contact</h2>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li>{displayValue(SITE.phone, "Téléphone à confirmer")}</li>
              <li>{displayValue(SITE.email, "Email à confirmer")}</li>
              <li>
                <Link to="/contact" className="transition-colors hover:text-foreground">
                  Nous écrire
                </Link>
              </li>
              <li>
                <Link to="/devis" className="transition-colors hover:text-foreground">
                  Demander un devis
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-8 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {displayValue(SITE.legalName, SITE.name)}.
          </p>
          <nav className="flex flex-wrap gap-6" aria-label="Liens légaux">
            <Link to="/methode" className="hover:text-foreground">
              Notre méthode
            </Link>
            <Link to="/faq" className="hover:text-foreground">
              FAQ
            </Link>
            <Link to="/mentions-legales" className="hover:text-foreground">
              Mentions légales
            </Link>
            <Link to="/confidentialite" className="hover:text-foreground">
              Politique de confidentialité
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

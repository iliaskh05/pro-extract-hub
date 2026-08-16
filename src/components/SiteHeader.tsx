import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/services", label: "Services" },
  { to: "/methode", label: "Notre méthode" },
  { to: "/zones", label: "Zones d'intervention" },
  { to: "/faq", label: "FAQ" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-border bg-background/85 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 md:h-20 lg:px-8">
        <Link to="/" className="group flex items-center gap-2.5" aria-label="Accueil">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-ink text-ink-foreground transition-transform duration-300 group-hover:-translate-y-0.5">
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
          <span className="leading-tight">
            <span className="block text-[15px] font-extrabold tracking-tight">
              Extraction<span className="text-accent">Pro</span>
            </span>
            <span className="block text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
              Hottes · Conduits · Moteurs
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navigation principale">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "text-foreground bg-secondary" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button asChild variant="ghost" size="sm">
            <Link to="/contact">
              <Phone className="size-4" /> Parler à un expert
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/devis">Obtenir mon devis</Link>
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-border bg-background/70 lg:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="fixed inset-x-0 top-16 bottom-0 z-50 overflow-y-auto border-t border-border bg-background px-5 py-6 lg:hidden">
          <nav className="flex flex-col gap-1" aria-label="Navigation mobile">
            {[{ to: "/", label: "Accueil" }, ...NAV].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-4 py-4 text-lg font-semibold tracking-tight hover:bg-secondary"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/admin"
              onClick={() => setOpen(false)}
              className="rounded-lg px-4 py-4 text-sm text-muted-foreground hover:bg-secondary"
            >
              Espace admin (démo CRM)
            </Link>
          </nav>
          <div className="mt-6 flex flex-col gap-3">
            <Button asChild size="lg">
              <Link to="/devis" onClick={() => setOpen(false)}>
                Obtenir mon devis
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/contact" onClick={() => setOpen(false)}>
                Parler à un expert
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

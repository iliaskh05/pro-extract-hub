import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/BrandMark";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/services", label: "Prestations" },
  { to: "/methode", label: "Notre méthode" },
  { to: "/secteurs", label: "Secteurs" },
  { to: "/zones", label: "Zones d'intervention" },
  { to: "/contact", label: "Contact" },
];

const MOBILE_NAV = [{ to: "/", label: "Accueil" }, ...NAV, { to: "/faq", label: "FAQ" }];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur-xl transition-[border-color,box-shadow] duration-300",
        scrolled || open ? "border-border shadow-[0_1px_0_0_rgb(17_17_17/0.04)]" : "border-transparent",
      )}
    >
      <div
        className={cn(
          "shell flex items-center gap-3 transition-[height] duration-300 ease-out",
          scrolled ? "h-14 md:h-16" : "h-16 md:h-20 lg:h-24",
        )}
      >
        <Link
          to="/"
          className="inline-flex min-w-0 shrink items-center transition-opacity hover:opacity-80"
          aria-label={`Accueil ${SITE.name}`}
        >
          <BrandMark
            className={cn(
              "transition-[width] duration-300 ease-out",
              scrolled ? "w-[7rem] md:w-[8.5rem]" : "w-[7.5rem] md:w-[10rem] lg:w-[11.5rem]",
            )}
          />
        </Link>

        <nav
          className="mx-auto hidden items-center gap-0.5 lg:flex"
          aria-label="Navigation principale"
        >
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-sm px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <Button asChild size="sm" className="h-10 rounded-sm px-4 text-sm">
            <Link to="/devis">Demander un devis</Link>
          </Button>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-border text-foreground transition-colors hover:bg-secondary lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div
          className={cn(
            "panel-in fixed inset-x-0 bottom-0 z-50 overflow-y-auto border-t border-border bg-background px-5 py-6 lg:hidden",
            scrolled ? "top-14 md:top-16" : "top-16 md:top-20",
          )}
        >
          <nav className="flex flex-col" aria-label="Navigation mobile">
            {MOBILE_NAV.map((item, i) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                style={{ animationDelay: `${50 + i * 40}ms` }}
                className="step-in border-b border-border py-4 text-lg font-semibold tracking-[-0.02em] transition-colors hover:text-accent"
                activeProps={{ className: "text-accent" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Button asChild size="lg" className="mt-8 h-12 w-full rounded-sm">
            <Link to="/devis" onClick={() => setOpen(false)}>
              Demander un devis
            </Link>
          </Button>
        </div>
      )}
    </header>
  );
}

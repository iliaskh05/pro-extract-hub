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
  const isHome = pathname === "/";
  const overHero = isHome && !scrolled && !open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
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

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 z-50 w-full transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300",
          overHero
            ? "border-b border-transparent bg-transparent"
            : "border-b border-border bg-background/90 shadow-[0_1px_0_0_rgb(17_17_17/0.04)] backdrop-blur-xl",
        )}
      >

      <div
        className={cn(
          "shell flex items-center gap-4 transition-[height] duration-300 ease-out",
          scrolled ? "h-14 md:h-16" : "h-[4.25rem] md:h-20 lg:h-[5.25rem]",
        )}
      >
        <Link
          to="/"
          className="group inline-flex min-w-0 shrink items-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={`Accueil ${SITE.name}`}
        >
          <BrandMark
            inverted={overHero}
            className={cn(
              "transition-[height,max-width] duration-300 ease-out group-hover:opacity-90",
              scrolled
                ? "!h-8 !max-w-[7.5rem] md:!h-10 md:!max-w-[10rem]"
                : "!h-9 !max-w-[8.5rem] md:!h-12 md:!max-w-[12.5rem] lg:!h-[3.35rem] lg:!max-w-[14rem]",
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
              className={cn(
                "rounded-sm px-3 py-2 text-sm font-medium transition-colors",
                overHero
                  ? "text-white/70 hover:text-white"
                  : "text-muted-foreground hover:text-foreground",
              )}
              activeProps={{
                className: overHero ? "text-white" : "text-foreground",
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          {/* Devis dans le header dès tablette ; sur mobile → barre sticky seule */}
          <Button
            asChild
            size="sm"
            variant={overHero ? "inverse" : "default"}
            className="hidden h-10 rounded-sm px-4 text-sm md:inline-flex"
          >
            <Link to="/devis">Demander un devis</Link>
          </Button>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            className={cn(
              "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-sm border transition-colors lg:hidden",
              overHero
                ? "border-white/25 text-white hover:bg-white/10"
                : "border-border text-foreground hover:bg-secondary",
            )}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div
          className={cn(
            "panel-in fixed inset-x-0 bottom-0 z-50 overflow-y-auto border-t border-border bg-background px-5 py-6 lg:hidden",
            scrolled ? "top-14 md:top-16" : "top-[4.25rem] md:top-20",
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

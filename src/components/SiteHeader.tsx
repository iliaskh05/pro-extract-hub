import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/BrandMark";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/services", label: "Services" },
  { to: "/methode", label: "Notre méthode" },
  { to: "/zones", label: "Zones d'intervention" },
  { to: "/faq", label: "FAQ" },
];

const INK_PATHS = ["/", "/services", "/zones", "/methode", "/contact", "/devis", "/faq"];

function likelyInk(pathname: string) {
  return INK_PATHS.some((p) => pathname === p || (p !== "/" && pathname.startsWith(p)));
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [onInk, setOnInk] = useState(() => likelyInk(pathname));
  const inverted = onInk && !scrolled && !open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    const el = document.getElementById("hero-sentinel");
    if (!el) {
      setOnInk(false);
      return;
    }
    setOnInk(true);
    const io = new IntersectionObserver(([entry]) => setOnInk(!!entry?.isIntersecting), {
      threshold: 0,
    });
    io.observe(el);
    return () => io.disconnect();
  }, [pathname]);

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
        scrolled || open
          ? "border-b border-border/80 bg-background/75 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-4 sm:h-[4.25rem] sm:gap-3 sm:px-5 md:h-20 md:gap-4 lg:h-24 lg:px-8">
        <Link
          to="/"
          className="group relative z-10 inline-flex min-w-0 shrink items-center transition-opacity hover:opacity-90"
          aria-label="Accueil Salis 3 Hottes"
        >
          <BrandMark
            inverted={inverted}
            className="w-[7.25rem] sm:w-[8.5rem] md:w-[11rem] lg:w-[13rem] xl:w-[14rem]"
          />
        </Link>

        <nav
          className="ml-auto hidden items-center gap-1 md:flex"
          aria-label="Navigation principale"
        >
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "rounded-md px-2.5 py-2 text-sm font-medium transition-colors lg:px-3",
                inverted
                  ? "text-ink-muted hover:bg-ink-foreground/10 hover:text-ink-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
              activeProps={{
                className: inverted
                  ? "text-ink-foreground bg-ink-foreground/10"
                  : "text-foreground bg-secondary",
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          {/* Menu hamburger — entre logo et CTA sur mobile */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            className={cn(
              "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border md:hidden",
              inverted
                ? "border-ink-border bg-ink-foreground/10 text-ink-foreground"
                : "border-border bg-background/70 text-foreground",
            )}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>

          <Button
            asChild
            variant="ghost"
            size="sm"
            className={cn(
              "hidden lg:inline-flex",
              inverted
                ? "text-ink-foreground hover:bg-ink-foreground/10 hover:text-ink-foreground"
                : "",
            )}
          >
            <Link to="/contact">Parler à un expert</Link>
          </Button>

          <Button
            asChild
            size="sm"
            variant={inverted ? "inverse" : "default"}
            className="h-9 shrink-0 px-3 text-xs sm:h-10 sm:px-4 sm:text-sm"
          >
            <Link to="/devis">Obtenir mon devis</Link>
          </Button>
        </div>
      </div>

      {open && (
        <div className="panel-in fixed inset-x-0 top-16 bottom-0 z-50 overflow-y-auto border-t border-border bg-background px-5 py-6 sm:top-[4.25rem] md:hidden">
          <nav className="flex flex-col gap-1" aria-label="Navigation mobile">
            {[{ to: "/", label: "Accueil" }, ...NAV].map((item, i) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                style={{ animationDelay: `${60 + i * 45}ms` }}
                className="step-in rounded-lg px-4 py-4 text-lg font-semibold tracking-tight transition-colors hover:bg-secondary"
                activeProps={{ className: "text-accent" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-6 flex flex-col gap-3">
            <Button asChild size="lg" className="min-h-12">
              <Link to="/devis" onClick={() => setOpen(false)}>
                Obtenir mon devis
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="min-h-12">
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

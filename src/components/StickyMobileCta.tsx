import { Link, useRouterState } from "@tanstack/react-router";

export function StickyMobileCta() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname.startsWith("/admin") || pathname.startsWith("/devis")) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-xl lg:hidden">
      <Link
        to="/devis"
        className="flex h-13 min-h-12 w-full items-center justify-center rounded-lg bg-primary px-6 text-base font-semibold text-primary-foreground transition-transform active:scale-[0.98]"
      >
        Obtenir mon devis
      </Link>
    </div>
  );
}

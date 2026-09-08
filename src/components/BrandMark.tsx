import { cn } from "@/lib/utils";
import { SITE } from "@/lib/site";
import logoWhite from "@/assets/brand/logo-white.png";
import logoBlack from "@/assets/brand/logo-black.png";

/**
 * Logo Salis 3 Hottes — fond transparent.
 * - inverted : fond sombre → version blanche
 * - sinon : fond clair → version noire
 */
export function BrandMark({
  className,
  inverted = false,
  compact = false,
}: {
  className?: string;
  inverted?: boolean;
  compact?: boolean;
}) {
  const size = compact
    ? "h-10 w-auto max-w-[9.5rem] sm:h-11 sm:max-w-[10.5rem]"
    : "h-11 w-auto max-w-[11rem] sm:h-12 sm:max-w-[12.5rem] md:h-14 md:max-w-[14rem]";

  return (
    <span
      className={cn(
        "brand-mark relative inline-flex shrink-0 items-center justify-center",
        size,
        className,
      )}
    >
      <img
        src={logoWhite}
        alt={inverted ? SITE.name : ""}
        width={800}
        height={459}
        decoding="async"
        aria-hidden={!inverted}
        className={cn(
          "block h-full w-auto max-w-full object-contain object-left select-none transition-opacity duration-300",
          inverted ? "opacity-100" : "pointer-events-none absolute inset-0 opacity-0",
        )}
      />
      <img
        src={logoBlack}
        alt={inverted ? "" : SITE.name}
        width={800}
        height={459}
        decoding="async"
        aria-hidden={inverted}
        className={cn(
          "block h-full w-auto max-w-full object-contain object-left select-none transition-opacity duration-300",
          inverted ? "pointer-events-none absolute inset-0 opacity-0" : "opacity-100",
        )}
      />
    </span>
  );
}

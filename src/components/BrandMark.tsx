import { cn } from "@/lib/utils";
import { SITE } from "@/lib/site";
import logoWhite from "@/assets/brand/logo-white.png";
import logoBlack from "@/assets/brand/logo-black.png";

/**
 * Logo flottant sans fond.
 * - Fond sombre (hero / footer) → blanc
 * - Fond clair (header au scroll) → noir
 */
export function BrandMark({
  className,
  inverted = false,
  compact = false,
}: {
  className?: string;
  /** true = fond sombre → logo blanc ; false = fond clair → logo noir */
  inverted?: boolean;
  compact?: boolean;
}) {
  const size = compact
    ? "w-[8.5rem] sm:w-[9.5rem]"
    : "w-[10.5rem] sm:w-[12rem] md:w-[13rem] lg:w-[14rem]";

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
        width={830}
        height={496}
        decoding="async"
        aria-hidden={!inverted}
        className={cn(
          "block h-auto w-full object-contain object-left select-none transition-opacity duration-300",
          inverted ? "opacity-100" : "pointer-events-none absolute inset-0 opacity-0",
        )}
      />
      <img
        src={logoBlack}
        alt={inverted ? "" : SITE.name}
        width={830}
        height={496}
        decoding="async"
        aria-hidden={inverted}
        className={cn(
          "block h-auto w-full object-contain object-left select-none transition-opacity duration-300",
          inverted ? "pointer-events-none absolute inset-0 opacity-0" : "opacity-100",
        )}
      />
    </span>
  );
}

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import {
  GOOGLE_REVIEWS,
  googleReviewLink,
  type GoogleReview,
} from "@/lib/google-reviews";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

function GoogleG({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function Stars({
  value,
  className,
  size = "md",
}: {
  value: number;
  className?: string;
  size?: "sm" | "md";
}) {
  const full = Math.round(Math.min(5, Math.max(0, value)));
  return (
    <span
      className={cn("inline-flex items-center gap-0.5 text-[#f2a60c]", className)}
      aria-label={`${full} sur 5`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn(
            size === "sm" ? "size-3.5" : "size-4",
            i < full ? "fill-current" : "fill-transparent opacity-35",
          )}
          strokeWidth={1.75}
        />
      ))}
    </span>
  );
}

function ReviewCard({ review }: { review: GoogleReview }) {
  const initial = (review.initial ?? review.author.slice(0, 1)).toUpperCase();
  return (
    <article className="relative flex w-[min(100%,18.5rem)] shrink-0 flex-col rounded-sm border border-border bg-background p-5 shadow-[0_8px_28px_-22px_rgb(17_17_17/0.35)] sm:w-[20rem]">
      <GoogleG className="absolute top-4 right-4 size-4 opacity-90" />
      <div className="flex items-start gap-3 pr-6">
        <span
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent/10 font-display text-sm font-bold text-accent"
          aria-hidden="true"
        >
          {initial}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-accent">{review.author}</p>
          <p className="text-xs text-muted-foreground">{review.relativeTime}</p>
        </div>
      </div>
      <Stars value={review.rating} size="sm" className="mt-3" />
      <p className="mt-3 line-clamp-5 text-sm leading-relaxed text-foreground/90">
        {review.text}
      </p>
    </article>
  );
}

function openGoogleReview() {
  const url = googleReviewLink();
  if (!url) {
    toast.info("Lien Google à venir", {
      description:
        "Collez l’URL de votre fiche Google Business dans VITE_GOOGLE_REVIEW_URL.",
    });
    return;
  }
  track("Google Review Click", { from: "home-reviews" });
  window.open(url, "_blank", "noopener,noreferrer");
}

/** Section avis Google — résumé + carrousel, lien à brancher via .env. */
export function GoogleReviewsSection() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const { rating, reviewCount, reviews, businessName } = GOOGLE_REVIEWS;
  const hasStats = typeof rating === "number" && typeof reviewCount === "number";
  const hasReviews = reviews.length > 0;
  const pages = Math.max(1, Math.ceil(reviews.length / 2));

  function scrollBy(dir: -1 | 1) {
    const el = scrollerRef.current;
    if (!el) return;
    const delta = Math.min(el.clientWidth * 0.85, 340) * dir;
    el.scrollBy({ left: delta, behavior: "smooth" });
    setPage((p) => {
      const next = p + dir;
      if (next < 0) return 0;
      if (next > pages - 1) return pages - 1;
      return next;
    });
  }

  return (
    <section className="border-y border-border bg-secondary/35">
      <div className="shell section-y">
        <Reveal>
          <SectionHeading
            align="center"
            className="mx-auto"
            eyebrow="Preuve sociale"
            title="Avis Google"
            description={
              hasStats
                ? `Note ${rating}/5 sur ${reviewCount} avis Google My Business`
                : "Notez notre intervention sur Google — le lien de la fiche sera branché dès qu’il sera prêt."
            }
          />
        </Reveal>

        <Reveal delay={80} className="mt-12">
          <div className="grid items-stretch gap-8 lg:grid-cols-[minmax(0,17.5rem)_1fr] lg:gap-10">
            {/* Résumé fiche */}
            <aside className="flex flex-col items-center justify-center rounded-sm border border-border bg-background px-6 py-8 text-center shadow-[0_12px_40px_-28px_rgb(17_17_17/0.4)]">
              <div className="flex size-14 items-center justify-center overflow-hidden rounded-full border border-border bg-white p-1.5">
                <BrandMark compact className="!h-9 !max-w-[3.25rem]" />
              </div>
              <p className="font-display mt-4 text-base font-bold tracking-tight">
                {businessName}
              </p>

              {hasStats ? (
                <>
                  <div className="mt-3 flex items-center justify-center gap-2">
                    <span className="font-display text-2xl font-bold tabular-nums tracking-tight">
                      {rating!.toFixed(1)}
                    </span>
                    <Stars value={rating!} />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Basé sur {reviewCount} avis
                  </p>
                </>
              ) : (
                <>
                  <div className="mt-3 flex items-center justify-center gap-2 opacity-80">
                    <Stars value={5} />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Fiche Google à relier
                  </p>
                </>
              )}

              <p className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
                powered by <GoogleG className="size-3.5" />
                <span className="font-medium text-foreground/70">Google</span>
              </p>

              <Button
                type="button"
                variant="accent"
                className="mt-6 h-11 w-full max-w-[14rem] rounded-full px-5"
                onClick={openGoogleReview}
              >
                <span>évaluez-nous sur</span>
                <span className="flex size-6 items-center justify-center rounded-full bg-white">
                  <GoogleG className="size-3.5" />
                </span>
              </Button>
            </aside>

            {/* Carrousel */}
            <div className="relative min-w-0">
              {hasReviews ? (
                <>
                  <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-0 sm:-left-1">
                    <button
                      type="button"
                      aria-label="Avis précédent"
                      onClick={() => scrollBy(-1)}
                      className="pointer-events-auto flex size-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-sm transition-colors hover:text-foreground"
                    >
                      <ChevronLeft className="size-4" />
                    </button>
                  </div>
                  <div className="pointer-events-none absolute inset-y-0 right-0 z-10 flex items-center pr-0 sm:-right-1">
                    <button
                      type="button"
                      aria-label="Avis suivant"
                      onClick={() => scrollBy(1)}
                      className="pointer-events-auto flex size-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-sm transition-colors hover:text-foreground"
                    >
                      <ChevronRight className="size-4" />
                    </button>
                  </div>

                  <div
                    ref={scrollerRef}
                    className="flex gap-4 overflow-x-auto px-10 pb-2 scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                  >
                    {reviews.map((r) => (
                      <ReviewCard key={r.id} review={r} />
                    ))}
                  </div>

                  <div className="mt-5 flex justify-center gap-1.5">
                    {Array.from({ length: pages }, (_, i) => (
                      <button
                        key={i}
                        type="button"
                        aria-label={`Page ${i + 1}`}
                        onClick={() => {
                          const el = scrollerRef.current;
                          if (!el) return;
                          el.scrollTo({
                            left: i * Math.min(el.clientWidth * 0.85, 340),
                            behavior: "smooth",
                          });
                          setPage(i);
                        }}
                        className={cn(
                          "size-2 rounded-full transition-colors",
                          page === i ? "bg-[#f2a60c]" : "bg-border",
                        )}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex h-full min-h-[14rem] flex-col items-center justify-center rounded-sm border border-dashed border-border bg-background/80 px-6 py-10 text-center">
                  <GoogleG className="size-8" />
                  <p className="font-display mt-4 text-lg font-bold tracking-tight">
                    Les avis s’afficheront ici
                  </p>
                  <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                    Dès que la fiche Google est reliée, collez le lien dans{" "}
                    <code className="text-xs">VITE_GOOGLE_REVIEW_URL</code> et
                    les avis réels dans{" "}
                    <code className="text-xs">src/lib/google-reviews.ts</code>.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-6 rounded-full"
                    onClick={openGoogleReview}
                  >
                    Nous noter sur Google
                    <GoogleG className="size-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

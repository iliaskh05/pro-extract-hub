import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Check, ChevronLeft, ChevronRight, Loader2, Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  BUSINESS_TYPES,
  CONTACT_METHODS,
  activeZones,
  whatsappLink,
  whatsappUnavailableMessage,
  zonesLine,
} from "@/lib/site";
import {
  ALLOWED_PHOTO_TYPES,
  LEAD_PHOTOS_BUCKET,
  MAX_PHOTO_BYTES,
  PHOTO_SLOTS,
  quoteSchema,
} from "@/lib/quote-schema";
import { attachLeadPhotos, submitQuote } from "@/lib/quote.functions";
import { track } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const STEPS = ["Établissement", "Installation", "Localisation", "Photos", "Coordonnées"] as const;

type FormState = {
  business_type: string;
  hood_length: string;
  filter_count: string;
  duct_present: boolean;
  motor_present: boolean;
  last_cleaning: string;
  requested_frequency: string;
  city: string;
  postal_code: string;
  contact_name: string;
  company_name: string;
  phone: string;
  email: string;
  message: string;
  preferred_contact: string;
  consent: boolean;
  website: string;
};

const EMPTY: FormState = {
  business_type: "",
  hood_length: "",
  filter_count: "",
  duct_present: false,
  motor_present: false,
  last_cleaning: "",
  requested_frequency: "",
  city: "",
  postal_code: "",
  contact_name: "",
  company_name: "",
  phone: "",
  email: "",
  message: "",
  preferred_contact: "email",
  consent: false,
  website: "",
};

function readUtms() {
  if (typeof window === "undefined") return { source: "", medium: "", campaign: "" };
  const q = new URLSearchParams(window.location.search);
  return {
    source: q.get("utm_source") ?? "",
    medium: q.get("utm_medium") ?? "",
    campaign: q.get("utm_campaign") ?? "",
  };
}

function validateFile(file: File) {
  if (!(ALLOWED_PHOTO_TYPES as readonly string[]).includes(file.type)) {
    return "Formats acceptés : JPG, PNG, WebP.";
  }
  if (file.size > MAX_PHOTO_BYTES) return "Chaque photo doit rester sous 5 Mo.";
  return null;
}

export function QuoteForm() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [files, setFiles] = useState<Partial<Record<string, File>>>({});
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState<string>("");
  const [utms] = useState(readUtms);
  const submitRemote = useServerFn(submitQuote);
  const attachRemote = useServerFn(attachLeadPhotos);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  useEffect(() => {
    track("Quote Start");
  }, []);

  useEffect(() => {
    track("Quote Step", { step: step + 1 });
  }, [step]);

  const parsed = quoteSchema.safeParse({
    ...form,
    business_type: form.business_type || undefined,
    consent: form.consent ? true : undefined,
    uploads: [],
  });

  const canContinue =
    (step === 0 && !!form.business_type) ||
    step === 1 ||
    (step === 2 && form.city.trim().length > 1) ||
    step === 3 ||
    (step === 4 && parsed.success);

  async function uploadSigned(
    uploads: Array<{ slot: string; path: string; token: string }>,
    leadId: string,
  ) {
    const stored: Array<{ slot: string; path: string; mime?: string; size?: number }> = [];
    for (const item of uploads) {
      const file = files[item.slot];
      if (!file) continue;
      const { error: upErr } = await supabase.storage
        .from(LEAD_PHOTOS_BUCKET)
        .uploadToSignedUrl(item.path, item.token, file);
      if (upErr) {
        setUploadError(`La photo « ${item.slot} » n'a pas pu être envoyée.`);
        continue;
      }
      stored.push({ slot: item.slot, path: item.path, mime: file.type, size: file.size });
    }
    if (stored.length) {
      await attachRemote({ data: { leadId, photos: stored } });
    }
  }

  async function submit() {
    const check = quoteSchema.safeParse({
      ...form,
      consent: form.consent ? true : undefined,
      source: "website_form",
      utm_source: utms.source,
      utm_medium: utms.medium,
      utm_campaign: utms.campaign,
      uploads: Object.entries(files).map(([slot, file]) => ({
        slot,
        name: file!.name,
        type: file!.type,
        size: file!.size,
      })),
    });
    if (!check.success) {
      setError(check.error.issues[0]?.message ?? "Vérifiez les champs du formulaire.");
      return;
    }

    setSubmitting(true);
    setError(null);
    setUploadError(null);

    try {
      const result = await submitRemote({ data: check.data });
      setReference(result.reference);
      if (result.id && result.uploads.length) {
        await uploadSigned(result.uploads, result.id);
      }
      track("Quote Submit", { city: form.city });
      setDone(true);
    } catch {
      const fallback = await supabase.from("leads").insert({
        company_name: form.company_name || null,
        contact_name: form.contact_name,
        phone: form.phone,
        email: form.email,
        business_type: form.business_type,
        city: form.city,
        postal_code: form.postal_code || null,
        hood_length: form.hood_length || null,
        filter_count: form.filter_count ? Number(form.filter_count) : null,
        duct_present: form.duct_present,
        motor_present: form.motor_present,
        last_cleaning: form.last_cleaning || null,
        requested_frequency: form.requested_frequency || null,
        photos: Object.keys(files),
        message: form.message || null,
        source: "website_form",
      });
      if (fallback.error) {
        setError("L'enregistrement a échoué. Merci de réessayer dans un instant.");
        toast.error("Envoi impossible", {
          description: "Le service est temporairement indisponible.",
        });
        setSubmitting(false);
        return;
      }
      setReference("ENREGISTREE");
      track("Quote Submit", { city: form.city, mode: "fallback" });
      setDone(true);
    }
    setSubmitting(false);
  }

  if (done) {
    const wa = whatsappLink(
      `Bonjour, je viens d'envoyer une demande de devis${reference ? ` (réf. #${reference})` : ""} depuis votre site.`,
    );
    return (
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
        <div className="surface-ink relative overflow-hidden px-8 py-12 text-center md:px-12 md:py-16">
          <div
            className="pointer-events-none absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-accent/15 blur-3xl"
            aria-hidden="true"
          />
          <div className="relative">
            <span className="step-in mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-accent/30 bg-accent/15 text-accent">
              <Check className="size-7" />
            </span>
            <p className="step-in eyebrow mt-6 text-accent">Demande enregistrée</p>
            <h2 className="step-in mt-4 text-3xl font-semibold tracking-[-0.04em] text-ink-foreground md:text-4xl">
              Votre demande est entre de bonnes mains.
            </h2>
            <p className="step-in mx-auto mt-4 max-w-md text-sm leading-relaxed text-ink-muted">
              Votre demande a bien été enregistrée. Nous disposons maintenant des informations
              nécessaires pour analyser votre installation.
            </p>
            {reference && reference !== "XXXXXX" && (
              <p className="step-in mt-7 inline-flex items-center gap-2 rounded-full border border-ink-border bg-ink-foreground/5 px-5 py-2.5 text-xs text-ink-muted">
                Référence :
                <span className="font-mono text-sm tracking-[0.2em] text-ink-foreground">
                  #{reference}
                </span>
              </p>
            )}
            {uploadError && <p className="mt-4 text-xs text-ink-muted">{uploadError}</p>}
          </div>
        </div>
        <div className="flex flex-col items-center gap-3 px-8 py-8 md:px-12">
          <div className="flex w-full flex-col justify-center gap-3 sm:flex-row">
            <Button
              onClick={() => {
                if (wa) {
                  track("WhatsApp Click", { from: "quote-success" });
                  window.open(wa, "_blank", "noopener");
                } else toast.info(whatsappUnavailableMessage().title, whatsappUnavailableMessage());
              }}
            >
              Continuer sur WhatsApp
            </Button>
            <Button asChild variant="outline">
              <Link to="/">Retour à l'accueil</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
      <div className="h-1 bg-secondary">
        <div
          className="h-full bg-accent transition-[width] duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="border-b border-border px-6 pt-6 pb-5 md:px-8">
        <p className="eyebrow text-accent">
          {String(step + 1).padStart(2, "0")} {STEPS[step]}
        </p>
        <div className="mt-4 flex items-center justify-between gap-2">
          {STEPS.map((label, i) => (
            <div key={label} className="flex flex-1 items-center gap-2">
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                  i < step
                    ? "bg-accent text-accent-foreground"
                    : i === step
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground",
                )}
              >
                {i < step ? <Check className="size-3.5" /> : i + 1}
              </span>
              <span
                className={cn(
                  "hidden text-[11px] font-medium tracking-wide uppercase md:block",
                  i === step ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {label}
              </span>
              {i < STEPS.length - 1 && (
                <span className={cn("h-px flex-1", i < step ? "bg-accent" : "bg-border")} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div key={step} className="animate-in fade-in slide-in-from-right-4 p-6 duration-300 md:p-8">
        {step === 0 && (
          <fieldset>
            <legend className="text-xl font-bold tracking-tight md:text-2xl">
              Votre établissement
            </legend>
            <p className="mt-2 text-sm text-muted-foreground">
              Sélectionnez le type d'établissement à entretenir.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {BUSINESS_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => set("business_type", type)}
                  className={cn(
                    "min-h-16 rounded-xl border px-3 py-4 text-sm font-medium transition-all",
                    form.business_type === type
                      ? "border-accent bg-accent/10 text-foreground shadow-card"
                      : "border-border hover:border-accent/60 hover:bg-secondary",
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
          </fieldset>
        )}

        {step === 1 && (
          <fieldset className="space-y-5">
            <legend className="text-xl font-bold tracking-tight md:text-2xl">
              Votre installation
            </legend>
            <p className="text-sm text-muted-foreground">
              Des estimations suffisent — nous affinons lors de la qualification.
            </p>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="hood_length">Longueur approximative de la hotte</Label>
                <Input
                  id="hood_length"
                  className="mt-2"
                  placeholder="ex. 3 mètres"
                  value={form.hood_length}
                  onChange={(e) => set("hood_length", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="filter_count">Nombre de filtres</Label>
                <Input
                  id="filter_count"
                  className="mt-2"
                  type="number"
                  min={0}
                  placeholder="ex. 6"
                  value={form.filter_count}
                  onChange={(e) => set("filter_count", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="last_cleaning">Dernière intervention</Label>
                <select
                  id="last_cleaning"
                  className="mt-2 h-11 w-full rounded-lg border border-input bg-background px-3.5 text-sm"
                  value={form.last_cleaning}
                  onChange={(e) => set("last_cleaning", e.target.value)}
                >
                  <option value="">Non précisé</option>
                  <option>Moins de 6 mois</option>
                  <option>6 à 12 mois</option>
                  <option>Plus de 12 mois</option>
                  <option>Jamais / inconnue</option>
                </select>
              </div>
              <div>
                <Label htmlFor="requested_frequency">Fréquence souhaitée</Label>
                <select
                  id="requested_frequency"
                  className="mt-2 h-11 w-full rounded-lg border border-input bg-background px-3.5 text-sm"
                  value={form.requested_frequency}
                  onChange={(e) => set("requested_frequency", e.target.value)}
                >
                  <option value="">Non précisé</option>
                  <option>Intervention ponctuelle</option>
                  <option>Semestrielle</option>
                  <option>Annuelle</option>
                  <option>À définir avec vous</option>
                </select>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {(
                [
                  ["duct_present", "Présence d'un conduit d'extraction"],
                  ["motor_present", "Présence d'un moteur / caisson"],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  aria-pressed={form[key]}
                  onClick={() => set(key, !form[key])}
                  className={cn(
                    "flex min-h-14 items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all",
                    form[key] ? "border-accent bg-accent/10" : "border-border hover:bg-secondary",
                  )}
                >
                  {label}
                  <span
                    className={cn(
                      "ml-3 flex h-5 w-5 items-center justify-center rounded-full border",
                      form[key]
                        ? "border-accent bg-accent text-accent-foreground"
                        : "border-border",
                    )}
                  >
                    {form[key] && <Check className="size-3" />}
                  </span>
                </button>
              ))}
            </div>
          </fieldset>
        )}

        {step === 2 && (
          <fieldset className="space-y-5">
            <legend className="text-xl font-bold tracking-tight md:text-2xl">Localisation</legend>
            <p className="text-sm text-muted-foreground">
              Nous intervenons sur {zonesLine(" et ")}. En limite de secteur, la faisabilité est
              confirmée avant proposition.
            </p>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="city">Ville *</Label>
                <Input
                  id="city"
                  className="mt-2"
                  required
                  list="zone-cities"
                  autoComplete="address-level2"
                  value={form.city}
                  onChange={(e) => set("city", e.target.value)}
                  placeholder={`ex. ${activeZones()[0]?.name ?? ""}`}
                />
                <datalist id="zone-cities">
                  {activeZones().map((zone) => (
                    <option key={zone.slug} value={zone.name} />
                  ))}
                </datalist>
              </div>
              <div>
                <Label htmlFor="postal_code">Code postal</Label>
                <Input
                  id="postal_code"
                  className="mt-2"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  value={form.postal_code}
                  onChange={(e) => set("postal_code", e.target.value)}
                  placeholder="ex. 10000"
                />
              </div>
            </div>
          </fieldset>
        )}

        {step === 3 && (
          <fieldset className="space-y-5">
            <legend className="text-xl font-bold tracking-tight md:text-2xl">Photos</legend>
            <p className="text-sm text-muted-foreground">
              Optionnel. JPG, PNG ou WebP, 5 Mo maximum par fichier. Les photos accélèrent la
              qualification.
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {PHOTO_SLOTS.map((slot) => {
                const current = files[slot.key];
                return (
                  <div key={slot.key} className="relative">
                    <label
                      className={cn(
                        "flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-3 py-4 text-sm font-medium transition-all",
                        current
                          ? "border-accent bg-accent/10"
                          : "border-border hover:border-accent/60 hover:bg-secondary",
                      )}
                    >
                      {current ? (
                        <Check className="size-5 text-accent" />
                      ) : (
                        <Upload className="size-5 text-muted-foreground" />
                      )}
                      {slot.label}
                      <span className="text-center text-[10px] text-muted-foreground">
                        {current ? current.name : "Ajouter"}
                      </span>
                      <input
                        type="file"
                        accept={ALLOWED_PHOTO_TYPES.join(",")}
                        className="sr-only"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const problem = validateFile(file);
                          if (problem) {
                            toast.error(problem);
                            return;
                          }
                          setFiles((prev) => ({ ...prev, [slot.key]: file }));
                        }}
                      />
                    </label>
                    {current && (
                      <button
                        type="button"
                        aria-label={`Retirer ${slot.label}`}
                        className="absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full bg-ink text-ink-foreground"
                        onClick={() =>
                          setFiles((prev) => {
                            const next = { ...prev };
                            delete next[slot.key];
                            return next;
                          })
                        }
                      >
                        <X className="size-3" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </fieldset>
        )}

        {step === 4 && (
          <fieldset className="space-y-5">
            <legend className="text-xl font-bold tracking-tight md:text-2xl">
              Vos coordonnées
            </legend>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="contact_name">Nom *</Label>
                <Input
                  id="contact_name"
                  className="mt-2"
                  required
                  autoComplete="name"
                  value={form.contact_name}
                  onChange={(e) => set("contact_name", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="company_name">Entreprise</Label>
                <Input
                  id="company_name"
                  className="mt-2"
                  autoComplete="organization"
                  value={form.company_name}
                  onChange={(e) => set("company_name", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="phone">Téléphone *</Label>
                <Input
                  id="phone"
                  className="mt-2"
                  required
                  type="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  className="mt-2"
                  required
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium">Préférence de contact</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {CONTACT_METHODS.map((m) => (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => set("preferred_contact", m.value)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-medium",
                      form.preferred_contact === m.value
                        ? "border-accent bg-accent/10"
                        : "border-border hover:bg-secondary",
                    )}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="message">Précisions (optionnel)</Label>
              <Textarea
                id="message"
                className="mt-2"
                rows={3}
                value={form.message}
                onChange={(e) => set("message", e.target.value)}
                placeholder="Contraintes d'accès, horaires souhaités…"
              />
            </div>
            <label className="flex items-start gap-3 text-sm leading-relaxed">
              <input
                type="checkbox"
                className="mt-1"
                checked={form.consent}
                onChange={(e) => set("consent", e.target.checked)}
              />
              <span>
                J'accepte que ces informations soient utilisées pour qualifier ma demande et me
                recontacter.{" "}
                <Link to="/confidentialite" className="underline-offset-4 hover:underline">
                  Confidentialité
                </Link>
                .
              </span>
            </label>
            <div className="hidden" aria-hidden="true">
              <Label htmlFor="company_website">Site web</Label>
              <input
                id="company_website"
                tabIndex={-1}
                autoComplete="off"
                value={form.website}
                onChange={(e) => set("website", e.target.value)}
              />
            </div>
            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}
          </fieldset>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-border px-6 py-5 md:px-8">
        <Button
          type="button"
          variant="ghost"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0 || submitting}
        >
          <ChevronLeft className="size-4" /> Retour
        </Button>
        <span className="hidden text-xs text-muted-foreground sm:block">
          Étape {step + 1} / {STEPS.length}
        </span>
        {step < STEPS.length - 1 ? (
          <Button type="button" disabled={!canContinue} onClick={() => setStep((s) => s + 1)}>
            Continuer <ChevronRight className="size-4" />
          </Button>
        ) : (
          <Button type="button" disabled={!canContinue || submitting} onClick={() => void submit()}>
            {submitting && <Loader2 className="size-4 animate-spin" />}
            {submitting ? "Envoi en cours…" : "Envoyer ma demande"}
          </Button>
        )}
      </div>
    </div>
  );
}

import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Check, ChevronLeft, ChevronRight, Loader2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { BUSINESS_TYPES, whatsappLink } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const STEPS = ["Établissement", "Installation", "Localisation", "Photos", "Coordonnées"] as const;

const PHOTO_SLOTS = [
  { key: "hotte", label: "Photo hotte" },
  { key: "filtres", label: "Photo filtres" },
  { key: "conduit", label: "Photo conduit" },
  { key: "moteur", label: "Photo moteur" },
] as const;

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
  photos: string[];
  contact_name: string;
  company_name: string;
  phone: string;
  email: string;
  message: string;
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
  photos: [],
  contact_name: "",
  company_name: "",
  phone: "",
  email: "",
  message: "",
};

export function QuoteForm() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const canContinue =
    (step === 0 && !!form.business_type) ||
    step === 1 ||
    (step === 2 && form.city.trim().length > 1) ||
    step === 3 ||
    (step === 4 &&
      form.contact_name.trim().length > 1 &&
      form.phone.trim().length > 5 &&
      /\S+@\S+\.\S+/.test(form.email));

  async function submit() {
    setSubmitting(true);
    setError(null);
    const { error: insertError } = await supabase.from("leads").insert({
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
      photos: form.photos,
      message: form.message || null,
      source: "website_form",
    });
    setSubmitting(false);
    if (insertError) {
      setError("L'enregistrement a échoué. Merci de réessayer dans un instant.");
      toast.error("Envoi impossible", { description: insertError.message });
      return;
    }
    setDone(true);
  }

  if (done) {
    const wa = whatsappLink("Bonjour, je viens d'envoyer une demande de devis depuis votre site.");
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-card md:p-12">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent/15 text-accent">
          <Check className="size-7" />
        </span>
        <h2 className="mt-6 text-2xl font-bold tracking-tight md:text-3xl">
          Votre demande a bien été prise en compte.
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
          Notre équipe qualifie votre installation et revient vers vous avec une proposition
          adaptée. Cette demande apparaît immédiatement dans l'espace CRM du prototype.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button
            onClick={() =>
              toast.success("Confirmation simulée", {
                description:
                  "Prototype : l'email transactionnel sera branché lors de la mise en production.",
              })
            }
          >
            Recevoir la confirmation par email
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              if (wa) window.open(wa, "_blank", "noopener");
              else
                toast.info("Prototype — WhatsApp non connecté", {
                  description: "Le numéro WhatsApp Business sera renseigné avant la mise en ligne.",
                });
            }}
          >
            Continuer sur WhatsApp
          </Button>
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
          <Link to="/admin" className="text-accent underline-offset-4 hover:underline">
            Voir la demande dans le CRM (démo)
          </Link>
          <button
            type="button"
            className="text-muted-foreground underline-offset-4 hover:underline"
            onClick={() => {
              setForm(EMPTY);
              setStep(0);
              setDone(false);
            }}
          >
            Nouvelle demande
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
      <div className="border-b border-border px-6 pt-6 pb-5 md:px-8">
        <div className="flex items-center justify-between gap-2">
          {STEPS.map((label, i) => (
            <div key={label} className="flex flex-1 items-center gap-2">
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors",
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
                  "hidden text-xs font-medium md:block",
                  i === step ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {label}
              </span>
              {i < STEPS.length - 1 && (
                <span
                  className={cn(
                    "h-px flex-1 transition-colors",
                    i < step ? "bg-accent" : "bg-border",
                  )}
                />
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
                  className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
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
                  className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
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
                      form[key] ? "border-accent bg-accent text-accent-foreground" : "border-border",
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
              Nous intervenons sur Paris / Île-de-France et Perpignan / Pyrénées-Orientales.
            </p>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="city">Ville *</Label>
                <Input
                  id="city"
                  className="mt-2"
                  required
                  value={form.city}
                  onChange={(e) => set("city", e.target.value)}
                  placeholder="ex. Paris"
                />
              </div>
              <div>
                <Label htmlFor="postal_code">Code postal</Label>
                <Input
                  id="postal_code"
                  className="mt-2"
                  inputMode="numeric"
                  value={form.postal_code}
                  onChange={(e) => set("postal_code", e.target.value)}
                  placeholder="ex. 75011"
                />
              </div>
            </div>
          </fieldset>
        )}

        {step === 3 && (
          <fieldset className="space-y-5">
            <legend className="text-xl font-bold tracking-tight md:text-2xl">Photos</legend>
            <p className="text-sm text-muted-foreground">
              Optionnel. Prototype : l'upload est simulé, aucun fichier n'est transféré.
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {PHOTO_SLOTS.map((slot) => {
                const active = form.photos.includes(slot.key);
                return (
                  <button
                    key={slot.key}
                    type="button"
                    onClick={() =>
                      set(
                        "photos",
                        active
                          ? form.photos.filter((p) => p !== slot.key)
                          : [...form.photos, slot.key],
                      )
                    }
                    className={cn(
                      "flex min-h-28 flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-3 py-4 text-sm font-medium transition-all",
                      active
                        ? "border-accent bg-accent/10"
                        : "border-border hover:border-accent/60 hover:bg-secondary",
                    )}
                  >
                    {active ? (
                      <Check className="size-5 text-accent" />
                    ) : (
                      <Upload className="size-5 text-muted-foreground" />
                    )}
                    {slot.label}
                    <span className="text-[10px] text-muted-foreground">
                      {active ? "Ajoutée (simulée)" : "Ajouter"}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>
        )}

        {step === 4 && (
          <fieldset className="space-y-5">
            <legend className="text-xl font-bold tracking-tight md:text-2xl">Vos coordonnées</legend>
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
            {error && <p className="text-sm text-destructive">{error}</p>}
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
        <span className="text-xs text-muted-foreground">
          Étape {step + 1} / {STEPS.length}
        </span>
        {step < STEPS.length - 1 ? (
          <Button type="button" disabled={!canContinue} onClick={() => setStep((s) => s + 1)}>
            Continuer <ChevronRight className="size-4" />
          </Button>
        ) : (
          <Button type="button" disabled={!canContinue || submitting} onClick={() => void submit()}>
            {submitting && <Loader2 className="size-4 animate-spin" />}
            Envoyer ma demande
          </Button>
        )}
      </div>
    </div>
  );
}

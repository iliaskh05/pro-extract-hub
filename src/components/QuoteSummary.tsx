import { Check, Pencil } from "lucide-react";
import { PHOTO_SLOTS } from "@/lib/quote-schema";
import {
  ACCESSIBILITY_OPTIONS,
  labelFor,
  MAINTENANCE_FREQUENCIES,
  NEED_TYPES,
  REQUEST_TYPES,
  SOIL_LEVELS,
  URGENCY_LEVELS,
} from "@/lib/quote-options";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type QuoteSummaryData = {
  company_name: string;
  contact_name: string;
  phone: string;
  email: string;
  business_type: string;
  city: string;
  postal_code: string;
  need_type: string;
  installation_type: string;
  hood_type: string;
  hood_length: string;
  duct_length: string;
  filter_count: string;
  duct_present: boolean;
  motor_present: boolean;
  soil_level: string;
  accessibility: string;
  night_intervention: boolean;
  schedule_preference: string;
  request_type: string;
  maintenance_frequency: string;
  urgency_level: string;
  last_cleaning: string;
  message: string;
  preferred_contact: string;
};

type Props = {
  data: QuoteSummaryData;
  photoCount: number;
  onEdit: (step: number) => void;
  onSubmit: () => void;
  submitting: boolean;
  error?: string | null;
};

function Row({ label, value }: { label: string; value: string }) {
  if (!value || value === "—") return null;
  return (
    <div className="flex flex-col gap-0.5 border-b border-border/60 py-3 last:border-0 sm:flex-row sm:justify-between sm:gap-4">
      <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className="text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}

export function QuoteSummary({ data, photoCount, onEdit, onSubmit, submitting, error }: Props) {
  const urgency =
    data.need_type === "intervention_urgente"
      ? labelFor(URGENCY_LEVELS, data.urgency_level)
      : "Normale";

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold tracking-tight md:text-2xl">
          Récapitulatif de votre demande
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Vérifiez les informations avant envoi. Vous pourrez être recontacté pour affiner le
          besoin.
        </p>
      </div>

      <section className="rounded-xl border border-border bg-secondary/30 p-5">
        <div className="flex items-center justify-between gap-3">
          <h4 className="text-sm font-semibold">Établissement</h4>
          <Button type="button" variant="ghost" size="sm" onClick={() => onEdit(0)}>
            <Pencil className="size-3.5" /> Modifier
          </Button>
        </div>
        <dl className="mt-2">
          <Row label="Type" value={data.business_type} />
          <Row
            label="Ville"
            value={`${data.city}${data.postal_code ? ` (${data.postal_code})` : ""}`}
          />
          <Row label="Besoin" value={labelFor(NEED_TYPES, data.need_type)} />
        </dl>
      </section>

      <section className="rounded-xl border border-border bg-secondary/30 p-5">
        <div className="flex items-center justify-between gap-3">
          <h4 className="text-sm font-semibold">Installation</h4>
          <Button type="button" variant="ghost" size="sm" onClick={() => onEdit(1)}>
            <Pencil className="size-3.5" /> Modifier
          </Button>
        </div>
        <dl className="mt-2">
          <Row label="Type d'installation" value={data.installation_type} />
          <Row label="Type de hotte" value={data.hood_type} />
          <Row label="Longueur hotte" value={data.hood_length || "—"} />
          <Row label="Longueur conduits" value={data.duct_length} />
          <Row label="Filtres" value={data.filter_count ? `${data.filter_count} filtre(s)` : "—"} />
          <Row label="Conduit" value={data.duct_present ? "Oui" : "Non"} />
          <Row label="Moteur / caisson" value={data.motor_present ? "Oui" : "Non"} />
        </dl>
      </section>

      <section className="rounded-xl border border-border bg-secondary/30 p-5">
        <div className="flex items-center justify-between gap-3">
          <h4 className="text-sm font-semibold">Besoin</h4>
          <Button type="button" variant="ghost" size="sm" onClick={() => onEdit(2)}>
            <Pencil className="size-3.5" /> Modifier
          </Button>
        </div>
        <dl className="mt-2">
          <Row label="Type de demande" value={labelFor(REQUEST_TYPES, data.request_type)} />
          <Row
            label="Fréquence"
            value={labelFor(MAINTENANCE_FREQUENCIES, data.maintenance_frequency)}
          />
          <Row label="Encrassement" value={labelFor(SOIL_LEVELS, data.soil_level)} />
          <Row label="Accessibilité" value={labelFor(ACCESSIBILITY_OPTIONS, data.accessibility)} />
          <Row label="Horaire souhaité" value={data.schedule_preference || "—"} />
          <Row label="Intervention de nuit / tôt" value={data.night_intervention ? "Oui" : "Non"} />
          <Row label="Dernière intervention" value={data.last_cleaning || "—"} />
          <Row label="Urgence" value={urgency} />
        </dl>
      </section>

      <section className="rounded-xl border border-border bg-secondary/30 p-5">
        <div className="flex items-center justify-between gap-3">
          <h4 className="text-sm font-semibold">Photos</h4>
          <Button type="button" variant="ghost" size="sm" onClick={() => onEdit(3)}>
            <Pencil className="size-3.5" /> Modifier
          </Button>
        </div>
        <p className="mt-2 text-sm">
          {photoCount > 0
            ? `${photoCount} photo(s) sur ${PHOTO_SLOTS.length} emplacements`
            : "Aucune photo jointe"}
        </p>
      </section>

      <section className="rounded-xl border border-border bg-secondary/30 p-5">
        <div className="flex items-center justify-between gap-3">
          <h4 className="text-sm font-semibold">Coordonnées</h4>
          <Button type="button" variant="ghost" size="sm" onClick={() => onEdit(4)}>
            <Pencil className="size-3.5" /> Modifier
          </Button>
        </div>
        <dl className="mt-2">
          <Row label="Entreprise" value={data.company_name || "—"} />
          <Row label="Contact" value={data.contact_name} />
          <Row label="Téléphone" value={data.phone} />
          <Row label="Email" value={data.email} />
          {data.message && <Row label="Précisions" value={data.message} />}
        </dl>
      </section>

      {data.need_type === "intervention_urgente" && (
        <p className="rounded-lg border border-accent/30 bg-accent/5 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
          Votre demande est signalée comme urgente. Nous la traiterons en priorité selon nos
          disponibilités, sans engagement de délai d'intervention précis à ce stade.
        </p>
      )}

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={() => onEdit(4)}>
          Modifier
        </Button>
        <Button
          type="button"
          disabled={submitting}
          onClick={onSubmit}
          className={cn("min-w-[12rem]", submitting && "opacity-80")}
        >
          {submitting ? (
            "Envoi en cours…"
          ) : (
            <>
              <Check className="size-4" /> Envoyer ma demande
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

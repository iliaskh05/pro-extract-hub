import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { LEAD_PHOTOS_BUCKET } from "@/lib/quote-schema";
import {
  labelFor,
  MAINTENANCE_FREQUENCIES,
  REQUEST_TYPES,
  URGENCY_LEVELS,
} from "@/lib/quote-options";
import { LEAD_STATUSES, PRIORITY_LABELS, type LeadStatus } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { priorityLabel, type Lead } from "./lead-helpers";

export function LeadDialog({
  lead,
  onOpenChange,
  onPatch,
  onUpdateStatus,
  onUpdatePriority,
}: {
  lead: Lead | null;
  onOpenChange: (open: boolean) => void;
  onPatch: (patch: Partial<Lead>) => void;
  onUpdateStatus: (lead: Lead, status: LeadStatus) => void;
  onUpdatePriority: (lead: Lead, priority: string) => void;
}) {
  return (
    <Dialog open={!!lead} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        {lead && (
          <>
            <DialogTitle className="flex flex-wrap items-center gap-2">
              {lead.company_name || lead.contact_name || "Lead"}
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                  lead.priority === "critical"
                    ? "bg-destructive/15 text-destructive"
                    : "bg-secondary",
                )}
              >
                {priorityLabel(lead.priority)}
              </span>
            </DialogTitle>
            <DialogDescription>
              Reçu le {new Date(lead.created_at).toLocaleString("fr-FR")} · réf.{" "}
              {lead.reference ? `#${lead.reference}` : "—"}
            </DialogDescription>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Contact" value={lead.contact_name} />
              <Field label="Téléphone" value={lead.phone} />
              <Field label="Email" value={lead.email} />
              <Field label="Établissement" value={lead.business_type} />
              <Field label="Ville" value={lead.city} />
              <Field label="Code postal" value={lead.postal_code} />
              <Field label="Type d'installation" value={lead.installation_type} />
              <Field label="Type de hotte" value={lead.hood_type} />
              <Field label="Longueur de hotte" value={lead.hood_length} />
              <Field label="Longueur conduits" value={lead.duct_length} />
              <Field label="Nombre de filtres" value={lead.filter_count?.toString()} />
              <Field label="Encrassement" value={lead.soil_level} />
              <Field label="Accessibilité" value={lead.accessibility} />
              <Field
                label="Type de demande"
                value={lead.request_type ? labelFor(REQUEST_TYPES, lead.request_type) : null}
              />
              <Field
                label="Fréquence"
                value={
                  lead.maintenance_frequency
                    ? labelFor(MAINTENANCE_FREQUENCIES, lead.maintenance_frequency)
                    : null
                }
              />
              <Field
                label="Urgence"
                value={lead.urgency_level ? labelFor(URGENCY_LEVELS, lead.urgency_level) : null}
              />
              <Field label="Planning souhaité" value={lead.schedule_preference} />
              <Field label="Nuit / tôt le matin" value={lead.night_intervention ? "Oui" : "Non"} />
              <Field label="Dernière intervention" value={lead.last_cleaning} />
              <Field label="Contact préféré" value={lead.preferred_contact} />
              <Field label="Page d'origine" value={lead.landing_page} />
              <Field label="Service source" value={lead.service_source} />
              <Field label="Zone source" value={lead.zone_source} />
              <Field
                label="Attribution UTM"
                value={[lead.utm_source, lead.utm_medium, lead.utm_campaign]
                  .filter(Boolean)
                  .join(" / ")}
              />
              <Field
                label="Dernière intervention (date)"
                value={
                  lead.last_intervention_at
                    ? new Date(lead.last_intervention_at).toLocaleDateString("fr-FR")
                    : null
                }
              />
              <Field
                label="Prochaine échéance"
                value={
                  lead.next_due_at ? new Date(lead.next_due_at).toLocaleDateString("fr-FR") : null
                }
              />
            </div>

            <LeadMaintenanceFields lead={lead} onSaved={onPatch} />

            <div>
              <p className="text-xs font-semibold text-muted-foreground">Photos transmises</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <LeadPhotos photos={lead.photos} />
              </div>
            </div>

            {lead.message && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground">Besoin exprimé</p>
                <p className="mt-1 text-sm">{lead.message}</p>
              </div>
            )}

            <LeadNotes lead={lead} onSaved={(notes) => onPatch({ notes })} />

            <div>
              <p className="text-xs font-semibold text-muted-foreground">Priorité CRM</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {Object.keys(PRIORITY_LABELS).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => onUpdatePriority(lead, p)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-medium",
                      lead.priority === p
                        ? "border-accent bg-accent/15"
                        : "border-border hover:bg-secondary",
                    )}
                  >
                    {priorityLabel(p)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-muted-foreground">Changer le statut</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {LEAD_STATUSES.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => onUpdateStatus(lead, s.value)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                      lead.status === s.value
                        ? "border-accent bg-accent/15"
                        : "border-border hover:bg-secondary",
                    )}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function LeadPhotos({ photos }: { photos: Lead["photos"] }) {
  const items = Array.isArray(photos) ? photos : [];
  if (items.length === 0) return <span className="text-sm text-muted-foreground">Aucune</span>;
  return (
    <>
      {items.map((item) => {
        if (typeof item === "string") {
          return (
            <span key={item} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">
              {item}
            </span>
          );
        }
        if (item && typeof item === "object" && "path" in item) {
          const path = String((item as { path: string }).path);
          return (
            <button
              key={path}
              type="button"
              className="rounded-full bg-secondary px-3 py-1 text-xs font-medium underline-offset-4 hover:underline"
              onClick={async () => {
                const { data } = await supabase.storage
                  .from(LEAD_PHOTOS_BUCKET)
                  .createSignedUrl(path, 120);
                if (data?.signedUrl) window.open(data.signedUrl, "_blank", "noopener");
                else toast.error("Photo indisponible");
              }}
            >
              {(item as { slot?: string }).slot || path}
            </button>
          );
        }
        return null;
      })}
    </>
  );
}

function LeadMaintenanceFields({
  lead,
  onSaved,
}: {
  lead: Lead;
  onSaved: (patch: Partial<Lead>) => void;
}) {
  const [nextAction, setNextAction] = useState(lead.next_action ?? "");
  const [lastAt, setLastAt] = useState(lead.last_intervention_at?.slice(0, 10) ?? "");
  const [nextDue, setNextDue] = useState(lead.next_due_at?.slice(0, 10) ?? "");
  const [saving, setSaving] = useState(false);

  return (
    <div className="rounded-lg border border-border p-4">
      <p className="text-xs font-semibold text-muted-foreground">Suivi maintenance</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="last_intervention">Dernière intervention (date)</Label>
          <Input
            id="last_intervention"
            type="date"
            className="mt-1"
            value={lastAt}
            onChange={(e) => setLastAt(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="next_due">Prochaine échéance</Label>
          <Input
            id="next_due"
            type="date"
            className="mt-1"
            value={nextDue}
            onChange={(e) => setNextDue(e.target.value)}
          />
        </div>
      </div>
      <div className="mt-3">
        <Label htmlFor="next_action">Prochaine action</Label>
        <Input
          id="next_action"
          className="mt-1"
          placeholder="ex. Rappeler pour devis, planifier visite…"
          value={nextAction}
          onChange={(e) => setNextAction(e.target.value)}
        />
      </div>
      <Button
        type="button"
        size="sm"
        className="mt-3"
        disabled={saving}
        onClick={async () => {
          setSaving(true);
          const patch = {
            last_intervention_at: lastAt || null,
            next_due_at: nextDue || null,
            next_action: nextAction || null,
          };
          const { error } = await supabase.from("leads").update(patch).eq("id", lead.id);
          setSaving(false);
          if (error) toast.error("Enregistrement impossible", { description: error.message });
          else {
            onSaved(patch);
            toast.success("Suivi enregistré");
          }
        }}
      >
        Enregistrer le suivi
      </Button>
    </div>
  );
}

function LeadNotes({ lead, onSaved }: { lead: Lead; onSaved: (notes: string) => void }) {
  const [notes, setNotes] = useState(lead.notes ?? "");
  const [saving, setSaving] = useState(false);
  return (
    <div>
      <p className="text-xs font-semibold text-muted-foreground">Notes internes</p>
      <textarea
        className="mt-2 min-h-20 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <Button
        type="button"
        size="sm"
        className="mt-2"
        disabled={saving}
        onClick={async () => {
          setSaving(true);
          const { error } = await supabase.from("leads").update({ notes }).eq("id", lead.id);
          setSaving(false);
          if (error) toast.error("Notes non enregistrées", { description: error.message });
          else {
            onSaved(notes);
            toast.success("Notes enregistrées");
          }
        }}
      >
        Enregistrer la note
      </Button>
    </div>
  );
}

function Field({ label, value }: { label: string; value?: string | null | undefined }) {
  return (
    <div>
      <p className="text-xs font-semibold text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm">{value || "—"}</p>
    </div>
  );
}

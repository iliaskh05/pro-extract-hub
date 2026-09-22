import { LEAD_STATUSES, PRIORITY_LABELS, type LeadStatus } from "@/lib/site";
import type { Tables } from "@/integrations/supabase/types";

export type Lead = Tables<"leads">;

export const KANBAN: LeadStatus[] = ["new", "contacted", "qualified", "quote_requested", "won"];

export function statusLabel(s: string) {
  return LEAD_STATUSES.find((x) => x.value === s)?.label ?? s;
}

export function priorityLabel(p: string | null | undefined) {
  return PRIORITY_LABELS[p ?? "normal"] ?? p ?? "—";
}

export function isUrgent(lead: Lead) {
  return (
    lead.priority === "high" ||
    lead.priority === "critical" ||
    lead.urgency_level === "prioritaire" ||
    lead.urgency_level === "critique" ||
    lead.need_type === "intervention_urgente"
  );
}

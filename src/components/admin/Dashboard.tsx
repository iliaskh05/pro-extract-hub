import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, LogOut, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  labelFor,
  MAINTENANCE_FREQUENCIES,
  REQUEST_TYPES,
  URGENCY_LEVELS,
} from "@/lib/quote-options";
import { BUSINESS_TYPES, LEAD_STATUSES, PRIORITY_LABELS, SITE, type LeadStatus } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DashboardOverview, PERIODS, type PeriodKey } from "@/components/admin/DashboardOverview";
import { cn } from "@/lib/utils";
import { KANBAN, isUrgent, priorityLabel, statusLabel, type Lead } from "./lead-helpers";
import { LeadDialog } from "./LeadDialog";

export function Dashboard({ leadIdFromUrl }: { leadIdFromUrl?: string | undefined }) {
  const qc = useQueryClient();
  const [selected, setSelected] = useState<Lead | null>(null);
  const [view, setView] = useState<"dashboard" | "pipeline">("dashboard");
  const [period, setPeriod] = useState<PeriodKey>("30d");
  const [lastUpdated, setLastUpdated] = useState(() => new Date());
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [cityFilter, setCityFilter] = useState("");
  const [businessFilter, setBusinessFilter] = useState<string>("all");
  const [freqFilter, setFreqFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState("");

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ["leads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Lead[];
    },
  });

  useEffect(() => {
    setLastUpdated(new Date());
  }, [leads]);

  useEffect(() => {
    const channel = supabase
      .channel("crm-leads")
      .on("postgres_changes", { event: "*", schema: "public", table: "leads" }, () => {
        void qc.invalidateQueries({ queryKey: ["leads"] });
      })
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [qc]);

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      if (statusFilter !== "all" && l.status !== statusFilter) return false;
      if (priorityFilter !== "all" && (l.priority ?? "normal") !== priorityFilter) return false;
      if (businessFilter !== "all" && l.business_type !== businessFilter) return false;
      if (freqFilter !== "all" && (l.maintenance_frequency ?? "") !== freqFilter) return false;
      if (cityFilter && !(l.city ?? "").toLowerCase().includes(cityFilter.toLowerCase()))
        return false;
      if (dateFrom && new Date(l.created_at) < new Date(dateFrom)) return false;
      return true;
    });
  }, [leads, statusFilter, priorityFilter, businessFilter, freqFilter, cityFilter, dateFrom]);

  const urgentLeads = useMemo(
    () => leads.filter((l) => isUrgent(l) && !["won", "lost"].includes(l.status)),
    [leads],
  );

  useEffect(() => {
    if (leadIdFromUrl && leads.length) {
      const found = leads.find((l) => l.id === leadIdFromUrl);
      if (found) setSelected(found);
    }
  }, [leadIdFromUrl, leads]);

  const kpis = useMemo(() => {
    const count = (s: string) => leads.filter((l) => l.status === s).length;
    const qualified = count("qualified") + count("quote_requested") + count("quote_sent");
    const conversion = leads.length ? Math.round((count("won") / leads.length) * 100) : 0;
    return [
      { label: "Nouveaux leads", value: count("new") },
      { label: "À traiter vite", value: urgentLeads.length },
      { label: "Leads qualifiés", value: qualified },
      { label: "Taux de conversion", value: `${conversion} %` },
    ];
  }, [leads, urgentLeads.length]);

  async function updateStatus(lead: Lead, status: LeadStatus) {
    const { error } = await supabase.from("leads").update({ status }).eq("id", lead.id);
    if (error) {
      toast.error("Mise à jour impossible", { description: error.message });
      return;
    }
    toast.success(`Statut : ${statusLabel(status)}`);
    void qc.invalidateQueries({ queryKey: ["leads"] });
    setSelected((s) => (s && s.id === lead.id ? { ...s, status } : s));
  }

  async function updatePriority(lead: Lead, priority: string) {
    const { error } = await supabase.from("leads").update({ priority }).eq("id", lead.id);
    if (error) {
      toast.error("Priorité non enregistrée", { description: error.message });
      return;
    }
    toast.success(`Priorité : ${priorityLabel(priority)}`);
    void qc.invalidateQueries({ queryKey: ["leads"] });
    setSelected((s) => (s && s.id === lead.id ? { ...s, priority } : s));
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="border-b border-border bg-ink text-ink-foreground">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-4 lg:px-8">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">CRM {SITE.name}</h1>
            <p className="mt-1 font-mono text-[11px] tracking-wide text-ink-muted uppercase">
              Demande → CRM → Suivi
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-ink-foreground hover:bg-ink-foreground/10 hover:text-ink-foreground"
            >
              <Link to="/">Voir le site</Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-ink-border bg-transparent text-ink-foreground hover:bg-ink-foreground/10 hover:text-ink-foreground"
              onClick={() => void qc.invalidateQueries({ queryKey: ["leads"] })}
            >
              <RefreshCw className="size-4" /> Actualiser
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-ink-foreground hover:bg-ink-foreground/10 hover:text-ink-foreground"
              onClick={() => void supabase.auth.signOut()}
            >
              <LogOut className="size-4" /> Quitter
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-8 px-5 py-8 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex rounded-lg border border-border bg-card p-1">
            {(
              [
                { value: "dashboard", label: "Tableau de bord" },
                { value: "pipeline", label: "Pipeline" },
              ] as const
            ).map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setView(t.value)}
                className={cn(
                  "rounded-md px-4 py-1.5 text-xs font-semibold transition-colors",
                  view === t.value
                    ? "bg-ink text-ink-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
          {view === "dashboard" && (
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className="size-2 animate-pulse rounded-full bg-accent" />
                En direct · maj {lastUpdated.toLocaleTimeString("fr-FR")}
              </span>
              <div className="inline-flex rounded-lg border border-border bg-card p-1">
                {PERIODS.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setPeriod(p.value)}
                    className={cn(
                      "rounded-md px-3 py-1.5 text-[11px] font-semibold transition-colors",
                      period === p.value
                        ? "bg-secondary text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {view === "dashboard" ? (
          <DashboardOverview leads={leads} period={period} isLoading={isLoading} />
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {kpis.map((k) => (
                <div
                  key={k.label}
                  className="rounded-xl border border-border bg-card p-5 shadow-card"
                >
                  <p className="text-xs text-muted-foreground">{k.label}</p>
                  <p className="mt-2 text-3xl font-extrabold tracking-tight">{k.value}</p>
                </div>
              ))}
            </div>

            {urgentLeads.length > 0 && (
              <section className="rounded-xl border border-accent/40 bg-accent/5 p-5">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="size-4 text-accent" />
                  <h2 className="text-sm font-bold tracking-tight">À traiter rapidement</h2>
                  <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-semibold">
                    {urgentLeads.length}
                  </span>
                </div>
                <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {urgentLeads.slice(0, 6).map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => setSelected(l)}
                      className="rounded-lg border border-border bg-card px-4 py-3 text-left text-xs hover:border-accent"
                    >
                      <span className="font-semibold">{l.company_name || l.contact_name}</span>
                      <span className="mt-1 block text-muted-foreground">
                        {l.city} · {priorityLabel(l.priority)}
                        {l.urgency_level ? ` · ${labelFor(URGENCY_LEVELS, l.urgency_level)}` : ""}
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            )}

            <section className="rounded-xl border border-border bg-card p-4">
              <h2 className="text-sm font-bold tracking-tight">Filtres</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
                <select
                  className="h-10 rounded-lg border border-input bg-background px-3 text-sm"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Tous statuts</option>
                  {LEAD_STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <select
                  className="h-10 rounded-lg border border-input bg-background px-3 text-sm"
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                >
                  <option value="all">Toutes priorités</option>
                  {Object.entries(PRIORITY_LABELS).map(([v, l]) => (
                    <option key={v} value={v}>
                      {l}
                    </option>
                  ))}
                </select>
                <Input
                  placeholder="Ville"
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                />
                <select
                  className="h-10 rounded-lg border border-input bg-background px-3 text-sm"
                  value={businessFilter}
                  onChange={(e) => setBusinessFilter(e.target.value)}
                >
                  <option value="all">Tous établissements</option>
                  {BUSINESS_TYPES.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
                <select
                  className="h-10 rounded-lg border border-input bg-background px-3 text-sm"
                  value={freqFilter}
                  onChange={(e) => setFreqFilter(e.target.value)}
                >
                  <option value="all">Toutes fréquences</option>
                  {MAINTENANCE_FREQUENCIES.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  aria-label="Date minimum"
                />
              </div>
            </section>

            {/* Pipeline */}
            <section>
              <h2 className="text-sm font-bold tracking-tight">Pipeline</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-3 lg:grid-cols-5">
                {KANBAN.map((status) => {
                  const items = filtered.filter((l) => l.status === status);
                  return (
                    <div key={status} className="rounded-xl border border-border bg-card p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold">{statusLabel(status)}</p>
                        <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold">
                          {items.length}
                        </span>
                      </div>
                      <div className="mt-3 space-y-2">
                        {items.length === 0 && (
                          <p className="rounded-lg border border-dashed border-border px-3 py-4 text-center text-[11px] text-muted-foreground">
                            Aucun lead
                          </p>
                        )}
                        {items.map((l) => (
                          <button
                            key={l.id}
                            type="button"
                            onClick={() => setSelected(l)}
                            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-left text-xs transition-colors hover:border-accent"
                          >
                            <span className="flex items-center justify-between gap-2">
                              <span className="block font-semibold">
                                {l.company_name || l.contact_name || "Sans nom"}
                              </span>
                              {(l.priority === "high" || l.priority === "critical") && (
                                <span className="shrink-0 rounded-full bg-accent/20 px-1.5 py-0.5 text-[9px] font-bold text-accent">
                                  {priorityLabel(l.priority)}
                                </span>
                              )}
                            </span>
                            <span className="block text-muted-foreground">
                              {l.city || "—"} · {l.business_type || "—"}
                            </span>
                            {l.request_type && (
                              <span className="block text-[10px] text-muted-foreground">
                                {labelFor(REQUEST_TYPES, l.request_type)}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Table */}
            <section>
              <h2 className="text-sm font-bold tracking-tight">Leads ({filtered.length})</h2>
              <div className="mt-4 overflow-x-auto rounded-xl border border-border bg-card">
                <table className="w-full min-w-[900px] text-sm">
                  <thead className="border-b border-border bg-secondary/60 text-left text-xs text-muted-foreground">
                    <tr>
                      {[
                        "Entreprise",
                        "Contact",
                        "Ville",
                        "Priorité",
                        "Type",
                        "Fréquence",
                        "Date",
                        "Statut",
                      ].map((h) => (
                        <th key={h} className="px-4 py-3 font-semibold">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading && (
                      <tr>
                        <td colSpan={8} className="px-4 py-10 text-center text-muted-foreground">
                          Chargement…
                        </td>
                      </tr>
                    )}
                    {!isLoading && filtered.length === 0 && (
                      <tr>
                        <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                          Aucun lead pour ces filtres.
                        </td>
                      </tr>
                    )}
                    {filtered.map((l) => (
                      <tr
                        key={l.id}
                        onClick={() => setSelected(l)}
                        className="cursor-pointer border-b border-border last:border-0 hover:bg-secondary/50"
                      >
                        <td className="px-4 py-3 font-medium">{l.company_name || "—"}</td>
                        <td className="px-4 py-3">{l.contact_name || "—"}</td>
                        <td className="px-4 py-3">{l.city || "—"}</td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                              l.priority === "critical"
                                ? "bg-destructive/15 text-destructive"
                                : l.priority === "high"
                                  ? "bg-accent/20 text-accent-foreground"
                                  : "bg-secondary",
                            )}
                          >
                            {priorityLabel(l.priority)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {l.request_type ? labelFor(REQUEST_TYPES, l.request_type) : "—"}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {l.maintenance_frequency
                            ? labelFor(MAINTENANCE_FREQUENCIES, l.maintenance_frequency)
                            : "—"}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {new Date(l.created_at).toLocaleDateString("fr-FR")}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              "rounded-full px-2.5 py-1 text-[11px] font-semibold",
                              l.status === "won"
                                ? "bg-accent/20 text-accent-foreground"
                                : l.status === "lost"
                                  ? "bg-destructive/10 text-destructive"
                                  : "bg-secondary text-secondary-foreground",
                            )}
                          >
                            {statusLabel(l.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </div>

      <LeadDialog
        lead={selected}
        onOpenChange={(open) => !open && setSelected(null)}
        onPatch={(patch) => setSelected((s) => (s ? { ...s, ...patch } : s))}
        onUpdateStatus={(lead, status) => void updateStatus(lead, status)}
        onUpdatePriority={(lead, priority) => void updatePriority(lead, priority)}
      />
    </div>
  );
}

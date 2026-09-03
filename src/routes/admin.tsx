import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, AlertTriangle, LogOut, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { BrandMark } from "@/components/BrandMark";
import { LEAD_PHOTOS_BUCKET } from "@/lib/quote-schema";
import {
  labelFor,
  MAINTENANCE_FREQUENCIES,
  REQUEST_TYPES,
  URGENCY_LEVELS,
} from "@/lib/quote-options";
import { BUSINESS_TYPES, LEAD_STATUSES, PRIORITY_LABELS, SITE, type LeadStatus } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { Session } from "@supabase/supabase-js";
import type { Tables } from "@/integrations/supabase/types";

type Lead = Tables<"leads">;

export const Route = createFileRoute("/admin")({
  validateSearch: (search: Record<string, unknown>) => ({
    lead: typeof search['lead'] === "string" ? (search['lead'] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Espace CRM | Salis 3 Hottes" },
      {
        name: "description",
        content: "Suivi interne des demandes de devis.",
      },
      { property: "og:title", content: "Espace CRM" },
      { property: "og:description", content: "CRM interne Salis 3 Hottes." },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/admin" }],
  }),
  component: AdminPage,
});

const KANBAN: LeadStatus[] = ["new", "contacted", "qualified", "quote_requested", "won"];

function statusLabel(s: string) {
  return LEAD_STATUSES.find((x) => x.value === s)?.label ?? s;
}

function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Chargement…
      </div>
    );
  }

  return session ? <Dashboard /> : <AuthGate />;
}

function AuthGate() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) toast.error("Connexion impossible", { description: error.message });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-5 py-16">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-lift">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" /> Retour au site
        </Link>
        <div className="mt-5">
          <BrandMark compact />
        </div>
        <h1 className="mt-5 text-2xl font-semibold tracking-tight">Espace CRM</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Accès réservé aux collaborateurs autorisés de {SITE.name}.
        </p>
        <p className="mt-4 font-mono text-[11px] tracking-wide text-accent uppercase">
          Demande → CRM → Suivi
        </p>
        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            void submit();
          }}
        >
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              autoComplete="email"
              className="mt-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              required
              minLength={6}
              autoComplete="current-password"
              className="mt-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            Se connecter
          </Button>
        </form>
      </div>
    </div>
  );
}

function priorityLabel(p: string | null | undefined) {
  return PRIORITY_LABELS[p ?? "normal"] ?? p ?? "—";
}

function isUrgent(lead: Lead) {
  return (
    lead.priority === "high" ||
    lead.priority === "critical" ||
    lead.urgency_level === "prioritaire" ||
    lead.urgency_level === "critique" ||
    lead.need_type === "intervention_urgente"
  );
}

function Dashboard() {
  const qc = useQueryClient();
  const { lead: leadIdFromUrl } = Route.useSearch();
  const [selected, setSelected] = useState<Lead | null>(null);
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((k) => (
            <div key={k.label} className="rounded-xl border border-border bg-card p-5 shadow-card">
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
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
          {selected && (
            <>
              <DialogTitle className="flex flex-wrap items-center gap-2">
                {selected.company_name || selected.contact_name || "Lead"}
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                    selected.priority === "critical"
                      ? "bg-destructive/15 text-destructive"
                      : "bg-secondary",
                  )}
                >
                  {priorityLabel(selected.priority)}
                </span>
              </DialogTitle>
              <DialogDescription>
                Reçu le {new Date(selected.created_at).toLocaleString("fr-FR")} · réf.{" "}
                {selected.reference ? `#${selected.reference}` : "—"}
              </DialogDescription>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Contact" value={selected.contact_name} />
                <Field label="Téléphone" value={selected.phone} />
                <Field label="Email" value={selected.email} />
                <Field label="Établissement" value={selected.business_type} />
                <Field label="Ville" value={selected.city} />
                <Field label="Code postal" value={selected.postal_code} />
                <Field label="Type d'installation" value={selected.installation_type} />
                <Field label="Type de hotte" value={selected.hood_type} />
                <Field label="Longueur de hotte" value={selected.hood_length} />
                <Field label="Longueur conduits" value={selected.duct_length} />
                <Field label="Nombre de filtres" value={selected.filter_count?.toString()} />
                <Field label="Encrassement" value={selected.soil_level} />
                <Field label="Accessibilité" value={selected.accessibility} />
                <Field
                  label="Type de demande"
                  value={
                    selected.request_type ? labelFor(REQUEST_TYPES, selected.request_type) : null
                  }
                />
                <Field
                  label="Fréquence"
                  value={
                    selected.maintenance_frequency
                      ? labelFor(MAINTENANCE_FREQUENCIES, selected.maintenance_frequency)
                      : null
                  }
                />
                <Field
                  label="Urgence"
                  value={
                    selected.urgency_level ? labelFor(URGENCY_LEVELS, selected.urgency_level) : null
                  }
                />
                <Field label="Planning souhaité" value={selected.schedule_preference} />
                <Field
                  label="Nuit / tôt le matin"
                  value={selected.night_intervention ? "Oui" : "Non"}
                />
                <Field label="Dernière intervention" value={selected.last_cleaning} />
                <Field label="Contact préféré" value={selected.preferred_contact} />
                <Field label="Page d'origine" value={selected.landing_page} />
                <Field label="Service source" value={selected.service_source} />
                <Field label="Zone source" value={selected.zone_source} />
                <Field
                  label="Attribution UTM"
                  value={[selected.utm_source, selected.utm_medium, selected.utm_campaign]
                    .filter(Boolean)
                    .join(" / ")}
                />
                <Field
                  label="Dernière intervention (date)"
                  value={
                    selected.last_intervention_at
                      ? new Date(selected.last_intervention_at).toLocaleDateString("fr-FR")
                      : null
                  }
                />
                <Field
                  label="Prochaine échéance"
                  value={
                    selected.next_due_at
                      ? new Date(selected.next_due_at).toLocaleDateString("fr-FR")
                      : null
                  }
                />
              </div>

              <LeadMaintenanceFields
                lead={selected}
                onSaved={(patch) => setSelected({ ...selected, ...patch })}
              />

              <div>
                <p className="text-xs font-semibold text-muted-foreground">Photos transmises</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <LeadPhotos photos={selected.photos} />
                </div>
              </div>

              {selected.message && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Besoin exprimé</p>
                  <p className="mt-1 text-sm">{selected.message}</p>
                </div>
              )}

              <LeadNotes lead={selected} onSaved={(notes) => setSelected({ ...selected, notes })} />

              <div>
                <p className="text-xs font-semibold text-muted-foreground">Priorité CRM</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {Object.keys(PRIORITY_LABELS).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => void updatePriority(selected, p)}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-xs font-medium",
                        selected.priority === p
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
                      onClick={() => void updateStatus(selected, s.value)}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                        selected.status === s.value
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
    </div>
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

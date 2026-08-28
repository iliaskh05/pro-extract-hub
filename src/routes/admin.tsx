import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, LogOut, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { BrandMark } from "@/components/BrandMark";
import { LEAD_PHOTOS_BUCKET } from "@/lib/quote-schema";
import { LEAD_STATUSES, SITE, type LeadStatus } from "@/lib/site";
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

function Dashboard() {
  const qc = useQueryClient();
  const [selected, setSelected] = useState<Lead | null>(null);

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

  const kpis = useMemo(() => {
    const count = (s: string) => leads.filter((l) => l.status === s).length;
    const qualified = count("qualified") + count("quote_requested") + count("quote_sent");
    const conversion = leads.length ? Math.round((count("won") / leads.length) * 100) : 0;
    return [
      { label: "Nouveaux leads", value: count("new") },
      { label: "Leads qualifiés", value: qualified },
      { label: "Demandes de devis", value: count("quote_requested") + count("quote_sent") },
      { label: "Taux de conversion", value: `${conversion} %` },
    ];
  }, [leads]);

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

        {/* Pipeline */}
        <section>
          <h2 className="text-sm font-bold tracking-tight">Pipeline</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3 lg:grid-cols-5">
            {KANBAN.map((status) => {
              const items = leads.filter((l) => l.status === status);
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
                        <span className="block font-semibold">
                          {l.company_name || l.contact_name || "Sans nom"}
                        </span>
                        <span className="block text-muted-foreground">
                          {l.city || "—"} · {l.business_type || "—"}
                        </span>
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
          <h2 className="text-sm font-bold tracking-tight">Leads</h2>
          <div className="mt-4 overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="border-b border-border bg-secondary/60 text-left text-xs text-muted-foreground">
                <tr>
                  {["Entreprise", "Contact", "Ville", "Source", "Date", "Statut"].map((h) => (
                    <th key={h} className="px-4 py-3 font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                      Chargement…
                    </td>
                  </tr>
                )}
                {!isLoading && leads.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                      Aucun lead pour le moment.{" "}
                      <Link to="/devis" className="text-accent underline-offset-4 hover:underline">
                        Envoyez une demande depuis le site
                      </Link>{" "}
                      pour la voir apparaître ici.
                    </td>
                  </tr>
                )}
                {leads.map((l) => (
                  <tr
                    key={l.id}
                    onClick={() => setSelected(l)}
                    className="cursor-pointer border-b border-border last:border-0 hover:bg-secondary/50"
                  >
                    <td className="px-4 py-3 font-medium">{l.company_name || "—"}</td>
                    <td className="px-4 py-3">{l.contact_name || "—"}</td>
                    <td className="px-4 py-3">{l.city || "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{l.source}</td>
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
              <DialogTitle>{selected.company_name || selected.contact_name || "Lead"}</DialogTitle>
              <DialogDescription>
                Reçu le {new Date(selected.created_at).toLocaleString("fr-FR")} · source{" "}
                {selected.source}
              </DialogDescription>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Contact" value={selected.contact_name} />
                <Field label="Téléphone" value={selected.phone} />
                <Field label="Email" value={selected.email} />
                <Field label="Établissement" value={selected.business_type} />
                <Field label="Ville" value={selected.city} />
                <Field label="Code postal" value={selected.postal_code} />
                <Field label="Longueur de hotte" value={selected.hood_length} />
                <Field label="Nombre de filtres" value={selected.filter_count?.toString()} />
                <Field label="Conduit" value={selected.duct_present ? "Oui" : "Non"} />
                <Field label="Moteur / caisson" value={selected.motor_present ? "Oui" : "Non"} />
                <Field label="Dernière intervention" value={selected.last_cleaning} />
                <Field label="Fréquence souhaitée" value={selected.requested_frequency} />
                <Field
                  label="Référence"
                  value={selected.reference ? `#${selected.reference}` : null}
                />
                <Field label="Contact préféré" value={selected.preferred_contact} />
                <Field
                  label="Attribution"
                  value={[selected.utm_source, selected.utm_medium, selected.utm_campaign]
                    .filter(Boolean)
                    .join(" / ")}
                />
              </div>

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
                <p className="text-xs font-semibold text-muted-foreground">Historique</p>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <li>
                    · Demande créée le {new Date(selected.created_at).toLocaleString("fr-FR")}
                  </li>
                  <li>
                    · Dernière mise à jour le{" "}
                    {new Date(selected.updated_at).toLocaleString("fr-FR")}
                  </li>
                  <li>· Statut actuel : {statusLabel(selected.status)}</li>
                </ul>
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

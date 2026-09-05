import { useMemo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import { eachDayOfInterval, eachMonthOfInterval, format, subDays, subMonths } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { LEAD_STATUSES, ZONES } from "@/lib/site";
import { cn } from "@/lib/utils";
import type { Tables } from "@/integrations/supabase/types";

type Lead = Tables<"leads">;

export type PeriodKey = "7d" | "30d" | "90d" | "12m" | "all";

export const PERIODS: { value: PeriodKey; label: string }[] = [
  { value: "7d", label: "7 jours" },
  { value: "30d", label: "30 jours" },
  { value: "90d", label: "90 jours" },
  { value: "12m", label: "12 mois" },
  { value: "all", label: "Tout" },
];

const CHART_COLORS = [
  "var(--color-chart-2)",
  "var(--color-chart-1)",
  "var(--color-chart-4)",
  "var(--color-chart-3)",
  "var(--color-chart-5)",
];

function periodStart(period: PeriodKey, now: Date): Date | null {
  switch (period) {
    case "7d":
      return subDays(now, 6);
    case "30d":
      return subDays(now, 29);
    case "90d":
      return subDays(now, 89);
    case "12m":
      return subMonths(now, 11);
    default:
      return null;
  }
}

function zoneOf(lead: Lead): string {
  const haystack = `${lead.zone_source ?? ""} ${lead.city ?? ""}`.toLowerCase();
  const match = ZONES.find(
    (z) => haystack.includes(z.slug) || haystack.includes(z.name.toLowerCase()),
  );
  if (match) return match.name;
  if (lead.city && lead.city.trim()) return lead.city.trim();
  return "Non précisé";
}

function sourceOf(lead: Lead): string {
  if (lead.utm_source) return lead.utm_source;
  if (lead.service_source) return "Page service";
  if (lead.zone_source) return "Page zone";
  if (lead.landing_page && lead.landing_page !== "/") return "Page interne";
  return "Site — accueil";
}

function isUrgentLead(lead: Lead) {
  return (
    lead.priority === "high" ||
    lead.priority === "critical" ||
    lead.urgency_level === "prioritaire" ||
    lead.urgency_level === "critique" ||
    lead.need_type === "intervention_urgente"
  );
}

function pct(part: number, total: number) {
  return total ? Math.round((part / total) * 100) : 0;
}

function EmptyState({ label = "Aucune donnée sur cette période." }: { label?: string }) {
  return (
    <div className="flex h-[220px] items-center justify-center rounded-lg border border-dashed border-border text-xs text-muted-foreground">
      {label}
    </div>
  );
}

function Panel({
  title,
  subtitle,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-xl border border-border bg-card p-5 shadow-card", className)}>
      <h3 className="text-sm font-bold tracking-tight">{title}</h3>
      {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function DashboardOverview({
  leads,
  period,
  isLoading,
}: {
  leads: Lead[];
  period: PeriodKey;
  isLoading: boolean;
}) {
  const now = useMemo(() => new Date(), []);
  const start = periodStart(period, now);

  const current = useMemo(
    () => (start ? leads.filter((l) => new Date(l.created_at) >= start) : leads),
    [leads, start],
  );

  const previous = useMemo(() => {
    if (!start) return [];
    const span = now.getTime() - start.getTime();
    const prevStart = new Date(start.getTime() - span);
    return leads.filter((l) => {
      const d = new Date(l.created_at);
      return d >= prevStart && d < start;
    });
  }, [leads, start, now]);

  const countBy = (list: Lead[], status: string) => list.filter((l) => l.status === status).length;

  const kpis = useMemo(() => {
    const total = current.length;
    const prevTotal = previous.length;
    const delta = prevTotal ? Math.round(((total - prevTotal) / prevTotal) * 100) : null;
    const won = countBy(current, "won");
    const lost = countBy(current, "lost");
    const urgent = current.filter(
      (l) => isUrgentLead(l) && !["won", "lost"].includes(l.status),
    ).length;
    const quotes = countBy(current, "quote_requested") + countBy(current, "quote_sent");

    return [
      { label: "Demandes reçues", value: String(total), delta },
      { label: "Urgences en attente", value: String(urgent), delta: null },
      { label: "Devis en cours", value: String(quotes), delta: null },
      { label: "Affaires gagnées", value: String(won), delta: null },
      { label: "Taux de conversion", value: `${pct(won, total)} %`, delta: null },
      { label: "Taux de perte", value: `${pct(lost, total)} %`, delta: null },
    ];
  }, [current, previous]);

  const timeSeries = useMemo(() => {
    const monthly = period === "12m" || period === "all";
    const from =
      start ??
      (leads.length
        ? new Date(Math.min(...leads.map((l) => new Date(l.created_at).getTime())))
        : now);
    const buckets = monthly
      ? eachMonthOfInterval({ start: from, end: now })
      : eachDayOfInterval({ start: from, end: now });
    const key = (d: Date) => (monthly ? format(d, "yyyy-MM") : format(d, "yyyy-MM-dd"));
    const map = new Map<string, { demandes: number; gagnees: number }>();
    for (const b of buckets) map.set(key(b), { demandes: 0, gagnees: 0 });
    for (const l of current) {
      const k = key(new Date(l.created_at));
      const entry = map.get(k);
      if (!entry) continue;
      entry.demandes += 1;
      if (l.status === "won") entry.gagnees += 1;
    }
    return buckets.map((b) => ({
      label: monthly ? format(b, "MMM yy", { locale: fr }) : format(b, "d MMM", { locale: fr }),
      ...(map.get(key(b)) ?? { demandes: 0, gagnees: 0 }),
    }));
  }, [current, leads, period, start, now]);

  const byZone = useMemo(() => {
    const map = new Map<string, { zone: string; demandes: number; gagnees: number }>();
    for (const l of current) {
      const zone = zoneOf(l);
      const entry = map.get(zone) ?? { zone, demandes: 0, gagnees: 0 };
      entry.demandes += 1;
      if (l.status === "won") entry.gagnees += 1;
      map.set(zone, entry);
    }
    return [...map.values()]
      .map((e) => ({ ...e, taux: pct(e.gagnees, e.demandes) }))
      .sort((a, b) => b.demandes - a.demandes)
      .slice(0, 8);
  }, [current]);

  const byStatus = useMemo(
    () =>
      LEAD_STATUSES.map((s, i) => ({
        name: s.label,
        value: countBy(current, s.value),
        fill: CHART_COLORS[i % CHART_COLORS.length] as string,
      })).filter((s) => s.value > 0),
    [current],
  );

  const funnel = useMemo(() => {
    const total = current.length;
    const rank: Record<string, number> = {
      new: 0,
      contacted: 1,
      qualified: 2,
      quote_requested: 3,
      quote_sent: 4,
      won: 5,
      lost: 1,
    };
    const atLeast = (level: number) =>
      current.filter((l) => (rank[l.status] ?? 0) >= level && l.status !== "lost").length;
    const steps = [
      { etape: "Reçues", value: total },
      { etape: "Contactées", value: atLeast(1) },
      { etape: "Qualifiées", value: atLeast(2) },
      { etape: "Devis envoyés", value: atLeast(4) },
      { etape: "Gagnées", value: atLeast(5) },
    ];
    return steps.map((s) => ({ ...s, taux: pct(s.value, total) }));
  }, [current]);

  const byBusiness = useMemo(() => {
    const map = new Map<string, number>();
    for (const l of current) {
      const k = l.business_type?.trim() || "Non précisé";
      map.set(k, (map.get(k) ?? 0) + 1);
    }
    return [...map.entries()]
      .map(([type, demandes]) => ({ type, demandes }))
      .sort((a, b) => b.demandes - a.demandes)
      .slice(0, 8);
  }, [current]);

  const bySource = useMemo(() => {
    const map = new Map<string, number>();
    for (const l of current) {
      const k = sourceOf(l);
      map.set(k, (map.get(k) ?? 0) + 1);
    }
    return [...map.entries()]
      .map(([name, value], i) => ({
        name,
        value,
        fill: CHART_COLORS[i % CHART_COLORS.length] as string,
      }))
      .sort((a, b) => b.value - a.value);
  }, [current]);

  const config: ChartConfig = {
    demandes: { label: "Demandes", color: "var(--color-chart-2)" },
    gagnees: { label: "Gagnées", color: "var(--color-chart-1)" },
    value: { label: "Demandes" },
  };

  if (isLoading) {
    return (
      <p className="rounded-xl border border-dashed border-border bg-card px-4 py-16 text-center text-sm text-muted-foreground">
        Chargement des indicateurs…
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-xl border border-border bg-card p-5 shadow-card">
            <p className="text-xs text-muted-foreground">{k.label}</p>
            <p className="mt-2 text-3xl font-extrabold tracking-tight">{k.value}</p>
            {k.delta !== null && k.delta !== undefined && (
              <p
                className={cn(
                  "mt-1 flex items-center gap-1 text-[11px] font-semibold",
                  k.delta > 0
                    ? "text-accent"
                    : k.delta < 0
                      ? "text-destructive"
                      : "text-muted-foreground",
                )}
              >
                {k.delta > 0 ? (
                  <ArrowUpRight className="size-3" />
                ) : k.delta < 0 ? (
                  <ArrowDownRight className="size-3" />
                ) : (
                  <Minus className="size-3" />
                )}
                {k.delta > 0 ? "+" : ""}
                {k.delta} % vs période précédente
              </p>
            )}
          </div>
        ))}
      </div>

      <Panel title="Évolution des demandes" subtitle="Demandes reçues et affaires gagnées">
        {current.length === 0 ? (
          <EmptyState />
        ) : (
          <ChartContainer config={config} className="h-[260px] w-full">
            <AreaChart data={timeSeries} margin={{ left: 4, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="demandesFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-demandes)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="var(--color-demandes)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={11} minTickGap={16} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={28} fontSize={11} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="demandes"
                stroke="var(--color-demandes)"
                fill="url(#demandesFill)"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="gagnees"
                stroke="var(--color-gagnees)"
                strokeWidth={2}
                dot={false}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Devis par zone" subtitle="Volume et taux de conversion par secteur">
          {byZone.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <ChartContainer config={config} className="h-[240px] w-full">
                <BarChart data={byZone} layout="vertical" margin={{ left: 8, right: 16 }}>
                  <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                  <XAxis type="number" allowDecimals={false} fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis
                    type="category"
                    dataKey="zone"
                    width={92}
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="demandes" fill="var(--color-demandes)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ChartContainer>
              <ul className="mt-4 space-y-1.5 text-xs">
                {byZone.map((z) => (
                  <li key={z.zone} className="flex justify-between text-muted-foreground">
                    <span>{z.zone}</span>
                    <span>
                      {z.demandes} demande{z.demandes > 1 ? "s" : ""} · {z.taux} % gagnées
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Panel>

        <Panel title="Répartition par statut" subtitle="État actuel du pipeline">
          {byStatus.length === 0 ? (
            <EmptyState />
          ) : (
            <ChartContainer config={config} className="h-[300px] w-full">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                <Pie data={byStatus} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95} paddingAngle={2}>
                  {byStatus.map((s) => (
                    <Cell key={s.name} fill={s.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          )}
        </Panel>

        <Panel title="Entonnoir de conversion" subtitle="Passage d'une étape à l'autre">
          {current.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-3">
              {funnel.map((step) => (
                <div key={step.etape}>
                  <div className="flex justify-between text-xs">
                    <span className="font-medium">{step.etape}</span>
                    <span className="text-muted-foreground">
                      {step.value} · {step.taux} %
                    </span>
                  </div>
                  <div className="mt-1.5 h-2.5 rounded-full bg-secondary">
                    <div
                      className="h-2.5 rounded-full bg-accent transition-all"
                      style={{ width: `${Math.max(step.taux, step.value > 0 ? 4 : 0)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Panel>

        <Panel title="Types d'établissement" subtitle="Segments les plus demandeurs">
          {byBusiness.length === 0 ? (
            <EmptyState />
          ) : (
            <ChartContainer config={config} className="h-[240px] w-full">
              <BarChart data={byBusiness} margin={{ left: 4, right: 8 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="type" fontSize={10} tickLine={false} axisLine={false} interval={0} angle={-20} height={48} textAnchor="end" />
                <YAxis allowDecimals={false} width={28} fontSize={11} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="demandes" fill="var(--color-demandes)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          )}
        </Panel>
      </div>

      <Panel title="Origine des demandes" subtitle="D'où viennent les contacts reçus">
        {bySource.length === 0 ? (
          <EmptyState />
        ) : (
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {bySource.map((s) => (
              <li
                key={s.name}
                className="flex items-center justify-between rounded-lg border border-border px-4 py-3 text-xs"
              >
                <span className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full" style={{ background: s.fill }} />
                  {s.name}
                </span>
                <span className="font-semibold">
                  {s.value} ({pct(s.value, current.length)} %)
                </span>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}

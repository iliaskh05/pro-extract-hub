-- Qualification avancée des leads (conversion, urgence, maintenance, attribution)

ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS need_type text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS installation_type text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS hood_type text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS duct_length text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS soil_level text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS accessibility text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS night_intervention boolean DEFAULT false;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS schedule_preference text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS request_type text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS maintenance_frequency text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS urgency_level text DEFAULT 'normal';
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS landing_page text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS service_source text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS zone_source text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS last_intervention_at date;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS next_due_at date;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS next_action text;

COMMENT ON COLUMN public.leads.need_type IS 'devis_classique | intervention_urgente';
COMMENT ON COLUMN public.leads.urgency_level IS 'normal | prioritaire | critique';
COMMENT ON COLUMN public.leads.request_type IS 'ponctuelle | entretien_periodique | contrat';
COMMENT ON COLUMN public.leads.maintenance_frequency IS 'mensuelle | trimestrielle | semestrielle | annuelle | a_determiner';

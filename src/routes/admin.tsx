import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { isStaffFromLegacyRoles, isStaffFromProfile } from "@/lib/staff-access";
import { AuthGate } from "@/components/admin/AuthGate";
import { Dashboard } from "@/components/admin/Dashboard";
import type { Session } from "@supabase/supabase-js";

export const Route = createFileRoute("/admin")({
  validateSearch: (search: Record<string, unknown>) => ({
    lead: typeof search["lead"] === "string" ? (search["lead"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Espace CRM | Salis3Hottes" },
      {
        name: "description",
        content: "Suivi interne des demandes de devis.",
      },
      { property: "og:title", content: "Espace CRM" },
      { property: "og:description", content: "CRM interne Salis3Hottes." },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/admin" }],
  }),
  component: AdminPage,
});

function AdminPage() {
  const { lead: leadIdFromUrl } = Route.useSearch();
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [isStaff, setIsStaff] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const userId = session?.user?.id;
    if (!userId) {
      setIsStaff(null);
      return;
    }
    let active = true;

    async function checkStaffAccess(userId: string) {
      // Official schema: public.staff_profiles (role 'admin' | 'commercial').
      // Not present in the generated Supabase types yet, so query it untyped.
      const { data: staffProfile, error: staffError } = await (supabase as any)
        .from("staff_profiles")
        .select("role")
        .eq("user_id", userId)
        .maybeSingle();

      if (!staffError && staffProfile) {
        return isStaffFromProfile(staffProfile as { role?: string });
      }

      // Fallback for deployments still on the legacy public.user_roles schema.
      const { data: legacyRoles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId);
      return isStaffFromLegacyRoles(legacyRoles);
    }

    void checkStaffAccess(userId).then((result) => {
      if (active) setIsStaff(result);
    });

    return () => {
      active = false;
    };
  }, [session?.user?.id]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Chargement…
      </div>
    );
  }

  if (!session) return <AuthGate />;

  if (isStaff === null) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Vérification des accès…
      </div>
    );
  }

  if (!isStaff) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-xl font-semibold">Accès non autorisé</h1>
        <p className="max-w-md text-sm text-muted-foreground">
          Votre compte n'a pas le rôle collaborateur requis pour consulter les demandes clients.
          Contactez un administrateur.
        </p>
        <Button variant="outline" onClick={() => void supabase.auth.signOut()}>
          Se déconnecter
        </Button>
      </div>
    );
  }

  return <Dashboard leadIdFromUrl={leadIdFromUrl} />;
}

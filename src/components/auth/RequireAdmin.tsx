import React from "react";
import type { Session, User } from "@supabase/supabase-js";
import { Button, Input } from "@antigravity/ds";
import { supabase } from "@/lib/supabase";

const ADMIN_ROLES = new Set(["admin", "owner", "superadmin"]);

const hasAdminRoleClaim = (user: User) => {
  const appRole = typeof user.app_metadata?.role === "string" ? user.app_metadata.role : "";
  const userRole = typeof user.user_metadata?.role === "string" ? user.user_metadata.role : "";
  return ADMIN_ROLES.has(appRole.toLowerCase()) || ADMIN_ROLES.has(userRole.toLowerCase());
};

const resolveIsAdmin = async (user: User) => {
  if (hasAdminRoleClaim(user)) {
    return true;
  }

  // Fallback to DB-side function (works with/without profiles table).
  const { data, error } = await supabase.rpc("is_dashboard_admin");
  if (error) {
    return false;
  }
  return data === true;
};

const DashboardSignIn = ({ onSuccess }: { onSuccess: () => Promise<void> }) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setError("Falha no login. Verifique suas credenciais.");
      setSubmitting(false);
      return;
    }

    setPassword("");
    await onSuccess();
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-black text-foreground flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <h1 className="text-xl font-bold text-white">Acesso ao Dashboard</h1>
        <p className="mt-2 text-sm text-zinc-400">Entre com sua conta administrativa.</p>
        <form onSubmit={handleSignIn} className="mt-6 flex flex-col gap-4">
          <Input
            type="email"
            autoComplete="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="bg-zinc-950 border-zinc-800"
            required
          />
          <Input
            type="password"
            autoComplete="current-password"
            placeholder="Senha"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="bg-zinc-950 border-zinc-800"
            required
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button type="submit" disabled={submitting || !email || !password}>
            {submitting ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </div>
    </div>
  );
};

const DashboardUnauthorized = () => {
  const [signingOut, setSigningOut] = React.useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    await supabase.auth.signOut();
    setSigningOut(false);
  };

  return (
    <div className="min-h-screen bg-black text-foreground flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <h1 className="text-xl font-bold text-white">Acesso negado</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Sua conta não possui permissão de administrador para visualizar este dashboard.
        </p>
        <Button className="mt-6 w-full" variant="outline" onClick={handleSignOut} disabled={signingOut}>
          {signingOut ? "Saindo..." : "Sair"}
        </Button>
      </div>
    </div>
  );
};

export const RequireAdmin = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = React.useState(true);
  const [session, setSession] = React.useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = React.useState(false);

  const refreshAuthState = React.useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.auth.getSession();
    const nextSession = data.session;
    setSession(nextSession);

    if (!nextSession?.user) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    const allowed = await resolveIsAdmin(nextSession.user);
    setIsAdmin(allowed);
    setLoading(false);
  }, []);

  React.useEffect(() => {
    let mounted = true;

    const init = async () => {
      await refreshAuthState();
    };

    void init();

    const { data: authSubscription } = supabase.auth.onAuthStateChange(() => {
      if (!mounted) {
        return;
      }
      void refreshAuthState();
    });

    return () => {
      mounted = false;
      authSubscription.subscription.unsubscribe();
    };
  }, [refreshAuthState]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-foreground flex items-center justify-center">
        <p className="text-sm text-zinc-400">Validando acesso...</p>
      </div>
    );
  }

  if (!session) {
    return <DashboardSignIn onSuccess={refreshAuthState} />;
  }

  if (!isAdmin) {
    return <DashboardUnauthorized />;
  }

  return <>{children}</>;
};

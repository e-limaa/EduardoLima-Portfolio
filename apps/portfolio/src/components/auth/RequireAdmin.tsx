import React from "react";
import type { Session } from "@supabase/supabase-js";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "@limia/design-system";
import { supabase } from "@/lib/supabase";

const resolveIsAdmin = async () => {
  // Source of truth stays server-side (RLS function + profiles table).
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
    <div className="flex min-h-screen items-center justify-center bg-background p-4 text-foreground">
      <Card className="w-full max-w-md border-border/70 bg-card/95 shadow-xl backdrop-blur">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Acesso ao Dashboard</CardTitle>
          <CardDescription>Entre com sua conta administrativa.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="admin-email">Email</Label>
              <Input
                id="admin-email"
                type="email"
                autoComplete="email"
                placeholder="Email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-11 bg-input-background"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="admin-password">Senha</Label>
              <Input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                placeholder="Senha"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-11 bg-input-background"
                required
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={submitting || !email || !password}>
              {submitting ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </CardContent>
      </Card>
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
    <div className="flex min-h-screen items-center justify-center bg-background p-4 text-foreground">
      <Card className="w-full max-w-md border-border/70 bg-card/95 shadow-xl backdrop-blur">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Acesso negado</CardTitle>
          <CardDescription>
            Sua conta nao possui permissao de administrador para visualizar este dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" variant="outline" onClick={handleSignOut} disabled={signingOut}>
            {signingOut ? "Saindo..." : "Sair"}
          </Button>
        </CardContent>
      </Card>
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

    const allowed = await resolveIsAdmin();
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
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <p className="text-sm text-muted-foreground">Validando acesso...</p>
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


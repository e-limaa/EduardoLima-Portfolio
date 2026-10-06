import React from "react";
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
import {
  ApiError,
  AUTH_INVALIDATED_EVENT,
  getAuthSession,
  loginAdmin,
  logoutAdmin,
} from "@/lib/portfolio-api";

type AuthState = "checking" | "signed-out" | "allowed" | "denied" | "error";

const DashboardSignIn = ({ onSuccess }: { onSuccess: () => Promise<void> }) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await loginAdmin({ email: email.trim(), password });
      setPassword("");
      await onSuccess();
    } catch (loginError) {
      if (loginError instanceof ApiError && loginError.status === 403) {
        setError("Sua conta nao possui permissao de administrador.");
      } else if (loginError instanceof ApiError && loginError.status === 401) {
        setError("Falha no login. Verifique suas credenciais.");
      } else {
        setError("Nao foi possivel entrar agora. Tente novamente.");
      }
    } finally {
      setSubmitting(false);
    }
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

const DashboardUnauthorized = ({ onSignedOut }: { onSignedOut: () => Promise<void> }) => {
  const [signingOut, setSigningOut] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSignOut = async () => {
    setSigningOut(true);
    setError(null);
    try {
      await logoutAdmin();
      await onSignedOut();
    } catch (logoutError) {
      if (logoutError instanceof ApiError && logoutError.status === 401) {
        await onSignedOut();
      } else {
        setError("Nao foi possivel encerrar a sessao. Tente novamente.");
        await onSignedOut();
      }
    } finally {
      setSigningOut(false);
    }
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
        <CardContent className="flex flex-col gap-4">
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button className="w-full" variant="outline" onClick={handleSignOut} disabled={signingOut}>
            {signingOut ? "Saindo..." : "Sair"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export const RequireAdmin = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = React.useState<AuthState>("checking");
  const [authError, setAuthError] = React.useState<string | null>(null);
  const requestId = React.useRef(0);

  const refreshAuthState = React.useCallback(async () => {
    const currentRequest = ++requestId.current;
    setAuthState("checking");
    setAuthError(null);

    try {
      const { user } = await getAuthSession();
      if (requestId.current !== currentRequest) return;
      setAuthState(user?.is_admin === true ? "allowed" : "denied");
    } catch (error) {
      if (requestId.current !== currentRequest) return;

      if (error instanceof ApiError && error.status === 401) {
        setAuthState("signed-out");
      } else if (error instanceof ApiError && error.status === 403) {
        setAuthState("denied");
      } else {
        setAuthError("Nao foi possivel validar seu acesso. Verifique a conexao e tente novamente.");
        setAuthState("error");
      }
    }
  }, []);

  React.useEffect(() => {
    const handleAuthInvalidated = (event: Event) => {
      const status = (event as CustomEvent<{ status?: number }>).detail?.status;
      if (status !== 401 && status !== 403) {
        void refreshAuthState();
        return;
      }

      requestId.current += 1;
      setAuthError(null);
      setAuthState(status === 403 ? "denied" : "signed-out");
    };

    window.addEventListener(AUTH_INVALIDATED_EVENT, handleAuthInvalidated);
    void refreshAuthState();

    return () => {
      requestId.current += 1;
      window.removeEventListener(AUTH_INVALIDATED_EVENT, handleAuthInvalidated);
    };
  }, [refreshAuthState]);

  if (authState === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <p className="text-sm text-muted-foreground">Validando acesso...</p>
      </div>
    );
  }

  if (authState === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4 text-foreground">
        <Card className="w-full max-w-md border-border/70 bg-card/95 shadow-xl backdrop-blur">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Falha ao validar acesso</CardTitle>
            <CardDescription>{authError}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline" onClick={() => void refreshAuthState()}>
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (authState === "signed-out") {
    return <DashboardSignIn onSuccess={refreshAuthState} />;
  }

  if (authState === "denied") {
    return <DashboardUnauthorized onSignedOut={refreshAuthState} />;
  }

  return <>{children}</>;
};

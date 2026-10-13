import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, useReducedMotion } from "motion/react";
import { Hero } from "./components/landing/Hero";
import { Navbar } from "./components/landing/Navbar";
import { ThemeProvider, useTheme } from "./components/theme-provider";
import { LanguageProvider } from "./components/language-provider";
import { WelcomeScreen } from "./components/landing/WelcomeScreen";
import { Toaster } from "@limia/design-system-src/components/ui/sonner";
import { WELCOME_SCREEN_STORAGE_KEY } from "./lib/storage-keys";
import { readStorage, removeStorage, writeStorage } from "./lib/safe-storage";
import { backgroundAudio } from "./lib/background-audio";
import { useDeferredActivation } from "./lib/use-deferred-activation";
import posthog from "posthog-js";

// Lazy load pages for bundle splitting

const ProjectDetail = React.lazy(() => import("./components/landing/ProjectDetail").then(module => ({ default: module.ProjectDetail })));
const Dashboard = React.lazy(() => import("./pages/Dashboard").then(module => ({ default: module.Dashboard })));
const Newsletter = React.lazy(() => import("./pages/Newsletter").then(module => ({ default: module.Newsletter })));
const UxUiProposal = React.lazy(() => import("./pages/UxUiProposal").then(module => ({ default: module.UxUiProposal })));
const LandingSections = React.lazy(() => import("./components/landing/LandingSections").then(module => ({ default: module.LandingSections })));
const MouseSpotlight = React.lazy(() => import("./components/landing/MouseSpotlight").then(module => ({ default: module.MouseSpotlight })));
const AudioPlayer = React.lazy(() => import("./components/landing/AudioPlayer").then(module => ({ default: module.AudioPlayer })));
const CursorTrail = React.lazy(() => import("./components/ui/CursorTrail").then(module => ({ default: module.CursorTrail })));
const RequireAdmin = React.lazy(() => import("./components/auth/RequireAdmin").then(module => ({ default: module.RequireAdmin })));

const LandingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();

  const handleNavigate = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: shouldReduceMotion ? "auto" : "smooth" });
    }
  };

  const handleProjectClick = (slug: string) => {
    navigate(`/project/${slug}`);
  };

  useEffect(() => {
    if (!location.hash) return;

    const id = location.hash.slice(1);
    const scrollToHash = () => {
      const element = document.getElementById(id);
      if (!element) return false;

      element.scrollIntoView({ behavior: shouldReduceMotion ? "auto" : "smooth" });
      return true;
    };

    if (scrollToHash()) return;

    const timeoutId = window.setTimeout(scrollToHash, 150);
    return () => window.clearTimeout(timeoutId);
  }, [location.hash, shouldReduceMotion]);

  return (
    <>
      <Navbar onNavigate={handleNavigate} />
      <Hero />
      <React.Suspense fallback={null}>
        <LandingSections onProjectClick={handleProjectClick} />
      </React.Suspense>
    </>
  );
};

function AppShell({
  hasEntered,
  shouldSkipIntro,
  setHasEntered,
}: {
  hasEntered: boolean;
  shouldSkipIntro: boolean;
  setHasEntered: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const location = useLocation();
  const { theme } = useTheme();
  const isHomeRoute = location.pathname === "/";
  const isProposalRoute = location.pathname.startsWith("/proposta/");
  const deferredHomeChrome = useDeferredActivation({
    enabled: isHomeRoute,
    waitForLoad: true,
    delayMs: 1200,
  });
  const shouldMountAmbientChrome =
    !isProposalRoute &&
    (hasEntered || shouldSkipIntro) &&
    (!isHomeRoute || deferredHomeChrome);

  return (
    <>
      <Toaster theme={theme} />
      {/* ALTERADO: Aplicação de classes de tema dinâmicas 
        - bg-background e text-foreground mapeiam para as variáveis CSS que mudam com o tema 
        - transition-colors permite a troca suave entre dark/light mode
    */}
      <div className="min-h-screen w-full overflow-x-hidden bg-background font-sans text-foreground antialiased selection:bg-primary/20 transition-colors duration-300">
        <AnimatePresence>
          {!hasEntered && !shouldSkipIntro && <WelcomeScreen
              onEnter={() => {
                // Must run inside the click: iOS blocks audio started later.
                backgroundAudio.start();
                setHasEntered(true);
              }}
            />}
        </AnimatePresence>

        {shouldMountAmbientChrome && (
          <React.Suspense fallback={null}>
            <CursorTrail />
          </React.Suspense>
        )}
        {shouldMountAmbientChrome && (
          <React.Suspense fallback={null}>
            <MouseSpotlight />
          </React.Suspense>
        )}

        {!shouldSkipIntro && shouldMountAmbientChrome && (
          <React.Suspense fallback={null}>
            <AudioPlayer />
          </React.Suspense>
        )}

        <main className="z-10">
          <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center text-foreground">Carregando...</div>}>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/newsletter" element={<Newsletter />} />
              <Route path="/proposta/consultoria-ux-ui" element={<UxUiProposal />} />

              <Route path="/project/:slug" element={<ProjectDetail />} />
              <Route
                path="/dashboard"
                element={
                  <RequireAdmin>
                    <Dashboard />
                  </RequireAdmin>
                }
              />
            </Routes>
          </React.Suspense>
        </main>
      </div>
    </>
  );
}

export default function App() {
  const location = useLocation();
  const [hasEntered, setHasEntered] = useState(() => {
    if (typeof window === "undefined") return false;

    if (readStorage(WELCOME_SCREEN_STORAGE_KEY) === "true") {
      removeStorage(WELCOME_SCREEN_STORAGE_KEY);
    }

    return readStorage(WELCOME_SCREEN_STORAGE_KEY, "session") === "true";
  });

  useEffect(() => {
    posthog.capture("$pageview");
  }, [location.pathname]);

  // Dashboard skips the intro flow.
  const isDashboard = location.pathname.startsWith('/dashboard');
  const isProposal = location.pathname.startsWith('/proposta/');
  const shouldSkipIntro = isDashboard || isProposal;

  useEffect(() => {
    if (!hasEntered || typeof window === "undefined") return;

    writeStorage(WELCOME_SCREEN_STORAGE_KEY, "true", "session");
  }, [hasEntered]);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="portfolio-theme">
      <LanguageProvider defaultLanguage="en" storageKey="portfolio-language">
        <AppShell hasEntered={hasEntered} shouldSkipIntro={shouldSkipIntro} setHasEntered={setHasEntered} />
      </LanguageProvider>
    </ThemeProvider>
  );
}




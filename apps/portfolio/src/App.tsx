import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import { Hero } from "./components/landing/Hero";
import { Storytelling } from "./components/landing/Storytelling";
import { Projects } from "./components/landing/Projects";
import { Stack } from "./components/landing/Stack";
import { CTA } from "./components/landing/CTA";
import { MouseSpotlight } from "./components/landing/MouseSpotlight";
import { Navbar } from "./components/landing/Navbar";
import { BrandMarquee } from "./components/landing/BrandMarquee";
import { Services } from "./components/landing/Services";
import { ThemeProvider } from "./components/theme-provider";
import { LanguageProvider } from "./components/language-provider";
import { AudioPlayer } from "./components/landing/AudioPlayer";
import { WelcomeScreen } from "./components/landing/WelcomeScreen";
import { CursorTrail } from "./components/ui/CursorTrail";
import { RequireAdmin } from "./components/auth/RequireAdmin";
import { Toaster } from "@/components/ui/sonner";
import { WELCOME_SCREEN_STORAGE_KEY } from "./lib/storage-keys";

// Lazy load pages for bundle splitting

const ProjectDetail = React.lazy(() => import("./components/landing/ProjectDetail").then(module => ({ default: module.ProjectDetail })));
const Dashboard = React.lazy(() => import("./pages/Dashboard").then(module => ({ default: module.Dashboard })));
const Newsletter = React.lazy(() => import("./pages/Newsletter").then(module => ({ default: module.Newsletter })));

const LandingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
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

      element.scrollIntoView({ behavior: "smooth" });
      return true;
    };

    if (scrollToHash()) return;

    const timeoutId = window.setTimeout(scrollToHash, 150);
    return () => window.clearTimeout(timeoutId);
  }, [location.hash]);

  return (
    <>
      <Navbar onNavigate={handleNavigate} />
      <Hero />

      <BrandMarquee />

      <Projects onProjectClick={handleProjectClick} />

      <Services />

      <Storytelling />

      <Stack />

      <CTA />
    </>
  );
};

export default function App() {
  const location = useLocation();
  const [hasEntered, setHasEntered] = useState(() => {
    if (typeof window === "undefined") return location.hash.includes("figmacapture=");

    return localStorage.getItem(WELCOME_SCREEN_STORAGE_KEY) === "true" || location.hash.includes("figmacapture=");
  });

  // Dashboard skips the intro flow.
  const isDashboard = location.pathname.startsWith('/dashboard');
  const shouldSkipIntro = isDashboard;

  useEffect(() => {
    if (!hasEntered || typeof window === "undefined") return;

    localStorage.setItem(WELCOME_SCREEN_STORAGE_KEY, "true");
  }, [hasEntered]);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="portfolio-theme">
      <LanguageProvider defaultLanguage="en" storageKey="portfolio-language">
        <Toaster />
        {/* ALTERADO: Aplicação de classes de tema dinâmicas 
          - bg-background e text-foreground mapeiam para as variáveis CSS que mudam com o tema 
          - transition-colors permite a troca suave entre dark/light mode
      */}
        <div className="min-h-screen w-full bg-background text-foreground selection:bg-blue-500/30 overflow-x-hidden font-sans transition-colors duration-300">
          <AnimatePresence>
            {!hasEntered && !shouldSkipIntro && <WelcomeScreen onEnter={() => setHasEntered(true)} />}
          </AnimatePresence>

          <CursorTrail />
          <MouseSpotlight />

            {!shouldSkipIntro && <AudioPlayer shouldPlay={hasEntered} />}

          <main className="z-10" key={hasEntered ? "entered" : "loading"}>
            <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center text-foreground">Carregando...</div>}>
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/newsletter" element={<Newsletter />} />

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
      </LanguageProvider>
    </ThemeProvider>
  );
}




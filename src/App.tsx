import React, { useState } from "react";
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
import { DocsPageLoader } from "./components/docs-page-loader";
import { RequireAdmin } from "./components/auth/RequireAdmin";
import { Toaster } from "@/components/ui/sonner";

// Lazy load pages for bundle splitting

const ProjectDetail = React.lazy(() => import("./components/landing/ProjectDetail").then(module => ({ default: module.ProjectDetail })));
const StyleGuideLayout = React.lazy(() => import("./pages/styleguide/Layout").then(module => ({ default: module.StyleGuideLayout })));
const Dashboard = React.lazy(() => import("./pages/Dashboard").then(module => ({ default: module.Dashboard })));
import { Overview } from "./pages/styleguide/Overview";

// Legacy Views (Being replaced)
// import { SpacingView } from "./pages/styleguide/foundation/SpacingView";
// import { RadiusView } from "./pages/styleguide/foundation/RadiusView";

import { docsRegistry } from './app/docs/registry';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleNavigate = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleProjectClick = (slug: string) => {
    navigate(`/project/${slug}`);
  };



  return (
    <>
      <Navbar onNavigate={handleNavigate} />
      <div id="hero">
        <Hero />
      </div>

      <BrandMarquee />

      <div id="projects">
        <Projects

          onProjectClick={handleProjectClick}
        />
      </div>

      <div id="services">
        <Services />
      </div>

      <div id="story">
        <Storytelling />
      </div>

      <div id="stack">
        <Stack />
      </div>

      <div id="contact">
        <CTA />
      </div>
    </>
  );
};

export default function App() {
  const [hasEntered, setHasEntered] = useState(false);
  const location = useLocation();

  // Check if we are in the Design System or Dashboard to skip intros
  const isDesignSystem = location.pathname.startsWith('/design-system');
  const isDashboard = location.pathname.startsWith('/dashboard');
  const shouldSkipIntro = isDesignSystem || isDashboard;

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

          <main className="relative z-10" key={hasEntered ? "entered" : "loading"}>
            <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center text-foreground">Carregando...</div>}>
              <Routes location={location} key={location.pathname.startsWith('/design-system') ? 'ds' : location.pathname}>
                <Route path="/" element={<LandingPage />} />


                <Route path="/project/:slug" element={<ProjectDetail />} />
                <Route
                  path="/dashboard"
                  element={
                    <RequireAdmin>
                      <Dashboard />
                    </RequireAdmin>
                  }
                />

                {/* Design System Routes */}
                <Route path="/design-system" element={<StyleGuideLayout />}>
                  <Route index element={<Overview />} />



                  {/* Registry-driven Docs Routes */}
                  {docsRegistry.map((doc) => {
                    // relative path for child route: remove /design-system/ prefix
                    const relativePath = doc.href.replace('/design-system/', '');
                    // Removed direct Component destructuring
                    return (
                      <Route
                        key={doc.href}
                        path={relativePath}
                        element={<DocsPageLoader doc={doc} />}
                      />
                    );
                  })}

                  {/* Fallback */}
                  <Route path="*" element={<Overview />} />
                </Route>
              </Routes>
            </React.Suspense>
          </main>
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}

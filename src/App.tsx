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
import { ProjectsPage } from "./components/landing/ProjectsPage";
import { ProjectDetail } from "./components/landing/ProjectDetail";
import { ThemeProvider } from "./components/theme-provider";
import { LanguageProvider } from "./components/language-provider";
import { AudioPlayer } from "./components/landing/AudioPlayer";
import { WelcomeScreen } from "./components/landing/WelcomeScreen";
import { CursorTrail } from "./components/ui/CursorTrail";
import { DocsPageLoader } from "./components/docs-page-loader";
import { StyleGuideLayout } from "./pages/styleguide/Layout";
import { Overview } from "./pages/styleguide/Overview";

// Legacy Views (Being replaced)
// import { TypographyView } from "./pages/styleguide/foundation/TypographyView";
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

  const handleViewAllProjects = () => {
    navigate('/projects');
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
          onViewAll={handleViewAllProjects}
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
  const navigate = useNavigate();

  // Check if we are in the Design System to skip intros
  const isDesignSystem = location.pathname.startsWith('/design-system');

  return (
    <ThemeProvider defaultTheme="dark" storageKey="portfolio-theme">
      <LanguageProvider defaultLanguage="en" storageKey="portfolio-language">
        {/* ALTERADO: Aplicação de classes de tema dinâmicas 
          - bg-background e text-foreground mapeiam para as variáveis CSS que mudam com o tema 
          - transition-colors permite a troca suave entre dark/light mode
      */}
        <div className="min-h-screen w-full bg-background text-foreground selection:bg-blue-500/30 overflow-x-hidden font-sans transition-colors duration-300">
          <AnimatePresence>
            {!hasEntered && !isDesignSystem && <WelcomeScreen onEnter={() => setHasEntered(true)} />}
          </AnimatePresence>

          <CursorTrail />
          <MouseSpotlight />

          {!isDesignSystem && <AudioPlayer shouldPlay={hasEntered} />}

          <main className="relative z-10" key={hasEntered ? "entered" : "loading"}>
            <Routes location={location} key={location.pathname.startsWith('/design-system') ? 'ds' : location.pathname}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/projects" element={<ProjectsPage onBack={() => navigate(-1)} onProjectClick={(slug) => navigate(`/project/${slug}`)} />} />
              <Route path="/project/:slug" element={<ProjectDetail />} />

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
          </main>
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}

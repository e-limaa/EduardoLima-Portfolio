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
import { AudioPlayer } from "./components/landing/AudioPlayer";
import { WelcomeScreen } from "./components/landing/WelcomeScreen";
import { CursorTrail } from "./components/ui/CursorTrail";
import { StyleGuideLayout } from "./pages/styleguide/Layout";
import { Overview } from "./pages/styleguide/Overview";
import { ColorsView } from "./pages/styleguide/foundation/ColorsView";
import { TypographyView } from "./pages/styleguide/foundation/TypographyView";
import { SpacingView } from "./pages/styleguide/foundation/SpacingView";
import { RadiusView } from "./pages/styleguide/foundation/RadiusView";
import { ButtonsView } from "./pages/styleguide/components/ButtonsView";
import InputsView from "./pages/styleguide/components/InputsView";
import CardsView from "./pages/styleguide/components/CardsView";
import BadgesView from "./pages/styleguide/components/BadgesView";

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
              <Route path="foundation/colors" element={<ColorsView />} />
              <Route path="foundation/typography" element={<TypographyView />} />
              <Route path="foundation/spacing" element={<SpacingView />} />
              <Route path="foundation/radius" element={<RadiusView />} />
              <Route path="components/buttons" element={<ButtonsView />} />
              <Route path="components/inputs" element={<InputsView />} />
              <Route path="components/cards" element={<CardsView />} />
              <Route path="components/badges" element={<BadgesView />} />
              {/* Fallback for other routes not yet implemented */}
              <Route path="*" element={<Overview />} />
            </Route>
          </Routes>
        </main>
      </div>
    </ThemeProvider>
  );
}

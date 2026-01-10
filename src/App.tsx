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

// Docs Imports
const DocsInstallation = React.lazy(() => import('./app/docs/getting-started/installation.mdx'));
// Unused placeholders can be kept if we plan to use them, but linter complains.
// Let's comment them out or remove them. For now, removing unused to silence linter.
// const DocsUsage = React.lazy(() => import('./app/docs/getting-started/usage-basics.mdx'));
// const DocsColors = React.lazy(() => import('./app/docs/foundations/colors.mdx'));
// const DocsTypography = React.lazy(() => import('./app/docs/foundations/typography.mdx'));
// const DocsSpacing = React.lazy(() => import('./app/docs/foundations/spacing.mdx'));
// const DocsRadius = React.lazy(() => import('./app/docs/foundations/radius.mdx'));
const DocsShadow = React.lazy(() => import('./app/docs/foundations/shadow.mdx'));
const DocsA11y = React.lazy(() => import('./app/docs/foundations/accessibility.mdx'));

// const DocsCompOverview = React.lazy(() => import('./app/docs/components/overview.mdx'));
// const DocsButton = React.lazy(() => import('./app/docs/components/button.mdx'));
// const DocsInput = React.lazy(() => import('./app/docs/components/input.mdx'));
// const DocsCard = React.lazy(() => import('./app/docs/components/card.mdx'));
const DocsVersioning = React.lazy(() => import('./app/docs/governance/versioning.mdx'));
const DocsLifecycle = React.lazy(() => import('./app/docs/governance/lifecycle.mdx'));
const DocsContributing = React.lazy(() => import('./app/docs/governance/contributing.mdx'));

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

              {/* Getting Started */}
              <Route path="installation" element={<DocsInstallation />} />

              {/* Foundation - Mix of old and new */}
              <Route path="foundation/colors" element={<ColorsView />} /> {/* Keep visual view for now */}
              <Route path="foundation/typography" element={<TypographyView />} />
              <Route path="foundation/spacing" element={<SpacingView />} />
              <Route path="foundation/radius" element={<RadiusView />} />

              {/* Foundation - New MDX placeholders */}
              <Route path="foundation/shadows" element={<DocsShadow />} />
              <Route path="foundation/accessibility" element={<DocsA11y />} />

              {/* Components */}
              <Route path="components/buttons" element={<ButtonsView />} /> {/* Keep visual view */}
              <Route path="components/inputs" element={<InputsView />} />
              <Route path="components/cards" element={<CardsView />} />
              <Route path="components/badges" element={<BadgesView />} />

              {/* Governance */}
              <Route path="governance/versioning" element={<DocsVersioning />} />
              <Route path="governance/lifecycle" element={<DocsLifecycle />} />
              <Route path="governance/contributing" element={<DocsContributing />} />

              {/* Fallback */}
              <Route path="*" element={<Overview />} />
            </Route>
          </Routes>
        </main>
      </div>
    </ThemeProvider>
  );
}

import React, { useState, useEffect } from "react";
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

export default function App() {
  const [view, setView] = useState<'home' | 'projects' | 'project-detail'>('home');
  const [previousView, setPreviousView] = useState<'home' | 'projects'>('home');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [hasEntered, setHasEntered] = useState(false);

  const handleNavigate = (id: string) => {
    if (view !== 'home') {
      setView('home');
      // Allow time for re-render before scrolling
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleProjectClick = (id: string) => {
    setPreviousView(view === 'project-detail' ? previousView : view as 'home' | 'projects');
    setSelectedProjectId(id);
    setView('project-detail');
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    // Scroll to top when view changes to projects
    if (view === 'projects') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [view]);

  // Render logic
  const renderContent = () => {
    switch (view) {
      case 'project-detail':
        return (
          <ProjectDetail
            projectId={selectedProjectId || 1}
            onBack={() => setView(previousView)}
            onNext={(id) => setSelectedProjectId(id)}
            onPrev={(id) => setSelectedProjectId(id)}
          />
        );
      case 'projects':
        return (
          <ProjectsPage
            onBack={() => setView('home')}
            onProjectClick={handleProjectClick}
          />
        );
      case 'home':
      default:
        return (
          <>
            <div id="hero">
              <Hero />
            </div>

            <BrandMarquee />

            <div id="projects">
              <Projects
                onViewAll={() => setView('projects')}
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
    }
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="portfolio-theme">
      {/* ALTERADO: Aplicação de classes de tema dinâmicas 
          - bg-background e text-foreground mapeiam para as variáveis CSS que mudam com o tema 
          - transition-colors permite a troca suave entre dark/light mode
      */}
      <div className="min-h-screen w-full bg-background text-foreground selection:bg-blue-500/30 overflow-x-hidden font-sans transition-colors duration-300">
        <AnimatePresence>
          {!hasEntered && <WelcomeScreen onEnter={() => setHasEntered(true)} />}
        </AnimatePresence>

        <MouseSpotlight />

        {/* Navbar only visible on Home and Projects list, not on Detail (Detail has its own nav) */}
        {view !== 'project-detail' && <Navbar onNavigate={handleNavigate} />}

        <AudioPlayer shouldPlay={hasEntered} />

        <main className="relative z-10" key={hasEntered ? "entered" : "loading"}>
          {renderContent()}
        </main>
      </div>
    </ThemeProvider>
  );
}

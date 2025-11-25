import React, { useState, useEffect } from "react";
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

export default function App() {
  const [view, setView] = useState<'home' | 'projects' | 'project-detail'>('home');
  const [previousView, setPreviousView] = useState<'home' | 'projects'>('home');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

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
            projectId={selectedProjectId || ""}
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
    <div className="bg-black min-h-screen w-full text-zinc-100 selection:bg-blue-500/30 overflow-x-hidden font-sans">
      <MouseSpotlight />

      {/* Navbar only visible on Home and Projects list, not on Detail (Detail has its own nav) */}
      {view !== 'project-detail' && <Navbar onNavigate={handleNavigate} />}

      <main className="relative z-10">
        {renderContent()}
      </main>
    </div>
  );
}

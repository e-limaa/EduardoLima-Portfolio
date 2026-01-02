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

        <AudioPlayer shouldPlay={hasEntered} />

        <main className="relative z-10" key={hasEntered ? "entered" : "loading"}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/projects" element={<ProjectsPage onBack={() => navigate(-1)} onProjectClick={(slug) => navigate(`/project/${slug}`)} />} />
            <Route path="/project/:slug" element={<ProjectDetail />} />
          </Routes>
        </main>
      </div>
    </ThemeProvider>
  );
}

import React from "react";
import { motion } from "motion/react";
import {
  TrueFocus,
  InteractiveGrid,
  LiquidEther,
  Badge,
  Button,
} from "@limia/design-system";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { ChatWidget } from "./ChatWidget";
import { useLanguage } from "../language-provider";

export const Hero = () => {
  const [videoFailed, setVideoFailed] = React.useState(false);

  const { t } = useLanguage();

  const handleScrollToProjects = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById("projects");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="relative isolate min-h-screen flex items-center justify-center overflow-hidden pt-16 pb-20 md:pt-0 md:pb-0 perspective-[1000px]"
    >
      <div className="absolute inset-0 z-0 pointer-events-none">
        <LiquidEther
          autoIntensity={1.1}
          autoSpeed={0.7}
          colors={[
            "#2563eb",
            "#5089fb",
            "#0735c0",
          ]}
          autoDemo
          cursorSize={200}
          isBounce
          isViscous
          mouseForce={8}
          resolution={0.5}
          viscous={100}
          className="opacity-75"
        />
        <InteractiveGrid variant="subtle" className="opacity-75" />
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-12"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="fixed top-6 left-0 right-0 z-50 pointer-events-none"
      >
        <div className="w-full max-w-[2000px] mx-auto px-4 md:px-8 xl:px-12 text-center lg:text-left">
          <span className="text-heading-sm font-semibold text-foreground tracking-tight pointer-events-auto inline-block">
            Eduardo Lima<span className="text-primary">.</span>
          </span>
        </div>
      </motion.div>

      <div className="w-full max-w-[2000px] mx-auto px-4 md:px-8 xl:px-12 z-10 grid grid-cols-1 lg:grid-cols-12 gap-2 lg:gap-6 items-center relative">
        <div className="col-span-1 lg:col-span-3 relative h-[400px] lg:h-[600px] flex items-end justify-center z-10 order-1 lg:order-2 pointer-events-none mt-4 lg:mt-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative z-40 isolate lg:absolute lg:bottom-[-50px] lg:-ml-12 w-[250px] md:w-[315px] lg:w-[360px] xl:w-[405px]"
          >
            <img
              src="/assets/images/Edu-image.webp"
              alt="Eduardo Lima"
              width={548}
              height={981}
              className="block h-full w-full object-contain drop-shadow-2xl md:hidden"
            />

            {!videoFailed ? (
              <video
                src="https://audio-assets.vercel.app/Edu-video.webm"
                autoPlay
                loop
                muted
                playsInline
                onError={() => setVideoFailed(true)}
                className="relative z-40 hidden h-auto w-full object-contain drop-shadow-2xl md:block"
              />
            ) : (
              <img
                src="/assets/images/Edu-image.webp"
                alt="Eduardo Lima"
                width={548}
                height={981}
                className="relative z-40 hidden h-full w-full object-contain drop-shadow-2xl md:block"
              />
            )}
          </motion.div>
        </div>

        <div className="col-span-1 lg:col-span-5 flex flex-col gap-6 text-center lg:text-left pointer-events-none z-20 order-2 lg:order-1 -mt-20 lg:mt-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="flex justify-center lg:justify-start"
          >
            <Badge
              variant="secondary"
              className="mb-4 text-body-sm font-medium px-4 py-1"
            >
              {t("hero.badge")}
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-display-xl md:text-display-2xl font-bold tracking-tighter text-foreground leading-[0.9] pointer-events-auto"
          >
            <TrueFocus
              priority
              blurAmount={6}
              animationDuration={0.55}
              pauseBetweenAnimations={2.2}
              className="flex flex-col items-center lg:items-start"
              itemClassName="-mb-3 pb-2 md:-mb-6"
              items={[
                {
                  key: "hero-word-1",
                  className: "pr-2",
                  content: (
                    <span className="block bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text leading-[1.0] text-transparent transition-colors duration-500 md:leading-[1.15]">
                      {t("hero.word1")}
                    </span>
                  ),
                },
                {
                  key: "hero-word-2",
                  content: (
                    <span className="block bg-gradient-to-r from-muted-foreground via-foreground/80 to-muted-foreground/70 bg-clip-text leading-[1.0] text-transparent md:leading-[1.15]">
                      {t("hero.word2")}
                    </span>
                  ),
                },
                {
                  key: "hero-word-3",
                  content: (
                    <span className="block bg-gradient-to-r from-primary to-primary/70 bg-clip-text leading-[1.0] text-transparent md:leading-[1.15]">
                      {t("hero.word3")}
                    </span>
                  ),
                },
              ]}
            />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-8 text-body-lg text-muted-foreground max-w-lg mx-auto lg:mx-0 font-light pointer-events-auto"
          >
            {t("hero.description")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap gap-4 justify-center lg:justify-start mt-4 pointer-events-auto mb-10 lg:mb-0"
          >
            <Button asChild size="lg" className="shadow-lg">
              <a href="#projects" onClick={handleScrollToProjects}>
                {t("hero.cta")}
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link to="/newsletter" state={{ fromInternal: true }}>
                {t("newsletter.trigger")}
              </Link>
            </Button>
          </motion.div>
        </div>

        <div className="col-span-1 lg:col-span-4 relative flex items-center justify-center lg:justify-end h-full pointer-events-auto min-h-[400px] order-3 lg:order-3">
          <motion.div
            className="relative z-20 w-full max-w-md"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <ChatWidget />
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ delay: 1.5, duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          Scroll
        </span>
        <div className="h-12 w-px bg-gradient-to-b from-border to-transparent"></div>
      </motion.div>
    </section>
  );
};

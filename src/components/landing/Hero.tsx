import React from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ChatWidget } from "./ChatWidget";
import { TextReveal } from "./TextReveal";
import { InteractiveGrid } from "./InteractiveGrid";
import { ArrowRight } from "lucide-react";

export const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 pb-20 md:pt-0 md:pb-0 perspective-[1000px]"
    >
      {/* Interactive Background Grid */}
      <InteractiveGrid />

      {/* Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div
          style={{ y: y1 }}
          className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse"
        />
        <motion.div
          style={{ y: y2 }}
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-zinc-600/10 rounded-full blur-[120px] mix-blend-screen"
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      {/* Fixed Header (Eduardo Lima) */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="fixed top-6 left-0 right-0 z-50 pointer-events-none"
      >
        <div className="container mx-auto px-4 lg:px-12 text-center lg:text-left">
          <span className="text-xl font-bold text-foreground tracking-tight pointer-events-auto inline-block">
            Eduardo Lima<span className="text-blue-600 dark:text-blue-500">.</span>
          </span>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 lg:px-12 z-10 grid grid-cols-1 lg:grid-cols-12 gap-2 lg:gap-6 items-center relative">

        {/* Video/Avatar Column */}
        {/* Order: Mobile 1, Desktop 2 (Center) */}
        <div className="col-span-1 lg:col-span-3 relative h-[400px] lg:h-[600px] flex items-end justify-center z-10 order-1 lg:order-2 pointer-events-none mt-4 lg:mt-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative lg:absolute lg:bottom-[-50px] lg:-ml-12 w-[250px] md:w-[315px] lg:w-[360px] xl:w-[405px]"
          >
            {/* Mobile Fallback Image (PNG) */}
            <img
              src="https://audio-assets.vercel.app/Edu-image.png"
              alt="Eduardo Lima"
              className="w-full h-auto object-contain drop-shadow-[0_0_60px_rgba(37,99,235,0.25)] block md:hidden"
            />

            {/* Desktop Video (WebM) */}
            <video
              src="https://audio-assets.vercel.app/Edu-video.webm"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-auto object-contain drop-shadow-[0_0_60px_rgba(37,99,235,0.25)] hidden md:block"
            />
          </motion.div>
        </div>

        {/* Text Content Column */}
        {/* Order: Mobile 2, Desktop 1 (Left) */}
        <div className="col-span-1 lg:col-span-5 flex flex-col gap-6 text-center lg:text-left pointer-events-none z-20 order-2 lg:order-1 -mt-20 lg:mt-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="flex justify-center lg:justify-start"
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur-sm hover:bg-black/10 dark:hover:bg-white/10 transition-colors mb-4 pointer-events-auto">
              <span className="text-sm text-zinc-600 dark:text-zinc-300 font-medium">Senior UI/UX</span>
            </div>
          </motion.div>

          <div className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-foreground leading-[0.9] pointer-events-auto">
            <TextReveal delay={0.1} className="-mb-3 md:-mb-6 pb-2">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 to-zinc-500 hover:to-zinc-900 dark:from-white dark:to-zinc-400 dark:hover:to-white transition-colors duration-500 pr-2 leading-[1.0] md:leading-[1.15]">Curiosidade.</span>
            </TextReveal>
            <TextReveal delay={0.2} className="-mb-3 md:-mb-6 pb-2">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-zinc-700 via-zinc-500 to-zinc-300 dark:from-zinc-200 dark:via-zinc-400 dark:to-zinc-600 leading-[1.0] md:leading-[1.15]">Design.</span>
            </TextReveal>
            <TextReveal delay={0.3} className="-mb-3 md:-mb-6 pb-2">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-700 dark:from-blue-400 dark:to-blue-600 leading-[1.0] md:leading-[1.15]">Impacto.</span>
            </TextReveal>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0 font-light pointer-events-auto"
          >
            Unindo a precisão do design system com a audácia da inteligência artificial.
            Criando interfaces que respiram e contam histórias.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap gap-4 justify-center lg:justify-start mt-4 pointer-events-auto mb-10 lg:mb-0"
          >
            <a
              href="#projects"
              className="flex items-center gap-2 px-6 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-medium transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)]"
            >
              Ver Projetos
              <ArrowRight className="w-4 h-4" />
            </a>

          </motion.div>
        </div>

        {/* Chat Widget Column */}
        {/* Order: Mobile 3, Desktop 3 (Right) */}
        <div className="col-span-1 lg:col-span-4 relative flex items-center justify-center lg:justify-end h-full pointer-events-auto min-h-[400px] order-3 lg:order-3">
          {/* Floating Chat UI */}
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

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ delay: 1.5, duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-zinc-500 to-transparent"></div>
      </motion.div>

    </section>
  );
};

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { ArrowUpRight, Fingerprint, Cpu, Sparkles, Crown } from "lucide-react";

const timelineData = [
  {
    id: 1,
    year: "ORIGIN",
    title: "Manual",
    subtitle: "A precisão do Craft",
    description: "Cresci em chão de fábrica. Onde milímetros importam. Essa obsessão por detalhes migrou do torno mecânico para o pixel perfeito.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80",
    icon: Fingerprint,
    color: "text-zinc-400",
    bgGradient: "from-zinc-500/20 to-transparent"
  },
  {
    id: 2,
    year: "CODE",
    title: "Lógica",
    subtitle: "Design System & Code",
    description: "Para desenhar o impossível, precisei aprender a construir. O código virou minha segunda caneta. Front-end não é barreira, é ferramenta.",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80",
    icon: Cpu,
    color: "text-blue-500",
    bgGradient: "from-blue-500/20 to-transparent"
  },
  {
    id: 3,
    year: "FUSION",
    title: "AI + UX",
    subtitle: "Inteligência Aumentada",
    description: "Integro fluxos de IA generativa no processo criativo. O designer do futuro não desenha telas, ele orquestra sistemas inteligentes.",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80",
    icon: Sparkles,
    color: "text-zinc-300",
    bgGradient: "from-zinc-400/20 to-transparent"
  },
  {
    id: 4,
    year: "LEAD",
    title: "Visão",
    subtitle: "Impacto & Liderança",
    description: "Design sem negócio é arte. Meu foco hoje é liderar times que movem ponteiros de conversão, retenção e valor de mercado.",
    image: "https://images.unsplash.com/photo-1535378437268-5f75d21683af?w=800&q=80",
    icon: Crown,
    color: "text-blue-400",
    bgGradient: "from-blue-400/20 to-transparent"
  }
];

export const Storytelling = () => {
  const [activeId, setActiveId] = useState<number>(1);

  return (
    <section className="relative py-12 md:py-24 bg-background overflow-hidden flex flex-col items-center justify-center transition-colors duration-300">
      
      {/* Header Minimalista */}
      <div className="container mx-auto px-4 lg:px-12 mb-12 md:mb-24 flex justify-between items-end relative z-10">
         <div>
            <span className="text-xs font-mono text-muted-foreground tracking-widest uppercase mb-2 block">
                03 — TIMELINE
            </span>
            <h2 className="text-4xl md:text-6xl font-bold text-foreground">
                DNA Criativo
            </h2>
         </div>
         <div className="hidden md:block text-right">
             <p className="text-muted-foreground text-sm max-w-[200px]">
                 Explore as fases que moldaram minha metodologia.
             </p>
         </div>
      </div>

      {/* Vertical Timeline Container */}
      <div className="container mx-auto px-4 lg:px-12 relative z-10 max-w-5xl">
        {/* Central Vertical Line */}
        <div className="absolute left-8 lg:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-zinc-300 dark:via-zinc-800 to-transparent transform -translate-x-1/2" />

        {timelineData.map((item, index) => {
          const isEven = index % 2 === 0;
          
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: index * 0.2 }}
              className={`relative flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-0 mb-12 md:mb-24 last:mb-0 group`}
            >
              {/* Desktop: Left Content (Even items) or Right Content (Odd items) */}
              {/* Mobile: Always content on right of line */}
              
              {/* Left Side (Desktop) */}
              <div className={`w-full lg:w-1/2 lg:pr-16 ${isEven ? 'lg:text-right' : 'lg:order-3 lg:pl-16 text-left'}`}>
                 <div className={`pl-16 lg:pl-0 ${isEven ? '' : 'lg:text-left'}`}>
                    <span className={`text-sm font-mono font-bold tracking-widest uppercase mb-2 block ${item.color}`}>
                        {item.year}
                    </span>
                    <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                        {item.title}
                    </h3>
                    <h4 className="text-lg text-muted-foreground mb-4 font-light">
                        {item.subtitle}
                    </h4>
                    <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                        {item.description}
                    </p>
                 </div>
              </div>

              {/* Center Point */}
              <div className="absolute left-8 lg:left-1/2 transform -translate-x-1/2 flex items-center justify-center z-20">
                 <div className={`w-12 h-12 rounded-full border border-zinc-200 dark:border-zinc-800 bg-background flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-[0_0_30px_-5px_rgba(0,0,0,0.5)] dark:shadow-none ${item.color}`}>
                    <div className={`absolute inset-0 bg-current opacity-10 rounded-full blur-lg group-hover:opacity-30 transition-opacity duration-500`} />
                    <item.icon className="w-5 h-5" />
                 </div>
              </div>

              {/* Right Side (Desktop) - Visual/Image */}
              <div className={`w-full lg:w-1/2 lg:pl-16 ${isEven ? 'lg:order-3 lg:pl-16' : 'lg:pr-16 lg:text-right'}`}>
                  <div className={`relative ml-16 lg:ml-0 rounded-2xl overflow-hidden border border-zinc-200 dark:border-white/10 aspect-video md:aspect-[4/3] group-hover:border-blue-500/50 dark:group-hover:border-white/20 transition-colors duration-500 shadow-sm dark:shadow-none`}>
                      <div className={`absolute inset-0 bg-gradient-to-t ${item.bgGradient} opacity-20 mix-blend-soft-light z-10`} />
                      <ImageWithFallback
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover opacity-80 dark:opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100 dark:group-hover:opacity-70 group-hover:scale-105 transition-all duration-700"
                      />
                  </div>
              </div>

            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

import { motion } from "motion/react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { ScanSearch, Workflow, Code2, Zap } from "lucide-react";
import { SectionHeader } from "@antigravity/ds";

const timelineData = [
  {
    id: 1,
    year: "Método de descoberta",
    title: "Curiosidade Aplicada",
    description: "Minha criatividade começa com perguntas. Entender o problema, explorar possibilidades e questionar soluções prontas faz parte do meu processo. Curiosidade, para mim, não é estética — é ferramenta para chegar em decisões mais conscientes.",
    image: "/assets/images/curiosidade-aplicada.webp",
    icon: ScanSearch,
    color: "text-zinc-400",
    bgGradient: "from-zinc-500/20 to-transparent"
  },
  {
    id: 2,
    year: "Estrutura antes da tela",
    title: "Pensamento Sistêmico",
    description: "Encaro produtos digitais como sistemas vivos. Cada decisão de interface impacta fluxos, regras de negócio, dados e evolução futura. Por isso, penso UX além das telas — como uma estrutura que precisa escalar, se manter e evoluir.",
    image: "/assets/images/pensamento-sistemico.webp",
    icon: Workflow,
    color: "text-blue-500",
    bgGradient: "from-blue-500/20 to-transparent"
  },
  {
    id: 3,
    year: "Design viável",
    title: "Execução com Consciência Técnica",
    description: "Entender limitações técnicas faz parte da criação. Conhecimento em frontend, lógica e automações me ajuda a projetar soluções viáveis, reduzir fricção com desenvolvimento e acelerar entregas sem perder qualidade.",
    image: "/assets/images/execucao-tecnica.webp",
    icon: Code2,
    color: "text-zinc-300",
    bgGradient: "from-zinc-400/20 to-transparent"
  },
  {
    id: 4,
    year: "Aprendizado constante",
    title: "Evolução Contínua",
    description: "Meu processo está sempre em movimento. Exploro novas tecnologias, IA e ferramentas não por tendência, mas para ampliar autonomia e elevar o nível das entregas. Aprender rápido virou parte essencial do meu jeito de trabalhar.",
    image: "/assets/images/evolucao-continua.webp",
    icon: Zap,
    color: "text-blue-400",
    bgGradient: "from-blue-400/20 to-transparent"
  }
];

export const Storytelling = () => {
  return (
    <section className="relative py-12 md:py-24 bg-background overflow-hidden flex flex-col items-center justify-center transition-colors duration-300">

      {/* Header Minimalista */}
      <div className="container mx-auto px-4 lg:px-12 mb-12 md:mb-24 relative z-10">
        <SectionHeader
          title="DNA Criativo"
          index="03"
          label="TIMELINE"
          description="Explore as fases que moldaram minha metodologia."
        />
      </div>

      {/* Vertical Timeline Container */}
      <div className="container mx-auto px-4 lg:px-12 relative z-10">
        {/* Central Vertical Line */}
        <div className="absolute left-8 lg:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-zinc-300 dark:via-zinc-800 to-transparent transform -translate-x-1/2" />

        {timelineData.map((item, index) => {
          const isEven = index % 2 === 0;

          return (
            <motion.div
              key={item.id}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-20%" }}
              className={`relative flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-0 mb-12 md:mb-24 last:mb-0 group`}
            >
              {/* Desktop: Left Content (Even items) or Right Content (Odd items) */}
              {/* Mobile: Always content on right of line */}

              {/* Left Side (Text Logic) */}
              {/* 
                  If Even: Text is on Left. Animate from Left (-x).
                  If Odd: Text is on Right. Animate from Right (+x).
              */}
              <div className={`w-full lg:w-1/2 ${isEven ? 'lg:pr-20 lg:text-right' : 'lg:order-3 lg:pl-20 text-left'}`}>
                <motion.div
                  variants={{
                    initial: { x: isEven ? -50 : 50, opacity: 0 },
                    animate: { x: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } }
                  }}
                  className={`pl-20 lg:pl-0 ${isEven ? '' : 'lg:text-left'}`}
                >
                  <span className={`text-sm font-mono font-bold tracking-widest uppercase mb-2 block ${item.color}`}>
                    {item.year}
                  </span>
                  <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-sm md:text-base whitespace-pre-line">
                    {item.description}
                  </p>
                </motion.div>
              </div>

              {/* Center Point */}
              <div className="absolute left-8 lg:left-1/2 transform -translate-x-1/2 flex items-center justify-center z-20">
                <motion.div
                  variants={{
                    initial: { scale: 0, opacity: 0 },
                    animate: { scale: 1.1, opacity: 1, transition: { duration: 0.5, delay: 0.2 } }
                  }}
                  className={`w-12 h-12 rounded-full border border-zinc-200 dark:border-zinc-800 bg-background flex items-center justify-center shadow-[0_0_30px_-5px_rgba(0,0,0,0.5)] dark:shadow-none ${item.color}`}
                >
                  <motion.div
                    variants={{
                      initial: { opacity: 0 },
                      animate: { opacity: 0.3, transition: { delay: 0.4, duration: 0.5 } }
                    }}
                    className={`absolute inset-0 bg-current rounded-full blur-lg`}
                  />
                  <item.icon className="w-5 h-5" />
                </motion.div>
              </div>

              {/* Right Side (Image Logic) */}
              {/* 
                  If Even: Image is on Right. Animate from Right (+x).
                  If Odd: Image is on Left. Animate from Left (-x).
              */}
              <div className={`w-full lg:w-1/2 ${isEven ? 'lg:order-3 lg:pl-20' : 'lg:pr-20 lg:text-right'}`}>
                <motion.div
                  variants={{
                    initial: { x: isEven ? 50 : -50, opacity: 0, borderColor: "rgba(255,255,255,0.1)" },
                    animate: { x: 0, opacity: 1, borderColor: "rgba(59, 130, 246, 0.5)", transition: { duration: 0.8, ease: "easeOut" } }
                  }}
                  className={`relative ml-20 lg:ml-0 rounded-2xl overflow-hidden border aspect-[3/2] transition-colors duration-500 shadow-sm dark:shadow-none bg-zinc-900/5`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-t ${item.bgGradient} opacity-20 mix-blend-soft-light z-10`} />
                  <motion.div
                    variants={{
                      initial: { filter: "grayscale(100%)", opacity: 0.4, scale: 1 },
                      animate: { filter: "grayscale(0%)", opacity: 1, scale: 1.05, transition: { duration: 0.8 } }
                    }}
                    className="w-full h-full"
                  >
                    <ImageWithFallback
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      decoding="async"
                      width={800}
                      height={533}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                </motion.div>
              </div>

            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

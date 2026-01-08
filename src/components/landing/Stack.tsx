import React from "react";
import { motion } from "motion/react";
import { Figma, Code, Database, Layers, Zap, PenTool } from "lucide-react";
import { TextReveal } from "./TextReveal";
import { InteractiveGrid } from "./InteractiveGrid";

const tools = [
    { name: "Figma", icon: Figma, desc: "Prototipagem avançada e Design Systems" },
    { name: "React / Next.js", icon: Code, desc: "Componentização e interfaces vivas" },
    { name: "AI Integration", icon: Zap, desc: "Midjourney, ChatGPT, n8n" },
    { name: "Design Systems", icon: Layers, desc: "Escalabilidade e consistência" },
    { name: "Automation", icon: Database, desc: "Workflows inteligentes" },
    { name: "Adobe Suite", icon: PenTool, desc: "Visual robusto e edição" },
];

export const Stack = () => {
    return (
        <section className="py-16 md:py-32 relative overflow-hidden bg-background transition-colors duration-300">
            <InteractiveGrid variant="subtle" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

            <div className="container mx-auto px-4 lg:px-12 relative z-10">
                <div className="mb-10 md:mb-20 border-b border-zinc-200 dark:border-white/10 pb-10 flex flex-col md:flex-row justify-between items-end gap-6">
                    <div>
                        <TextReveal>
                            <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-2">Arsenal Tecnológico</h2>
                        </TextReveal>
                        <p className="text-muted-foreground text-lg w-full mt-4">
                            Ferramentas que potencializam minha criatividade e eficiência.
                        </p>
                    </div>
                    <div className="text-right hidden md:block">
                        <span className="text-muted-foreground font-mono text-sm">04 — STACK</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {tools.map((tool, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            whileHover={{ y: -10, scale: 1.02 }}
                            className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/5 backdrop-blur-sm rounded-2xl p-8 flex flex-col items-start text-left group hover:border-blue-500/30 transition-colors duration-500 cursor-default relative overflow-hidden shadow-sm dark:shadow-none"
                        >
                            <div className="absolute inset-0 bg-gradient-to-b from-zinc-100 to-transparent dark:from-white/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                            <motion.div
                                animate={{ y: [0, -5, 0] }}
                                transition={{ duration: 3 + Math.random(), repeat: Infinity, ease: "easeInOut" }}
                                className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-black/40 flex items-center justify-center mb-6 text-muted-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-all duration-500"
                            >
                                <tool.icon className="w-8 h-8" />
                            </motion.div>
                            <h3 className="text-xl font-bold text-foreground mb-3 relative z-10">{tool.name}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed relative z-10 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">{tool.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

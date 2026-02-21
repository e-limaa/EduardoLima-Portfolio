import React from "react";
import { motion } from "motion/react";
import { Figma, Code, Database, Layers, Zap, PenTool } from "lucide-react";
import { SectionHeader, Section, Card, CardContent, CardTitle, CardDescription } from "@antigravity/ds";
import { useLanguage } from "../language-provider";

const tools = [
    { name: "Figma", icon: Figma, translationKey: "stack.tool.figma" },
    { name: "React / Next.js", icon: Code, translationKey: "stack.tool.react" },
    { name: "AI Integration", icon: Zap, translationKey: "stack.tool.ai" },
    { name: "Design Systems", icon: Layers, translationKey: "stack.tool.ds" },
    { name: "Automation", icon: Database, translationKey: "stack.tool.automation" },
    { name: "Adobe Suite", icon: PenTool, translationKey: "stack.tool.adobe" },
];

export const Stack = () => {
    const { t } = useLanguage();

    return (
        <Section className="py-16 md:py-32">
            <SectionHeader
                title={t("stack.title")}
                description={t("stack.description")}
                index="04"
                label="STACK"
            />

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {tools.map((tool, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        whileHover={{ y: -10, scale: 1.02 }}
                        className="group"
                    >
                        <Card className="h-full bg-white dark:bg-white/5 border-zinc-200 dark:border-white/5 backdrop-blur-sm hover:border-blue-500/30 transition-colors duration-500 relative overflow-hidden shadow-sm dark:shadow-none">
                            <div className="absolute inset-0 bg-gradient-to-b from-zinc-100 to-transparent dark:from-white/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                            <CardContent className="p-8 flex flex-col items-start h-full relative z-10">
                                <motion.div
                                    animate={{ y: [0, -5, 0] }}
                                    transition={{ duration: 3 + Math.random(), repeat: Infinity, ease: "easeInOut" }}
                                    className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-black/40 flex items-center justify-center mb-6 text-muted-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-all duration-500"
                                >
                                    <tool.icon className="w-8 h-8" />
                                </motion.div>
                                <CardTitle className="text-heading-sm font-bold text-foreground mb-3">{tool.name}</CardTitle>
                                <CardDescription className="text-body-sm text-muted-foreground leading-relaxed group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                                    {t(tool.translationKey)}
                                </CardDescription>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </Section>
    );
};

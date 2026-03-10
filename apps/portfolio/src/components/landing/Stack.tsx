import React from "react";
import { motion } from "motion/react";
import { Figma, Code, Database, Layers, Zap, PenTool } from "lucide-react";
import { SectionHeader, Section, Card, CardContent, CardTitle, CardDescription } from "@limia/design-system";
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
        <Section id="stack" className="py-16 md:py-32">
            <SectionHeader
                title={t("stack.title")}
                description={t("stack.description")}
                index="04"
                label={t("stack.label")}
            />

            <ul className="list-none m-0 p-0 grid grid-cols-2 md:grid-cols-3 gap-6">
                {tools.map((tool, index) => (
                    <motion.li
                        key={tool.name}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        whileHover={{ y: -10, scale: 1.02 }}
                        className="group"
                    >
                        <Card className="relative h-full overflow-hidden border-border bg-card/70 shadow-sm transition-colors duration-500 hover:border-primary/30">
                            <CardContent className="flex h-full flex-col items-start bg-gradient-to-b from-muted/60 to-transparent p-8 transition-colors duration-500 group-hover:from-muted">
                                <motion.div
                                    animate={{ y: [0, -5, 0] }}
                                    transition={{ duration: 3 + (index % 3) * 0.4, repeat: Infinity, ease: "easeInOut" }}
                                    className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-background/80 text-muted-foreground transition-all duration-500 group-hover:text-primary group-hover:shadow-lg"
                                >
                                    <tool.icon className="w-8 h-8" />
                                </motion.div>
                                <CardTitle className="text-heading-sm font-bold text-foreground mb-3">{tool.name}</CardTitle>
                                <CardDescription className="text-body-sm leading-relaxed text-muted-foreground transition-colors group-hover:text-foreground/80">
                                    {t(tool.translationKey)}
                                </CardDescription>
                            </CardContent>
                        </Card>
                    </motion.li>
                ))}
            </ul>
        </Section>
    );
};


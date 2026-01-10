import React, { useState, useEffect } from "react";
import { motion, useMotionValue } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { TextReveal } from "./TextReveal";
import { InteractiveGrid } from "./InteractiveGrid";
import { getProjects, getImageUrl } from "../../lib/project-service";
import { Project } from "../../lib/sanity-types";
import { Button } from "@antigravity/ds";

const ProjectCard = ({ project, index, onClick }: { project: Project, index: number, onClick?: () => void }) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const [isHovered, setIsHovered] = useState(false);

    function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        mouseX.set(x);
        mouseY.set(y);

        if (!isHovered) {
            setIsHovered(true);
        }
    }

    const imageUrl = getImageUrl(project.mainImage);

    return (
        <motion.div
            className="relative group w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden bg-black dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 cursor-none"
            whileHover={{ y: -10 }}
            transition={{ duration: 0.5, ease: "circOut" }}
            onMouseMove={handleMouseMove}
            onClick={onClick}
            onMouseEnter={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                mouseX.set(e.clientX - rect.left);
                mouseY.set(e.clientY - rect.top);
                setIsHovered(true);
            }}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Custom Cursor - Only rendered when hovered to prevent ghosting */}
            {isHovered && (
                <motion.div
                    className="hidden md:flex absolute pointer-events-none z-50 w-12 h-12 rounded-full bg-blue-600/90 backdrop-blur-sm items-center justify-center shadow-lg shadow-blue-600/20"
                    style={{
                        left: mouseX,
                        top: mouseY,
                        x: "-50%",
                        y: "-50%",
                    }}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.2 }}
                >
                    <ArrowUpRight className="w-5 h-5 text-white" />
                </motion.div>
            )}

            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-700 z-10" />

            <motion.div
                className="absolute inset-0 w-full h-full"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.7 }}
            >
                <ImageWithFallback
                    src={imageUrl}
                    alt={project.title}
                    className="object-cover w-full h-full opacity-60 group-hover:opacity-100 transition-opacity duration-700 grayscale group-hover:grayscale-0"
                />
            </motion.div>

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 z-10" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 p-8 md:p-12 z-20 w-full transform transition-transform duration-500 group-hover:translate-y-[-10px]">
                <div className="flex flex-col gap-4">
                    <div className="overflow-hidden">
                        <motion.span
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            className={`text-transparent bg-clip-text bg-gradient-to-r ${project.color} font-bold tracking-widest text-sm uppercase inline-block`}
                        >
                            {project.category}
                        </motion.span>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 transition-colors duration-300">
                        {project.title}
                    </h3>

                    <div className="flex items-center justify-between mt-4 border-t border-white/10 pt-6 opacity-60 group-hover:opacity-100 transition-opacity duration-500">
                        <span className="font-mono text-sm text-white/80">
                            {project.metric}
                        </span>

                        <div className="flex items-center gap-2 text-white font-medium">
                            <span className="text-sm uppercase tracking-wider">Ver Case</span>
                            <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export const Projects = ({ onViewAll, onProjectClick }: { onViewAll?: () => void, onProjectClick?: (id: string) => void }) => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProjects = async () => {
            try {
                const data = await getProjects();
                setProjects(data);
            } catch (error) {
                console.error("Failed to load projects", error);
            } finally {
                setLoading(false);
            }
        };
        loadProjects();
    }, []);

    useEffect(() => {
        const loadProjects = async () => {
            try {
                const data = await getProjects();
                setProjects(data);
            } catch (error) {
                console.error("Failed to load projects", error);
            } finally {
                setLoading(false);
            }
        };
        loadProjects();
    }, []);

    // Display first 6 projects for the grid layout (3 per row * 2 rows ideally)
    const featuredProjects = projects.slice(0, 6);

    if (loading) {
        return <div className="py-20 text-center">Carregando projetos...</div>;
    }

    return (
        <section className="pt-16 pb-8 md:pt-32 bg-background relative overflow-hidden transition-colors duration-300">
            {/* Interactive Background Grid */}
            <InteractiveGrid variant="subtle" />

            {/* Noise Overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

            <div className="container mx-auto px-4 lg:px-12 mb-10 md:mb-16">
                <div className="border-b border-zinc-200 dark:border-white/10 pb-10 flex flex-col md:flex-row justify-between items-end gap-6">
                    <div>
                        <TextReveal>
                            <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-2">
                                Projetos
                            </h2>
                        </TextReveal>
                        <p className="text-muted-foreground text-lg w-full mt-4">
                            Uma seleção de trabalhos que definem minha abordagem.
                        </p>
                    </div>

                    <div className="flex flex-col items-end gap-6 relative z-10">
                        <span className="text-muted-foreground font-mono text-sm hidden md:block">01 — PROJECTS</span>
                    </div>

                </div>

                {/* Grid Container */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 no-cursor-trail">
                    {featuredProjects.map((project, index) => (
                        <ProjectCard
                            key={project._id}
                            project={project}
                            index={index}
                            onClick={() => onProjectClick && onProjectClick(project.slug.current)}
                        />
                    ))}
                </div>

                {/* Bottom Action */}
                <div className="mt-16 flex justify-center">
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={onViewAll}
                        className="group text-lg px-8 h-14 rounded-full border-zinc-200 dark:border-white/10 hover:bg-foreground hover:text-background transition-all duration-300"
                    >
                        Ver todos os projetos
                        <ArrowUpRight className="ml-2 w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </Button>
                </div>
            </div>
        </section>
    );
};


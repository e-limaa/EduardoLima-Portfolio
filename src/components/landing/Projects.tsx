import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { TextReveal } from "./TextReveal";
import { InteractiveGrid } from "./InteractiveGrid";
import { getProjects, getImageUrl } from "../../lib/project-service";
import { Project } from "../../lib/sanity-types";

const ProjectCard = ({ project, index, onClick }: { project: Project, index: number, onClick?: () => void }) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const [isHovered, setIsHovered] = useState(false);

    // Faster spring for snappier movement and less "floaty" entrance
    const cursorX = useSpring(mouseX, { stiffness: 500, damping: 28 });
    const cursorY = useSpring(mouseY, { stiffness: 500, damping: 28 });

    function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // If this is the first move (just entered), snap to position immediately
        if (!isHovered) {
            // Note: MotionValue.set jumps immediately, but spring interpolates.
            // To minimize the "fly-in" effect, we just ensure we update before setting hover state
            mouseX.set(x);
            mouseY.set(y);
            setIsHovered(true);
        } else {
            mouseX.set(x);
            mouseY.set(y);
        }
    }

    const imageUrl = getImageUrl(project.mainImage);

    return (
        <motion.div
            className="relative group min-w-[280px] md:min-w-[400px] h-[400px] md:h-[500px] rounded-3xl overflow-hidden bg-black dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 snap-center cursor-none"
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
                        left: cursorX,
                        top: cursorY,
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

                    <h3 className="text-4xl md:text-6xl font-bold text-white mb-2 transition-colors duration-300">
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
    const scrollRef = useRef<HTMLDivElement>(null);
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

    // Using the first 4 projects for the landing page
    const featuredProjects = projects.slice(0, 4);

    if (loading) {
        return <div className="py-20 text-center">Carregando projetos...</div>;
    }

    return (
        <section className="pt-16 pb-8 md:pt-32 bg-background relative overflow-hidden transition-colors duration-300">
            {/* Interactive Background Grid */}
            <InteractiveGrid variant="subtle" />

            {/* Noise Overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

            {/* Background Glow */}


            <div className="container mx-auto px-4 lg:px-12 mb-10 md:mb-20">
                <div className="border-b border-zinc-200 dark:border-white/10 pb-10 flex flex-col md:flex-row justify-between items-end gap-6">
                    <div>
                        <TextReveal>
                            <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-2">
                                Projetos
                            </h2>
                        </TextReveal>
                        <p className="text-muted-foreground text-lg max-w-md mt-4">
                            Uma seleção de trabalhos que definem minha abordagem.
                        </p>
                    </div>

                    <div className="flex flex-col items-end gap-6 relative z-10">
                        <span className="text-muted-foreground font-mono text-sm hidden md:block">01 — PROJECTS</span>

                        <div className="flex items-center gap-6">
                            <div className="hidden md:flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                                <span className="text-xs text-muted-foreground uppercase tracking-widest font-mono">Navegue</span>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => scrollRef.current?.scrollBy({ left: -500, behavior: 'smooth' })}
                                    className="w-12 h-12 rounded-full border border-zinc-200 dark:border-white/10 flex items-center justify-center text-foreground hover:bg-foreground hover:text-background transition-all active:scale-95"
                                    aria-label="Anterior"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                                </button>
                                <button
                                    onClick={() => scrollRef.current?.scrollBy({ left: 500, behavior: 'smooth' })}
                                    className="w-12 h-12 rounded-full border border-zinc-200 dark:border-white/10 flex items-center justify-center text-foreground hover:bg-foreground hover:text-background transition-all active:scale-95"
                                    aria-label="Próximo"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Horizontal Scroll Container */}
            <div
                ref={scrollRef}
                className="flex gap-8 overflow-x-auto pb-8 pt-4 snap-x snap-mandatory cursor-grab active:cursor-grabbing [&::-webkit-scrollbar]:hidden pl-4 md:pl-[calc((100vw-768px)/2+1rem)] lg:pl-[calc((100vw-1024px)/2+3rem)] xl:pl-[calc((100vw-1280px)/2+3rem)] 2xl:pl-[calc((100vw-1536px)/2+3rem)] pr-4"
                style={{ scrollBehavior: 'smooth', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {featuredProjects.map((project, index) => (
                    <div key={project._id} className="snap-center shrink-0">
                        <ProjectCard
                            project={project}
                            index={index}
                            onClick={() => onProjectClick && onProjectClick(project._id)}
                        />
                    </div>
                ))}

                {/* "More" Card */}
                <div
                    onClick={onViewAll}
                    className="min-w-[200px] md:min-w-[250px] flex items-center justify-center snap-center shrink-0 relative group cursor-pointer pr-4 md:pr-[calc((100vw-768px)/2+1rem)] lg:pr-[calc((100vw-1024px)/2+3rem)] xl:pr-[calc((100vw-1280px)/2+3rem)] 2xl:pr-[calc((100vw-1536px)/2+3rem)]"
                >
                    <div className="text-center group-hover:scale-110 transition-transform duration-500">
                        <p className="text-muted-foreground mb-4 text-xl font-light font-mono">Ver mais</p>
                        <div className="w-16 h-16 rounded-full border border-zinc-200 dark:border-white/20 flex items-center justify-center mx-auto group-hover:bg-foreground group-hover:text-background transition-colors duration-300 text-foreground">
                            <ArrowUpRight className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

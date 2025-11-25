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
            className="relative group min-w-[280px] md:min-w-[400px] h-[400px] md:h-[500px] rounded-3xl overflow-hidden bg-zinc-900 border border-white/10 snap-start cursor-none"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
            viewport={{ once: true, margin: "-50px" }}
            whileHover={{ y: -10 }}
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
    const [padding, setPadding] = useState(16);

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
        const updatePadding = () => {
            const width = window.innerWidth;
            let containerMaxWidth = width; // Default to full width if < sm
            let containerPadding = 16; // Default px-4

            if (width >= 1536) { // 2xl
                containerMaxWidth = 1536;
                containerPadding = 48; // px-12 (3rem)
            } else if (width >= 1280) { // xl
                containerMaxWidth = 1280;
                containerPadding = 48;
            } else if (width >= 1024) { // lg
                containerMaxWidth = 1024;
                containerPadding = 48;
            } else if (width >= 768) { // md
                containerMaxWidth = 768;
                containerPadding = 16;
            } else if (width >= 640) { // sm
                containerMaxWidth = 640;
                containerPadding = 16;
            }

            // Calculate left offset of the container
            // (Viewport Width - Container Max Width) / 2 + Container Padding
            const calculatedPadding = Math.max(16, (width - containerMaxWidth) / 2 + containerPadding);
            setPadding(calculatedPadding);
        };

        updatePadding();
        window.addEventListener('resize', updatePadding);
        return () => window.removeEventListener('resize', updatePadding);
    }, []);

    useEffect(() => {
        const resetScroll = () => {
            if (scrollRef.current) {
                scrollRef.current.scrollTo({ left: 0, behavior: 'instant' });
            }
        };

        // Attempt immediate reset
        resetScroll();

        // Force reset after a short delay to override browser scroll restoration
        const timer = setTimeout(resetScroll, 500);

        return () => clearTimeout(timer);
    }, [projects]);

    // Using the first 5 projects for the landing page
    const featuredProjects = projects.slice(0, 5);

    return (
        <section className="pt-16 pb-8 md:pt-32 bg-black relative overflow-hidden">
            {/* Interactive Background Grid */}
            <InteractiveGrid variant="subtle" />

            {/* Noise Overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

            <div className="container mx-auto px-4 lg:px-12 mb-10 md:mb-20">
                <div className="border-b border-white/10 pb-10 flex flex-col md:flex-row justify-between items-end gap-6">
                    <div>
                        <TextReveal>
                            <h2 className="text-4xl md:text-6xl font-bold text-white mb-2">
                                Projetos
                            </h2>
                        </TextReveal>
                        <p className="text-zinc-500 text-lg max-w-md mt-4">
                            Uma seleção de trabalhos que definem minha abordagem.
                        </p>
                    </div>

                    <div className="flex flex-col items-end gap-6 relative z-10">
                        <span className="text-zinc-600 font-mono text-sm hidden md:block">01 — PROJECTS</span>

                        <div className="flex items-center gap-6">
                            <div className="hidden md:flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                                <span className="text-xs text-zinc-500 uppercase tracking-widest font-mono">Navegue</span>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => scrollRef.current?.scrollBy({ left: -500, behavior: 'smooth' })}
                                    className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all active:scale-95"
                                    aria-label="Anterior"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                                </button>
                                <button
                                    onClick={() => scrollRef.current?.scrollBy({ left: 500, behavior: 'smooth' })}
                                    className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all active:scale-95"
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
                key="projects-carousel-reset"
                ref={scrollRef}
                className="flex gap-8 overflow-x-auto pb-8 pt-4 cursor-grab active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    paddingLeft: `${padding}px`,
                    paddingRight: '16px' // Default right padding, will be overridden by last item's margin if needed, but here we use padding on the container or the item?
                    // Actually, we want the last item to have padding-right equal to 'padding'.
                    // But we can't easily set padding-right on the container if we want the scroll to work nicely with snap.
                    // A common trick is to use a pseudo-element or just padding-right on the container.
                    // Let's set paddingRight on the container to match paddingLeft.
                }}
            >
                {loading ? (
                    <div className="w-full flex justify-center py-20 text-zinc-500">Carregando projetos...</div>
                ) : (
                    <>
                        {featuredProjects.map((project, index) => (
                            <div key={project._id} className="snap-start shrink-0">
                                <ProjectCard
                                    project={project}
                                    index={index}
                                    onClick={() => onProjectClick && onProjectClick(project._id)}
                                />
                            </div>
                        ))}
                    </>
                )}

                {/* "More" Card */}
                <div
                    onClick={onViewAll}
                    className="min-w-[200px] md:min-w-[250px] flex items-center justify-center snap-center shrink-0 relative group cursor-pointer"
                    style={{ paddingRight: `${padding}px` }}
                >
                    <div className="text-center group-hover:scale-110 transition-transform duration-500">
                        <p className="text-zinc-500 mb-4 text-xl font-light font-mono">Ver mais</p>
                        <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center mx-auto group-hover:bg-white group-hover:text-black transition-colors duration-300">
                            <ArrowUpRight className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

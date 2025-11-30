import React, { useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { ArrowUpRight, ArrowLeft } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { TextReveal } from "./TextReveal";
import { InteractiveGrid } from "./InteractiveGrid";
import { projects } from "./projects-data";

const ProjectCard = ({ project, index, onClick }: { project: typeof projects[0], index: number, onClick?: () => void }) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const [isHovered, setIsHovered] = useState(false);

    const cursorX = useSpring(mouseX, { stiffness: 500, damping: 28 });
    const cursorY = useSpring(mouseY, { stiffness: 500, damping: 28 });

    function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (!isHovered) {
             mouseX.set(x);
             mouseY.set(y);
             setIsHovered(true);
        } else {
            mouseX.set(x);
            mouseY.set(y);
        }
    }

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
                    src={project.image} 
                    alt={project.title}
                    className="object-cover w-full h-full opacity-60 group-hover:opacity-100 transition-opacity duration-700 grayscale group-hover:grayscale-0"
                />
            </motion.div>
            
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 z-10" />
            
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
                    
                    <h3 className="text-4xl md:text-5xl font-bold text-white mb-2 transition-colors duration-300">
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

export const ProjectsPage = ({ onBack, onProjectClick }: { onBack: () => void, onProjectClick?: (id: number) => void }) => {
    return (
        <div className="min-h-screen bg-background pt-20 lg:pt-32 pb-20 relative transition-colors duration-300">
            <InteractiveGrid variant="subtle" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
            
            <div className="container mx-auto px-4 lg:px-12 relative z-10">
                <div className="mb-8 lg:mb-16">
                    <button 
                        onClick={onBack}
                        className="group flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="uppercase tracking-widest font-mono text-sm">Voltar ao início</span>
                    </button>

                    <TextReveal>
                        <h1 className="text-5xl md:text-8xl font-bold text-foreground mb-6 tracking-tighter">
                            Todos os Projetos
                        </h1>
                    </TextReveal>
                    <p className="text-muted-foreground text-lg md:text-xl max-w-2xl font-light">
                        Uma coleção completa de trabalhos recentes, experimentos e estudos de caso detalhados em design de interface e experiência do usuário.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {projects.map((project, index) => (
                        <ProjectCard 
                            key={project.id} 
                            project={project} 
                            index={index} 
                            onClick={() => onProjectClick && onProjectClick(project.id)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

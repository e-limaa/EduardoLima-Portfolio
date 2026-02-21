import React, { useState } from "react";
import { motion, useMotionValue } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "../lib/utils";

export interface ProjectCardProps {
    title: string;
    category: string;
    image: string;
    metric?: string;
    color: string; // e.g., "from-blue-500 to-cyan-500"
    onClick?: () => void;
    className?: string;
}

const ERROR_IMG_SRC = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==';

export const ProjectCard = ({
    title,
    category,
    image,
    metric,
    color,
    onClick,
    className
}: ProjectCardProps) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const [isHovered, setIsHovered] = useState(false);
    const [imgSrc, setImgSrc] = useState(image);

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
            className={cn(
                "relative group w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden bg-black dark:bg-zinc-900 cursor-none",
                className
            )}
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
                <img
                    src={imgSrc}
                    alt={title}
                    loading="lazy"
                    onError={() => setImgSrc(ERROR_IMG_SRC)}
                    className="object-cover w-full h-full opacity-100 transition-opacity duration-700"
                />
            </motion.div>

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 z-10" />

            <div className="absolute bottom-0 left-0 p-8 md:p-12 z-20 w-full transform transition-transform duration-500 group-hover:translate-y-[-10px]">
                <div className="flex flex-col gap-4">
                    <div className="overflow-hidden">
                        <motion.span
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            className={cn(
                                "text-transparent bg-clip-text bg-gradient-to-r font-bold tracking-widest text-sm uppercase inline-block",
                                color
                            )}
                        >
                            {category}
                        </motion.span>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 transition-colors duration-300">
                        {title}
                    </h3>

                    <div className="flex items-center justify-between mt-4 border-t border-white/10 pt-6 opacity-60 group-hover:opacity-100 transition-opacity duration-500">
                        {metric && (
                            <span className="font-mono text-sm text-white/80">
                                {metric}
                            </span>
                        )}

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

import { type MouseEvent, useState } from "react";
import { motion, useMotionValue, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "../lib/utils";

export interface ProjectCardProps {
    title: string;
    category: string;
    image: string;
    metric?: string;
    color: string; // e.g., "from-blue-500 to-cyan-500"
    /** Visible call to action, also used in the accessible name. */
    ctaLabel?: string;
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
    ctaLabel = "View case",
    onClick,
    className
}: ProjectCardProps) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const shouldReduceMotion = useReducedMotion();
    const [isHovered, setIsHovered] = useState(false);
    const [imgSrc, setImgSrc] = useState(image);

    function handleMouseMove(e: MouseEvent<HTMLElement>) {
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
        <motion.article
            className={cn(
                "relative group w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden bg-black cursor-none outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                className
            )}
            whileHover={shouldReduceMotion ? undefined : { y: -10 }}
            transition={{ duration: 0.5, ease: "circOut" }}
            onMouseMove={handleMouseMove}
            onClick={onClick}
            role={onClick ? "button" : undefined}
            tabIndex={onClick ? 0 : undefined}
            aria-label={onClick ? `${ctaLabel}: ${title}` : undefined}
            onKeyDown={(e) => {
                if (!onClick) return;
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onClick();
                }
            }}
            onMouseEnter={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                mouseX.set(e.clientX - rect.left);
                mouseY.set(e.clientY - rect.top);
                setIsHovered(true);
            }}
            onMouseLeave={() => setIsHovered(false)}
        >
            {isHovered && !shouldReduceMotion && (
                <motion.div
                    className="hidden md:flex absolute pointer-events-none z-50 w-12 h-12 rounded-full bg-primary/90 backdrop-blur-sm items-center justify-center shadow-lg shadow-primary/20"
                    style={{
                        left: mouseX,
                        top: mouseY,
                        x: "-50%",
                        y: "-50%",
                    }}
                    initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.5 }}
                    animate={shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.2 }}
                >
                    <ArrowUpRight className="w-5 h-5 text-primary-foreground" />
                </motion.div>
            )}

            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-700 z-10" />

            <motion.div
                className="absolute inset-0 w-full h-full"
                whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
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

            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent opacity-90 z-10" />

            <div className="absolute bottom-0 left-0 p-8 md:p-12 z-20 w-full transform transition-transform duration-500 group-hover:translate-y-[-10px]">
                <div className="flex flex-col gap-4">
                    <div className="overflow-hidden">
                        <motion.span
                            initial={shouldReduceMotion ? false : { y: 20, opacity: 0 }}
                            whileInView={shouldReduceMotion ? undefined : { y: 0, opacity: 1 }}
                            className={cn(
                                "text-transparent bg-clip-text bg-gradient-to-r font-bold tracking-widest text-sm uppercase inline-block",
                                color
                            )}
                        >
                            {category}
                        </motion.span>
                    </div>

                    <h3 className="text-heading-sm md:text-heading-md font-bold text-white mb-2 transition-colors duration-300">
                        {title}
                    </h3>

                    <div className="flex items-center justify-between gap-4 mt-4 border-t border-white/20 pt-6 opacity-80 group-hover:opacity-100 transition-opacity duration-500">
                        {metric && (
                            <span className="min-w-0 font-mono text-sm text-white/90">
                                {metric}
                            </span>
                        )}

                        <div className="ml-auto flex shrink-0 items-center gap-2 text-white font-medium">
                            <span className="whitespace-nowrap text-sm uppercase tracking-wider">{ctaLabel}</span>
                            <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
                        </div>
                    </div>
                </div>
            </div>
        </motion.article>
    );
};


import { useEffect, useRef, useState } from "react";
import {
    motion,
    useMotionTemplate,
    useMotionValue,
    useReducedMotion,
} from "motion/react";
import { cn } from "../lib/utils";

const GRID_SIZE = 64;
const GRID_MASK = "radial-gradient(ellipse 60% 50% at 50% 0%, black 70%, transparent 100%)";

type PulseAxis = "horizontal" | "vertical";

interface GridPulse {
    axis: PulseAxis;
    cycle: number;
    color: string;
    delay: number;
    duration: number;
    glow: string;
    id: number;
    length: number;
    lineOffset: number;
    opacity: number;
    thickness: number;
}

export interface InteractiveGridProps {
    variant?: "default" | "subtle";
    className?: string;
}

const randomBetween = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
};

const createPulse = (
    id: number,
    axis: PulseAxis,
    width: number,
    height: number,
    variant: InteractiveGridProps["variant"],
    cycle = 0
): GridPulse => {
    const lineCount = axis === "horizontal"
        ? Math.max(2, Math.floor(height / GRID_SIZE) + 1)
        : Math.max(2, Math.floor(width / GRID_SIZE) + 1);
    const lineIndex = Math.floor(Math.random() * lineCount);
    const axisLength = axis === "horizontal" ? width : height;
    const baseLength = variant === "subtle"
        ? axisLength * randomBetween(0.08, 0.16)
        : axisLength * randomBetween(0.1, 0.2);
    const thickness = variant === "subtle"
        ? randomBetween(1, 2.2)
        : randomBetween(1.2, 3.4);
    const isSofterPulse = Math.random() > 0.58;
    const color = isSofterPulse
        ? variant === "subtle"
            ? "color-mix(in oklab, var(--color-primary) 26%, white 8%)"
            : "color-mix(in oklab, var(--color-primary) 34%, white 10%)"
        : variant === "subtle"
            ? "color-mix(in oklab, var(--color-primary) 52%, white 18%)"
            : "color-mix(in oklab, var(--color-primary) 72%, white 22%)";
    const glow = isSofterPulse
        ? variant === "subtle"
            ? "color-mix(in oklab, var(--color-primary) 10%, transparent)"
            : "color-mix(in oklab, var(--color-primary) 14%, transparent)"
        : variant === "subtle"
            ? "color-mix(in oklab, var(--color-primary) 18%, transparent)"
            : "color-mix(in oklab, var(--color-primary) 28%, transparent)";

    return {
        axis,
        cycle,
        color,
        delay: randomBetween(0, variant === "subtle" ? 2.8 : 1.6),
        duration: randomBetween(
            variant === "subtle" ? 4.2 : 3.2,
            variant === "subtle" ? 7.4 : 5.6
        ),
        glow,
        id,
        length: Math.max(40, baseLength),
        lineOffset: lineIndex * GRID_SIZE,
        opacity: randomBetween(
            isSofterPulse
                ? variant === "subtle" ? 0.18 : 0.24
                : variant === "subtle" ? 0.45 : 0.62,
            isSofterPulse
                ? variant === "subtle" ? 0.34 : 0.42
                : variant === "subtle" ? 0.72 : 0.95
        ),
        thickness,
    };
};

export const InteractiveGrid = ({ variant = "default", className }: InteractiveGridProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const prefersReducedMotion = useReducedMotion();
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
    const [pulses, setPulses] = useState<GridPulse[]>([]);

    const maskSize = variant === "subtle" ? 150 : 300;
    const glowSize = variant === "subtle" ? 200 : 400;
    const gridOpacity = variant === "subtle" ? 0.2 : 0.5;
    const glowColor = variant === "subtle"
        ? "color-mix(in oklab, var(--color-primary) 8%, transparent)"
        : "color-mix(in oklab, var(--color-primary) 18%, transparent)";
    useEffect(() => {
        if (!containerRef.current) return;

        const updateSize = () => {
            if (!containerRef.current) return;

            const { width, height } = containerRef.current.getBoundingClientRect();
            setContainerSize({
                width,
                height,
            });
            mouseX.set(width / 2);
            mouseY.set(height / 3);
        };

        updateSize();

        const observer = new ResizeObserver(updateSize);
        observer.observe(containerRef.current);

        return () => observer.disconnect();
    }, [mouseX, mouseY]);

    useEffect(() => {
        if (
            prefersReducedMotion
            || containerSize.width <= 0
            || containerSize.height <= 0
        ) {
            setPulses([]);
            return;
        }

        const horizontalCount = variant === "subtle" ? 8 : 11;
        const verticalCount = variant === "subtle" ? 8 : 11;
        const nextPulses: GridPulse[] = [];

        for (let index = 0; index < horizontalCount; index += 1) {
            nextPulses.push(
                createPulse(
                    index,
                    "horizontal",
                    containerSize.width,
                    containerSize.height,
                    variant
                )
            );
        }

        for (let index = 0; index < verticalCount; index += 1) {
            const pulseId = horizontalCount + index;
            nextPulses.push(
                createPulse(
                    pulseId,
                    "vertical",
                    containerSize.width,
                    containerSize.height,
                    variant
                )
            );
        }

        setPulses(nextPulses);
    }, [containerSize.height, containerSize.width, prefersReducedMotion, variant]);

    useEffect(() => {
        if (prefersReducedMotion) return;

        const handleMouseMove = (event: MouseEvent) => {
            if (!containerRef.current) return;

            const rect = containerRef.current.getBoundingClientRect();
            mouseX.set(event.clientX - rect.left);
            mouseY.set(event.clientY - rect.top);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY, prefersReducedMotion]);

    const respawnPulse = (id: number) => {
        setPulses((currentPulses) =>
            currentPulses.map((pulse) =>
                pulse.id === id
                    ? createPulse(
                        id,
                        pulse.axis,
                        containerSize.width,
                        containerSize.height,
                        variant,
                        pulse.cycle + 1
                    )
                    : pulse
            )
        );
    };

    return (
        <div
            ref={containerRef}
            className={cn("absolute inset-0 z-0 overflow-hidden pointer-events-none", className)}
        >
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage:
                        "linear-gradient(to right, var(--color-border) 1px, transparent 1px), linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)",
                    backgroundSize: "4rem 4rem",
                    maskImage: GRID_MASK,
                    WebkitMaskImage: GRID_MASK,
                }}
            />

            {!prefersReducedMotion && (
                <div
                    className="absolute inset-0"
                    style={{
                        maskImage: GRID_MASK,
                        WebkitMaskImage: GRID_MASK,
                    }}
                >
                    {pulses.map((pulse) => {
                        const isHorizontal = pulse.axis === "horizontal";

                        return (
                            <motion.div
                                key={`${pulse.id}-${pulse.cycle}`}
                                className="absolute mix-blend-screen"
                                initial={isHorizontal
                                    ? { x: -pulse.length, opacity: 0 }
                                    : { y: -pulse.length, opacity: 0 }}
                                animate={isHorizontal
                                    ? {
                                        x: containerSize.width,
                                        opacity: [0, pulse.opacity, 0],
                                    }
                                    : {
                                        y: containerSize.height,
                                        opacity: [0, pulse.opacity, 0],
                                    }}
                                transition={{
                                    delay: pulse.delay,
                                    duration: pulse.duration,
                                    ease: "linear",
                                }}
                                onAnimationComplete={() => respawnPulse(pulse.id)}
                                style={isHorizontal
                                    ? {
                                        top: pulse.lineOffset,
                                        left: 0,
                                        width: pulse.length,
                                        height: pulse.thickness,
                                        background: `linear-gradient(90deg, transparent 0%, ${pulse.color} 18%, ${pulse.color} 50%, transparent 100%)`,
                                        boxShadow: `0 0 10px ${pulse.glow}, 0 0 22px ${pulse.glow}`,
                                    }
                                    : {
                                        top: 0,
                                        left: pulse.lineOffset,
                                        width: pulse.thickness,
                                        height: pulse.length,
                                        background: `linear-gradient(180deg, transparent 0%, ${pulse.color} 18%, ${pulse.color} 50%, transparent 100%)`,
                                        boxShadow: `0 0 10px ${pulse.glow}, 0 0 22px ${pulse.glow}`,
                                    }}
                            />
                        );
                    })}
                </div>
            )}

            {!prefersReducedMotion && (
                <>
                    <motion.div
                        className="absolute inset-0"
                        style={{
                            opacity: gridOpacity,
                            backgroundImage:
                                "linear-gradient(to right, var(--color-primary) 1px, transparent 1px), linear-gradient(to bottom, var(--color-primary) 1px, transparent 1px)",
                            backgroundSize: "4rem 4rem",
                            maskImage: useMotionTemplate`radial-gradient(${maskSize}px circle at ${mouseX}px ${mouseY}px, black, transparent)`,
                            WebkitMaskImage: useMotionTemplate`radial-gradient(${maskSize}px circle at ${mouseX}px ${mouseY}px, black, transparent)`,
                        }}
                    />

                    <motion.div
                        className="absolute inset-0 mix-blend-screen"
                        style={{
                            background: useMotionTemplate`radial-gradient(${glowSize}px circle at ${mouseX}px ${mouseY}px, ${glowColor}, transparent 80%)`,
                        }}
                    />
                </>
            )}
        </div>
    );
};

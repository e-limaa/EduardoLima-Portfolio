import {
    type CSSProperties,
    type ReactNode,
    startTransition,
    useEffect,
    useRef,
    useState,
} from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

import { cn } from "../lib/utils";

export interface TrueFocusItem {
    content: ReactNode;
    className?: string;
    key?: string;
}

export interface TrueFocusProps {
    items: TrueFocusItem[];
    className?: string;
    itemClassName?: string;
    priority?: boolean;
    manualMode?: boolean;
    blurAmount?: number;
    borderColor?: string;
    glowColor?: string;
    animationDuration?: number;
    pauseBetweenAnimations?: number;
}

interface FocusRect {
    x: number;
    y: number;
    width: number;
    height: number;
}

const EMPTY_RECT: FocusRect = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
};

export const TrueFocus = ({
    items,
    className,
    itemClassName,
    priority = false,
    manualMode = false,
    blurAmount = 5,
    borderColor = "var(--primary)",
    animationDuration = 0.5,
    pauseBetweenAnimations = 1,
}: TrueFocusProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const viewRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<Array<HTMLSpanElement | null>>([]);
    const shouldReduceMotion = useReducedMotion();
    const inView = useInView(viewRef, { once: true, amount: 0.4 });

    const [currentIndex, setCurrentIndex] = useState(0);
    const [lastActiveIndex, setLastActiveIndex] = useState(0);
    const [focusRect, setFocusRect] = useState<FocusRect>(EMPTY_RECT);

    const hasItems = items.length > 0;
    const isActive = priority || inView;
    const enableAnimation = hasItems && items.length > 1 && !shouldReduceMotion && isActive;

    useEffect(() => {
        if (!enableAnimation || manualMode) {
            return;
        }

        const intervalId = window.setInterval(() => {
            startTransition(() => {
                setCurrentIndex((previousIndex) => (previousIndex + 1) % items.length);
            });
        }, (animationDuration + pauseBetweenAnimations) * 1000);

        return () => {
            window.clearInterval(intervalId);
        };
    }, [animationDuration, enableAnimation, items.length, manualMode, pauseBetweenAnimations]);

    useEffect(() => {
        if (!hasItems) {
            return;
        }

        setCurrentIndex((previousIndex) => Math.min(previousIndex, items.length - 1));
        setLastActiveIndex((previousIndex) => Math.min(previousIndex, items.length - 1));
    }, [hasItems, items.length]);

    useEffect(() => {
        const updateFocusRect = () => {
            const container = containerRef.current;
            const activeItem = itemRefs.current[currentIndex];

            if (!container || !activeItem) {
                return;
            }

            const containerRect = container.getBoundingClientRect();
            const activeRect = activeItem.getBoundingClientRect();

            setFocusRect({
                x: activeRect.left - containerRect.left,
                y: activeRect.top - containerRect.top,
                width: activeRect.width,
                height: activeRect.height,
            });
        };

        updateFocusRect();

        const observer = typeof ResizeObserver === "undefined"
            ? null
            : new ResizeObserver(() => updateFocusRect());

        if (observer) {
            if (containerRef.current) {
                observer.observe(containerRef.current);
            }

            const activeItem = itemRefs.current[currentIndex];

            if (activeItem) {
                observer.observe(activeItem);
            }
        } else {
            window.addEventListener("resize", updateFocusRect);
        }

        return () => {
            if (observer) {
                observer.disconnect();
                return;
            }

            window.removeEventListener("resize", updateFocusRect);
        };
    }, [currentIndex, items]);

    const handleMouseEnter = (index: number) => {
        if (!manualMode || !enableAnimation) {
            return;
        }

        startTransition(() => {
            setLastActiveIndex(index);
            setCurrentIndex(index);
        });
    };

    const handleMouseLeave = () => {
        if (!manualMode || !enableAnimation) {
            return;
        }

        startTransition(() => {
            setCurrentIndex(lastActiveIndex);
        });
    };

    return (
        <div ref={viewRef} className={cn("relative", className)}>
            <div ref={containerRef} className="relative flex flex-col">
                {items.map((item, index) => {
                    const isCurrent = currentIndex === index;
                    const shouldBlur = enableAnimation && (!manualMode ? !isCurrent : currentIndex !== index);
                    const itemStyle: CSSProperties = {
                        filter: shouldBlur
                            ? `blur(${blurAmount}px) brightness(0.72)`
                            : "blur(0px) brightness(1)",
                        transitionDuration: `${animationDuration}s`,
                    };

                    return (
                        <span
                            key={item.key ?? index}
                            ref={(node) => {
                                itemRefs.current[index] = node;
                            }}
                            className={cn(
                                "relative z-10 block w-fit transition-[filter] ease-out will-change-[filter]",
                                itemClassName,
                                item.className,
                            )}
                            style={itemStyle}
                            onMouseEnter={() => handleMouseEnter(index)}
                            onMouseLeave={handleMouseLeave}
                        >
                            {item.content}
                        </span>
                    );
                })}

                {enableAnimation ? (
                    <motion.div
                        aria-hidden="true"
                        className="pointer-events-none absolute left-0 top-0 z-0 -translate-y-[6px]"
                        animate={{
                            x: focusRect.x,
                            y: focusRect.y,
                            width: focusRect.width,
                            height: focusRect.height,
                            opacity: 1,
                        }}
                        transition={{ duration: animationDuration, ease: [0.22, 1, 0.36, 1] }}
                    >
                        {["top-left", "top-right", "bottom-left", "bottom-right"].map((corner) => {
                            const cornerStyle: CSSProperties = {
                                borderColor,
                            };

                            return (
                                <span
                                    key={corner}
                                    className={cn(
                                        "absolute h-4 w-4 rounded-[4px] border-[3px]",
                                        corner === "top-left" && "-left-4 -top-2 border-b-0 border-r-0",
                                        corner === "top-right" && "-right-2 -top-2 border-b-0 border-l-0",
                                        corner === "bottom-left" && "-bottom-2 -left-4 border-r-0 border-t-0",
                                        corner === "bottom-right" && "-bottom-2 -right-2 border-l-0 border-t-0",
                                    )}
                                    style={cornerStyle}
                                />
                            );
                        })}
                    </motion.div>
                ) : null}
            </div>
        </div>
    );
};

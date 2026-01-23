import React, { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

export interface TextRevealProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}

export const TextReveal = ({ children, className = "", delay = 0 }: TextRevealProps) => {
    const shouldReduceMotion = useReducedMotion();
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    const y = shouldReduceMotion ? 0 : "100%";

    return (
        <div ref={ref} className={`overflow-hidden relative z-20 ${className}`}>
            <motion.div
                initial={{ y }}
                animate={isInView ? { y: 0 } : { y }}
                transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1], delay }}
            >
                {children}
            </motion.div>
        </div>
    );
};

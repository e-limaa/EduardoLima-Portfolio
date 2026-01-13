import React from "react";
import { motion } from "motion/react";

export interface TextRevealProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}

export const TextReveal = ({ children, className = "", delay = 0 }: TextRevealProps) => {
    return (
        <div className={`overflow-hidden relative z-20 ${className}`}>
            <motion.div
                initial={{ y: "100%" }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1], delay }}
            >
                {children}
            </motion.div>
        </div>
    );
};

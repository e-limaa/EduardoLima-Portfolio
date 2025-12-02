import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight } from "lucide-react";
import { InteractiveGrid } from "./InteractiveGrid";

interface WelcomeScreenProps {
    onEnter: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onEnter }) => {
    const [progress, setProgress] = useState(0);
    const [showButton, setShowButton] = useState(false);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        // Lock body scroll
        document.body.style.overflow = 'hidden';

        const duration = 3000; // 3 seconds
        const interval = 30;
        const steps = duration / interval;
        const increment = 100 / steps;

        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(timer);
                    setShowButton(true);
                    return 100;
                }
                return prev + increment;
            });
        }, interval);

        return () => {
            clearInterval(timer);
            // Restore body scroll
            document.body.style.overflow = 'unset';
        };
    }, []);

    const handleEnter = () => {
        setIsExiting(true);
        // Trigger the parent callback immediately, let AnimatePresence handle the visual exit
        onEnter();
    };

    return (
        <motion.div
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-zinc-950 text-white overflow-hidden"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
        >
            <div className="absolute inset-0 z-0">
                <InteractiveGrid variant="subtle" />
            </div>

            <div className="w-full max-w-md px-8 flex flex-col items-center text-center relative z-10">
                <motion.h1
                    className="text-4xl md:text-5xl font-bold tracking-tighter mb-4"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    Eduardo Lima<span className="text-blue-600">.</span>
                </motion.h1>

                <motion.p
                    className="text-zinc-500 text-sm md:text-base mb-12 whitespace-nowrap"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                >
                    Transformando complexidade em experiências simples e inteligentes.
                </motion.p>

                <div className="h-12 w-full flex items-center justify-center relative">
                    <AnimatePresence mode="wait">
                        {!showButton ? (
                            <motion.div
                                key="progress"
                                className="w-full flex items-center gap-4"
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="flex-1 h-[2px] bg-zinc-800 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-white"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <span className="text-xs font-mono text-zinc-400 w-8 text-right">
                                    {Math.round(progress)}%
                                </span>
                            </motion.div>
                        ) : (
                            <motion.button
                                key="button"
                                onClick={handleEnter}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="group flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 transition-all duration-300 text-sm font-medium text-zinc-200"
                            >
                                Acessar portfólio
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
};

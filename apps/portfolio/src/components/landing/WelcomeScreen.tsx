import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Button } from "@limia/design-system-src/components/button";
import { InteractiveGrid } from "@limia/design-system-src/components/interactive-grid";
import { Progress } from "@limia/design-system-src/components/ui/progress";
import { useLanguage } from "../language-provider";

interface WelcomeScreenProps {
    onEnter: () => void;
}

function TypewriterText({
    text,
    shouldStart,
    speed = 18,
    onComplete,
}: {
    text: string;
    shouldStart: boolean;
    speed?: number;
    onComplete?: () => void;
}) {
    const [displayedText, setDisplayedText] = useState(shouldStart ? "" : text);
    const completionRef = useRef(onComplete);

    useEffect(() => {
        completionRef.current = onComplete;
    }, [onComplete]);

    useEffect(() => {
        if (!shouldStart) {
            setDisplayedText(text);
            return;
        }

        setDisplayedText("");
        let index = 0;
        const interval = window.setInterval(() => {
            index += 1;
            setDisplayedText(text.slice(0, index));

            if (index >= text.length) {
                window.clearInterval(interval);
                completionRef.current?.();
            }
        }, speed);

        return () => window.clearInterval(interval);
    }, [shouldStart, speed, text]);

    return <>{displayedText}</>;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onEnter }) => {
    const [progress, setProgress] = useState(0);
    const [showButton, setShowButton] = useState(false);
    const [footerPhase, setFooterPhase] = useState<-1 | 0 | 1 | 2>(-1);
    const { t } = useLanguage();
    const sessionNoticeTitle = t("sessionNotice.title");
    const sessionNoticeBody = t("sessionNotice.body");

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

    useEffect(() => {
        setFooterPhase(-1);
        const timeoutId = window.setTimeout(() => {
            setFooterPhase(0);
        }, 250);

        return () => window.clearTimeout(timeoutId);
    }, [sessionNoticeTitle, sessionNoticeBody]);

    const handleEnter = () => {
        // Trigger the parent callback immediately, let AnimatePresence handle the visual exit
        onEnter();
    };

    return (
        <motion.div
            className="fixed inset-0 z-[100] flex h-[100dvh] flex-col items-center justify-center overflow-hidden bg-background text-foreground"
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
                    Eduardo Lima<span className="text-primary">.</span>
                </motion.h1>

                <motion.p
                    className="mb-12 whitespace-normal text-sm text-muted-foreground md:text-base md:whitespace-nowrap"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                >
                    {t("welcome.subtitle")}
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
                                <div className="flex-1 overflow-hidden rounded-full bg-border/60">
                                    <Progress value={progress} className="h-[2px]" />
                                </div>
                                <span className="w-8 text-right font-mono text-xs text-muted-foreground">
                                    {Math.round(progress)}%
                                </span>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="button"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <Button onClick={handleEnter} size="lg" variant="outline" className="group">
                                    {t("welcome.enter")}
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.5 }}
                className="absolute bottom-6 left-0 z-20 flex h-auto w-full shrink-0 flex-col gap-14 px-4 text-center md:bottom-10"
            >
                <div className="mx-auto max-w-[40rem]">
                    <p className="font-mono text-[10px] text-foreground md:text-xs">
                        <TypewriterText
                            text={sessionNoticeTitle}
                            shouldStart={footerPhase === 0}
                            speed={20}
                            onComplete={() => setFooterPhase(1)}
                        />
                    </p>
                    <p className="mt-1 font-mono text-[10px] text-muted-foreground/80 md:text-xs">
                        {footerPhase >= 1 ? (
                            <TypewriterText
                                text={sessionNoticeBody}
                                shouldStart={footerPhase === 1}
                                speed={12}
                                onComplete={() => setFooterPhase(2)}
                            />
                        ) : null}
                    </p>
                </div>
                <p className="font-mono text-[10px] text-muted-foreground/80 md:text-xs">
                    {t("welcome.audioHelp")}
                </p>
            </motion.div>
        </motion.div>
    );
};


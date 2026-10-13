import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Play, Pause, Volume2, VolumeX, Music } from "lucide-react";
import { useLanguage } from "../language-provider";
import { WELCOME_SCREEN_STORAGE_KEY } from "../../lib/storage-keys";
import { readStorage } from "../../lib/safe-storage";

const PLAYLIST = [
    {
        title: "Rollercoastin - Roddy Ricch (Instrumental)",
        src: "https://audio-assets.vercel.app/Rollercoastin.mp3",
    },
    {
        title: "Awake - Tycho",
        src: "https://audio-assets.vercel.app/Tycho-Awake.mp3",
    },
    {
        title: "Photosynthesis",
        src: "https://audio-assets.vercel.app/Carbon Based Lifeforms - Photosynthesis.mp3",
    },
];

interface AudioPlayerProps {
    shouldPlay: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ shouldPlay }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [showImmersiveHint, setShowImmersiveHint] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const { t } = useLanguage();
    const shouldReduceMotion = useReducedMotion();

    useEffect(() => {
        if (shouldPlay && audioRef.current) {
            audioRef.current.volume = 0.1; // Start at 10% volume
            const playPromise = audioRef.current.play();

            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        setIsPlaying(true);
                    })
                    .catch(() => {
                        setIsPlaying(false);
                    });
            }
        }
    }, [shouldPlay]);

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play().catch(() => setIsPlaying(false));
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, currentTrackIndex]);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const hasSeenWelcome = readStorage(WELCOME_SCREEN_STORAGE_KEY, "session") === "true";
        if (!hasSeenWelcome) return;

        setShowImmersiveHint(true);

        const timeoutId = window.setTimeout(() => {
            setShowImmersiveHint(false);
        }, 5000);

        return () => window.clearTimeout(timeoutId);
    }, []);

    const togglePlay = () => {
        setShowImmersiveHint(false);
        setIsPlaying(!isPlaying);
    };

    const nextTrack = () => {
        setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
        setIsPlaying(true);
    };

    const toggleMute = () => {
        setShowImmersiveHint(false);
        if (audioRef.current) {
            audioRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const handleEnded = () => {
        nextTrack();
    };

    return (
        <motion.div
            className="absolute top-4 right-4 md:fixed md:bottom-7 md:right-7 md:top-auto z-50 flex items-center gap-2"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            onMouseEnter={() => {
                setIsHovered(true);
                setShowImmersiveHint(false);
            }}
            onMouseLeave={() => setIsHovered(false)}
        >
            <audio
                ref={audioRef}
                preload="none"
                src={PLAYLIST[currentTrackIndex].src}
                onEnded={handleEnded}
            />

            <AnimatePresence>
                {showImmersiveHint && (
                    <motion.div
                        initial={shouldReduceMotion ? false : { opacity: 0, y: 8, scale: 0.96 }}
                        animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
                        exit={shouldReduceMotion ? undefined : { opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="pointer-events-none absolute top-full right-0 mt-2 w-52 rounded-2xl border border-border/70 bg-background/95 px-3 py-2 text-xs leading-relaxed text-foreground shadow-lg backdrop-blur-md md:top-auto md:right-0 md:bottom-full md:mb-3 md:mt-0"
                        role="status"
                        aria-live="polite"
                    >
                        {t("audio.tooltip.immersive")}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className={`
        flex items-center gap-3 px-3 py-1.5 md:px-4 md:py-2 rounded-full 
        bg-card/80 backdrop-blur-md 
        border border-border/70 
        shadow-lg transition-[padding,background-color,border-color,box-shadow] duration-300
        ${isHovered ? "pr-4" : "pr-2"}
      `}>
                {/* Track Info (Visible on Hover) */}
                <AnimatePresence>
                    {isHovered && (
                        <motion.div
                            initial={shouldReduceMotion ? false : { opacity: 0, x: 8 }}
                            animate={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
                            exit={shouldReduceMotion ? undefined : { opacity: 0, x: 8 }}
                            className="overflow-hidden whitespace-nowrap mr-2"
                        >
                            <div className="flex items-center gap-2 text-xs font-medium text-foreground/80">
                                <Music className="w-3 h-3 motion-safe:animate-pulse" />
                                <span>{PLAYLIST[currentTrackIndex].title}</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Controls */}
                <button
                    onClick={togglePlay}
                    className="flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-full p-3 text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    aria-label={isPlaying ? "Pause" : "Play"}
                >
                    {isPlaying ? <Pause className="w-3 h-3 md:w-4 md:h-4" /> : <Play className="w-3 h-3 md:w-4 md:h-4" />}
                </button>

                <button
                    onClick={toggleMute}
                    className="flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-full p-3 text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    aria-label={isMuted ? "Unmute" : "Mute"}
                >
                    {isMuted ? <VolumeX className="w-3 h-3 md:w-4 md:h-4" /> : <Volume2 className="w-3 h-3 md:w-4 md:h-4" />}
                </button>
            </div>
        </motion.div>
    );
};

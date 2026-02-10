import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, Pause, SkipForward, Volume2, VolumeX, Music } from "lucide-react";

const PLAYLIST = [
    {
        title: "Rollercoastin - Roddy Ricch (Instrumental)",
        src: "https://audio-assets.vercel.app/Rollercoastin%20%20Roddy%20Ricch%20%20Instrumental%20%20Remake%20%20RX808%20-%20RX808%20(youtube)%20(2).mp3",
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
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (shouldPlay && audioRef.current) {
            audioRef.current.volume = 0.1; // Start at 10% volume
            const playPromise = audioRef.current.play();

            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        setIsPlaying(true);
                    })
                    .catch((error) => {
                        console.log("Autoplay prevented by browser:", error);
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

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    const nextTrack = () => {
        setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
        setIsPlaying(true);
    };

    const toggleMute = () => {
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
            className="fixed top-4 right-4 md:bottom-7 md:right-7 md:top-auto z-50 flex items-center gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <audio
                ref={audioRef}
                preload="none"
                src={PLAYLIST[currentTrackIndex].src}
                onEnded={handleEnded}
            />

            <div className={`
        flex items-center gap-3 px-3 py-1.5 md:px-4 md:py-2 rounded-full 
        bg-white/10 dark:bg-black/20 backdrop-blur-md 
        border border-white/20 dark:border-white/10 
        shadow-lg transition-all duration-300
        ${isHovered ? "pr-4" : "pr-2"}
      `}>
                {/* Track Info (Visible on Hover) */}
                <AnimatePresence>
                    {isHovered && (
                        <motion.div
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            className="overflow-hidden whitespace-nowrap mr-2"
                        >
                            <div className="flex items-center gap-2 text-xs font-medium text-zinc-700 dark:text-zinc-300">
                                <Music className="w-3 h-3 animate-pulse" />
                                <span>{PLAYLIST[currentTrackIndex].title}</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Controls */}
                <button
                    onClick={togglePlay}
                    className="p-1 md:p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-zinc-800 dark:text-zinc-200"
                    aria-label={isPlaying ? "Pause" : "Play"}
                >
                    {isPlaying ? <Pause className="w-3 h-3 md:w-4 md:h-4" /> : <Play className="w-3 h-3 md:w-4 md:h-4" />}
                </button>

                {/* <button
                    onClick={nextTrack}
                    className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-zinc-800 dark:text-zinc-200"
                    aria-label="Next Track"
                >
                    <SkipForward className="w-4 h-4" />
                </button> */}

                <button
                    onClick={toggleMute}
                    className="p-1 md:p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-zinc-800 dark:text-zinc-200"
                    aria-label={isMuted ? "Unmute" : "Mute"}
                >
                    {isMuted ? <VolumeX className="w-3 h-3 md:w-4 md:h-4" /> : <Volume2 className="w-3 h-3 md:w-4 md:h-4" />}
                </button>
            </div>
        </motion.div>
    );
};

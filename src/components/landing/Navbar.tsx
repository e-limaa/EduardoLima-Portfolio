import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { Home, User, Briefcase, Layers, Mail, Zap } from "lucide-react";
import { ModeToggle } from "../mode-toggle";
import { useLanguage } from "../language-provider";

const navItems = [
  { id: "hero", icon: Home, translationKey: "nav.hero" },
  { id: "projects", icon: Briefcase, translationKey: "nav.projects" },
  { id: "services", icon: Zap, translationKey: "nav.services" },
  { id: "story", icon: User, translationKey: "nav.story" },
  { id: "stack", icon: Layers, translationKey: "nav.stack" },
  { id: "contact", icon: Mail, translationKey: "nav.contact" },
];

export const Navbar = ({ onNavigate }: { onNavigate?: (id: string) => void }) => {
  const { language, setLanguage, t } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      // Use a small 1px threshold to avoid rounding issues
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 1);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const handleNavigation = (id: string) => {
    if (onNavigate) {
      onNavigate(id);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  let maskImage: string | undefined = undefined;
  if (canScrollLeft && canScrollRight) {
    maskImage = "linear-gradient(to right, transparent, black 16px, black calc(100% - 16px), transparent)";
  } else if (canScrollLeft) {
    maskImage = "linear-gradient(to right, transparent, black 16px)";
  } else if (canScrollRight) {
    maskImage = "linear-gradient(to right, black calc(100% - 24px), transparent)";
  }

  return (
    <div className="fixed bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-50 w-full px-2 sm:px-4 flex justify-center pointer-events-none">
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.5, type: "spring" }}
        className="pointer-events-auto px-1 py-1 sm:px-2 sm:py-2 rounded-[2rem] sm:rounded-full bg-zinc-100/80 dark:bg-black/50 backdrop-blur-xl border border-zinc-200 dark:border-[#155DFC] shadow-lg dark:shadow-[0_0_30px_rgba(0,0,0,0.5)] max-w-full flex items-center"
      >
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          style={maskImage ? { maskImage, WebkitMaskImage: maskImage } : undefined}
          className="flex items-center gap-1.5 sm:gap-2 px-1 py-1 sm:px-2 sm:py-1 max-w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] transition-all"
        >
          {navItems.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => handleNavigation(item.id)}
              whileHover={{ scale: 1.2, y: -5 }}
              whileTap={{ scale: 0.9 }}
              aria-label={t(item.translationKey)}
              className="flex-shrink-0 relative group p-1.5 sm:p-3 rounded-full hover:bg-white dark:hover:bg-white/10 transition-colors"
            >
              <item.icon className="w-5 h-5 sm:w-5 sm:h-5 text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />

              {/* Tooltip */}
              <span className="hidden sm:block absolute -top-10 left-1/2 transform -translate-x-1/2 bg-zinc-900 dark:bg-black/80 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-white/10">
                {t(item.translationKey)}
              </span>
            </motion.button>
          ))}

          <div className="flex-shrink-0 w-px h-6 bg-zinc-300 dark:bg-zinc-700 mx-1 sm:mx-2" />

          <div className="flex-shrink-0 flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800/50 p-1 rounded-lg border border-zinc-200 dark:border-white/5">
            <button
              onClick={() => setLanguage("en")}
              className={`px-2 py-0.5 text-xs font-bold font-mono uppercase rounded-md transition-all ${language === "en"
                ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/70"
                }`}
              title="English"
            >
              EN
            </button>
            <button
              onClick={() => setLanguage("pt-br")}
              className={`px-2 py-0.5 text-xs font-bold font-mono uppercase rounded-md transition-all ${language === "pt-br"
                ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/70"
                }`}
              title="Português"
            >
              PT
            </button>
          </div>

          <div className="flex-shrink-0 w-px h-6 bg-zinc-300 dark:bg-zinc-700 mx-1 sm:mx-2" />

          <div className="flex-shrink-0 flex items-center">
            <ModeToggle />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

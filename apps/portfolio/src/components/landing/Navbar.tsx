import { useState, useRef, useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Home, User, Briefcase, Layers, Mail, Zap } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@limia/design-system";
import { TextSwitch } from "@limia/design-system-src/components/text-switch";
import { ModeToggle } from "../mode-toggle";
import posthog from "posthog-js";
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
  const shouldReduceMotion = useReducedMotion();
  const navigate = useNavigate();
  const location = useLocation();
  const scrollRef = useRef<HTMLUListElement>(null);
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

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return false;

    element.scrollIntoView({ behavior: shouldReduceMotion ? "auto" : "smooth" });
    return true;
  };

  const handleNavigation = (id: string) => {
    posthog.capture("Navbar Clicked", { destination: id });
    if (onNavigate && location.pathname === "/") {
      onNavigate(id);
      return;
    }

    if (scrollToSection(id)) {
      return;
    }

    navigate(`/#${id}`);
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
        initial={shouldReduceMotion ? false : { y: 100, opacity: 0 }}
        animate={shouldReduceMotion ? undefined : { y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.5, type: "spring" }}
        className="pointer-events-auto w-full max-w-full sm:w-max"
      >
        <nav
          aria-label={language === "pt-br" ? "Navegação de seções" : "Section navigation"}
          className="w-full max-w-full rounded-[2rem] border border-border/70 bg-surface-glass px-1 py-1 shadow-lg shadow-black/10 sm:w-max sm:rounded-full sm:px-2 sm:py-2"
        >
          <TooltipProvider delayDuration={120}>
            <div className="flex min-w-0 max-w-full items-center gap-1.5 sm:gap-2">
              <ul
                ref={scrollRef}
                onScroll={checkScroll}
                style={maskImage ? { maskImage, WebkitMaskImage: maskImage } : undefined}
                className="m-0 -my-2 flex min-w-0 max-w-full flex-1 list-none items-center gap-1.5 overflow-x-auto px-1 py-3 sm:-my-2 sm:gap-2 sm:px-2 sm:py-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              >
                {navItems.map((item) => (
                  <li key={item.id} className="flex-shrink-0">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <motion.button
                          type="button"
                          onClick={() => handleNavigation(item.id)}
                          whileHover={shouldReduceMotion ? undefined : { scale: 1.2, y: -5 }}
                          whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
                          aria-label={t(item.translationKey)}
                          className="group flex min-h-11 min-w-11 items-center justify-center rounded-full p-3 transition-colors hover:bg-accent"
                        >
                          <item.icon className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-accent-foreground sm:h-5 sm:w-5" />
                        </motion.button>
                      </TooltipTrigger>
                      <TooltipContent side="top" sideOffset={10}>
                        {t(item.translationKey)}
                      </TooltipContent>
                    </Tooltip>
                  </li>
                ))}
              </ul>

              <div aria-hidden className="mx-1 h-6 w-px flex-shrink-0 bg-border sm:mx-2" />

              <div className="flex flex-shrink-0 items-center gap-1.5 sm:gap-2">
                <TextSwitch
                  checked={language === "pt-br"}
                  onCheckedChange={(checked) => {
                    const newLanguage = checked ? "pt-br" : "en";
                    setLanguage(newLanguage);
                    posthog.capture("Language Changed", { language: newLanguage });
                  }}
                  uncheckedLabel="EN"
                  checkedLabel="PT"
                  aria-label={language === "pt-br" ? "Selecionar idioma" : "Select language"}
                  title={language === "pt-br" ? "Selecionar idioma" : "Select language"}
                  className="h-14 w-24 p-1.5 [&>span]:size-10 [&_[data-slot=text-switch-thumb]]:left-1.5 [&_[data-slot=text-switch-thumb]]:top-1.5 [&_[data-slot=text-switch-thumb]]:size-10 [&_[data-slot=text-switch-thumb][data-state=checked]]:translate-x-11"
                />

                <div aria-hidden className="mx-1 h-6 w-px flex-shrink-0 bg-border sm:mx-2" />

                <div className="[&_[data-slot=theme-switch]]:h-11!">
                  <ModeToggle />
                </div>
              </div>
            </div>
          </TooltipProvider>
        </nav>
      </motion.div>
    </div>
  );
};


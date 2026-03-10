import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { Home, User, Briefcase, Layers, Mail, Zap } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { TextSwitch } from "@limia/design-system";
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

    element.scrollIntoView({ behavior: "smooth" });
    return true;
  };

  const handleNavigation = (id: string) => {
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
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.5, type: "spring" }}
        className="pointer-events-auto max-w-full"
      >
        <nav
          aria-label={language === "pt-br" ? "Navegação de seções" : "Section navigation"}
          className="rounded-[2rem] border border-border/70 bg-background/85 px-1 py-1 shadow-lg shadow-black/10 backdrop-blur-xl sm:rounded-full sm:px-2 sm:py-2"
        >
          <ul
            ref={scrollRef}
            onScroll={checkScroll}
            style={maskImage ? { maskImage, WebkitMaskImage: maskImage } : undefined}
            className="list-none m-0 -my-2 p-0 flex items-center gap-1.5 sm:gap-2 px-1 py-3 sm:-my-2 sm:px-2 sm:py-3 max-w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] transition-all"
          >
            {navItems.map((item) => (
              <li key={item.id} className="flex-shrink-0">
                <motion.button
                  type="button"
                  onClick={() => handleNavigation(item.id)}
                  whileHover={{ scale: 1.2, y: -5 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={t(item.translationKey)}
                  title={t(item.translationKey)}
                  className="group rounded-full p-1.5 transition-colors hover:bg-accent sm:p-3"
                >
                  <item.icon className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-accent-foreground sm:h-5 sm:w-5" />
                </motion.button>
              </li>
            ))}

            <li aria-hidden className="mx-1 h-6 w-px flex-shrink-0 bg-border sm:mx-2" />

            <li className="flex-shrink-0">
              <TextSwitch
                checked={language === "pt-br"}
                onCheckedChange={(checked) => setLanguage(checked ? "pt-br" : "en")}
                uncheckedLabel="EN"
                checkedLabel="PT"
                aria-label={language === "pt-br" ? "Selecionar idioma" : "Select language"}
                title={language === "pt-br" ? "Selecionar idioma" : "Select language"}
              />
            </li>

            <li aria-hidden className="mx-1 h-6 w-px flex-shrink-0 bg-border sm:mx-2" />

            <li className="flex-shrink-0 flex items-center">
              <ModeToggle />
            </li>
          </ul>
        </nav>
      </motion.div>
    </div>
  );
};



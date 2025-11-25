import React from "react";
import { motion } from "motion/react";
import { Home, User, Briefcase, Layers, Mail, Zap } from "lucide-react";

const navItems = [
  { id: "hero", icon: Home, label: "Início" },
  { id: "projects", icon: Briefcase, label: "Projetos" },
  { id: "services", icon: Zap, label: "Serviços" },
  { id: "story", icon: User, label: "Sobre" },
  { id: "stack", icon: Layers, label: "Stack" },
  { id: "contact", icon: Mail, label: "Contato" },
];

export const Navbar = ({ onNavigate }: { onNavigate?: (id: string) => void }) => {
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

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.5, type: "spring" }}
        className="flex items-center gap-2 px-4 py-3 rounded-full bg-black/50 backdrop-blur-xl border border-[#155DFC] shadow-[0_0_30px_rgba(0,0,0,0.5)]"
      >
        {navItems.map((item) => (
          <motion.button
            key={item.id}
            onClick={() => handleNavigation(item.id)}
            whileHover={{ scale: 1.2, y: -5 }}
            whileTap={{ scale: 0.9 }}
            className="relative group p-3 rounded-full hover:bg-white/10 transition-colors"
          >
            <item.icon className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
            
            {/* Tooltip */}
            <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-white/10">
              {item.label}
            </span>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
};

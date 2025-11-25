import React from "react";
import { motion } from "motion/react";
import { Quote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { InteractiveGrid } from "./InteractiveGrid";

const testimonials = [
  {
    name: "Sarah Collins",
    role: "Head of Product @ Fintech",
    text: "A capacidade dele de traduzir requisitos de negócio complexos em interfaces simples é inigualável. O Design System que ele implementou acelerou nosso dev em 40%.",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
  },
  {
    name: "Marcus Chen",
    role: "CTO @ Startup",
    text: "Finalmente um designer que entende de código. A entrega técnica foi perfeita e a animação das interfaces elevou o nível do nosso produto.",
    img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
  },
  {
    name: "Elena Rodriguez",
    role: "Marketing Director",
    text: "Ele não apenas desenha telas, ele cria narrativas. O rebranding que fizemos mudou a percepção da nossa marca no mercado global.",
    img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop"
  }
];

export const Testimonials = () => {
  return (
    <section className="py-32 bg-black relative overflow-hidden">
      <InteractiveGrid variant="subtle" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      
      {/* Background blob */}
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-pulse"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="mb-20 border-b border-white/10 pb-10 flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-2">O que dizem</h2>
                <p className="text-zinc-500 text-lg max-w-md mt-4">
                    Feedback de quem já transformou ideias em realidade comigo.
                </p>
            </div>
            <div className="text-right hidden md:block">
                <span className="text-zinc-600 font-mono text-sm">03 — TESTIMONIALS</span>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
                <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="bg-white/5 border border-white/5 p-8 rounded-2xl relative backdrop-blur-sm group hover:border-blue-500/20 transition-colors"
                >
                    <Quote className="w-10 h-10 text-zinc-700 group-hover:text-blue-500/40 transition-colors mb-6 absolute top-6 right-6" />
                    
                    <p className="text-zinc-300 mb-8 leading-relaxed relative z-10">
                        "{t.text}"
                    </p>
                    
                    <div className="flex items-center gap-4">
                        <Avatar>
                            <AvatarImage src={t.img} />
                            <AvatarFallback>{t.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h4 className="text-white font-bold text-sm">{t.name}</h4>
                            <p className="text-zinc-500 text-xs">{t.role}</p>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
};

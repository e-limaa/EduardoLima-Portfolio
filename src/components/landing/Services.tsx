import React from "react";
import { motion } from "motion/react";
import { PenTool, Layout, Smartphone, Box } from "lucide-react";
import { SectionHeader, Section } from "@antigravity/ds";
import services3dImage from "figma:asset/8926732e6d84f8a31a4ab7a603fb7f29d74326b8.png";
import designSystem3dImage from "figma:asset/ae81cf578fc1b70d1cd9b353a408f5971601e9a0.png";
import mobileExp3dImage from "figma:asset/0fd29a5a04bdb70fda1a96b5dccc2cb95458d271.png";
import visualStrategy3dImage from "figma:asset/f8254b1f94d7f936b0be7dfd62c50373257cfd12.png";

const services = [
  {
    icon: Layout,
    title: "Product Design",
    desc: "Da ideação ao MVP. Transformo requisitos complexos em interfaces intuitivas focadas em conversão e retenção."
  },
  {
    icon: Box,
    title: "Design Systems",
    desc: "Criação de bibliotecas de componentes escaláveis, tokens e documentação para garantir consistência visual e velocidade de dev."
  },
  {
    icon: Smartphone,
    title: "Mobile Experience",
    desc: "Interfaces nativas (iOS/Android) desenhadas pensando nas diretrizes de cada plataforma e na ergonomia do toque."
  },
  {
    icon: PenTool,
    title: "Visual Strategy",
    desc: "Direção de arte e identidade visual digital que posiciona sua marca como líder de mercado através de estética premium."
  }
];

export const Services = () => {
  return (
    <Section id="services" className="py-16 md:py-32">
      <SectionHeader
        title="Expertise"
        description="Metodologias refinadas ao longo de uma década de experiência."
        index="02"
        label="SERVICES"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-zinc-200 dark:bg-white/5 border border-zinc-200 dark:border-white/10 overflow-hidden rounded-3xl backdrop-blur-sm shadow-sm dark:shadow-none">
        {services.map((service, index) => (
          <div key={index} className="bg-background dark:bg-black/40 p-12 group hover:bg-zinc-50 dark:hover:bg-zinc-900/60 transition-colors duration-500 relative overflow-hidden">
            <div className="absolute top-6 right-6 w-32 h-32 opacity-50 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-6">
              <img
                src={[
                  services3dImage,
                  designSystem3dImage,
                  mobileExp3dImage,
                  visualStrategy3dImage
                ][index]}
                alt=""
                className="w-full h-full object-contain"
              />
            </div>

            <service.icon className="w-8 h-8 text-muted-foreground group-hover:text-blue-500 transition-colors duration-500 mb-6 relative z-10" />
            <h3 className="text-2xl font-bold text-foreground mb-4 relative z-10">{service.title}</h3>
            <p className="text-muted-foreground leading-relaxed relative z-10">{service.desc}</p>
          </div>
        ))}
      </div>
    </Section>
  );
};

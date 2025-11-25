import React, { useEffect, useRef } from "react";
import { motion, useMotionTemplate, useMotionValue } from "motion/react";

export const InteractiveGrid = ({ variant = "default" }: { variant?: "default" | "subtle" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const maskSize = variant === "subtle" ? 150 : 300;
  const glowSize = variant === "subtle" ? 200 : 400;
  const gridOpacity = variant === "subtle" ? 0.2 : 0.5;
  const glowColor = variant === "subtle" ? "rgba(59,130,246,0.03)" : "rgba(59,130,246,0.15)";

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      
      // Calculate mouse position relative to the container
      // clientX/Y are relative to viewport. rect.left/top are relative to viewport.
      // So (clientX - rect.left) gives position inside the element.
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Base Grid Pattern - Dark and Subtle */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>

      {/* Interactive Spotlight Grid */}
      {/* This layer is hidden by default and revealed by the mask */}
      <motion.div
        className={`absolute inset-0 bg-[linear-gradient(to_right,#3b82f6_1px,transparent_1px),linear-gradient(to_bottom,#3b82f6_1px,transparent_1px)] bg-[size:4rem_4rem]`}
        style={{
          opacity: gridOpacity,
          maskImage: useMotionTemplate`radial-gradient(${maskSize}px circle at ${mouseX}px ${mouseY}px, black, transparent)`,
          WebkitMaskImage: useMotionTemplate`radial-gradient(${maskSize}px circle at ${mouseX}px ${mouseY}px, black, transparent)`,
        }}
      />
      
      {/* Optional Glow dot for extra pop */}
       <motion.div
        className="absolute w-full h-full pointer-events-none mix-blend-screen"
        style={{
           background: useMotionTemplate`radial-gradient(${glowSize}px circle at ${mouseX}px ${mouseY}px, ${glowColor}, transparent 80%)`
        }}
      />
    </div>
  );
};

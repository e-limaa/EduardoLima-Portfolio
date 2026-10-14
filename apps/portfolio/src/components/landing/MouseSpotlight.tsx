import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion, useSpring } from 'motion/react';

export const MouseSpotlight = () => {
  const [mounted, setMounted] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Use spring for smooth trailing effect like in the reference
  const mouseX = useSpring(0, { stiffness: 100, damping: 30 });
  const mouseY = useSpring(0, { stiffness: 100, damping: 30 });

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      // Half of the 420px glow, so it is centred on the pointer.
      mouseX.set(e.clientX - 210);
      mouseY.set(e.clientY - 210);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // A glow trailing the pointer is decorative motion: skip it when reduced motion is requested.
  if (!mounted || shouldReduceMotion) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 z-0 hidden h-[420px] w-[420px] rounded-full bg-primary/5 blur-[80px] mix-blend-screen pointer-events-none md:block"
      style={{ x: mouseX, y: mouseY }}
    />
  );
};

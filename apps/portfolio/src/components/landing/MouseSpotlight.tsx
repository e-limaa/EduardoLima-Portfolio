import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'motion/react';

export const MouseSpotlight = () => {
  const [mounted, setMounted] = useState(false);

  // Use spring for smooth trailing effect like in the reference
  const mouseX = useSpring(0, { stiffness: 100, damping: 30 });
  const mouseY = useSpring(0, { stiffness: 100, damping: 30 });

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      // Center the spotlight
      mouseX.set(e.clientX - 250);
      mouseY.set(e.clientY - 250);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  if (!mounted) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 z-0 hidden h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px] mix-blend-screen pointer-events-none md:block"
      style={{ x: mouseX, y: mouseY }}
    />
  );
};

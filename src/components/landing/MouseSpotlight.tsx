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
      className="fixed top-0 left-0 w-[500px] h-[500px] bg-blue-500/05 rounded-full blur-[120px] pointer-events-none z-0 mix-blend-screen"
      style={{ x: mouseX, y: mouseY }}
    />
  );
};

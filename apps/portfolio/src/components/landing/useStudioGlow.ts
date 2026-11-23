import type { PointerEvent } from "react";
import { useReducedMotion } from "motion/react";

/**
 * Tracks pointer coordinates into CSS custom properties (`--studio-x`, `--studio-y`,
 * `--studio-active`) so `.studio-glow-surface` cards illuminate without React re-renders.
 */
export function useStudioGlow(disabled = false) {
  const shouldReduceMotion = useReducedMotion();

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (disabled || shouldReduceMotion || event.pointerType === "touch") return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    event.currentTarget.style.setProperty("--studio-x", `${x}px`);
    event.currentTarget.style.setProperty("--studio-y", `${y}px`);
    event.currentTarget.style.setProperty("--studio-active", "1");
  };

  const onPointerLeave = (event: PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty("--studio-active", "0");
  };

  return { onPointerMove, onPointerLeave };
}

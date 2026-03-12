import { useEffect, useState } from "react";

interface DeferredActivationOptions {
  enabled?: boolean;
  delayMs?: number;
  waitForLoad?: boolean;
}

export const useDeferredActivation = ({
  enabled = true,
  delayMs = 0,
  waitForLoad = false,
}: DeferredActivationOptions = {}) => {
  const [isActivated, setIsActivated] = useState(() => !enabled);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") {
      setIsActivated(true);
      return;
    }

    let timeoutId: number | null = null;
    let idleId: number | null = null;

    const activate = () => {
      timeoutId = window.setTimeout(() => {
        setIsActivated(true);
      }, delayMs);
    };

    const scheduleActivation = () => {
      if ("requestIdleCallback" in window) {
        idleId = window.requestIdleCallback(activate, {
          timeout: Math.max(800, delayMs + 400),
        });
        return;
      }

      activate();
    };

    setIsActivated(false);

    if (waitForLoad && document.readyState !== "complete") {
      window.addEventListener("load", scheduleActivation, { once: true });
    } else {
      scheduleActivation();
    }

    return () => {
      window.removeEventListener("load", scheduleActivation);

      if (idleId !== null && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleId);
      }

      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [delayMs, enabled, waitForLoad]);

  return isActivated;
};

"use client";

import type { ComponentProps } from "react";
import { Toaster as Sonner, toast } from "sonner";

type LimiaToasterTheme = "light" | "dark" | "system";

type ToasterProps = Omit<ComponentProps<typeof Sonner>, "theme"> & {
  theme?: LimiaToasterTheme;
};

const Toaster = ({ theme = "system", ...props }: ToasterProps) => {

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster, toast };
export type { ToasterProps, LimiaToasterTheme };


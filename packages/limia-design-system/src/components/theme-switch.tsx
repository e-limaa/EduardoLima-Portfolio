import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { Moon, Sun } from "lucide-react";

import { cn } from "../lib/utils";
import { t } from "../lib/token";

type ThemeSwitchProps = React.ComponentProps<typeof SwitchPrimitive.Root>;

const ThemeSwitch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  ThemeSwitchProps
>(({ checked = false, className, style, ...props }, ref) => {
  const isDark = Boolean(checked);

  return (
    <SwitchPrimitive.Root
      ref={ref}
      data-slot="theme-switch"
      checked={checked}
      className={cn(
        "relative inline-flex h-9.6 w-[4.6rem] shrink-0 items-center justify-between overflow-hidden rounded-full border border-border p-1 backdrop-blur transition-colors outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      style={{ backgroundColor: t("background.layer-2"), ...style }}
      {...props}
    >
      <span className="pointer-events-none relative z-10 flex size-7.5 shrink-0 items-center justify-center">
        <Sun
          className={cn(
            "size-4 transition-colors duration-200",
            isDark ? "text-muted-foreground" : "text-primary-foreground",
          )}
        />
      </span>

      <span className="pointer-events-none relative z-10 flex size-7.5 shrink-0 items-center justify-center">
        <Moon
          className={cn(
            "size-4 transition-colors duration-200",
            isDark ? "text-primary-foreground" : "text-muted-foreground",
          )}
        />
      </span>

      <SwitchPrimitive.Thumb
        data-slot="theme-switch-thumb"
        className="pointer-events-none absolute left-1 top-1 z-0 flex size-7.5 items-center justify-center rounded-full bg-primary ring-1 ring-primary/20 transition-transform duration-200 data-[state=checked]:translate-x-8 data-[state=unchecked]:translate-x-0"
      />
    </SwitchPrimitive.Root>
  );
});
ThemeSwitch.displayName = "ThemeSwitch";

export { ThemeSwitch };

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { Moon, Sun } from "lucide-react";

import { cn } from "../lib/utils";

type ThemeSwitchProps = React.ComponentProps<typeof SwitchPrimitive.Root>;

const ThemeSwitch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  ThemeSwitchProps
>(({ checked = false, className, ...props }, ref) => {
  const isDark = Boolean(checked);
  const ActiveIcon = isDark ? Moon : Sun;
  const InactiveIcon = isDark ? Sun : Moon;

  return (
    <SwitchPrimitive.Root
      ref={ref}
      data-slot="theme-switch"
      checked={checked}
      className={cn(
        "group relative inline-flex h-9.6 w-[4.6rem] shrink-0 items-center justify-between overflow-hidden rounded-full border border-border bg-layer-2 p-1 backdrop-blur transition-colors outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="theme-switch-thumb"
        className="pointer-events-none absolute left-1 top-1 z-10 flex size-7.5 items-center justify-center rounded-full bg-primary text-primary-foreground ring-1 ring-primary/20 transition-transform duration-200 data-[state=checked]:translate-x-8 data-[state=unchecked]:translate-x-0"
      >
        <ActiveIcon className="size-4" />
      </SwitchPrimitive.Thumb>

      <span
        className={cn(
          "pointer-events-none absolute right-1 z-0 flex size-7.5 shrink-0 items-center justify-center text-muted-foreground transition-colors duration-200 group-hover:text-foreground",
          isDark && "left-1 right-auto",
        )}
      >
        <InactiveIcon className="size-4" />
      </span>
    </SwitchPrimitive.Root>
  );
});
ThemeSwitch.displayName = "ThemeSwitch";

export { ThemeSwitch };

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";

import { cn } from "../lib/utils";
import { t } from "../lib/token";

type TextSwitchProps = React.ComponentProps<typeof SwitchPrimitive.Root> & {
  checkedLabel: React.ReactNode;
  uncheckedLabel: React.ReactNode;
};

const TextSwitch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  TextSwitchProps
>(({ checked = false, checkedLabel, uncheckedLabel, className, style, ...props }, ref) => {
  return (
    <SwitchPrimitive.Root
      ref={ref}
      data-slot="text-switch"
      checked={checked}
      className={cn(
        "group relative inline-flex h-9.6 w-[4.6rem] shrink-0 items-center justify-between overflow-hidden rounded-full border border-border p-1 backdrop-blur transition-colors outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      style={{ backgroundColor: t("background.layer-2"), ...style }}
      {...props}
    >
      <span className="pointer-events-none relative z-10 flex size-7.5 shrink-0 items-center justify-center font-mono text-[0.625rem] font-bold uppercase tracking-[0.12em]">
        <span className={cn(checked ? "text-muted-foreground group-hover:text-foreground" : "text-foreground")}>
          {uncheckedLabel}
        </span>
      </span>

      <span className="pointer-events-none relative z-10 flex size-7.5 shrink-0 items-center justify-center font-mono text-[0.625rem] font-bold uppercase tracking-[0.12em]">
        <span className={cn(checked ? "text-foreground" : "text-muted-foreground group-hover:text-foreground")}>
          {checkedLabel}
        </span>
      </span>

      <SwitchPrimitive.Thumb
        data-slot="text-switch-thumb"
        className="pointer-events-none absolute left-1 top-1 z-0 flex size-7.5 items-center justify-center rounded-full border border-border-strong bg-layer-1 ring-1 ring-border/50 transition-transform duration-200 data-[state=checked]:translate-x-8 data-[state=unchecked]:translate-x-0"
      />
    </SwitchPrimitive.Root>
  );
});
TextSwitch.displayName = "TextSwitch";

export { TextSwitch };

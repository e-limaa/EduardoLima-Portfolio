import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@limia/design-system";

export interface StudioSectionHeaderProps {
  index: string;
  label: string;
  title: string;
  description?: string;
  headingId?: string;
  align?: "left" | "stack";
  className?: string;
  children?: ReactNode;
}

export const StudioSectionHeader = ({
  index,
  label,
  title,
  description,
  headingId,
  align = "left",
  className,
  children,
}: StudioSectionHeaderProps) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.header
      initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn("mb-10 md:mb-14", className)}
    >
      <div className="mb-6 flex items-center gap-4">
        <span className="inline-flex items-center gap-2.5 rounded-full border border-border/80 bg-layer-1/80 px-3.5 py-1.5 shadow-xs backdrop-blur-md">
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_10px_var(--action-primary-background)]"
          />
          <span className="font-mono text-xs font-semibold text-primary">
            {index}
          </span>
          <span aria-hidden="true" className="text-border-strong">
            /
          </span>
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
            {label}
          </span>
        </span>
        <span
          aria-hidden="true"
          className="hidden h-px flex-1 bg-gradient-to-r from-border via-border/40 to-transparent sm:block"
        />
      </div>

      <div
        className={cn(
          "flex flex-col gap-6",
          align !== "stack" && "md:flex-row md:items-end md:justify-between"
        )}
      >
        <div>
          <h2
            id={headingId}
            className="text-display-lg md:text-display-xl font-bold tracking-tight text-balance text-foreground"
          >
            {title}
          </h2>
          {description && (
            <p className="mt-4 max-w-2xl text-body-lg leading-relaxed text-pretty text-muted-foreground">
              {description}
            </p>
          )}
        </div>

        {children && <div className="shrink-0">{children}</div>}
      </div>
    </motion.header>
  );
};

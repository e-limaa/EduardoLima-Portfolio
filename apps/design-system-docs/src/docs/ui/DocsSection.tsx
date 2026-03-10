import type { ReactNode } from "react";

import { cn } from "@limia/design-system";

interface DocsSectionProps {
  id: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function DocsSection({
  id,
  title,
  description,
  children,
  className,
}: DocsSectionProps) {
  return (
    <section id={id} className={cn("space-y-4 scroll-mt-24", className)}>
      <div className="space-y-2 border-b border-border pb-4">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        {description && (
          <p className="max-w-2xl text-base leading-7 text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}

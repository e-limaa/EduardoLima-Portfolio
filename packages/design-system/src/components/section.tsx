import React from "react";
import { cn } from "../lib/utils";
import { InteractiveGrid } from "./interactive-grid";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
    variant?: "default" | "subtle";
    grid?: boolean;
    noise?: boolean;
    container?: boolean;
}

export const Section = ({
    children,
    className,
    variant = "subtle",
    grid = true,
    noise = true,
    container = true,
    ...props
}: SectionProps) => {
    return (
        <section
            className={cn(
                "py-16 md:py-32 relative overflow-hidden bg-background transition-colors duration-300",
                className
            )}
            {...props}
        >
            {grid && <InteractiveGrid variant={variant} />}

            {noise && (
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
            )}

            {container ? (
                <div className="w-full px-4 md:px-8 xl:px-12 relative z-10 max-w-[2000px] mx-auto">
                    {children}
                </div>
            ) : children}
        </section>
    );
};

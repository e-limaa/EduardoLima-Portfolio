
import { TextReveal } from "./text-reveal";
import { cn } from "../lib/utils";

export interface SectionHeaderProps {
    title: string;
    description?: string;
    index?: string;
    label?: string;
    className?: string;
    align?: "left" | "center";
}

export const SectionHeader = ({
    title,
    description,
    index,
    label,
    className,
    align = "left"
}: SectionHeaderProps) => {
    return (
        <div className={cn(
            "mb-10 md:mb-20 border-b border-zinc-200 dark:border-white/10 pb-10 flex flex-col md:flex-row justify-between items-end gap-6",
            align === "center" && "text-center md:text-left",
            className
        )}>
            <div>
                <TextReveal>
                    <h2 className="text-heading-lg font-semibold text-foreground mb-2">
                        {title}
                    </h2>
                </TextReveal>
                {description && (
                    <p className="text-muted-foreground text-lg w-full mt-4 max-w-4xl">
                        {description}
                    </p>
                )}
            </div>

            {(index || label) && (
                <div className="text-right hidden md:block shrink-0">
                    <span className="text-muted-foreground font-mono text-sm uppercase">
                        {index && `${index} — `}{label}
                    </span>
                </div>
            )}
        </div>
    );
};

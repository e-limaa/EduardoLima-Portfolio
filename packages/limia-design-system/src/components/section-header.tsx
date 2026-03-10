
import { cn } from "../lib/utils";

export interface SectionHeaderProps {
    title: string;
    description?: string;
    index?: string;
    label?: string;
    headingId?: string;
    className?: string;
    align?: "left" | "center";
    children?: React.ReactNode;
}

export const SectionHeader = ({
    title,
    description,
    index,
    label,
    headingId,
    className,
    align = "left",
    children
}: SectionHeaderProps) => {
    return (
        <header className={cn(
            "mb-10 flex flex-col gap-6 border-b border-border pb-10 md:mb-20 md:flex-row md:items-end md:justify-between",
            align === "center" && "text-center md:text-left",
            className
        )}>
            <hgroup>
                <h2 id={headingId} className="text-heading-lg font-semibold text-foreground mb-2">
                    {title}
                </h2>
                {description && (
                    <p className="text-muted-foreground text-lg w-full mt-4 max-w-4xl">
                        {description}
                    </p>
                )}
            </hgroup>

            <div className="flex items-center gap-4 shrink-0">
                {children}
                {(index || label) && !children && (
                    <div className="text-right hidden md:block">
                        <span className="text-muted-foreground font-mono text-sm uppercase">
                            {index && `${index} — `}{label}
                        </span>
                    </div>
                )}
            </div>
        </header>
    );
};

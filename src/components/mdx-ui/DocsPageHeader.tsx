import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { DocStatus } from '@/app/docs/registry';

interface DocsPageHeaderProps {
    title: string;
    description?: string;
    status?: DocStatus;
    className?: string; // Allow custom classes
}

const statusColorMap: Record<DocStatus, "default" | "secondary" | "outline" | "destructive"> = {
    draft: "secondary",
    beta: "default",
    stable: "outline", // Clean look for stable
    deprecated: "destructive",
};

export function DocsPageHeader({ title, description, status = 'stable', className }: DocsPageHeaderProps) {
    return (
        <div className={cn("space-y-4 pb-8 border-b border-border mb-8", className)}>
            <div className="flex items-center gap-3">
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                    {title}
                </h1>
                {status && (
                    <Badge variant={statusColorMap[status]} className="uppercase text-[10px] tracking-wider font-mono">
                        {status}
                    </Badge>
                )}
            </div>
            {description && (
                <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
                    {description}
                </p>
            )}
        </div>
    );
}

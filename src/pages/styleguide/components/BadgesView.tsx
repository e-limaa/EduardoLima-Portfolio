import React from "react";
import { Badge } from "../../../components/ui/badge";

export default function BadgesView() {
    return (
        <div className="space-y-12">
            <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight text-foreground">
                    Badge
                </h1>
                <p className="text-xl text-muted-foreground">
                    Displays a badge or a component that looks like a badge.
                </p>
            </div>

            <section className="space-y-8">
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                    Examples
                </h2>

                <div className="p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-background space-y-8">

                    <div className="space-y-4">
                        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-widest">
                            Variants
                        </h3>
                        <div className="flex flex-wrap gap-4">
                            <Badge>Default</Badge>
                            <Badge variant="secondary">Secondary</Badge>
                            <Badge variant="outline">Outline</Badge>
                            <Badge variant="destructive">Destructive</Badge>
                        </div>
                    </div>

                    <pre className="bg-zinc-950 text-zinc-50 p-4 rounded-xl text-sm overflow-x-auto">
                        <code>{`<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="destructive">Destructive</Badge>`}</code>
                    </pre>
                </div>
            </section>
        </div>
    );
}

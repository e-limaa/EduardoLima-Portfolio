// This would ideally come from the tokens package, but for docs we can hardcode key intents or map them
// Since we have CSS variables, we can just use them.

const SWATCHES: Record<string, { name: string, token: string, text: string, border?: boolean }[]> = {
    brand: [
        { name: 'Primary', token: 'bg-primary', text: 'text-primary-foreground' },
        { name: 'Secondary', token: 'bg-secondary', text: 'text-secondary-foreground' },
        { name: 'Accent', token: 'bg-accent', text: 'text-accent-foreground' },
    ],
    status: [
        { name: 'Destructive', token: 'bg-destructive', text: 'text-destructive-foreground' },
        { name: 'Muted', token: 'bg-muted', text: 'text-muted-foreground' },
    ],
    backgrounds: [
        { name: 'Background', token: 'bg-background', text: 'text-foreground', border: true },
        { name: 'Card', token: 'bg-card', text: 'text-card-foreground', border: true },
        { name: 'Popover', token: 'bg-popover', text: 'text-popover-foreground', border: true },
    ]
};

const PRIMITIVES = {
    Slate: [
        'bg-slate-50', 'bg-slate-100', 'bg-slate-200', 'bg-slate-300', 'bg-slate-400',
        'bg-slate-500', 'bg-slate-600', 'bg-slate-700', 'bg-slate-800', 'bg-slate-900', 'bg-slate-950'
    ],
    Blue: [
        'bg-blue-50', 'bg-blue-100', 'bg-blue-200', 'bg-blue-300', 'bg-blue-400',
        'bg-blue-500', 'bg-blue-600', 'bg-blue-700', 'bg-blue-800', 'bg-blue-900', 'bg-blue-950'
    ],
    Red: [
        'bg-red-50', 'bg-red-100', 'bg-red-200', 'bg-red-300', 'bg-red-400',
        'bg-red-500', 'bg-red-600', 'bg-red-700', 'bg-red-800', 'bg-red-900', 'bg-red-950'
    ],
};

export function ColorPalette() {
    return (
        <div className="space-y-12">
            {/* Semantic Colors */}
            <div className="space-y-8">
                <h3 className="text-2xl font-bold tracking-tight">Semantic Colors</h3>
                {Object.entries(SWATCHES).map(([category, items]) => (
                    <div key={category}>
                        <h4 className="capitalize text-lg font-semibold mb-4 text-foreground">{category}</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {items.map((item) => (
                                <div key={item.name} className="flex flex-col space-y-2">
                                    <div
                                        className={`h-24 w-full rounded-md flex items-center justify-center border shadow-sm ${item.token} ${item.border ? 'border-border' : 'border-transparent'}`}
                                    >
                                        <span className={`text-sm font-medium ${item.text}`}>Aa</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-foreground">{item.name}</span>
                                        <code className="text-xs text-muted-foreground">{item.token}</code>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Primitive Colors */}
            <div className="space-y-8">
                <h3 className="text-2xl font-bold tracking-tight">Primitives</h3>
                <p className="text-muted-foreground">The raw color scales used to build the semantic system.</p>

                {Object.entries(PRIMITIVES).map(([name, classes]) => (
                    <div key={name}>
                        <h4 className="capitalize text-lg font-semibold mb-4 text-foreground">{name}</h4>
                        <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-11 gap-2">
                            {classes.map((className) => {
                                // Extract step number from class: "bg-slate-500" -> "500"
                                const step = className.split('-').pop();
                                // Naive contrast logic: 50-400 dark text, 500+ light text
                                const textColor = parseInt(step || '0') > 400 ? 'text-white' : 'text-slate-900';

                                return (
                                    <div key={className} className="flex flex-col gap-2">
                                        <div
                                            className={`h-16 w-full rounded-md flex items-center justify-center border shadow-sm ${className} border-transparent`}
                                        >
                                            <span className={`text-xs font-medium ${textColor}`}>{step}</span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

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

export function ColorPalette() {
    return (
        <div className="space-y-8">
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
    );
}

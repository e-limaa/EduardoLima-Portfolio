import React, { useState } from 'react';
import { Button } from '@antigravity/ds';
import { Check, Copy } from 'lucide-react';

// Simple types for controls
type ControlType = 'select' | 'boolean' | 'text';

interface Control {
    name: string;
    type: ControlType;
    options?: string[];
    defaultValue?: any;
}

interface ComponentPlaygroundProps {
    children: (props: any) => React.ReactNode;
    controls: Control[];
    codeTemplate: (props: any) => string;
}

export const ComponentPlayground = ({ children, controls, codeTemplate }: ComponentPlaygroundProps) => {
    // Initialize state from default values
    const [values, setValues] = useState<Record<string, any>>(() => {
        return controls.reduce((acc, control) => {
            acc[control.name] = control.defaultValue;
            return acc;
        }, {} as Record<string, any>);
    });

    const [copied, setCopied] = useState(false);

    const handleChange = (name: string, value: any) => {
        setValues(prev => ({ ...prev, [name]: value }));
    };

    const code = codeTemplate(values).trim();

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="my-8 border rounded-xl bg-background overflow-hidden shadow-sm">
            <div className="flex border-b bg-muted/30">
                <div className="flex-1 p-4 flex items-center justify-center min-h-[200px] bg-[url('/grid-pattern.svg')]">
                    {/* Render children with current prop values */}
                    <div className="scale-100 transition-all duration-200">
                        {children(values)}
                    </div>
                </div>

                {/* Controls Sidebar */}
                <div className="w-64 border-l bg-card p-4 space-y-4">
                    <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-2">Controls</h4>
                    {controls.map(control => (
                        <div key={control.name} className="space-y-1.5">
                            <label className="text-sm font-medium text-foreground capitalize">{control.name}</label>

                            {control.type === 'select' && (
                                <select
                                    className="w-full h-8 text-sm rounded-md border border-input bg-background px-2"
                                    value={values[control.name]}
                                    onChange={(e) => handleChange(control.name, e.target.value)}
                                >
                                    {control.options?.map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            )}

                            {control.type === 'boolean' && (
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id={control.name}
                                        checked={values[control.name]}
                                        onChange={(e) => handleChange(control.name, e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300 text-primary"
                                    />
                                    <label htmlFor={control.name} className="text-xs text-muted-foreground">Enabled</label>
                                </div>
                            )}

                            {control.type === 'text' && (
                                <input
                                    type="text"
                                    value={values[control.name]}
                                    onChange={(e) => handleChange(control.name, e.target.value)}
                                    className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Code Viewer */}
            <div className="bg-zinc-950 p-4 relative group">
                <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="icon" variant="secondary" className="h-8 w-8" onClick={handleCopy}>
                        {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                    </Button>
                </div>
                <pre className="text-sm font-mono text-zinc-50 overflow-x-auto">
                    <code>{code}</code>
                </pre>
            </div>
        </div>
    );
};

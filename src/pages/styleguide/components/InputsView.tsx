import React from "react";

import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";

export default function InputsView() {
    return (
        <div className="space-y-12">
            <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight text-foreground">
                    Input
                </h1>
                <p className="text-xl text-muted-foreground">
                    Displays a form input field or a component that looks like an input field.
                </p>
            </div>

            <section className="space-y-8">
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                    Examples
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Default */}
                    <div className="p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-background space-y-4">
                        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-widest">
                            Default
                        </h3>
                        <div className="flex w-full max-w-sm items-center space-x-2">
                            <Input type="email" placeholder="Email" />
                        </div>
                        <pre className="bg-zinc-950 text-zinc-50 p-4 rounded-xl text-sm overflow-x-auto">
                            <code>{`<Input type="email" placeholder="Email" />`}</code>
                        </pre>
                    </div>

                    {/* With Label */}
                    <div className="p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-background space-y-4">
                        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-widest">
                            With Label
                        </h3>
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label htmlFor="email-2">Email</Label>
                            <Input type="email" id="email-2" placeholder="Email" />
                        </div>
                        <pre className="bg-zinc-950 text-zinc-50 p-4 rounded-xl text-sm overflow-x-auto">
                            <code>{`<div className="grid w-full max-w-sm items-center gap-1.5">
  <Label htmlFor="email">Email</Label>
  <Input type="email" id="email" placeholder="Email" />
</div>`}</code>
                        </pre>
                    </div>

                    {/* Disabled */}
                    <div className="p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-background space-y-4">
                        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-widest">
                            Disabled
                        </h3>
                        <div className="flex w-full max-w-sm items-center space-x-2">
                            <Input disabled type="email" placeholder="Email" />
                        </div>
                        <pre className="bg-zinc-950 text-zinc-50 p-4 rounded-xl text-sm overflow-x-auto">
                            <code>{`<Input disabled type="email" placeholder="Email" />`}</code>
                        </pre>
                    </div>

                    {/* With Button */}
                    <div className="p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-background space-y-4">
                        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-widest">
                            With Button
                        </h3>
                        <div className="flex w-full max-w-sm items-center space-x-2">
                            <Input type="email" placeholder="Email" />
                            <button className="bg-primary text-primary-foreground h-9 px-4 py-2 rounded-full text-sm font-medium hover:bg-primary/90">
                                Subscribe
                            </button>
                        </div>
                        <pre className="bg-zinc-950 text-zinc-50 p-4 rounded-xl text-sm overflow-x-auto">
                            <code>{`<div className="flex w-full max-w-sm items-center space-x-2">
  <Input type="email" placeholder="Email" />
  <Button type="submit">Subscribe</Button>
</div>`}</code>
                        </pre>
                    </div>

                </div>
            </section>
        </div>
    );
}

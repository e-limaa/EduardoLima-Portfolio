import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@antigravity/ds";
import { Button } from "@antigravity/ds";
import { Input } from "@antigravity/ds";
import { Label } from "../../../components/ui/label";

export default function CardsView() {
    return (
        <div className="space-y-12">
            <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight text-foreground">
                    Card
                </h1>
                <p className="text-xl text-muted-foreground">
                    Displays a card with header, content, and footer.
                </p>
            </div>

            <section className="space-y-8">
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                    Examples
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Simple Card */}
                    <div className="p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-background space-y-4">
                        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-widest">
                            Simple Card
                        </h3>
                        <Card className="w-[350px]">
                            <CardHeader>
                                <CardTitle>Create project</CardTitle>
                                <CardDescription>
                                    Deploy your new project in one-click.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form>
                                    <div className="grid w-full items-center gap-4">
                                        <div className="flex flex-col space-y-1.5">
                                            <Label htmlFor="name">Name</Label>
                                            <Input id="name" placeholder="Name of your project" />
                                        </div>
                                    </div>
                                </form>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <Button variant="outline">Cancel</Button>
                                <Button>Deploy</Button>
                            </CardFooter>
                        </Card>

                        <pre className="bg-zinc-950 text-zinc-50 p-4 rounded-xl text-sm overflow-x-auto mt-4">
                            <code>{`<Card className="w-[350px]">
  <CardHeader>
    <CardTitle>Create project</CardTitle>
    <CardDescription>Deploy your new project in one-click.</CardDescription>
  </CardHeader>
  <CardContent>
    ...
  </CardContent>
  <CardFooter className="flex justify-between">
    <Button variant="outline">Cancel</Button>
    <Button>Deploy</Button>
  </CardFooter>
</Card>`}</code>
                        </pre>
                    </div>
                </div>
            </section>
        </div>
    );
}

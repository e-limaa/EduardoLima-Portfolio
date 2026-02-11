import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button, Input } from "@antigravity/ds";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

interface NewsletterFormValues {
    name: string;
    email: string;
}

export const NewsletterModal = () => {
    const [open, setOpen] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);

    const form = useForm<NewsletterFormValues>({
        defaultValues: {
            name: "",
            email: "",
        },
    });

    const onSubmit = async (data: NewsletterFormValues) => {
        setIsLoading(true);
        try {
            const { error } = await supabase
                .from("newsletter_subscribers")
                .insert([
                    {
                        name: data.name,
                        email: data.email,
                    },
                ]);

            if (error) throw error;

            toast.success("Inscrição realizada com sucesso!", {
                description: "Fique de olho no seu e-mail para novidades.",
            });
            setOpen(false);
            form.reset();
        } catch (error: any) {
            console.error("Error subscribing:", error);

            // Check for unique constraint violation (Postgres error code 23505)
            if (error?.code === '23505') {
                toast.error("Você já está cadastrado", {
                    description: "Este e-mail já faz parte da nossa lista.",
                });
            } else {
                toast.error("Erro ao realizar inscrição", {
                    description: "Por favor, tente novamente mais tarde.",
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="rounded-full px-6 py-2 h-auto text-base font-medium border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all">
                    Newsletter
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Entre na minha Newsletter</DialogTitle>
                    <DialogDescription>
                        Receba notícias e insights exclusivos sobre o universo de Inteligência Artificial e tecnologia diretamente no seu e-mail.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            rules={{ required: "Nome é obrigatório" }}
                            render={({ field }: { field: any }) => (
                                <FormItem>
                                    <FormLabel>Nome</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Seu nome" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            rules={{
                                required: "E-mail é obrigatório",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "E-mail inválido",
                                },
                            }}
                            render={({ field }: { field: any }) => (
                                <FormItem>
                                    <FormLabel>E-mail</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="seu@email.com"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter className="pt-4">
                            <Button type="submit" disabled={isLoading} className="w-full">
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Inscrever-se
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog >
    );
};

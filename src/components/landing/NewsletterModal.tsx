import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button, Input, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@antigravity/ds";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import { useLanguage } from "../language-provider";

interface NewsletterFormValues {
    name: string;
    email: string;
}

export const NewsletterModal = () => {
    const [open, setOpen] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const { t } = useLanguage();

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

            toast.success(t("newsletter.toast.success.title"), {
                description: t("newsletter.toast.success.desc"),
            });
            setOpen(false);
            form.reset();
        } catch (error: any) {
            console.error("Error subscribing:", error);

            // Check for unique constraint violation (Postgres error code 23505)
            if (error?.code === '23505') {
                toast.error(t("newsletter.toast.error.duplicateTitle"), {
                    description: t("newsletter.toast.error.duplicateDesc"),
                });
            } else {
                toast.error(t("newsletter.toast.error.generalTitle"), {
                    description: t("newsletter.toast.error.generalDesc"),
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="secondary" className="rounded-full px-6 py-2 h-auto text-base font-medium transition-all">
                    {t("newsletter.trigger")}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t("newsletter.title")}</DialogTitle>
                    <DialogDescription>
                        {t("newsletter.desc")}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            rules={{ required: t("newsletter.form.nameRequired") }}
                            render={({ field }: { field: any }) => (
                                <FormItem>
                                    <FormLabel>{t("newsletter.form.name")}</FormLabel>
                                    <FormControl>
                                        <Input placeholder={t("newsletter.form.namePlaceholder")} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            rules={{
                                required: t("newsletter.form.emailRequired"),
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: t("newsletter.form.emailInvalid"),
                                },
                            }}
                            render={({ field }: { field: any }) => (
                                <FormItem>
                                    <FormLabel>{t("newsletter.form.email")}</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder={t("newsletter.form.emailPlaceholder")}
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
                                {t("newsletter.form.submit")}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog >
    );
};

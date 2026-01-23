import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/utils";

import { t } from "../lib/token";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-[color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive active:scale-95",
    {
        variants: {
            variant: {
                default: "bg-primary text-primary-foreground hover:bg-primary/90 border border-primary/20 hover:shadow-lg",
                destructive:
                    "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 shadow-sm",
                outline:
                    "border bg-transparent text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-900",
                secondary:
                    "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                ghost:
                    "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
                link: "text-primary underline-offset-4 hover:underline",
            },
            size: {
                default: "h-10 px-5 py-2 has-[>svg]:px-3 text-sm",
                sm: "h-8 rounded-full gap-1.5 px-3 has-[>svg]:px-2.5 text-xs",
                lg: "h-12 rounded-full px-8 has-[>svg]:px-6 text-base",
                xl: "h-14 rounded-full px-10 text-lg font-bold",
                icon: "size-10 rounded-full",
                "icon-xs": "size-7 rounded-full",
                "icon-sm": "size-8 rounded-full",
                "icon-md": "size-9 rounded-full",
                "icon-lg": "size-12 rounded-full",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    },
);

const Button = React.forwardRef<
    HTMLButtonElement,
    React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
        asChild?: boolean;
    }
>(({ className, variant, size, asChild = false, style, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    // Example of Safe Token Consumption (Dogfooding)
    // We explicitly use the token helper for complex values Tailwind doesn't map easily.
    const dynamicStyles = variant === 'default' ? {
        boxShadow: `0 0 20px ${t('action.primary.background')}`, // Uses the token value!
        ...style
    } : style;

    return (
        <Comp
            data-slot="button"
            className={cn(buttonVariants({ variant, size, className }))}
            ref={ref}
            style={dynamicStyles}
            {...props}
        />
    );
});
Button.displayName = "Button";

export { Button, buttonVariants };

import React from 'react';

const TypeSpec = ({ role, token, weight, size, children }: { role: string; token?: string; weight?: string; size?: string; children: React.ReactNode }) => (
    <div className="flex flex-col md:flex-row md:items-baseline gap-4 py-8 border-b border-border last:border-0">
        <div className="md:w-1/4 space-y-1">
            <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">{role}</p>
            {token && <p className="font-mono text-[10px] text-muted-foreground opacity-70">{token}</p>}
            <div className="flex gap-2 text-[10px] text-muted-foreground font-mono mt-1">
                {weight && <span>{weight}</span>}
                {size && <span>{size}</span>}
            </div>
        </div>
        <div className="md:w-3/4">
            {children}
        </div>
    </div>
);

export const TypographyView = () => {
    return (
        <div className="space-y-12">
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-4">Tipografia</h1>
                <p className="text-xl text-muted-foreground max-w-3xl">
                    Utilizamos a família <strong>Inter</strong> para toda a interface, garantindo clareza e neutralidade.
                </p>
            </div>

            <div className="border rounded-xl border-border bg-card px-8">
                <TypeSpec role="H1 Display" token="text-3xl / 4xl / 5xl" weight="Medium/Bold" size="Various">
                    <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                        The quick brown fox
                    </h1>
                </TypeSpec>

                <TypeSpec role="H2 Section" token="text-3xl" weight="Semibold" size="30px">
                    <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                        Jumps over the lazy dog
                    </h2>
                </TypeSpec>

                <TypeSpec role="H3 Subsection" token="text-2xl" weight="Semibold" size="24px">
                    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                        Design Systems are products
                    </h3>
                </TypeSpec>

                <TypeSpec role="H4 Title" token="text-xl" weight="Semibold" size="20px">
                    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                        Consistency matters
                    </h4>
                </TypeSpec>

                <TypeSpec role="P Body" token="text-base" weight="Regular (400)" size="16px">
                    <p className="leading-7 [&:not(:first-child)]:mt-6">
                        A tipografia é o elemento mais onipresente na interface. Uma boa escala tipográfica
                        cria ritmo e hierarquia natural. Usamos <code>leading-7</code> para parágrafos longos
                        para melhorar a legibilidade.
                    </p>
                </TypeSpec>

                <TypeSpec role="Blockquote" token="italic" weight="Medium" size="16px">
                    <blockquote className="mt-6 border-l-2 pl-6 italic text-muted-foreground">
                        "Good design is obvious. Great design is transparent."
                    </blockquote>
                </TypeSpec>

                <TypeSpec role="Small" token="text-sm" weight="Medium/Regular" size="14px">
                    <p className="text-sm font-medium leading-none">
                        Email address
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                        Enter your email address.
                    </p>
                </TypeSpec>

                <TypeSpec role="Muted" token="text-sm + text-muted-foreground" weight="Regular" size="14px">
                    <p className="text-sm text-muted-foreground">
                        Texto de apoio ou metadados geralmente usam a cor muted-foreground.
                    </p>
                </TypeSpec>

                <TypeSpec role="Inline Code" token="bg-muted + font-mono" weight="Regular" size="14px">
                    <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                        @design-system/typography
                    </code>
                </TypeSpec>
            </div>
        </div>
    );
};

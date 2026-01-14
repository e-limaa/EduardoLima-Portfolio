import React from "react";
import { useLanguage } from "../language-provider";

export const TypographyDemo = () => {
    const { language } = useLanguage();

    const text = {
        display: {
            title: language === 'pt-br' ? 'Display' : 'Display',
            desc: language === 'pt-br' ? 'Usado para elementos de alto impacto e heros.' : 'Used for high-impact elements and heros.',
        },
        headings: {
            title: language === 'pt-br' ? 'Cabeçalhos' : 'Headings',
            desc: language === 'pt-br' ? 'Mapeados automaticamente para as tags HTML h1-h4.' : 'Automatically mapped to HTML h1-h4 tags.',
        },
        body: {
            title: language === 'pt-br' ? 'Corpo & Texto' : 'Body & Text',
            desc: language === 'pt-br' ? 'Usado para conteúdo geral.' : 'Used for general content.',
            sampleLg: language === 'pt-br' ? 'A tipografia é o elemento mais onipresente na UI.' : 'Typography is the most ubiquitous element in UI.',
            sampleMd: language === 'pt-br' ? 'Texto padrão do corpo da página.' : 'Default body text.',
            sampleSm: language === 'pt-br' ? 'Texto secundário ou detalhes.' : 'Secondary text or details.',
            sampleCaption: language === 'pt-br' ? 'Legendas e metadados.' : 'Captions and metadata.',
        }
    };

    return (
        <div className="space-y-12 my-6">
            {/* Display Section */}
            <div>
                <h3 className="text-xl font-semibold mb-6 pb-2 border-b">{text.display.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{text.display.desc}</p>
                <div className="rounded-xl border border-border bg-card px-8 text-foreground">
                    <div className="flex flex-col md:flex-row md:items-baseline gap-4 py-8 border-b border-border">
                        <div className="md:w-1/4 space-y-1">
                            <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">Display 2XL</p>
                            <p className="font-mono text-[10px] text-muted-foreground opacity-70">.text-display-2xl (72px)</p>
                        </div>
                        <div className="md:w-3/4">
                            <div className="text-display-2xl font-bold">
                                Display 2XL
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-baseline gap-4 py-8 border-b border-border">
                        <div className="md:w-1/4 space-y-1">
                            <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">Display XL</p>
                            <p className="font-mono text-[10px] text-muted-foreground opacity-70">.text-display-xl (60px)</p>
                        </div>
                        <div className="md:w-3/4">
                            <div className="text-display-xl font-bold">
                                Display XL
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-baseline gap-4 py-8 border-b border-border">
                        <div className="md:w-1/4 space-y-1">
                            <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">Display LG</p>
                            <p className="font-mono text-[10px] text-muted-foreground opacity-70">.text-display-lg (48px)</p>
                        </div>
                        <div className="md:w-3/4">
                            <div className="text-display-lg font-bold">
                                Display LG
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Heading Section */}
            <div>
                <h3 className="text-xl font-semibold mb-6 pb-2 border-b">{text.headings.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{text.headings.desc}</p>
                <div className="rounded-xl border border-border bg-card px-8 text-foreground">
                    <div className="flex flex-col md:flex-row md:items-baseline gap-4 py-8 border-b border-border">
                        <div className="md:w-1/4 space-y-1">
                            <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">H1 (Heading XL)</p>
                            <p className="font-mono text-[10px] text-muted-foreground opacity-70">.text-heading-xl (36px)</p>
                        </div>
                        <div className="md:w-3/4">
                            <h1 className="text-heading-xl font-bold m-0 p-0 border-0">Heading XL</h1>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-baseline gap-4 py-8 border-b border-border">
                        <div className="md:w-1/4 space-y-1">
                            <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">H2 (Heading LG)</p>
                            <p className="font-mono text-[10px] text-muted-foreground opacity-70">.text-heading-lg (30px)</p>
                        </div>
                        <div className="md:w-3/4">
                            <h2 className="text-heading-lg font-semibold m-0 p-0 border-0">Heading LG</h2>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-baseline gap-4 py-8 border-b border-border">
                        <div className="md:w-1/4 space-y-1">
                            <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">H3 (Heading MD)</p>
                            <p className="font-mono text-[10px] text-muted-foreground opacity-70">.text-heading-md (24px)</p>
                        </div>
                        <div className="md:w-3/4">
                            <h3 className="text-heading-md font-semibold m-0 p-0">Heading MD</h3>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-baseline gap-4 py-8 border-b border-border">
                        <div className="md:w-1/4 space-y-1">
                            <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">H4 (Heading SM)</p>
                            <p className="font-mono text-[10px] text-muted-foreground opacity-70">.text-heading-sm (20px)</p>
                        </div>
                        <div className="md:w-3/4">
                            <h4 className="text-heading-sm font-semibold m-0 p-0">Heading SM</h4>
                        </div>
                    </div>
                </div>
            </div>

            {/* Body Section */}
            <div>
                <h3 className="text-xl font-semibold mb-6 pb-2 border-b">{text.body.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{text.body.desc}</p>
                <div className="rounded-xl border border-border bg-card px-8 text-foreground">
                    <div className="flex flex-col md:flex-row md:items-baseline gap-4 py-8 border-b border-border">
                        <div className="md:w-1/4 space-y-1">
                            <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">Body LG</p>
                            <p className="font-mono text-[10px] text-muted-foreground opacity-70">.text-body-lg (18px)</p>
                        </div>
                        <div className="md:w-3/4">
                            <div className="text-body-lg">
                                {text.body.sampleLg}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-baseline gap-4 py-8 border-b border-border">
                        <div className="md:w-1/4 space-y-1">
                            <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">Body MD (Default)</p>
                            <p className="font-mono text-[10px] text-muted-foreground opacity-70">.text-body-md (16px)</p>
                        </div>
                        <div className="md:w-3/4">
                            <div className="text-body-md">{text.body.sampleMd}</div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-baseline gap-4 py-8 border-b border-border">
                        <div className="md:w-1/4 space-y-1">
                            <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">Body SM</p>
                            <p className="font-mono text-[10px] text-muted-foreground opacity-70">.text-body-sm (14px)</p>
                        </div>
                        <div className="md:w-3/4">
                            <div className="text-body-sm">
                                {text.body.sampleSm}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-baseline gap-4 py-8 border-b border-border">
                        <div className="md:w-1/4 space-y-1">
                            <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">Caption</p>
                            <p className="font-mono text-[10px] text-muted-foreground opacity-70">.text-caption (12px)</p>
                        </div>
                        <div className="md:w-3/4">
                            <div className="text-caption text-muted-foreground">
                                {text.body.sampleCaption}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

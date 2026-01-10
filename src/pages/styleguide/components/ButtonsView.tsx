import React from 'react';
import { Button } from '@antigravity/ds';
import { Loader2, Mail, ArrowUpRight } from 'lucide-react';

const VariantSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider font-mono border-b border-border pb-2">{title}</h3>
        <div className="flex flex-wrap gap-4 items-center">
            {children}
        </div>
    </div>
);

const CodeBlock = ({ code }: { code: string }) => (
    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs font-mono border border-border">
        <code>{code}</code>
    </pre>
);

export const ButtonsView = () => {
    return (
        <div className="space-y-16">
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-4">Botões</h1>
                <p className="text-xl text-muted-foreground max-w-3xl">
                    Elementos interativos para ações do usuário. Suporta múltiplas variantes, tamanhos e estados.
                </p>
                <div className="mt-6 flex gap-4">
                    <Button>Install Component</Button>
                    <a href="https://ui.shadcn.com/docs/components/button" target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline flex items-center">
                        Docs Oficiais <ArrowUpRight className="ml-1 w-3 h-3" />
                    </a>
                </div>
            </div>

            <div className="grid gap-12 p-8 border border-border rounded-xl bg-card">
                <VariantSection title="Variantes de Estilo">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 items-center">
                        <div className="space-y-2">
                            <Button variant="default">Primary</Button>
                            <p className="text-xs text-muted-foreground">Ação principal</p>
                        </div>
                        <div className="space-y-2">
                            <Button variant="secondary">Secondary</Button>
                            <p className="text-xs text-muted-foreground">Ação secundária</p>
                        </div>
                        <div className="space-y-2">
                            <Button variant="destructive">Destructive</Button>
                            <p className="text-xs text-muted-foreground">Ações de perigo</p>
                        </div>
                        <div className="space-y-2">
                            <Button variant="outline">Outline</Button>
                            <p className="text-xs text-muted-foreground">Baixa ênfase</p>
                        </div>
                        <div className="space-y-2">
                            <Button variant="ghost">Ghost</Button>
                            <p className="text-xs text-muted-foreground">Botões 'invisíveis'</p>
                        </div>
                        <div className="space-y-2">
                            <Button variant="link">Link</Button>
                            <p className="text-xs text-muted-foreground">Aparência de link</p>
                        </div>
                    </div>
                </VariantSection>

                <VariantSection title="Tamanhos">
                    <div className="flex items-end gap-4">
                        <Button size="lg">Large (lg)</Button>
                        <Button size="default">Default</Button>
                        <Button size="sm">Small (sm)</Button>
                        <Button size="icon" variant="outline" title="Icon Only"><Mail className="h-4 w-4" /></Button>
                    </div>
                </VariantSection>

                <VariantSection title="Com Ícones">
                    <div className="flex flex-wrap gap-4">
                        <Button>
                            <Mail className="mr-2 h-4 w-4" /> Login with Email
                        </Button>
                        <Button variant="secondary">
                            See Details <ArrowUpRight className="ml-2 h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                            <Loader2 className="h-4 w-4 animate-spin" />
                        </Button>
                    </div>
                </VariantSection>

                <VariantSection title="Estados">
                    <div className="flex gap-4">
                        <Button disabled>Disabled</Button>
                        <Button disabled variant="secondary">Disabled Secondary</Button>
                        <Button disabled>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Please wait
                        </Button>
                    </div>
                </VariantSection>
            </div>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight">Uso e Código</h2>
                <div className="grid lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <h3 className="font-medium text-sm text-muted-foreground uppercase">Importação</h3>
                        <CodeBlock code={`import { Button } from "@antigravity/ds"`} />

                        <h3 className="font-medium text-sm text-muted-foreground uppercase pt-4">Exemplos Práticos</h3>
                        <CodeBlock code={`// Primary Action
<Button onClick={submit}>
  Salvar Alterações
</Button>

// Secondary with Icon
<Button variant="secondary" size="sm">
  <Mail className="mr-2 h-4 w-4" />
  Contato
</Button>

// Loading State
<Button disabled>
  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  Processando...
</Button>`} />
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-medium text-sm text-muted-foreground uppercase">Tabela de Props</h3>
                        <div className="border border-border rounded-lg overflow-hidden text-sm">
                            <table className="w-full text-left">
                                <thead className="bg-muted text-muted-foreground font-medium">
                                    <tr>
                                        <th className="p-3 border-b border-border">Prop</th>
                                        <th className="p-3 border-b border-border">Tipo</th>
                                        <th className="p-3 border-b border-border">Default</th>
                                        <th className="p-3 border-b border-border">Descrição</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    <tr className="bg-card">
                                        <td className="p-3 font-mono text-xs">variant</td>
                                        <td className="p-3 text-xs opacity-70">'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'</td>
                                        <td className="p-3 text-xs font-mono">default</td>
                                        <td className="p-3 text-xs">Estilo visual do botão.</td>
                                    </tr>
                                    <tr className="bg-card">
                                        <td className="p-3 font-mono text-xs">size</td>
                                        <td className="p-3 text-xs opacity-70">'default' | 'sm' | 'lg' | 'icon'</td>
                                        <td className="p-3 text-xs font-mono">default</td>
                                        <td className="p-3 text-xs">Tamanho do botão.</td>
                                    </tr>
                                    <tr className="bg-card">
                                        <td className="p-3 font-mono text-xs">asChild</td>
                                        <td className="p-3 text-xs opacity-70">boolean</td>
                                        <td className="p-3 text-xs font-mono">false</td>
                                        <td className="p-3 text-xs">Se true, renderiza o filho como o elemento raiz (Pattern Slot).</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

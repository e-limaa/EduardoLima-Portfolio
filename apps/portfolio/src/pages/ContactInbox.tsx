import { useMemo, useState } from 'react';
import { ArrowLeft, Building2, Inbox, Mail, Phone, Search } from 'lucide-react';
import { Badge, Button, Card, Input } from '@limia/design-system';
import type { ContactRow } from '../lib/portfolio-api';

const whatsappLink = (phone: string) => {
    const digits = phone.replace(/\D/g, '');
    // Brazilian numbers are often typed without the country code.
    const international = digits.length <= 11 ? `55${digits}` : digits;
    return `https://wa.me/${international}`;
};

export const ContactInbox = ({
    contacts,
    loading,
    onOpen,
}: {
    contacts: ContactRow[];
    loading: boolean;
    onOpen: (contact: ContactRow) => void;
}) => {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const filtered = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        if (!term) return contacts;
        return contacts.filter((contact) =>
            [contact.name, contact.email, contact.phone, contact.company, contact.message]
                .some((value) => value?.toLowerCase().includes(term))
        );
    }, [contacts, searchTerm]);

    const selected = contacts.find((contact) => contact.id === selectedId) ?? null;

    const open = (contact: ContactRow) => {
        setSelectedId(contact.id);
        if (!contact.is_read) onOpen(contact);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
            <Card className={`flex h-full flex-col overflow-hidden border-border bg-card/95 ${selected ? 'hidden lg:flex' : 'flex'}`}>
                <div className="border-b border-border p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar nome, email ou mensagem..."
                            aria-label="Buscar contatos"
                            className="bg-input-background pl-9"
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    <div className="flex flex-col gap-1 p-2">
                        {loading ? (
                            <div className="text-center p-4 text-muted-foreground">Carregando...</div>
                        ) : filtered.length === 0 ? (
                            <div className="text-center p-4 text-muted-foreground">
                                {contacts.length === 0 ? 'Nenhuma mensagem de contato ainda.' : 'Nenhum contato encontrado.'}
                            </div>
                        ) : filtered.map((contact) => (
                            <button
                                key={contact.id}
                                onClick={() => open(contact)}
                                className={`flex flex-col items-start gap-1 rounded-lg border p-3 text-left transition-colors ${selectedId === contact.id ? 'border-primary/30 bg-primary/10' : 'border-transparent hover:bg-muted/40'}`}
                            >
                                <div className="flex items-center justify-between w-full gap-2">
                                    <span className={`truncate text-sm ${contact.is_read ? 'text-foreground/80' : 'font-semibold text-foreground'}`}>
                                        {contact.name}
                                    </span>
                                    <div className="flex shrink-0 items-center gap-2">
                                        <span className="text-[10px] text-muted-foreground">{new Date(contact.created_at).toLocaleDateString()}</span>
                                        {!contact.is_read && (
                                            <Badge className="h-5 rounded-full px-1.5 text-[10px]">Novo</Badge>
                                        )}
                                    </div>
                                </div>
                                <p className="w-full line-clamp-1 text-sm text-muted-foreground">{contact.message}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </Card>

            <Card className={`col-span-1 flex h-full flex-col overflow-hidden border-border bg-card/95 lg:col-span-2 ${selected ? 'flex' : 'hidden lg:flex'}`}>
                {selected ? (
                    <>
                        <div className="flex items-center justify-between gap-2 border-b border-border bg-muted/20 p-4">
                            <div className="flex min-w-0 items-center gap-2">
                                <Button variant="ghost" size="icon" className="mr-1 min-h-11 min-w-11 lg:hidden" onClick={() => setSelectedId(null)} aria-label="Voltar para contatos">
                                    <ArrowLeft className="w-4 h-4" />
                                </Button>
                                <div className="min-w-0">
                                    <h2 className="truncate font-semibold">{selected.name}</h2>
                                    <p className="text-xs text-muted-foreground">{new Date(selected.created_at).toLocaleString()}</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => setSelectedId(null)}>
                                Fechar
                            </Button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6">
                            <dl className="mb-6 grid gap-3 text-sm sm:grid-cols-2">
                                {selected.email && (
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                                        <dt className="sr-only">Email</dt>
                                        <dd><a className="text-primary underline-offset-4 hover:underline" href={`mailto:${selected.email}`}>{selected.email}</a></dd>
                                    </div>
                                )}
                                {selected.phone && (
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                                        <dt className="sr-only">Telefone</dt>
                                        <dd className="flex flex-wrap gap-x-3">
                                            <a className="text-primary underline-offset-4 hover:underline" href={`tel:${selected.phone}`}>{selected.phone}</a>
                                            <a className="text-primary underline-offset-4 hover:underline" href={whatsappLink(selected.phone)} target="_blank" rel="noopener noreferrer">WhatsApp</a>
                                        </dd>
                                    </div>
                                )}
                                {selected.company && (
                                    <div className="flex items-center gap-2">
                                        <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                                        <dt className="sr-only">Empresa</dt>
                                        <dd>{selected.company}</dd>
                                    </div>
                                )}
                            </dl>
                            <p className="whitespace-pre-wrap rounded-2xl border border-border bg-muted/40 p-4 text-sm">{selected.message}</p>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-1 flex-col items-center justify-center gap-4 text-muted-foreground">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/50">
                            <Inbox className="w-8 h-8 opacity-20" />
                        </div>
                        <p>Selecione um contato para ver a mensagem</p>
                    </div>
                )}
            </Card>
        </div>
    );
};

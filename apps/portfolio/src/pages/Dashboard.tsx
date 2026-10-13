import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import {
    ApiError,
    getAdminContacts,
    getAdminInteractions,
    markAdminContactRead,
    markAdminSessionRead,
    notifyAuthInvalidated,
    requestAuthRefresh,
    logoutAdmin,
    type ContactRow,
    type InteractionRow,
} from '../lib/portfolio-api';
import { Alert, AlertDescription, AlertTitle, Badge, Button, Card, CardContent, CardHeader, CardTitle, Input, t as token } from '@limia/design-system';
import { Search, MessageSquare, BarChart, User, Bot, ArrowLeft, Inbox } from 'lucide-react';
import { ContactInbox } from './ContactInbox';
import { useNavigate } from 'react-router-dom';
import { BarChart as RechartsBar, Bar, ResponsiveContainer } from 'recharts';

// UI Interface (Flattened)
interface ChatMessage {
    id: string;
    session_id: string;
    content: string;
    role: 'user' | 'assistant';
    created_at: string;
    is_read: boolean;
}

export const Dashboard = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const lifecycleRef = useRef(0);
    const dataRevisionRef = useRef(0);
    const fetchSequenceRef = useRef(0);
    const activeFetchRef = useRef<number | null>(null);
    const refreshQueuedRef = useRef(false);
    const hasLoadedRef = useRef(false);
    const authInvalidatedRef = useRef(false);
    const markingSessionsRef = useRef(new Set<string>());

    const [view, setView] = useState<'chat' | 'contacts'>('chat');
    const [contacts, setContacts] = useState<ContactRow[]>([]);
    const [contactsLoading, setContactsLoading] = useState(true);
    const unreadContacts = contacts.filter((contact) => !contact.is_read).length;

    const handleAuthError = useCallback((err: unknown) => {
        if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
            authInvalidatedRef.current = true;
            setMessages([]);
            setContacts([]);
            notifyAuthInvalidated(err.status);
            return true;
        }
        return false;
    }, []);

    const fetchContacts = useCallback(async () => {
        if (authInvalidatedRef.current || document.visibilityState !== 'visible') return;
        try {
            const { contacts: rows } = await getAdminContacts();
            setContacts(rows);
        } catch (err: unknown) {
            if (!handleAuthError(err)) {
                console.error('Dashboard contacts error:', err);
                setError(err instanceof Error ? err.message : 'Erro desconhecido ao carregar contatos.');
            }
        } finally {
            setContactsLoading(false);
        }
    }, [handleAuthError]);

    // Contacts change rarely: poll every 30 seconds while the tab is visible.
    useEffect(() => {
        void fetchContacts();
        const intervalId = window.setInterval(() => void fetchContacts(), 30000);
        const handleVisibility = () => {
            if (document.visibilityState === 'visible') void fetchContacts();
        };
        document.addEventListener('visibilitychange', handleVisibility);
        return () => {
            window.clearInterval(intervalId);
            document.removeEventListener('visibilitychange', handleVisibility);
        };
    }, [fetchContacts]);

    const markContactAsRead = async (contact: ContactRow) => {
        setContacts((prev) => prev.map((row) => row.id === contact.id ? { ...row, is_read: true } : row));
        try {
            await markAdminContactRead(contact.id);
        } catch (markError) {
            if (!handleAuthError(markError)) {
                setError(markError instanceof Error ? markError.message : 'Nao foi possivel marcar o contato como lido.');
                void fetchContacts();
            }
        }
    };

    const fetchMessages = useCallback(async () => {
        if (authInvalidatedRef.current) return;
        if (document.visibilityState !== 'visible') return;
        if (activeFetchRef.current !== null) {
            refreshQueuedRef.current = true;
            return;
        }

        const fetchToken = ++fetchSequenceRef.current;
        const lifecycle = lifecycleRef.current;
        const revision = dataRevisionRef.current;
        activeFetchRef.current = fetchToken;
        if (!hasLoadedRef.current) setLoading(true);

        try {
            const { interactions } = await getAdminInteractions();
            if (lifecycleRef.current !== lifecycle || dataRevisionRef.current !== revision) return;

            const transformedMessages: ChatMessage[] = [];
            [...interactions].sort((left, right) =>
                new Date(left.timestamp).getTime() - new Date(right.timestamp).getTime()
            ).forEach((row: InteractionRow) => {
                const sessionId = row.session_id || 'unknown';

                if (row.user_message) {
                    transformedMessages.push({
                        id: `${row.id}-user`,
                        session_id: sessionId,
                        content: row.user_message,
                        role: 'user',
                        created_at: row.timestamp,
                        is_read: row.is_read,
                    });
                }

                if (row.ai_response) {
                    transformedMessages.push({
                        id: `${row.id}-ai`,
                        session_id: sessionId,
                        content: row.ai_response,
                        role: 'assistant',
                        created_at: row.timestamp,
                        is_read: row.is_read,
                    });
                }
            });

            setMessages(transformedMessages);
            setError(null);
            hasLoadedRef.current = true;
        } catch (err: unknown) {
            if (lifecycleRef.current !== lifecycle || dataRevisionRef.current !== revision) return;

            if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
                authInvalidatedRef.current = true;
                setMessages([]);
                notifyAuthInvalidated(err.status);
            } else {
                console.error('Dashboard API error:', err);
                setError(err instanceof Error ? err.message : 'Erro desconhecido ao carregar conversas.');
            }
            hasLoadedRef.current = true;
        } finally {
            if (lifecycleRef.current === lifecycle && activeFetchRef.current === fetchToken) {
                activeFetchRef.current = null;
                setLoading(false);
                if (refreshQueuedRef.current) {
                    refreshQueuedRef.current = false;
                    queueMicrotask(() => void fetchMessages());
                }
            }
        }
    }, []);

    useEffect(() => {
        lifecycleRef.current += 1;
        let intervalId: number | undefined;

        const stopPolling = () => {
            if (intervalId !== undefined) {
                window.clearInterval(intervalId);
                intervalId = undefined;
            }
        };

        const startPolling = () => {
            if (document.visibilityState !== 'visible' || intervalId !== undefined) return;
            void fetchMessages();
            intervalId = window.setInterval(() => void fetchMessages(), 5000);
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                startPolling();
            } else {
                stopPolling();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        startPolling();

        return () => {
            lifecycleRef.current += 1;
            activeFetchRef.current = null;
            refreshQueuedRef.current = false;
            stopPolling();
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [fetchMessages]);

    const markSessionAsRead = async (sessionId: string) => {
        if (sessionId === 'unknown' || markingSessionsRef.current.has(sessionId)) return;
        if (!messages.some((message) => message.session_id === sessionId && !message.is_read)) return;

        markingSessionsRef.current.add(sessionId);
        dataRevisionRef.current += 1;
        setMessages(prev => prev.map(message =>
            message.session_id === sessionId ? { ...message, is_read: true } : message
        ));

        try {
            await markAdminSessionRead(sessionId);
        } catch (markError) {
            if (markError instanceof ApiError && (markError.status === 401 || markError.status === 403)) {
                authInvalidatedRef.current = true;
                setMessages([]);
                notifyAuthInvalidated(markError.status);
            } else {
                console.error('Error marking session as read:', markError);
                setError(markError instanceof Error ? markError.message : 'Nao foi possivel marcar a conversa como lida.');
            }
        } finally {
            markingSessionsRef.current.delete(sessionId);
            if (!authInvalidatedRef.current) void fetchMessages();
        }
    };

    const handleSessionClick = (sessionId: string) => {
        setSelectedSessionId(sessionId);
        void markSessionAsRead(sessionId);
    };

    const handleSignOut = async () => {
        try {
            await logoutAdmin();
            authInvalidatedRef.current = true;
            setMessages([]);
            notifyAuthInvalidated(401);
        } catch (signOutError) {
            if (signOutError instanceof ApiError && (signOutError.status === 401 || signOutError.status === 403)) {
                authInvalidatedRef.current = true;
                setMessages([]);
                notifyAuthInvalidated(signOutError.status);
            } else {
                setError(signOutError instanceof Error ? signOutError.message : 'Nao foi possivel sair agora.');
                requestAuthRefresh();
            }
        }
    };

    // Group messages by session
    const sessions = useMemo(() => {
        const grouped: Record<string, ChatMessage[]> = {};
        messages.forEach(msg => {
            const sid = msg.session_id;
            if (!grouped[sid]) grouped[sid] = [];
            grouped[sid].push(msg);
        });

        // Sort sessions by latest message timestamp
        return Object.entries(grouped).sort(([, a], [, b]) => {
            const lastA = new Date(a[a.length - 1].created_at).getTime();
            const lastB = new Date(b[b.length - 1].created_at).getTime();
            return lastB - lastA;
        });
    }, [messages]);

    // Filtered sessions
    const filteredSessions = useMemo(() => {
        return sessions.filter(([sid, msgs]) => {
            const matchesId = sid.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesContent = msgs.some(m => m.content.toLowerCase().includes(searchTerm.toLowerCase()));
            return matchesId || matchesContent;
        });
    }, [sessions, searchTerm]);

    const activeMessages = useMemo(() => {
        if (!selectedSessionId) return [];
        return sessions.find(([sid]) => sid === selectedSessionId)?.[1] || [];
    }, [selectedSessionId, sessions]);

    // Analytics
    const stats = useMemo(() => {
        const totalSessions = sessions.length;
        const totalMessages = messages.length;
        const userMessages = messages.filter(m => m.role === 'user').length;
        const botMessages = messages.filter(m => m.role === 'assistant').length;

        return { totalSessions, totalMessages, userMessages, botMessages };
    }, [sessions, messages]);

    // Graph Data: Messages per Day
    const activityData = useMemo(() => {
        const counts: Record<string, number> = {};
        messages.forEach(m => {
            const date = new Date(m.created_at).toLocaleDateString();
            counts[date] = (counts[date] || 0) + 1;
        });
        return Object.entries(counts).map(([name, value]) => ({ name, value })).slice(-7);
    }, [messages]);

    return (
        <div className={`bg-background text-foreground p-4 md:p-8 flex flex-col ${selectedSessionId ? 'h-screen overflow-hidden' : 'min-h-screen lg:h-screen lg:overflow-hidden'}`}>
            <div className="max-w-[1600px] mx-auto w-full flex-1 flex flex-col min-h-0">
                <div className={selectedSessionId && view === 'chat' ? 'hidden lg:block' : ''}>
                    {/* Header */}
                    <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" className="min-h-11 min-w-11 rounded-full p-0" onClick={() => navigate('/')} aria-label="Voltar para o site">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight">Chat Dashboard</h1>
                                <p className="text-muted-foreground text-sm">Monitoramento de conversas do projeto Bio</p>
                            </div>
                        </div>

                        <div role="tablist" aria-label="Seção do painel" className="flex gap-1 rounded-full border border-border bg-muted/30 p-1">
                            <Button
                                role="tab"
                                aria-selected={view === 'chat'}
                                variant={view === 'chat' ? 'default' : 'ghost'}
                                size="sm"
                                className="rounded-full"
                                onClick={() => setView('chat')}
                            >
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Conversas
                            </Button>
                            <Button
                                role="tab"
                                aria-selected={view === 'contacts'}
                                variant={view === 'contacts' ? 'default' : 'ghost'}
                                size="sm"
                                className="rounded-full"
                                onClick={() => setView('contacts')}
                            >
                                <Inbox className="mr-2 h-4 w-4" />
                                Contatos
                                {unreadContacts > 0 && (
                                    <Badge className="ml-2 h-5 min-w-5 rounded-full px-1 text-[10px]" aria-label={`${unreadContacts} não lidos`}>
                                        {unreadContacts}
                                    </Badge>
                                )}
                            </Button>
                        </div>

                        <div className="flex gap-4 text-sm text-muted-foreground">
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => void handleSignOut()}
                            >
                                Sair
                            </Button>
                            <div className="flex items-center gap-2">
                                <MessageSquare className="w-4 h-4" />
                                <span>{stats.totalSessions} Conversas</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <BarChart className="w-4 h-4" />
                                <span>{stats.totalMessages} Mensagens</span>
                            </div>
                        </div>
                    </div>

                    {/* Analytics Row */}
                    {view === 'chat' && (<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        <Card className="border-border bg-card/95">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Total de Mensagens</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-foreground">{stats.totalMessages}</div>
                            </CardContent>
                        </Card>
                        <Card className="border-border bg-card/95">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Usuários</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-primary">{stats.userMessages}</div>
                            </CardContent>
                        </Card>
                        <Card className="border-border bg-card/95">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Bot</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-foreground">{stats.botMessages}</div>
                            </CardContent>
                        </Card>
                        <Card className="col-span-1 border-border bg-card/95">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Atividade Recente</CardTitle>
                            </CardHeader>
                            <CardContent className="h-[80px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RechartsBar data={activityData}>
                                        <Bar dataKey="value" fill={token('action.primary.background')} radius={[4, 4, 0, 0]} />
                                    </RechartsBar>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>)}


                    {/* Error Alert */}
                    {error && (
                        <Alert variant="destructive" className="mb-8 flex items-center justify-between">
                            <div>
                                <AlertTitle>Erro ao carregar dados do painel</AlertTitle>
                                <AlertDescription>
                                    <p className="mt-1 font-mono text-sm">{error}</p>
                                    <p className="mt-2 text-xs">Falha na conexao com a API do portfolio.</p>
                                </AlertDescription>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => { setError(null); void fetchMessages(); void fetchContacts(); }}>
                                Tentar Novamente
                            </Button>
                        </Alert>
                    )}
                </div>

                {view === 'contacts' ? (
                    <ContactInbox contacts={contacts} loading={contactsLoading} onOpen={(contact) => void markContactAsRead(contact)} />
                ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
                    {/* Sidebar - Session List */}
                    <Card className={`flex h-full flex-col overflow-hidden border-border bg-card/95 ${selectedSessionId ? 'hidden lg:flex' : 'flex'}`}>
                        <div className="border-b border-border p-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Buscar ID ou conteúdo..."
                                    className="bg-input-background pl-9"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            <div className="flex flex-col gap-1 p-2">
                                {loading ? (
                                    <div className="text-center p-4 text-muted-foreground">Carregando...</div>
                                ) : filteredSessions.map(([sid, msgs]) => {
                                    const lastMsg = msgs[msgs.length - 1]; // Use last message of the group

                                    // Calculate unread count (messages where is_read is false)
                                    // Use set to count unique interaction rows if needed, but simple filter is fine
                                    const unreadCount = msgs.filter(m => m.is_read === false).length;

                                    return (
                                        <button
                                            key={sid}
                                            onClick={() => handleSessionClick(sid)}
                                            className={`flex flex-col items-start gap-1 rounded-lg border p-3 text-left transition-colors ${selectedSessionId === sid ? 'border-primary/30 bg-primary/10' : 'border-transparent hover:bg-muted/40'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between w-full">
                                                <span className="max-w-[150px] truncate font-mono text-xs font-medium text-primary">{sid}</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] text-muted-foreground">{new Date(lastMsg.created_at).toLocaleDateString()}</span>
                                                    {unreadCount > 0 && (
                                                        <Badge className="flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px]">
                                                            {unreadCount}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="w-full line-clamp-1 text-sm text-foreground/80">
                                                {lastMsg.content}
                                            </p>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </Card>

                    {/* Main - Chat View */}
                    <Card className={`col-span-1 flex h-full flex-col overflow-hidden border-border bg-card/95 lg:col-span-2 ${selectedSessionId ? 'flex' : 'hidden lg:flex'}`}>
                        {selectedSessionId ? (
                            <>
                                <div className="flex items-center justify-between border-b border-border bg-muted/20 p-4">
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="icon" className="mr-1 min-h-11 min-w-11 lg:hidden" onClick={() => setSelectedSessionId(null)} aria-label="Voltar para sessões">
                                            <ArrowLeft className="w-4 h-4" />
                                        </Button>
                                        <div className="h-2 w-2 motion-safe:animate-pulse rounded-full bg-primary" />
                                        <span className="font-mono text-sm text-muted-foreground">Session: {selectedSessionId}</span>
                                    </div>
                                    <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => setSelectedSessionId(null)}>
                                        Fechar
                                    </Button>
                                </div>
                                <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
                                    <div className="flex flex-col gap-6">
                                        {activeMessages.map((msg) => {
                                            const isBot = msg.role === 'assistant';
                                            return (
                                                <div key={msg.id} className={`flex gap-4 ${isBot ? '' : 'flex-row-reverse'}`}>
                                                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${isBot ? 'bg-muted text-muted-foreground' : 'bg-primary text-primary-foreground'}`}>
                                                        {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                                                    </div>
                                                    <div className={`flex flex-col gap-1 max-w-[80%] ${isBot ? '' : 'items-end'}`}>
                                                        <div className={`p-4 rounded-2xl ${isBot
                                                            ? 'border border-border bg-muted/40 text-foreground rounded-tl-none'
                                                            : 'bg-primary text-primary-foreground rounded-tr-none'
                                                            }`}>
                                                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                                        </div>
                                                        <span className="text-[10px] text-muted-foreground">
                                                            {new Date(msg.created_at).toLocaleString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-1 flex-col items-center justify-center gap-4 text-muted-foreground">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/50">
                                    <MessageSquare className="w-8 h-8 opacity-20" />
                                </div>
                                <p>Selecione uma conversa para visualizar o histórico</p>
                            </div>
                        )}
                    </Card>
                </div>)}
            </div>
        </div >
    );
};


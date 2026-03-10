import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { Alert, AlertDescription, AlertTitle, Badge, Button, Card, CardContent, CardHeader, CardTitle, Input, t as token } from '@limia/design-system';
import { Search, MessageSquare, BarChart, User, Bot, ArrowLeft } from 'lucide-react';
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

// DB Interface (Row)
interface InteractionLog {
    id: string;
    session_id: string | null;
    user_message: string;
    ai_response: string;
    timestamp: string;
    is_read: boolean;
}

export const Dashboard = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMessages();

        const channel = supabase
            .channel('interaction_logs_changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'interaction_logs'
                },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        const row = payload.new as InteractionLog;
                        const sessionId = row.session_id || 'unknown';
                        const timestamp = row.timestamp;
                        const isRead = row.is_read;
                        const newMessages: ChatMessage[] = [];

                        if (row.user_message) {
                            newMessages.push({
                                id: `${row.id}-user`,
                                session_id: sessionId,
                                content: row.user_message,
                                role: 'user',
                                created_at: timestamp,
                                is_read: isRead
                            });
                        }
                        if (row.ai_response) {
                            newMessages.push({
                                id: `${row.id}-ai`,
                                session_id: sessionId,
                                content: row.ai_response,
                                role: 'assistant',
                                created_at: timestamp,
                                is_read: isRead
                            });
                        }

                        setMessages(prev => [...prev, ...newMessages]);
                    } else if (payload.eventType === 'UPDATE') {
                        const newRow = payload.new as InteractionLog;
                        setMessages(prev => prev.map(msg => {
                            if (msg.id.startsWith(newRow.id)) {
                                return { ...msg, is_read: newRow.is_read };
                            }
                            return msg;
                        }));
                    }
                }
            )
            .subscribe();

        return () => {
            void supabase.removeChannel(channel);
        };
    }, []);

    const fetchMessages = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data, error: sbError } = await supabase
                .from('interaction_logs')
                .select('*')
                .order('timestamp', { ascending: true });

            if (sbError) {
                console.error('Supabase Error:', sbError);
                setError(sbError.message);
                setMessages([]);
            } else {
                const transformedMessages: ChatMessage[] = [];

                (data as InteractionLog[] || []).forEach((row) => {
                    const sessionId = row.session_id || 'unknown';
                    const timestamp = row.timestamp;
                    const isRead = row.is_read;

                    if (row.user_message) {
                        transformedMessages.push({
                            id: `${row.id}-user`,
                            session_id: sessionId,
                            content: row.user_message,
                            role: 'user',
                            created_at: timestamp,
                            is_read: isRead
                        });
                    }

                    if (row.ai_response) {
                        transformedMessages.push({
                            id: `${row.id}-ai`,
                            session_id: sessionId,
                            content: row.ai_response,
                            role: 'assistant',
                            created_at: timestamp,
                            is_read: isRead
                        });
                    }
                });

                setMessages(transformedMessages);
            }
        } catch (err: unknown) {
            console.error("Unexpected fetch error:", err);
            setError(err instanceof Error ? err.message : "Unknown error occurred");
        } finally {
            setLoading(false);
        }
    };

    // Mark session as read
    const markSessionAsRead = async (sessionId: string) => {
        // Optimistic UI update
        setMessages(prev => prev.map(m =>
            m.session_id === sessionId ? { ...m, is_read: true } : m
        ));

        // Update DB
        const { error } = await supabase
            .from('interaction_logs')
            .update({ is_read: true })
            .eq('session_id', sessionId);

        if (error) {
            console.error('Error marking as read:', error);
        }
    };

    const handleSessionClick = (sid: string) => {
        setSelectedSessionId(sid);
        void markSessionAsRead(sid);
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        setMessages([]);
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
                <div className={selectedSessionId ? 'hidden lg:block' : ''}>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" className="rounded-full w-10 h-10 p-0" onClick={() => navigate('/')}>
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight">Chat Dashboard</h1>
                                <p className="text-muted-foreground text-sm">Monitoramento de conversas do projeto Bio</p>
                            </div>
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
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
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
                    </div>


                    {/* Error Alert */}
                    {error && (
                        <Alert variant="destructive" className="mb-8 flex items-center justify-between">
                            <div>
                                <AlertTitle>Erro ao carregar dados do Supabase</AlertTitle>
                                <AlertDescription>
                                    <p className="mt-1 font-mono text-sm">{error}</p>
                                    <p className="mt-2 text-xs">Falha na conexao com interaction_logs.</p>
                                </AlertDescription>
                            </div>
                            <Button variant="outline" size="sm" onClick={fetchMessages}>
                                Tentar Novamente
                            </Button>
                        </Alert>
                    )}
                </div>

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
                                        <Button variant="ghost" size="icon" className="mr-1 h-8 w-8 lg:hidden" onClick={() => setSelectedSessionId(null)}>
                                            <ArrowLeft className="w-4 h-4" />
                                        </Button>
                                        <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
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
                </div>
            </div>
        </div >
    );
};


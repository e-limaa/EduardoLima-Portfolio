import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@antigravity/ds';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@antigravity/ds';
import { Button } from '@antigravity/ds';
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
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const isAuth = localStorage.getItem('dashboard_auth') === 'true';
        if (isAuth) {
            setIsAuthenticated(true);
            fetchMessages();
        }
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const envPassword = import.meta.env.VITE_DASHBOARD_PASSWORD;
        if (passwordInput === envPassword) {
            setIsAuthenticated(true);
            localStorage.setItem('dashboard_auth', 'true');
            fetchMessages();
        } else {
            alert('Senha incorreta');
        }
    };

    const fetchMessages = async () => {
        setLoading(true);
        setError(null);
        try {
            console.log("Attempting to fetch from table 'interaction_logs'...");

            // Fetch raw rows
            const { data, error: sbError } = await supabase
                .from('interaction_logs')
                .select('*')
                .order('timestamp', { ascending: true });

            if (sbError) {
                console.error('Supabase Error:', sbError);
                setError(sbError.message);
                setMessages([]);
            } else {
                console.log("Raw DB Data:", data);

                if (data && data.length > 0 && !data[0].session_id) {
                    console.warn("WARNING: 'session_id' column seems missing or empty in first row. Columns found:", Object.keys(data[0]));
                }

                // Transform DB rows (Turn-based) into UI Messages (List-based)
                const transformedMessages: ChatMessage[] = [];

                (data as InteractionLog[] || []).forEach((row) => {
                    // User requested to use "session_id" as the grouping key
                    const sessionId = row.session_id || 'unknown';
                    const timestamp = row.timestamp;
                    const isRead = row.is_read; // From DB

                    // Message 1: User
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

                    // Message 2: AI
                    if (row.ai_response) {
                        transformedMessages.push({
                            id: `${row.id}-ai`,
                            session_id: sessionId,
                            content: row.ai_response,
                            role: 'assistant',
                            created_at: timestamp,
                            is_read: isRead // AI messages usually considered read or don't generate badge? Let's assume user checking dashboard sees them. 
                            // Actually, if the user (admin) hasn't seen the interaction, both are unread.
                            // Let's inherit row.is_read for simplicity.
                        });
                    }
                });

                setMessages(transformedMessages);
            }
        } catch (err: any) {
            console.error("Unexpected fetch error:", err);
            setError(err.message || "Unknown error occurred");
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
        markSessionAsRead(sid);
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

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-black text-foreground flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardHeader>
                            <CardTitle>Acesso Restrito</CardTitle>
                            <CardDescription>Digite a senha para acessar o dashboard.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleLogin} className="flex flex-col gap-4">
                                <Input
                                    type="password"
                                    placeholder="Senha"
                                    value={passwordInput}
                                    onChange={(e) => setPasswordInput(e.target.value)}
                                    className="bg-zinc-950 border-zinc-800"
                                />
                                <Button type="submit" className="w-full">Entrar</Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-foreground p-4 md:p-8">
            <div className="max-w-[1600px] mx-auto">
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
                        <Button variant="outline" size="sm" onClick={() => {
                            localStorage.removeItem('dashboard_auth');
                            setIsAuthenticated(false);
                            setMessages([]);
                        }} className="border-red-900/30 text-red-500 hover:text-red-400 hover:bg-red-900/20">
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
                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total de Mensagens</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">{stats.totalMessages}</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Usuários</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-400">{stats.userMessages}</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Bot</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-400">{stats.botMessages}</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-zinc-900 border-zinc-800 col-span-1">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Atividade Recente</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[80px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <RechartsBar data={activityData}>
                                    <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                </RechartsBar>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>


                {/* Error Alert */}
                {error && (
                    <div className="bg-red-900/20 border border-red-900/50 text-red-200 p-4 rounded-lg mb-8 flex items-center justify-between">
                        <div>
                            <p className="font-bold">Erro ao carregar dados do Supabase</p>
                            <p className="text-sm font-mono mt-1">{error}</p>
                            <p className="text-xs text-red-400 mt-2">Falha na conexão com interaction_logs.</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={fetchMessages} className="border-red-900/50 hover:bg-red-900/30">
                            Tentar Novamente
                        </Button>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-250px)]">
                    {/* Sidebar - Session List */}
                    <Card className="bg-zinc-900 border-zinc-800 flex flex-col h-full overflow-hidden">
                        <div className="p-4 border-b border-zinc-800">
                            <div className="relative">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Buscar ID ou conteúdo..."
                                    className="pl-9 bg-zinc-950 border-zinc-800 focus:ring-blue-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <ScrollArea className="flex-1">
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
                                            className={`flex flex-col items-start gap-1 p-3 rounded-lg text-left transition-colors ${selectedSessionId === sid ? 'bg-blue-600/20 border border-blue-600/30' : 'hover:bg-zinc-800 border border-transparent'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between w-full">
                                                <span className="font-mono text-xs text-blue-400 font-medium truncate max-w-[150px]">{sid}</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] text-zinc-500">{new Date(lastMsg.created_at).toLocaleDateString()}</span>
                                                    {unreadCount > 0 && (
                                                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500 text-[10px] font-bold text-white">
                                                            {unreadCount}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="text-sm text-zinc-300 line-clamp-1 w-full">
                                                {lastMsg.content}
                                            </p>
                                        </button>
                                    );
                                })}
                            </div>
                        </ScrollArea>
                    </Card>

                    {/* Main - Chat View */}
                    <Card className="bg-zinc-900 border-zinc-800 col-span-1 lg:col-span-2 flex flex-col h-full overflow-hidden">
                        {selectedSessionId ? (
                            <>
                                <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        <span className="font-mono text-sm text-zinc-400">Session: {selectedSessionId}</span>
                                    </div>
                                    <Button variant="outline" size="sm" className="h-8 text-xs border-zinc-700 bg-zinc-800" onClick={() => setSelectedSessionId(null)}>
                                        Fechar
                                    </Button>
                                </div>
                                <ScrollArea className="flex-1 p-6">
                                    <div className="flex flex-col gap-6">
                                        {activeMessages.map((msg) => {
                                            const isBot = msg.role === 'assistant';
                                            return (
                                                <div key={msg.id} className={`flex gap-4 ${isBot ? '' : 'flex-row-reverse'}`}>
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isBot ? 'bg-zinc-800' : 'bg-blue-600'}`}>
                                                        {isBot ? <Bot className="w-4 h-4 text-zinc-400" /> : <User className="w-4 h-4 text-white" />}
                                                    </div>
                                                    <div className={`flex flex-col gap-1 max-w-[80%] ${isBot ? '' : 'items-end'}`}>
                                                        <div className={`p-4 rounded-2xl ${isBot
                                                            ? 'bg-zinc-800 text-zinc-300 rounded-tl-none'
                                                            : 'bg-blue-600 text-white rounded-tr-none'
                                                            }`}>
                                                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                                        </div>
                                                        <span className="text-[10px] text-zinc-600">
                                                            {new Date(msg.created_at).toLocaleString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </ScrollArea>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-zinc-600 gap-4">
                                <div className="w-16 h-16 rounded-full bg-zinc-800/50 flex items-center justify-center">
                                    <MessageSquare className="w-8 h-8 opacity-20" />
                                </div>
                                <p>Selecione uma conversa para visualizar o histórico</p>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
};

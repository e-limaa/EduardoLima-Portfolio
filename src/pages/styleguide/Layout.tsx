import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Moon, Sun, Menu, X, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme-provider';
import { navigation } from '@design-system/docs/styleguide/navigation';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export const StyleGuideLayout = () => {
    const { theme, setTheme } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    // Close mobile menu on route change
    React.useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    return (
        <div className="h-screen overflow-hidden bg-background text-foreground flex">
            {/* Mobile Menu Backdrop */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside className={cn(
                "fixed lg:static inset-y-0 left-0 z-50 w-72 border-r border-border bg-card transition-transform duration-300 ease-in-out",
                isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            )}>
                <div className="h-full flex flex-col">
                    <div className="p-6 border-b border-border">
                        <div className="flex items-center gap-2 mb-2 cursor-pointer" onClick={() => navigate('/')}>
                            <ArrowLeft className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                            <span className="text-xs font-mono text-muted-foreground">Voltar</span>
                        </div>
                        <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
                            DS <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs border border-primary/20">v1.0</span>
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">Design System Docs</p>
                    </div>

                    <nav className="flex-1 overflow-y-auto p-4 space-y-8">
                        {navigation.map((section) => (
                            <div key={section.title}>
                                <h4 className="mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">
                                    {section.title}
                                </h4>
                                <div className="space-y-1">
                                    {section.items.map((item) => {
                                        const isActive = location.pathname === item.href;
                                        const Icon = item.icon;
                                        return (
                                            <button
                                                key={item.href}
                                                onClick={() => navigate(item.href)}
                                                className={cn(
                                                    "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                                                    isActive
                                                        ? "bg-primary/10 text-primary"
                                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                                )}
                                            >
                                                <Icon size={16} />
                                                {item.title}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </nav>

                    <footer className="p-4 border-t border-border text-xs text-muted-foreground font-mono">
                        &copy; 2026 Eduardo Lima
                    </footer>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <header className="flex-shrink-0 flex h-16 items-center gap-4 border-b border-border bg-background/80 px-6 backdrop-blur">
                    <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsMobileMenuOpen(true)}>
                        <Menu size={20} />
                    </Button>

                    <div className="flex-1">
                        {/* Breadcrumbs or Search could go here */}
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="rounded-full"
                    >
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </Button>
                </header>

                <main className="flex-1 overflow-y-auto p-6 lg:p-12 max-w-5xl mx-auto w-full animate-in fade-in duration-500 slide-in-from-bottom-4">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

import React from 'react';
import { DocsMDXProvider } from '@/components/mdx/mdx-provider';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Moon, Sun, Menu, ArrowLeft } from 'lucide-react';
import { Button } from '@antigravity/ds';
import { useTheme } from '@/components/theme-provider';
import { useLanguage } from '@/components/language-provider';
import { LanguageToggle } from '@/components/language-toggle';
import { docsRegistry } from '@/app/docs/registry';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export const StyleGuideLayout = () => {
    const { theme, setTheme } = useTheme();
    const { t } = useLanguage();
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
                            <span className="text-xs font-mono text-muted-foreground">{t('docs.sidebar.back')}</span>
                        </div>
                        <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
                            {t('docs.header.title')} <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs border border-primary/20">v0.1.0</span>
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">{t('docs.header.subtitle')}</p>
                    </div>

                    <nav className="flex-1 overflow-y-auto p-4 space-y-8">
                        {['Getting Started', 'Foundations', 'Components', 'Patterns', 'Governance'].map((sectionTitle) => {
                            const items = docsRegistry.filter(doc => doc.section === sectionTitle);
                            if (items.length === 0) return null;

                            return (
                                <div key={sectionTitle}>
                                    <h4 className="mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">
                                        {t(`docs.nav.${sectionTitle.toLowerCase().replace(' ', '-')}`)}
                                    </h4>
                                    <div className="space-y-1">
                                        {items.map((item) => {
                                            const isActive = location.pathname === item.href;
                                            return (
                                                <button
                                                    key={item.href}
                                                    onClick={() => navigate(item.href)}
                                                    className={cn(
                                                        "w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors", // Modified class
                                                        isActive
                                                            ? "bg-primary/10 text-primary"
                                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                                    )}
                                                >
                                                    <span className="flex items-center gap-2">
                                                        {t(item.title)}
                                                    </span>
                                                    {item.status === 'beta' && <span className="text-[10px] bg-secondary px-1.5 py-0.5 rounded text-secondary-foreground">Beta</span>}
                                                    {item.status === 'draft' && <span className="text-[10px] border border-border px-1.5 py-0.5 rounded text-muted-foreground opacity-70">Draft</span>}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </nav>

                    <footer className="p-4 border-t border-border text-xs text-muted-foreground font-mono">
                        {t('docs.sidebar.footer')}
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

                    <LanguageToggle />

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
                    <DocsMDXProvider>
                        <Outlet />
                    </DocsMDXProvider>
                </main>
            </div>
        </div>
    );
};

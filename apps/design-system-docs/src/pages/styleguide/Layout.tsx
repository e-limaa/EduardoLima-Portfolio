import React from "react";
import { Moon, Sun, Menu, ArrowLeft } from "lucide-react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { Button, cn } from "@limia/design-system";
import { DocsMDXProvider, docsRegistry } from "../../docs";
import { useTheme } from "../../components/theme-provider";
import { useLanguage } from "../../components/language-provider";
import { LanguageToggle } from "../../components/language-toggle";

export function StyleGuideLayout() {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const portfolioUrl =
    window.location.hostname === "localhost"
      ? "http://localhost:3000"
      : "https://elimaj.com.br";

  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 border-r border-border bg-card transition-transform duration-300 ease-in-out lg:static",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex h-full flex-col">
          <div className="border-b border-border p-6">
            <button
              className="mb-2 flex items-center gap-2 text-xs font-mono text-muted-foreground"
              onClick={() => {
                window.location.href = portfolioUrl;
              }}
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{t("docs.sidebar.back")}</span>
            </button>
            <h1 className="flex items-center gap-2 text-xl font-bold tracking-tight">
              {t("docs.header.title")}
              <span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-xs text-primary">
                v0.1.0
              </span>
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("docs.header.subtitle")}
            </p>
          </div>

          <nav className="flex-1 space-y-8 overflow-y-auto p-4">
            {["Getting Started", "Foundations", "Components", "Patterns", "Governance"].map((sectionTitle) => {
              const items = docsRegistry.filter((doc) => doc.section === sectionTitle);
              if (items.length === 0) return null;

              return (
                <div key={sectionTitle}>
                  <h4 className="mb-2 px-2 font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {t(`docs.nav.${sectionTitle.toLowerCase().replace(" ", "-")}`)}
                  </h4>
                  <div className="space-y-1">
                    {items.map((item) => {
                      const isActive = location.pathname === item.href;

                      return (
                        <button
                          key={item.href}
                          onClick={() => navigate(item.href)}
                          className={cn(
                            "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors",
                            isActive
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground",
                          )}
                        >
                          <span>{t(item.title)}</span>
                          {item.status === "beta" && (
                            <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] text-secondary-foreground">
                              Beta
                            </span>
                          )}
                          {item.status === "draft" && (
                            <span className="rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground opacity-70">
                              Draft
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </nav>

          <footer className="border-t border-border p-4 font-mono text-xs text-muted-foreground">
            {t("docs.sidebar.footer")}
          </footer>
        </div>
      </aside>

      <div className="flex h-full flex-1 flex-col overflow-hidden">
        <header className="flex h-16 flex-shrink-0 items-center gap-4 border-b border-border bg-background/80 px-6 backdrop-blur">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={20} />
          </Button>

          <div className="flex-1" />
          <LanguageToggle />
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
        </header>

        <main className="mx-auto flex-1 w-full max-w-5xl overflow-y-auto p-6 lg:p-12">
          <DocsMDXProvider>
            <Outlet />
          </DocsMDXProvider>
        </main>
      </div>
    </div>
  );
}

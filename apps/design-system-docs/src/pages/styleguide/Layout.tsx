import React from "react";
import { Moon, Sun, Menu } from "lucide-react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { Button, cn } from "@limia/design-system";
import { DocsMDXProvider, docsRegistry } from "../../docs";
import { DocStatusBadge } from "../../docs/ui";
import { useTheme } from "../../components/theme-provider";
import { useLanguage } from "../../components/language-provider";
import { LanguageToggle } from "../../components/language-toggle";

export function StyleGuideLayout() {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

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
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
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
                      return (
                        <NavLink
                          key={item.href}
                          to={item.href}
                          className={({ isActive }) =>
                            cn(
                              "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors",
                              isActive
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground",
                            )
                          }
                        >
                          <span>{t(item.title)}</span>
                          {(item.status === "beta" || item.status === "draft") && (
                            <DocStatusBadge
                              status={item.status}
                              className="font-mono text-[10px] uppercase tracking-wider"
                            />
                          )}
                        </NavLink>
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
            aria-label={t("docs.actions.open-menu")}
            title={t("docs.actions.open-menu")}
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
            aria-label={
              theme === "dark"
                ? t("docs.actions.switch-light")
                : t("docs.actions.switch-dark")
            }
            title={
              theme === "dark"
                ? t("docs.actions.switch-light")
                : t("docs.actions.switch-dark")
            }
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
        </header>

        <main className="flex-1 w-full overflow-y-auto p-6 lg:p-12">
          <DocsMDXProvider>
            <Outlet />
          </DocsMDXProvider>
        </main>
      </div>
    </div>
  );
}

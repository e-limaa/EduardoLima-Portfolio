import { ArrowRight, BookOpen, Boxes, ShieldCheck } from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@limia/design-system";
import { Link } from "react-router-dom";

import { useLanguage } from "../components/language-provider";
import { DocStatusBadge } from "./ui";
import { docsRegistry } from "./registry";

const sectionIcons = {
  "Getting Started": BookOpen,
  Foundations: ShieldCheck,
  Components: Boxes,
  Patterns: Boxes,
  Governance: ShieldCheck,
} as const;

export function DesignSystemOverview() {
  const { t } = useLanguage();

  const groupedDocs = ["Getting Started", "Foundations", "Components", "Patterns", "Governance"].map(
    (section) => ({
      section,
      items: docsRegistry.filter((doc) => doc.section === section),
    }),
  );

  return (
    <div className="space-y-12">
      <section className="space-y-6 border-b border-border pb-10">
        <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight text-foreground lg:text-5xl">
          {t("docs.overview.title")}
        </h1>
        <p className="max-w-3xl text-lg leading-8 text-muted-foreground lg:text-xl">
          {t("docs.overview.description")}
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild className="gap-2 rounded-full">
            <Link to="/design-system/components/buttons">
              {t("docs.overview.primary-cta")} <ArrowRight size={16} />
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/design-system/foundation/colors">
              {t("docs.overview.secondary-cta")}
            </Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <Card className="border-border bg-card/70">
          <CardHeader>
            <CardTitle>{t("docs.overview.card.architecture.title")}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-6 text-muted-foreground">
            {t("docs.overview.card.architecture.description")}
          </CardContent>
        </Card>
        <Card className="border-border bg-card/70">
          <CardHeader>
            <CardTitle>{t("docs.overview.card.governance.title")}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-6 text-muted-foreground">
            {t("docs.overview.card.governance.description")}
          </CardContent>
        </Card>
        <Card className="border-border bg-card/70">
          <CardHeader>
            <CardTitle>{t("docs.overview.card.resources.title")}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-6 text-muted-foreground">
            {t("docs.overview.card.resources.description")}
          </CardContent>
        </Card>
      </section>

      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground">
            {t("docs.overview.section-browse")}
          </h2>
          <p className="max-w-3xl text-base leading-7 text-muted-foreground">
            {t("docs.overview.section-browse-description")}
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          {groupedDocs.map(({ section, items }) => {
            const Icon = sectionIcons[section as keyof typeof sectionIcons];

            return (
              <Card key={section} className="border-border bg-card/50">
                <CardHeader className="space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon size={18} />
                      </div>
                      <div>
                        <CardTitle>{t(`docs.nav.${section.toLowerCase().replace(" ", "-")}`)}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {items.length} {t("docs.overview.section-count")}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {items.slice(0, 6).map((doc) => (
                    <Link
                      key={doc.href}
                      to={doc.href}
                      className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background/50 px-4 py-3 transition-colors hover:bg-muted/40"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">
                          {t(doc.title)}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {t(doc.description)}
                        </p>
                      </div>
                      <DocStatusBadge status={doc.status} />
                    </Link>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}

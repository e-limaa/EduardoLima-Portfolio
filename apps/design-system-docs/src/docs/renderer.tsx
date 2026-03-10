import React from "react";

import { useLanguage } from "../components/language-provider";
import type { DocPage } from "./types";
import { DocsGeneratedChapters, DocsMetaRail, DocsPageHero } from "./ui";

export function DesignSystemDocsPage({
  doc,
  language = "en",
}: {
  doc: DocPage;
  language?: string;
}) {
  const { t } = useLanguage();
  const Component =
    language === "pt-br" && doc.componentPt ? doc.componentPt : doc.component;

  return (
    <article className="space-y-8">
      <DocsPageHero
        title={t(doc.title)}
        description={t(doc.description)}
        status={doc.status}
        kind={doc.kind}
        a11yStatus={doc.a11yStatus}
        resources={doc.resources}
      />

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_18rem] xl:items-start">
        <div data-doc-body className="min-w-0 space-y-8">
          <React.Suspense
            fallback={
              <div className="py-20 text-center text-muted-foreground">
                Loading...
              </div>
            }
          >
            <Component />
          </React.Suspense>
          <DocsGeneratedChapters doc={doc} />
        </div>
        <DocsMetaRail doc={doc} />
      </div>
    </article>
  );
}

import React from "react";

import type { DocPage } from "./types";

export function DesignSystemDocsPage({
  doc,
  language = "en",
}: {
  doc: DocPage;
  language?: string;
}) {
  const Component =
    language === "pt-br" && doc.componentPt ? doc.componentPt : doc.component;

  return (
    <React.Suspense
      fallback={
        <div className="py-20 text-center text-muted-foreground">Loading...</div>
      }
    >
      <Component />
    </React.Suspense>
  );
}

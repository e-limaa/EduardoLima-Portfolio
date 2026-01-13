import React from "react";
import { useLanguage } from "./language-provider";
import { DocPage } from "@/app/docs/registry";

export const DocsPageLoader = ({ doc }: { doc: DocPage }) => {
    const { language } = useLanguage();

    const Component = language === "pt-br" && doc.componentPt
        ? doc.componentPt
        : doc.component;

    // We need to wrap in Suspense because these are lazy components
    // But typically the Router or App handles Suspense suitable for routes.
    // If not, we might need a Suspense here.
    return (
        <React.Suspense fallback={<div className="py-20 text-center text-muted-foreground">Loading...</div>}>
            <Component />
        </React.Suspense>
    );
};

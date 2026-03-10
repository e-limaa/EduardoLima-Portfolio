import React from "react";
import { MDXProvider } from "@mdx-js/react";

import {
  Callout,
  ComponentPlayground,
  ComponentPreview,
  DoDont,
  DoDontContainer,
  DocsMetaRail,
  DocsPageHeader,
  DocsPageHero,
  DocsRelatedLinks,
  DocsResources,
  DocsSection,
  DocsSectionNav,
  TokenTable,
} from "./ui";

function slugifyHeading(children: React.ReactNode): string | undefined {
  const text =
    typeof children === "string"
      ? children.trim()
      : Array.isArray(children)
        ? children
            .map((child) => (typeof child === "string" ? child : ""))
            .join(" ")
            .trim()
        : "";

  if (!text) return undefined;

  const normalized = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

  const chapterAliasMap: Record<string, string> = {
    overview: "overview",
    "visao geral": "overview",
    usage: "usage",
    uso: "usage",
    style: "style",
    estilo: "style",
    code: "code",
    codigo: "code",
    accessibility: "accessibility",
    acessibilidade: "accessibility",
    setup: "setup",
    "next steps": "next-steps",
    "proximos passos": "next-steps",
    principles: "principles",
    principios: "principles",
    tokens: "tokens",
    implementation: "implementation",
    implementacao: "implementation",
    related: "related",
    relacionados: "related",
    "when to use": "when-to-use",
    "quando usar": "when-to-use",
    composition: "composition",
    composicao: "composition",
    policy: "policy",
    politica: "policy",
    workflow: "workflow",
    fluxo: "workflow",
    references: "references",
    referencias: "references",
  };

  if (chapterAliasMap[normalized]) {
    return chapterAliasMap[normalized];
  }

  return normalized.replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");
}

const components = {
  h1: (props: any) => (
    <h1
      className="scroll-m-20 mb-6 text-4xl font-extrabold tracking-tight text-foreground lg:text-5xl"
      {...props}
    />
  ),
  h2: (props: any) => (
    <h2
      id={props.id ?? slugifyHeading(props.children)}
      className="mt-12 mb-4 scroll-mt-24 border-b border-border pb-3 text-3xl font-semibold tracking-tight text-foreground first:mt-0"
      {...props}
    />
  ),
  h3: (props: any) => (
    <h3
      className="mt-8 mb-3 scroll-m-20 text-2xl font-semibold tracking-tight text-foreground"
      {...props}
    />
  ),
  h4: (props: any) => (
    <h4
      className="mt-6 mb-2 scroll-m-20 text-xl font-semibold tracking-tight text-foreground"
      {...props}
    />
  ),
  p: (props: any) => (
    <p className="leading-7 text-muted-foreground [&:not(:first-child)]:mt-6" {...props} />
  ),
  ul: (props: any) => (
    <ul className="my-6 ml-6 list-disc text-muted-foreground [&>li]:mt-2" {...props} />
  ),
  ol: (props: any) => (
    <ol className="my-6 ml-6 list-decimal text-muted-foreground [&>li]:mt-2" {...props} />
  ),
  li: (props: any) => <li {...props} />,
  blockquote: (props: any) => (
    <blockquote
      className="mt-6 border-l-2 border-primary pl-6 italic text-muted-foreground"
      {...props}
    />
  ),
  code: (props: any) => (
    <code
      className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-foreground"
      {...props}
    />
  ),
  pre: (props: any) => (
    <div className="mb-4 mt-6 overflow-hidden rounded-lg border bg-muted/50 p-4">
      <pre className="overflow-x-auto py-4" {...props} />
    </div>
  ),
  a: (props: any) => (
    <a
      className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
      {...props}
    />
  ),
  hr: (props: any) => <hr className="my-8 border-border" {...props} />,
  table: (props: any) => (
    <div className="my-6 w-full overflow-y-auto">
      <table className="w-full" {...props} />
    </div>
  ),
  tr: (props: any) => (
    <tr className="m-0 border-t border-border p-0 even:bg-muted/50" {...props} />
  ),
  th: (props: any) => (
    <th
      className="border border-border px-4 py-2 text-left font-bold text-foreground [&[align=center]]:text-center [&[align=right]]:text-right"
      {...props}
    />
  ),
  td: (props: any) => (
    <td
      className="border border-border px-4 py-2 text-left text-muted-foreground [&[align=center]]:text-center [&[align=right]]:text-right"
      {...props}
    />
  ),
  Callout,
  DoDont,
  DoDontContainer,
  ComponentPreview,
  TokenTable,
  DocsPageHeader,
  DocsPageHero,
  DocsSection,
  DocsSectionNav,
  DocsMetaRail,
  DocsResources,
  DocsRelatedLinks,
  ComponentPlayground,
};

export function DocsMDXProvider({ children }: { children: React.ReactNode }) {
  return <MDXProvider components={components}>{children}</MDXProvider>;
}

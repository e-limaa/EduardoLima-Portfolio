import React from "react";
import { MDXProvider } from "@mdx-js/react";

import {
  Callout,
  ComponentPlayground,
  ComponentPreview,
  DoDont,
  DoDontContainer,
  DocsPageHeader,
  TokenTable,
} from "./ui";

const components = {
  h1: (props: any) => (
    <h1
      className="scroll-m-20 mb-6 text-4xl font-extrabold tracking-tight text-foreground lg:text-5xl"
      {...props}
    />
  ),
  h2: (props: any) => (
    <h2
      className="mt-10 mb-4 scroll-m-20 border-b border-border pb-2 text-3xl font-semibold tracking-tight text-foreground first:mt-0"
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
  ComponentPlayground,
};

export function DocsMDXProvider({ children }: { children: React.ReactNode }) {
  return <MDXProvider components={components}>{children}</MDXProvider>;
}

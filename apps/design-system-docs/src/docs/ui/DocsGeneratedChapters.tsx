import React from "react";
import { Badge } from "@limia/design-system";

import { useLanguage } from "../../components/language-provider";
import type { DocKind, DocPage } from "../types";

function CodeBlock({ code }: { code: string }) {
  return (
    <pre>
      <code>{code}</code>
    </pre>
  );
}

function Guidance({
  title,
  children,
  tone = "info",
}: {
  title: string;
  children: React.ReactNode;
  tone?: "info" | "warning";
}) {
  return (
    <div
      className={
        tone === "warning"
          ? "rounded-xl border border-destructive/20 bg-destructive/10 p-4"
          : "rounded-xl border border-primary/20 bg-primary/5 p-4"
      }
    >
      <div className="mb-2 flex items-center gap-2">
        <Badge variant={tone === "warning" ? "destructive" : "outline"}>
          {title}
        </Badge>
      </div>
      <div className="space-y-3 text-sm leading-6 text-muted-foreground">
        {children}
      </div>
    </div>
  );
}

function GuidanceList({
  doTitle,
  doText,
  dontTitle,
  dontText,
}: {
  doTitle: string;
  doText: string;
  dontTitle: string;
  dontText: string;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
        <p className="mb-2 font-semibold text-foreground">{doTitle}</p>
        <p className="text-sm leading-6 text-muted-foreground">{doText}</p>
      </div>
      <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4">
        <p className="mb-2 font-semibold text-foreground">{dontTitle}</p>
        <p className="text-sm leading-6 text-muted-foreground">{dontText}</p>
      </div>
    </div>
  );
}

function scanHeadings() {
  return Array.from(document.querySelectorAll("[data-doc-body] h2[id]")).map(
    (heading) => heading.id,
  );
}

function getGenericCodeSnippet(doc: DocPage) {
  if (doc.resources?.import) return `${doc.resources.import}\n`;
  if (doc.resources?.package) return `// Package: ${doc.resources.package}\n`;
  return `// Follow the public API documented for ${doc.href}\n`;
}

function buildComponentSections(doc: DocPage, title: string, description: string) {
  return {
    overview: (
      <>
        <p>{description}</p>
        <p>
          Treat {title} as a public design-system primitive. Product-specific
          behavior should be composed on top of it rather than re-skinned locally.
        </p>
      </>
    ),
    usage: (
      <>
        <p>
          Use this component when the interaction matches its native behavior
          and when reusing a shared primitive is more valuable than creating a
          product-only variant.
        </p>
        <GuidanceList
          doTitle="Start from the primitive"
          doText="Prefer the Limia export first, then compose product logic around it."
          dontTitle="Fork for visual tweaks"
          dontText="Avoid local wrappers whose main purpose is to change spacing, color or token usage outside the system contract."
        />
      </>
    ),
    style: (
      <>
        <p>
          Style should communicate emphasis and state through Limia tokens such
          as `bg-primary`, `text-muted-foreground`, `border-border` and
          `bg-card`. Avoid local hue decisions when the semantic role already
          exists in the system.
        </p>
        <Guidance title="Carbon-inspired guidance">
          Keep states visible, labels concise and visual emphasis tied to the
          job of the component, not to arbitrary brand color overrides.
        </Guidance>
      </>
    ),
    code: (
      <>
        <p>
          Consume the public export directly from the package. Keep app-specific
          orchestration outside the primitive.
        </p>
        <CodeBlock code={getGenericCodeSnippet(doc)} />
      </>
    ),
    accessibility: (
      <>
        <p>
          Keyboard support, visible focus and semantic labeling are part of the
          component contract. Pages that use this component should not remove or
          visually suppress those guarantees.
        </p>
        <Guidance title="Review status" tone="warning">
          This page is marked as <strong>{doc.a11yStatus ?? "partial"}</strong>.
          Treat any product-specific composition as requiring manual keyboard and
          screen-reader verification before release.
        </Guidance>
      </>
    ),
  };
}

function buildFoundationSections(doc: DocPage, title: string, description: string) {
  return {
    overview: (
      <>
        <p>{description}</p>
        <p>
          Foundations define the baseline contract for components and product
          adoption. Treat them as system rules, not as optional styling hints.
        </p>
      </>
    ),
    principles: (
      <>
        <p>
          Limia foundations should remain semantic, consistent across themes and
          reusable across apps. Product teams should consume them through tokens
          and documented utilities instead of inventing local scales.
        </p>
      </>
    ),
    tokens: (
      <>
        <p>
          The source of truth for this foundation lives in{" "}
          <code>{doc.resources?.source ?? "the design-system sources"}</code>.
        </p>
        <p>
          Prefer documented token names over raw values so apps inherit theming,
          accessibility and governance updates automatically.
        </p>
      </>
    ),
    implementation: (
      <>
        <GuidanceList
          doTitle="Implement semantically"
          doText="Use documented roles, utilities and package styles when consuming this foundation."
          dontTitle="Bypass the foundation"
          dontText="Avoid hardcoded values when a Limia token, utility or preset already expresses the same intent."
        />
      </>
    ),
    accessibility: (
      <>
        <p>
          Foundation decisions directly affect contrast, readability, motion,
          spacing rhythm and error recovery. Any extension of this foundation
          should be reviewed against accessibility before adoption.
        </p>
      </>
    ),
    related: (
      <p>
        Use the related pages in the right rail to understand how this
        foundation influences components and patterns across the system.
      </p>
    ),
  };
}

function buildPatternSections(doc: DocPage, description: string) {
  return {
    overview: <p>{description}</p>,
    "when-to-use": (
      <p>
        Use this pattern when multiple primitives need consistent orchestration
        and when product teams benefit from shared guidance more than from
        isolated component rules.
      </p>
    ),
    composition: (
      <p>
        Compose patterns from public Limia primitives first. Keep validation,
        async logic and product policy in the application layer.
      </p>
    ),
    code: <CodeBlock code={getGenericCodeSnippet(doc)} />,
    accessibility: (
      <p>
        Review the full flow, not only each primitive in isolation. Patterns
        create additional accessibility obligations through sequence, feedback
        and focus management.
      </p>
    ),
  };
}

function buildGovernanceSections(doc: DocPage, description: string) {
  return {
    overview: <p>{description}</p>,
    policy: (
      <p>
        Governance pages define release expectations, adoption rules and change
        management across package, docs and consuming apps.
      </p>
    ),
    workflow: (
      <p>
        Treat documentation, lifecycle metadata and package behavior as one
        coordinated workflow. A policy change is only complete when all three
        are aligned.
      </p>
    ),
    references: (
      <p>
        Source of truth: <code>{doc.resources?.source ?? "repository docs"}</code>.
      </p>
    ),
  };
}

function buildGettingStartedSections(doc: DocPage, description: string) {
  return {
    overview: <p>{description}</p>,
    setup: (
      <p>
        Start with package installation, style imports and preset wiring before
        using any primitive in product code.
      </p>
    ),
    usage: (
      <p>
        Prefer public exports from `@limia/design-system` and `@limia/tokens`
        instead of local copies or manually recreated styles.
      </p>
    ),
    "next-steps": (
      <p>
        Continue into foundations and components to adopt the system with full
        semantic token coverage.
      </p>
    ),
  };
}

function getSections(doc: DocPage, title: string, description: string) {
  const builders: Record<
    DocKind,
    ReturnType<typeof buildComponentSections>
  > = {
    component: buildComponentSections(doc, title, description),
    foundation: buildFoundationSections(doc, title, description),
    pattern: buildPatternSections(doc, description),
    governance: buildGovernanceSections(doc, description),
    "getting-started": buildGettingStartedSections(doc, description),
  };

  return builders[doc.kind];
}

export function DocsGeneratedChapters({ doc }: { doc: DocPage }) {
  const { language, t } = useLanguage();
  const [availableIds, setAvailableIds] = React.useState<string[]>([]);
  const [hasScanned, setHasScanned] = React.useState(false);

  React.useEffect(() => {
    setHasScanned(false);

    const collect = () => {
      setAvailableIds(scanHeadings());
      setHasScanned(true);
    };

    collect();
    const timeoutId = window.setTimeout(collect, 120);
    const observer = new MutationObserver(collect);
    const body = document.querySelector("[data-doc-body]");

    if (body) observer.observe(body, { childList: true, subtree: true });

    return () => {
      window.clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [doc.href, language]);

  if (!hasScanned) return null;

  const title = t(doc.title);
  const description = t(doc.description);
  const sections = getSections(doc, title, description);
  const available = new Set(availableIds);
  const missing = doc.chapters.filter((chapter) => !available.has(chapter.id));

  if (missing.length === 0) return null;

  return (
    <>
      {missing.map((chapter) => {
        const content = sections[chapter.id as keyof typeof sections];
        if (!content) return null;

        return (
          <section key={chapter.id} id={chapter.id} className="scroll-mt-24 space-y-4">
            <div className="border-b border-border pb-3">
              <h2 className="text-3xl font-semibold tracking-tight text-foreground">
                {t(chapter.label)}
              </h2>
            </div>
            {content}
          </section>
        );
      })}
    </>
  );
}

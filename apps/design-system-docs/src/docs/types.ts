import React from "react";

export type DocStatus = "draft" | "beta" | "stable" | "deprecated";
export type DocKind =
  | "getting-started"
  | "foundation"
  | "component"
  | "pattern"
  | "governance";
export type DocA11yStatus = "reviewed" | "partial" | "not-reviewed";
export type DocSection =
  | "Getting Started"
  | "Foundations"
  | "Components"
  | "Patterns"
  | "Governance";

export interface DocChapter {
  id: string;
  label: string;
  required: boolean;
}

export interface DocResources {
  package?: string;
  import?: string;
  source?: string;
  storybook?: string;
  figma?: string;
}

export interface DocPage {
  title: string;
  href: string;
  section: DocSection;
  kind: DocKind;
  status: DocStatus;
  description: string;
  chapters: DocChapter[];
  resources?: DocResources;
  related?: string[];
  a11yStatus?: DocA11yStatus;
  component: React.LazyExoticComponent<any>;
  componentPt?: React.LazyExoticComponent<any>;
  label?: string;
}

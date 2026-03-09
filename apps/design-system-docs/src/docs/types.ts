import React from "react";

export type DocStatus = "draft" | "beta" | "stable" | "deprecated";
export type DocSection =
  | "Getting Started"
  | "Foundations"
  | "Components"
  | "Patterns"
  | "Governance";

export interface DocPage {
  title: string;
  href: string;
  section: DocSection;
  status: DocStatus;
  description: string;
  component: React.LazyExoticComponent<any>;
  componentPt?: React.LazyExoticComponent<any>;
  label?: string;
}

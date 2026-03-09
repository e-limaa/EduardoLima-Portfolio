import { type DocPage, DesignSystemDocsPage } from "../docs";
import { useLanguage } from "./language-provider";

export function DocsPageLoader({ doc }: { doc: DocPage }) {
  const { language } = useLanguage();
  return <DesignSystemDocsPage doc={doc} language={language} />;
}

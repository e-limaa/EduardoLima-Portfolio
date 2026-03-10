import { type DocPage, CurrentDocProvider, DesignSystemDocsPage } from "../docs";
import { useLanguage } from "./language-provider";

export function DocsPageLoader({ doc }: { doc: DocPage }) {
  const { language } = useLanguage();
  return (
    <CurrentDocProvider doc={doc}>
      <DesignSystemDocsPage doc={doc} language={language} />
    </CurrentDocProvider>
  );
}

import { Navigate, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import { LanguageProvider } from "./components/language-provider";
import { DocsPageLoader } from "./components/docs-page-loader";
import { DesignSystemOverview, docsRegistry } from "./docs";
import { StyleGuideLayout } from "./pages/styleguide/Layout";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="limia-docs-theme">
      <LanguageProvider defaultLanguage="en" storageKey="limia-docs-language">
        <Routes>
          <Route path="/" element={<Navigate to="/design-system" replace />} />
          <Route path="/design-system" element={<StyleGuideLayout />}>
            <Route index element={<DesignSystemOverview />} />
            {docsRegistry.map((doc) => {
              const relativePath = doc.href.replace("/design-system/", "");
              return (
                <Route
                  key={doc.href}
                  path={relativePath}
                  element={<DocsPageLoader doc={doc} />}
                />
              );
            })}
            <Route path="*" element={<DesignSystemOverview />} />
          </Route>
        </Routes>
      </LanguageProvider>
    </ThemeProvider>
  );
}

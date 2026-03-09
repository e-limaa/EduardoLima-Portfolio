import { createContext, useContext, useEffect, useState } from "react";
import { DEFAULT_LANGUAGE, type AppLanguage, translations } from "../lib/i18n";

type LanguageProviderProps = {
  children: React.ReactNode;
  defaultLanguage?: AppLanguage;
  storageKey?: string;
};

type LanguageProviderState = {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
  t: (key: string) => string;
};

const LanguageProviderContext = createContext<LanguageProviderState>({
  language: DEFAULT_LANGUAGE,
  setLanguage: () => null,
  t: (key) => key,
});

export function LanguageProvider({
  children,
  defaultLanguage = DEFAULT_LANGUAGE,
  storageKey = "limia-docs-language",
}: LanguageProviderProps) {
  const [language, setLanguage] = useState<AppLanguage>(
    () => (localStorage.getItem(storageKey) as AppLanguage) || defaultLanguage,
  );

  useEffect(() => {
    localStorage.setItem(storageKey, language);
    document.documentElement.lang = language;
  }, [language, storageKey]);

  return (
    <LanguageProviderContext.Provider
      value={{
        language,
        setLanguage,
        t: (key) => translations[language][key] || key,
      }}
    >
      {children}
    </LanguageProviderContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageProviderContext);
}

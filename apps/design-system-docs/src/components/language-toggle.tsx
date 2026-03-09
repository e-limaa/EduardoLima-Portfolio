import { Languages } from "lucide-react";
import { Button } from "@limia/design-system";
import { useLanguage } from "./language-provider";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2 rounded-full border border-border bg-card/80 p-1">
      <Languages className="ml-2 h-4 w-4 text-muted-foreground" />
      <Button
        variant={language === "en" ? "secondary" : "ghost"}
        size="sm"
        className="rounded-full"
        onClick={() => setLanguage("en")}
      >
        EN
      </Button>
      <Button
        variant={language === "pt-br" ? "secondary" : "ghost"}
        size="sm"
        className="rounded-full"
        onClick={() => setLanguage("pt-br")}
      >
        PT
      </Button>
    </div>
  );
}

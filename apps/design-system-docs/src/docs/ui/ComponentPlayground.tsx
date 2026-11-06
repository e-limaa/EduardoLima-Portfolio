import React, { useId, useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@limia/design-system";

import { useLanguage } from "../../components/language-provider";

// Simple types for controls
type ControlType = "select" | "boolean" | "text";

interface Control {
  name: string;
  type: ControlType;
  options?: string[];
  defaultValue?: any;
}

interface ComponentPlaygroundProps {
  children: (props: any, helpers: { setValue: (name: string, value: any) => void }) => React.ReactNode;
  controls: Control[];
  codeTemplate: (props: any) => string;
}

const fieldClassName =
  "h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export const ComponentPlayground = ({
  children,
  controls,
  codeTemplate,
}: ComponentPlaygroundProps) => {
  const { t } = useLanguage();
  const baseId = useId();
  const [values, setValues] = useState<Record<string, any>>(() => {
    return controls.reduce((acc, control) => {
      acc[control.name] = control.defaultValue;
      return acc;
    }, {} as Record<string, any>);
  });

  const [copied, setCopied] = useState(false);

  const handleChange = (name: string, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const code = codeTemplate(values).trim();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="my-8 overflow-hidden rounded-xl border border-border bg-background shadow-sm">
      <div className="flex flex-col border-b border-border bg-muted/30 md:flex-row">
        <div className="flex min-h-[200px] min-w-0 flex-1 items-center justify-center overflow-x-auto bg-[url('/grid-pattern.svg')] p-6">
          {children(values, { setValue: handleChange })}
        </div>

        <div className="w-full shrink-0 space-y-4 border-t border-border bg-card p-4 md:w-64 md:border-l md:border-t-0">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t("docs.playground.controls")}
          </h4>
          {controls.map((control) => {
            const fieldId = `${baseId}-${control.name}`;

            return (
              <div key={control.name} className="space-y-1.5">
                <label
                  htmlFor={fieldId}
                  className="block text-sm font-medium capitalize text-foreground"
                >
                  {control.name}
                </label>

                {control.type === "select" && (
                  <select
                    id={fieldId}
                    className={fieldClassName}
                    value={values[control.name]}
                    onChange={(e) => handleChange(control.name, e.target.value)}
                  >
                    {control.options?.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                )}

                {control.type === "boolean" && (
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={fieldId}
                      checked={Boolean(values[control.name])}
                      onChange={(e) => handleChange(control.name, e.target.checked)}
                      className="h-4 w-4 rounded border-input accent-primary"
                    />
                    <span className="text-xs text-muted-foreground" aria-hidden="true">
                      {values[control.name] ? t("docs.playground.on") : t("docs.playground.off")}
                    </span>
                  </div>
                )}

                {control.type === "text" && (
                  <input
                    type="text"
                    id={fieldId}
                    value={values[control.name]}
                    onChange={(e) => handleChange(control.name, e.target.value)}
                    className={fieldClassName}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="relative bg-muted/50">
        <Button
          size="icon"
          variant="ghost"
          className="absolute right-2 top-2 h-8 w-8"
          onClick={handleCopy}
          aria-label={copied ? t("docs.playground.copied") : t("docs.playground.copy")}
          title={copied ? t("docs.playground.copied") : t("docs.playground.copy")}
        >
          {copied ? <Check size={14} className="text-primary" /> : <Copy size={14} />}
        </Button>
        <pre className="overflow-x-auto p-4 pr-12 font-mono text-sm text-foreground">
          <code>{code}</code>
        </pre>
        <span className="sr-only" aria-live="polite">
          {copied ? t("docs.playground.copied") : ""}
        </span>
      </div>
    </div>
  );
};

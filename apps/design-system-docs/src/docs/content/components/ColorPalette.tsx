import { primitiveTokens, tokens } from "@limia/tokens";

type Locale = "en" | "pt-br";

type Swatch = {
  label: string;
  background: string;
  foreground: string;
  border?: string;
};

const PRIMITIVE_STEPS = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"] as const;
const PRIMITIVE_FAMILIES = ["zinc", "brand", "cyan", "teal", "emerald", "amber", "violet", "rose", "red"] as const;

const COPY = {
  en: {
    semanticTitle: "Semantic roles",
    semanticDescription: "Roles stay stable across themes. Hue is a tool; intent is the contract.",
    layersTitle: "Themes and layers",
    actionsTitle: "Action tokens",
    supportTitle: "Support colors",
    primitivesTitle: "Primitive scales",
    primitivesDescription: "Raw scales are available for system work, but product code should usually consume semantic roles first.",
    sample: "Aa",
    categories: {
      page: "Page background",
      surface: "Surface",
      layer1: "Layer 1",
      layer2: "Layer 2",
      layer3: "Layer 3",
      popover: "Popover",
      inverse: "Inverse surface",
      primary: "Primary",
      secondary: "Secondary",
      accent: "Accent",
      destructive: "Destructive",
      info: "Info",
      success: "Success",
      warning: "Warning",
      danger: "Danger",
      subtleInfo: "Info subtle",
      subtleSuccess: "Success subtle",
      subtleWarning: "Warning subtle",
      subtleDanger: "Danger subtle",
    },
  },
  "pt-br": {
    semanticTitle: "Papéis semânticos",
    semanticDescription: "Os papéis permanecem estáveis entre temas. Matiz é ferramenta; intenção é o contrato.",
    layersTitle: "Temas e camadas",
    actionsTitle: "Tokens de ação",
    supportTitle: "Cores de suporte",
    primitivesTitle: "Escalas primitivas",
    primitivesDescription: "As escalas brutas ficam disponíveis para trabalho de sistema, mas o código do produto deve consumir primeiro os papéis semânticos.",
    sample: "Aa",
    categories: {
      page: "Fundo da página",
      surface: "Superfície",
      layer1: "Camada 1",
      layer2: "Camada 2",
      layer3: "Camada 3",
      popover: "Popover",
      inverse: "Superfície inversa",
      primary: "Primário",
      secondary: "Secundário",
      accent: "Accent",
      destructive: "Destrutivo",
      info: "Informação",
      success: "Sucesso",
      warning: "Aviso",
      danger: "Perigo",
      subtleInfo: "Informação sutil",
      subtleSuccess: "Sucesso sutil",
      subtleWarning: "Aviso sutil",
      subtleDanger: "Perigo sutil",
    },
  },
} as const;

function colorForStep(step: string) {
  return Number(step) >= 500 ? tokens["text.on-color"] : tokens["text.primary"];
}

function SemanticSwatch({
  label,
  background,
  foreground,
  border,
  sample,
}: Swatch & { sample: string }) {
  return (
    <div className="space-y-2">
      <div
        className="flex h-24 items-center justify-center rounded-lg border shadow-sm"
        style={{
          backgroundColor: background,
          color: foreground,
          borderColor: border ?? tokens["border.default"],
        }}
      >
        <span className="text-sm font-semibold">{sample}</span>
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <code className="block text-xs text-muted-foreground">{background}</code>
      </div>
    </div>
  );
}

export function ColorPalette({ locale = "en" }: { locale?: Locale }) {
  const copy = COPY[locale];

  const layers: Swatch[] = [
    {
      label: copy.categories.page,
      background: tokens["background.default"],
      foreground: tokens["text.primary"],
      border: tokens["border.default"],
    },
    {
      label: copy.categories.surface,
      background: tokens["background.surface"],
      foreground: tokens["text.primary"],
      border: tokens["border.default"],
    },
    {
      label: copy.categories.layer1,
      background: tokens["background.layer-1"],
      foreground: tokens["text.primary"],
      border: tokens["border.subtle"],
    },
    {
      label: copy.categories.layer2,
      background: tokens["background.layer-2"],
      foreground: tokens["text.primary"],
      border: tokens["border.default"],
    },
    {
      label: copy.categories.layer3,
      background: tokens["background.layer-3"],
      foreground: tokens["text.primary"],
      border: tokens["border.strong"],
    },
    {
      label: copy.categories.popover,
      background: tokens["background.popover"],
      foreground: tokens["text.primary"],
      border: tokens["border.default"],
    },
    {
      label: copy.categories.inverse,
      background: tokens["background.inverse"],
      foreground: tokens["text.inverse"],
      border: tokens["border.inverse"],
    },
  ];

  const actions: Swatch[] = [
    {
      label: copy.categories.primary,
      background: tokens["action.primary.background"],
      foreground: tokens["action.primary.foreground"],
    },
    {
      label: copy.categories.secondary,
      background: tokens["action.secondary.background"],
      foreground: tokens["action.secondary.foreground"],
      border: tokens["border.default"],
    },
    {
      label: copy.categories.accent,
      background: tokens["action.accent.background"],
      foreground: tokens["action.accent.foreground"],
    },
    {
      label: copy.categories.destructive,
      background: tokens["action.destructive.background"],
      foreground: tokens["action.destructive.foreground"],
    },
  ];

  const support: Swatch[] = [
    {
      label: copy.categories.info,
      background: tokens["support.info.background"],
      foreground: tokens["support.info.foreground"],
    },
    {
      label: copy.categories.success,
      background: tokens["support.success.background"],
      foreground: tokens["support.success.foreground"],
    },
    {
      label: copy.categories.warning,
      background: tokens["support.warning.background"],
      foreground: tokens["support.warning.foreground"],
    },
    {
      label: copy.categories.danger,
      background: tokens["support.danger.background"],
      foreground: tokens["support.danger.foreground"],
    },
    {
      label: copy.categories.subtleInfo,
      background: tokens["support.info.subtle"],
      foreground: tokens["support.info.subtle-foreground"],
      border: tokens["support.info.border"],
    },
    {
      label: copy.categories.subtleSuccess,
      background: tokens["support.success.subtle"],
      foreground: tokens["support.success.subtle-foreground"],
      border: tokens["support.success.border"],
    },
    {
      label: copy.categories.subtleWarning,
      background: tokens["support.warning.subtle"],
      foreground: tokens["support.warning.subtle-foreground"],
      border: tokens["support.warning.border"],
    },
    {
      label: copy.categories.subtleDanger,
      background: tokens["support.danger.subtle"],
      foreground: tokens["support.danger.subtle-foreground"],
      border: tokens["support.danger.border"],
    },
  ];

  return (
    <div className="space-y-12">
      <section className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-2xl font-semibold tracking-tight text-foreground">{copy.semanticTitle}</h3>
          <p className="max-w-3xl text-sm text-muted-foreground">{copy.semanticDescription}</p>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-foreground">{copy.layersTitle}</h4>
          <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-4">
            {layers.map((swatch) => (
              <SemanticSwatch key={swatch.label} {...swatch} sample={copy.sample} />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-foreground">{copy.actionsTitle}</h4>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {actions.map((swatch) => (
              <SemanticSwatch key={swatch.label} {...swatch} sample={copy.sample} />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-foreground">{copy.supportTitle}</h4>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {support.map((swatch) => (
              <SemanticSwatch key={swatch.label} {...swatch} sample={copy.sample} />
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-2xl font-semibold tracking-tight text-foreground">{copy.primitivesTitle}</h3>
          <p className="max-w-3xl text-sm text-muted-foreground">{copy.primitivesDescription}</p>
        </div>

        <div className="space-y-8">
          {PRIMITIVE_FAMILIES.map((family) => (
            <div key={family} className="space-y-3">
              <h4 className="text-lg font-semibold capitalize text-foreground">{family}</h4>
              <div className="grid grid-cols-3 gap-2 md:grid-cols-6 xl:grid-cols-11">
                {PRIMITIVE_STEPS.map((step) => {
                  const tokenKey = `${family}.${step}` as keyof typeof primitiveTokens;
                  const backgroundColor = primitiveTokens[tokenKey];

                  return (
                    <div key={tokenKey} className="space-y-2">
                      <div
                        className="flex h-16 items-center justify-center rounded-md border border-transparent shadow-sm"
                        style={{
                          backgroundColor,
                          color: colorForStep(step),
                        }}
                      >
                        <span className="text-xs font-semibold">{step}</span>
                      </div>
                      <code className="block text-center text-[11px] text-muted-foreground">{tokenKey}</code>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

import { createContext, useContext, useEffect, useState } from "react"

type Language = "en" | "pt-br"

type LanguageProviderProps = {
    children: React.ReactNode
    defaultLanguage?: Language
    storageKey?: string
}

type LanguageProviderState = {
    language: Language
    setLanguage: (language: Language) => void
    t: (key: string) => string
}

const initialState: LanguageProviderState = {
    language: "en",
    setLanguage: () => null,
    t: (key: string) => key,
}

const translations: Record<Language, Record<string, string>> = {
    "en": {
        "docs.header.title": "Limex",
        "docs.header.subtitle": "Limex Design System Docs",
        "docs.sidebar.back": "Back",
        "docs.sidebar.footer": "© 2026 Eduardo Lima",

        // Nav Sections
        "docs.nav.getting-started": "Getting Started",
        "docs.nav.foundations": "Foundations",
        "docs.nav.components": "Components",
        "docs.nav.patterns": "Patterns",
        "docs.nav.governance": "Governance",

        // Getting Started
        "docs.installation.title": "Installation",
        "docs.installation.description": "How to install and configure the design system.",

        // Foundations
        "docs.colors.title": "Colors",
        "docs.colors.description": "Our color system is based on intent and semantic roles.",
        "docs.typography.title": "Typography",
        "docs.typography.description": "Type scale and hierarchy guidelines.",
        "docs.spacing.title": "Spacing",
        "docs.spacing.description": "Spacing tokens and layout rhythm.",
        "docs.radius.title": "Radius",
        "docs.radius.description": "Corner rounding and shape tokens.",
        "docs.accessibility.title": "Accessibility",
        "docs.accessibility.description": "General accessibility guidelines.",
        "docs.shadows.title": "Shadows",
        "docs.shadows.description": "Elevation and depth levels.",

        // Components
        "docs.button.title": "Button",
        "docs.button.description": "Triggers actions or events.",
        "docs.input.title": "Input",
        "docs.input.description": "Textbox for user input.",
        "docs.card.title": "Card",
        "docs.card.description": "Container for grouping related content.",
        "docs.section-header.title": "Section Header",
        "docs.section-header.description": "Standardized header for page sections.",
        "docs.project-card.title": "Project Card",
        "docs.project-card.description": "Interactive card with spotlight effect.",
        "docs.section.title": "Section",
        "docs.section.description": "Layout container with grid and noise.",
        "docs.badge.title": "Badge",
        "docs.badge.description": "Status indicators and labels.",

        // Patterns
        "docs.forms.title": "Forms",
        "docs.forms.description": "Best practices for building accessible forms.",
        "docs.feedback.title": "Feedback",
        "docs.feedback.description": "Communicating success, error, and loading states.",

        // Governance
        "docs.versioning.title": "Versioning",
        "docs.versioning.description": "How we manage releases and breaking changes.",
        "docs.lifecycle.title": "Lifecycle",
        "docs.lifecycle.description": "Component lifecycle stages.",
        "docs.contributing.title": "Contributing",
        "docs.contributing.description": "How to contribute to the design system.",
        "docs.localization.title": "Localization",
        "docs.localization.description": "Governance rules for internationalization.",

        // Placeholders (Getting Started / Overview)
        "docs.overview.title": "Overview",
        "docs.overview.description": "Component library overview.",
        "docs.usage-basics.title": "Usage Basics",
        "docs.usage-basics.description": "How to use the design system.",
    },
    "pt-br": {
        "docs.header.title": "Limex",
        "docs.header.subtitle": "Documentação do Limex",
        "docs.sidebar.back": "Voltar",
        "docs.sidebar.footer": "© 2026 Eduardo Lima",

        // Nav Sections
        "docs.nav.getting-started": "Começando",
        "docs.nav.foundations": "Fundamentos",
        "docs.nav.components": "Componentes",
        "docs.nav.patterns": "Padrões",
        "docs.nav.governance": "Governança",

        // Getting Started
        "docs.installation.title": "Instalação",
        "docs.installation.description": "Como instalar e configurar o design system.",

        // Foundations
        "docs.colors.title": "Cores",
        "docs.colors.description": "Nosso sistema de cores baseado em intenção e papéis semânticos.",
        "docs.typography.title": "Tipografia",
        "docs.typography.description": "Escala tipográfica e hierarquia.",
        "docs.spacing.title": "Espaçamento",
        "docs.spacing.description": "Tokens de espaçamento e ritmo de layout.",
        "docs.radius.title": "Raio (Radius)",
        "docs.radius.description": "Arredondamento de cantos e tokens de forma.",
        "docs.accessibility.title": "Acessibilidade",
        "docs.accessibility.description": "Diretrizes gerais de acessibilidade.",
        "docs.shadows.title": "Sombras",
        "docs.shadows.description": "Níveis de elevação e profundidade.",

        // Components
        "docs.button.title": "Botão",
        "docs.button.description": "Dispara ações ou eventos.",
        "docs.input.title": "Input",
        "docs.input.description": "Campo de texto para entrada do usuário.",
        "docs.card.title": "Card",
        "docs.card.description": "Container para agrupar conteúdo relacionado.",
        "docs.section-header.title": "Cabeçalho de Seção",
        "docs.section-header.description": "Cabeçalho padronizado para seções de página.",
        "docs.project-card.title": "Card de Projeto",
        "docs.project-card.description": "Card interativo com efeito de destaque.",
        "docs.section.title": "Seção",
        "docs.section.description": "Container de layout com grid e noise.",
        "docs.badge.title": "Badge",
        "docs.badge.description": "Indicadores de status e rótulos.",

        // Patterns
        "docs.forms.title": "Formulários",
        "docs.forms.description": "Melhores práticas para formulários acessíveis.",
        "docs.feedback.title": "Feedback",
        "docs.feedback.description": "Comunicando sucesso, erro e estados de carregamento.",

        // Governance
        "docs.versioning.title": "Versionamento",
        "docs.versioning.description": "Como gerenciamos releases e mudanças quebram compatibilidade.",
        "docs.lifecycle.title": "Ciclo de Vida",
        "docs.lifecycle.description": "Estágios de maturidade dos componentes.",
        "docs.contributing.title": "Contribuindo",
        "docs.contributing.description": "Como contribuir para o sistema de design.",
        "docs.localization.title": "Localização",
        "docs.localization.description": "Regras de governança para internacionalização.",

        // Placeholders
        "docs.overview.title": "Visão Geral",
        "docs.overview.description": "Visão geral da biblioteca de componentes.",
        "docs.usage-basics.title": "Noções Básicas",
        "docs.usage-basics.description": "Como usar o sistema de design.",
    }
}

const LanguageProviderContext = createContext<LanguageProviderState>(initialState)

export function LanguageProvider({
    children,
    defaultLanguage = "en",
    storageKey = "vite-ui-language",
    ...props
}: LanguageProviderProps) {
    const [language, setLanguage] = useState<Language>(
        () => (localStorage.getItem(storageKey) as Language) || defaultLanguage
    )

    useEffect(() => {
        localStorage.setItem(storageKey, language)
        document.documentElement.lang = language
    }, [language, storageKey])

    const t = (key: string) => {
        return translations[language][key] || key
    }

    const value = {
        language,
        setLanguage,
        t
    }

    return (
        <LanguageProviderContext.Provider value={value} {...props}>
            {children}
        </LanguageProviderContext.Provider>
    )
}

export const useLanguage = () => {
    const context = useContext(LanguageProviderContext)

    if (context === undefined)
        throw new Error("useLanguage must be used within a LanguageProvider")

    return context
}

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
        // Landing Page: Nav
        "nav.hero": "Home",
        "nav.projects": "Projects",
        "nav.services": "Services",
        "nav.story": "About",
        "nav.stack": "Stack",
        "nav.contact": "Contact",

        // Landing Page: Hero
        "hero.badge": "Senior UI/UX",
        "hero.word1": "Curiosity.",
        "hero.word2": "Design.",
        "hero.word3": "Impact.",
        "hero.description": "I design digital experiences blending design, technology, and AI to solve real problems and generate measurable impact.",
        "hero.cta": "View Projects",

        // Landing Page: Projects
        "projects.title": "Projects",
        "projects.description": "A selection of work that defines my approach.",
        "projects.tab.ux": "UX Research",
        "projects.tab.ui": "UI Design",
        "projects.empty": "No projects found in this category at the moment.",

        // Landing Page: Services
        "services.title": "Services",
        "services.description": "How I can help your team or product grow.",
        "services.cta": "Let's talk",
        "services.design.title": "Product Design",
        "services.design.desc": "End-to-end design: from research to handoff. Creating interfaces that balance user needs with business goals.",
        "services.system.title": "Design Systems",
        "services.system.desc": "Building scalable component libraries and documentation to ensure consistency and speed up development.",
        "services.consulting.title": "UX Consulting",
        "services.consulting.desc": "Auditing and improving existing products. Identifying friction points and proposing actionable solutions.",
        "services.dev.title": "Frontend / Prototyping",
        "services.dev.desc": "Creating high-fidelity prototypes and frontend components (React/Tailwind) to bridge the gap between design and code.",

        // Landing Page: Storytelling
        "story.title": "Creative DNA",
        "story.description": "Explore the phases that shaped my methodology.",
        "story.1.year": "Discovery Method",
        "story.1.title": "Applied Curiosity",
        "story.1.desc": "My creativity starts with questions. Understanding the problem, exploring possibilities, and questioning ready-made solutions is part of my process. Curiosity, to me, is not an aesthetic — it's a tool to reach more conscious decisions.",
        "story.2.year": "Structure before Screen",
        "story.2.title": "Systemic Thinking",
        "story.2.desc": "I see digital products as living systems. Every interface decision impacts flows, business rules, data, and future evolution. That's why I think of UX beyond screens — as a structure that needs to scale, be maintained, and evolve.",
        "story.3.year": "Viable Design",
        "story.3.title": "Execution with Technical Awareness",
        "story.3.desc": "Understanding technical limitations is part of creation. Knowledge in frontend, logic, and automation helps me design viable solutions, reduce friction with development, and accelerate deliveries without losing quality.",
        "story.4.year": "Constant Learning",
        "story.4.title": "Continuous Evolution",
        "story.4.desc": "My process is always in motion. I explore new technologies, AI, and tools not out of trend, but to increase autonomy and raise the level of deliveries. Learning fast has become an essential part of how I work.",

        // Landing Page: Stack
        "stack.title": "Tech Stack",
        "stack.description": "Tools and technologies I use to bring ideas to life.",
        "stack.tool.figma": "Advanced prototyping and Design Systems",
        "stack.tool.react": "Componentization and living interfaces",
        "stack.tool.ai": "Midjourney, ChatGPT, n8n",
        "stack.tool.ds": "Scalability and consistency",
        "stack.tool.automation": "Intelligent workflows",
        "stack.tool.adobe": "Robust visuals and editing",

        // Landing Page: CTA
        "cta.title": "Let's talk?",
        "cta.description": "Always open to new projects, collaborations, or a good chat about design and technology.",
        "cta.button.email": "Get in touch",
        "cta.button.linkedin": "Connect on LinkedIn",

        // --- PHASE 2 COMPONENTS ---
        // WelcomeScreen
        "welcome.subtitle": "Transforming complexity into simple and intelligent experiences.",
        "welcome.enter": "Access portfolio",
        "welcome.audioHelp": "Immersive audio experience. Control available in the bottom corner.",

        // Testimonials
        "testimonials.title": "What they say",
        "testimonials.subtitle": "Feedback from those who have turned ideas into reality with me.",
        "testimonials.1.text": "His ability to translate complex business requirements into simple interfaces is unmatched. The Design System he implemented accelerated our dev by 40%.",
        "testimonials.1.role": "Head of Product @ Fintech",
        "testimonials.2.text": "Finally a designer who understands code. The technical delivery was perfect and the interface animations elevated our product level.",
        "testimonials.2.role": "CTO @ Startup",
        "testimonials.3.text": "He doesn't just design screens, he creates narratives. The rebranding we did changed our brand perception in the global market.",
        "testimonials.3.role": "Marketing Director",

        // ContactFormModal
        "contact.dialog.title": "Let's talk",
        "contact.dialog.desc": "Fill out the form below with your details and project info.",
        "contact.form.name": "Name",
        "contact.form.namePlaceholder": "Your name",
        "contact.form.phone": "Phone",
        "contact.form.company": "Company",
        "contact.form.companyPlaceholder": "Company name",
        "contact.form.desc": "Description",
        "contact.form.descPlaceholder": "How can I help you?",
        "contact.form.submit": "Send message",

        // NewsletterModal
        "newsletter.trigger": "AI Newsletter",
        "newsletter.title": "Join my Newsletter",
        "newsletter.desc": "Get exclusive news and insights about Artificial Intelligence and technology straight to your inbox.",
        "newsletter.form.name": "Name",
        "newsletter.form.namePlaceholder": "Your name",
        "newsletter.form.nameRequired": "Name is required",
        "newsletter.form.email": "Email",
        "newsletter.form.emailPlaceholder": "your@email.com",
        "newsletter.form.emailRequired": "Email is required",
        "newsletter.form.emailInvalid": "Invalid email",
        "newsletter.form.submit": "Subscribe",
        "newsletter.toast.success.title": "Successfully subscribed!",
        "newsletter.toast.success.desc": "Keep an eye on your inbox for news.",
        "newsletter.toast.error.duplicateTitle": "You are already subscribed",
        "newsletter.toast.error.duplicateDesc": "This email is already on our list.",
        "newsletter.toast.error.generalTitle": "Error subscribing",
        "newsletter.toast.error.generalDesc": "Please try again later.",

        // ChatWidget
        "chat.msg1": "Hi! Welcome to my portfolio.",
        "chat.msg2": "Ask me anything about my work, creative process, or experience.",
        "chat.placeholder": "Type your message...",
        "chat.assistant": "AI Assistant",

        // ProjectDetail
        "project.back": "Back",
        "project.client": "Client",
        "project.role": "Role",
        "project.tech": "Technologies",
        "project.year": "Year",
        "project.overview": "Overview",
        "project.challenge": "The Challenge",
        "project.solution": "The Solution",
        "project.next": "Next Project",
        "project.viewNext": "View Next",
        "project.keyMetric": "Key Metric",
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
        // Landing Page: Nav
        "nav.hero": "Início",
        "nav.projects": "Projetos",
        "nav.services": "Serviços",
        "nav.story": "Sobre",
        "nav.stack": "Stack",
        "nav.contact": "Contato",

        // Landing Page: Hero
        "hero.badge": "Senior UI/UX",
        "hero.word1": "Curiosidade.",
        "hero.word2": "Design.",
        "hero.word3": "Impacto.",
        "hero.description": "Projeto experiências digitais unindo design, tecnologia e IA para resolver problemas reais e gerar impacto mensurável.",
        "hero.cta": "Ver Projetos",

        // Landing Page: Projects
        "projects.title": "Projetos",
        "projects.description": "Uma seleção de trabalhos que definem minha abordagem.",
        "projects.tab.ux": "Pesquisas UX",
        "projects.tab.ui": "UI Design",
        "projects.empty": "Nenhum projeto encontrado nesta categoria no momento.",

        // Landing Page: Services
        "services.title": "Serviços",
        "services.description": "Como posso ajudar seu time ou produto a evoluir.",
        "services.cta": "Vamos conversar",
        "services.design.title": "Product Design",
        "services.design.desc": "Design de ponta a ponta: da pesquisa ao handoff. Criando interfaces que equilibram as necessidades do usuário com os objetivos de negócio.",
        "services.system.title": "Design Systems",
        "services.system.desc": "Construção de bibliotecas de componentes escaláveis e documentação para garantir consistência e acelerar o desenvolvimento.",
        "services.consulting.title": "Consultoria UX",
        "services.consulting.desc": "Auditoria e melhoria de produtos existentes. Identificação de pontos de fricção e proposta de soluções acionáveis.",
        "services.dev.title": "Frontend / Prototipação",
        "services.dev.desc": "Criação de protótipos de alta fidelidade e componentes frontend (React/Tailwind) para diminuir a distância entre design e código.",

        // Landing Page: Storytelling
        "story.title": "DNA Criativo",
        "story.description": "Explore as fases que moldaram minha metodologia.",
        "story.1.year": "Método de descoberta",
        "story.1.title": "Curiosidade Aplicada",
        "story.1.desc": "Minha criatividade começa com perguntas. Entender o problema, explorar possibilidades e questionar soluções prontas faz parte do meu processo. Curiosidade, para mim, não é estética — é ferramenta para chegar em decisões mais conscientes.",
        "story.2.year": "Estrutura antes da tela",
        "story.2.title": "Pensamento Sistêmico",
        "story.2.desc": "Encaro produtos digitais como sistemas vivos. Cada decisão de interface impacta fluxos, regras de negócio, dados e evolução futura. Por isso, penso UX além das telas — como uma estrutura que precisa escalar, se manter e evoluir.",
        "story.3.year": "Design viável",
        "story.3.title": "Execução com Consciência Técnica",
        "story.3.desc": "Entender limitações técnicas faz parte da criação. Conhecimento em frontend, lógica e automações me ajuda a projetar soluções viáveis, reduzir fricção com desenvolvimento e acelerar entregas sem perder qualidade.",
        "story.4.year": "Aprendizado constante",
        "story.4.title": "Evolução Contínua",
        "story.4.desc": "Meu processo está sempre em movimento. Exploro novas tecnologias, IA e ferramentas não por tendência, mas para ampliar autonomia e elevar o nível das entregas. Aprender rápido virou parte essencial do meu jeito de trabalhar.",

        // Landing Page: Stack
        "stack.title": "Tech Stack",
        "stack.description": "Ferramentas e tecnologias que utilizo para dar vida às ideias.",
        "stack.tool.figma": "Prototipagem avançada e Design Systems",
        "stack.tool.react": "Componentização e interfaces vivas",
        "stack.tool.ai": "Midjourney, ChatGPT, n8n",
        "stack.tool.ds": "Escalabilidade e consistência",
        "stack.tool.automation": "Workflows inteligentes",
        "stack.tool.adobe": "Visual robusto e edição",

        // Landing Page: CTA
        "cta.title": "Vamos conversar?",
        "cta.description": "Sempre aberto a novos projetos, colaborações ou um bom papo sobre design e tecnologia.",
        "cta.button.email": "Entrar em contato",
        "cta.button.linkedin": "Conectar no LinkedIn",

        // --- PHASE 2 COMPONENTS ---
        // WelcomeScreen
        "welcome.subtitle": "Transformando complexidade em experiências simples e inteligentes.",
        "welcome.enter": "Acessar portfólio",
        "welcome.audioHelp": "Experiência imersiva com áudio. Controle disponível no canto inferior.",

        // Testimonials
        "testimonials.title": "O que dizem",
        "testimonials.subtitle": "Feedback de quem já transformou ideias em realidade comigo.",
        "testimonials.1.text": "A capacidade dele de traduzir requisitos de negócio complexos em interfaces simples é inigualável. O Design System que ele implementou acelerou nosso dev em 40%.",
        "testimonials.1.role": "Head of Product @ Fintech",
        "testimonials.2.text": "Finalmente um designer que entende de código. A entrega técnica foi perfeita e a animação das interfaces elevou o nível do nosso produto.",
        "testimonials.2.role": "CTO @ Startup",
        "testimonials.3.text": "Ele não apenas desenha telas, ele cria narrativas. O rebranding que fizemos mudou a percepção da nossa marca no mercado global.",
        "testimonials.3.role": "Marketing Director",

        // ContactFormModal
        "contact.dialog.title": "Vamos conversar",
        "contact.dialog.desc": "Preencha o formulário abaixo com seus dados e detalhes do projeto.",
        "contact.form.name": "Nome",
        "contact.form.namePlaceholder": "Seu nome",
        "contact.form.phone": "Telefone",
        "contact.form.company": "Empresa",
        "contact.form.companyPlaceholder": "Nome da empresa",
        "contact.form.desc": "Descrição",
        "contact.form.descPlaceholder": "Como posso ajudar?",
        "contact.form.submit": "Enviar mensagem",

        // NewsletterModal
        "newsletter.trigger": "Newsletter IA",
        "newsletter.title": "Entre na minha Newsletter",
        "newsletter.desc": "Receba notícias e insights exclusivos sobre o universo de Inteligência Artificial e tecnologia diretamente no seu e-mail.",
        "newsletter.form.name": "Nome",
        "newsletter.form.namePlaceholder": "Seu nome",
        "newsletter.form.nameRequired": "Nome é obrigatório",
        "newsletter.form.email": "E-mail",
        "newsletter.form.emailPlaceholder": "seu@email.com",
        "newsletter.form.emailRequired": "E-mail é obrigatório",
        "newsletter.form.emailInvalid": "E-mail inválido",
        "newsletter.form.submit": "Inscrever-se",
        "newsletter.toast.success.title": "Inscrição realizada com sucesso!",
        "newsletter.toast.success.desc": "Fique de olho no seu e-mail para novidades.",
        "newsletter.toast.error.duplicateTitle": "Você já está cadastrado",
        "newsletter.toast.error.duplicateDesc": "Este e-mail já faz parte da nossa lista.",
        "newsletter.toast.error.generalTitle": "Erro ao realizar inscrição",
        "newsletter.toast.error.generalDesc": "Por favor, tente novamente mais tarde.",

        // ChatWidget
        "chat.msg1": "Olá! Bem-vindo ao meu portfólio.",
        "chat.msg2": "Pergunte qualquer coisa sobre meu trabalho, processo criativo ou experiência.",
        "chat.placeholder": "Digite sua mensagem...",
        "chat.assistant": "AI Assistant",

        // ProjectDetail
        "project.back": "Voltar",
        "project.client": "Cliente",
        "project.role": "Função",
        "project.tech": "Tecnologias",
        "project.year": "Ano",
        "project.overview": "Visão Geral",
        "project.challenge": "O Desafio",
        "project.solution": "A Solução",
        "project.next": "Próximo Projeto",
        "project.viewNext": "Ver Próximo",
        "project.keyMetric": "Métrica Chave",
    }
}

const LanguageProviderContext = createContext<LanguageProviderState>(initialState)

export function LanguageProvider({
    children,
    defaultLanguage = "en",
    storageKey = "portfolio-language",
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

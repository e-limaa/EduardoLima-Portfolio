export const projects = [
    {
        id: 1,
        title: "Nexus Financial",
        category: "Fintech • Sistema",
        role: "Designer de Produto",
        year: "2024",
        client: "Nexus Inc.",
        description: "Um redesign abrangente de dashboard financeiro focado em visualização de dados e retenção de usuários. Transformamos dados financeiros complexos em insights acionáveis.",
        challenge: "Os usuários estavam sobrecarregados pela densidade de dados no sistema legado, levando a uma alta taxa de churn durante o processo de onboarding. A navegação era confusa e métricas críticas estavam escondidas.",
        solution: "Implementamos um sistema de widgets modulares permitindo que os usuários personalizem seu dashboard. Também introduzimos o recurso 'Smart Insight' que destaca anomalias e tendências automaticamente usando IA.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
            "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1200&q=80"
        ],
        metric: "+45% Retenção",
        color: "from-blue-600 to-blue-400",
        stack: ["React", "D3.js", "Tailwind", "Framer Motion"]
    },
    {
        id: 2,
        title: "Aura Health",
        category: "Mobile • Interação",
        role: "Designer Líder",
        year: "2023",
        client: "Aura Well",
        description: "Um aplicativo de meditação e bem-estar focado em interações fluidas e visuais calmantes. O objetivo foi reduzir o atrito para encontrar conteúdo relevante.",
        challenge: "O mercado está saturado de aplicativos de bem-estar. A Aura precisava de uma proposta de valor única e uma UX que parecesse significativamente mais 'calma' e 'premium' que os concorrentes.",
        solution: "Usamos formas orgânicas, gradientes suaves e navegação baseada em gestos para criar uma experiência de estado de fluxo. O feedback háptico foi usado sutilmente para reforçar exercícios de respiração.",
        image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1200&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1200&q=80",
            "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80"
        ],
        metric: "4.9 App Store",
        color: "from-zinc-500 to-zinc-300",
        stack: ["React Native", "Reanimated", "Node.js"]
    },
    {
        id: 3,
        title: "Velocita Shop",
        category: "Web • 3D",
        role: "Desenvolvedor UI",
        year: "2023",
        client: "Velocita",
        description: "Uma experiência imersiva de e-commerce para peças automotivas de alto padrão, com configuração 3D em tempo real.",
        challenge: "Clientes hesitavam em comprar peças caras sem saber se serviriam ou ficariam boas. Imagens estáticas não eram suficientes.",
        solution: "Integramos um visualizador WebGL permitindo aos usuários rotacionar, ampliar e explodir peças. A interface permanece minimalista para deixar o produto brilhar.",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
            "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=80"
        ],
        metric: "2.3s Carregamento",
        color: "from-zinc-400 to-zinc-200",
        stack: ["Three.js", "React Three Fiber", "Shopify"]
    },
    {
        id: 4,
        title: "Echo AI Platform",
        category: "SaaS • Dashboard",
        role: "Arquiteto UX",
        year: "2024",
        client: "Echo Systems",
        description: "Uma plataforma de analytics impulsionada por IA para equipes corporativas. Foco em clareza e inteligência acionável.",
        challenge: "Apresentar intervalos de confiança de IA e relacionamentos de dados complexos sem confundir stakeholders não técnicos.",
        solution: "Desenvolvemos uma interface de 'Linguagem Natural' onde usuários fazem perguntas e obtêm respostas visuais, ignorando filtros complexos.",
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80",
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80"
        ],
        metric: "10k+ Usuários",
        color: "from-blue-500 to-indigo-600",
        stack: ["Next.js", "Python", "PostgreSQL"]
    },
    {
        id: 5,
        title: "Urban Mobility",
        category: "App • Cidade",
        role: "Designer de Produto",
        year: "2022",
        client: "City Flow",
        description: "Aplicativo de navegação para cidades inteligentes integrando transporte público, caronas e micromobilidade.",
        challenge: "Serviços de mobilidade fragmentados significavam que usuários tinham que verificar 3-4 apps para planejar uma viagem.",
        solution: "Um algoritmo de roteamento unificado que combina todos os modos de transporte em itinerários únicos e comparáveis por preço e tempo.",
        image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1200&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1200&q=80"
        ],
        metric: "1M+ Corridas",
        color: "from-emerald-500 to-teal-600",
        stack: ["Flutter", "Google Maps API", "Firebase"]
    },
    {
        id: 6,
        title: "Creative Hub",
        category: "Web • Portfólio",
        role: "Dev Frontend",
        year: "2023",
        client: "Self",
        description: "Uma plataforma para artistas digitais exibirem seus trabalhos com zero artefatos de compressão.",
        challenge: "Plataformas existentes comprimem imagens demais, arruinando os detalhes da arte digital.",
        solution: "Um CDN especializado e visualizador que carrega blocos de alta resolução sob demanda, similar a aplicativos de mapas.",
        image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&q=80"
        ],
        metric: "Premiado",
        color: "from-purple-500 to-pink-600",
        stack: ["React", "WebAssembly", "AWS S3"]
    }
];

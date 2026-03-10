# Portfolio Adoption Inventory

Inventario versionado dos componentes locais do `apps/portfolio` para orientar a promocao de primitives ao Limia e a migracao de consumo no app.

## Resumo Executivo

- Total de componentes avaliados: `67`
- Total por decisao:
  - `promover para o Limia`: `43`
  - `reconstruir com Limia e manter local`: `18`
  - `manter local`: `6`
- Primeiros candidatos a promocao:
  - `Avatar`
  - `DropdownMenu`
  - `Sonner` / `Toaster` / `toast`
  - retirar copias locais de `Dialog`, `Form`, `Badge`, `Label` e `Textarea` em favor da API publica existente
- Principais desvios de adocao detectados:
  - `44` primitives locais em `apps/portfolio/src/components/ui`, todos com arquivo equivalente no pacote, mantendo duas fontes de verdade.
  - O `portfolio` ainda depende de imports fora da API publica para `Avatar`, `Dialog`, `DropdownMenu`, `Toaster` e `toast`.
  - Fluxos de alto impacto como `Newsletter`, `ContactFormModal`, `ChatWidget`, `ModeToggle` e `RequireAdmin` re-skinam primitives do Limia com hardcodes de cor, sombra e foco.
  - A maior parte das secoes de landing ja usa building blocks do Limia, mas ainda mistura composicao de produto com overrides locais extensos.

## Escopo e Exclusoes

- Escopo desta fase:
  - `apps/portfolio/src/components/**`
  - `apps/portfolio/src/pages/**`
- Itens excluidos do inventario detalhado:
  - providers: `language-provider.tsx`, `theme-provider.tsx`
  - utilitarios / hooks: `components/ui/use-mobile.ts`, `components/ui/utils.ts`
  - conteudo puro: `landing/projects-data.ts`
  - integracoes e dados fora de `components/**` e `pages/**`
- Observacao de governanca:
  - Todos os primitives locais em `components/ui` possuem arquivo equivalente em `packages/limia-design-system/src/components/ui`.
  - O problema atual e de superficie publica, ownership e adocao; nao de ausencia de implementacao base.

## Inventario Detalhado

## Componentes de Shell e Produto

### `LanguageToggle`
- Componente: `LanguageToggle`
- Local atual: `apps/portfolio/src/components/language-toggle.tsx`
- Tipo: `composicao reutilizavel`
- Dependencias de UI: `primitives locais: DropdownMenu*`; `primitives do Limia: Button`; `tokens/estilos hardcoded: baixo`
- Superficie publica equivalente no Limia: `existe parcialmente`
- Decisao: `reconstruir com Limia e manter local`
- Justificativa: o padrao visual pode ser compartilhado, mas o contrato depende do `language-provider` do app.
- Bloqueadores: `DropdownMenu*` ainda nao esta publico no pacote.
- Prioridade: `P1`
- Sequencia recomendada: `Migrar consumo depois`

### `ModeToggle`
- Componente: `ModeToggle`
- Local atual: `apps/portfolio/src/components/mode-toggle.tsx`
- Tipo: `composicao reutilizavel`
- Dependencias de UI: `primitives locais: nenhuma`; `primitives do Limia: Button importado, mas nao usado`; `tokens/estilos hardcoded: alto`
- Superficie publica equivalente no Limia: `existe parcialmente`
- Decisao: `reconstruir com Limia e manter local`
- Justificativa: o comportamento de troca de tema e reutilizavel, mas a integracao depende do provider do app e o componente hoje ignora a superficie do Limia.
- Bloqueadores: falta definir um padrao de theme toggle sobre primitives publicos.
- Prioridade: `P1`
- Sequencia recomendada: `Migrar consumo depois`

### `RequireAdmin`
- Componente: `RequireAdmin`
- Local atual: `apps/portfolio/src/components/auth/RequireAdmin.tsx`
- Tipo: `composicao de produto`
- Dependencias de UI: `primitives locais: nenhuma`; `primitives do Limia: Button, Input`; `tokens/estilos hardcoded: medio-alto`
- Superficie publica equivalente no Limia: `existe parcialmente`
- Decisao: `reconstruir com Limia e manter local`
- Justificativa: a autenticacao e 100% especifica do dashboard, mas o shell visual deve aderir a tokens e estados do Limia.
- Bloqueadores: dependencia de fluxo Supabase e estados de permissao do produto.
- Prioridade: `P1`
- Sequencia recomendada: `Migrar consumo depois`

### `ImageWithFallback`
- Componente: `ImageWithFallback`
- Local atual: `apps/portfolio/src/components/figma/ImageWithFallback.tsx`
- Tipo: `composicao reutilizavel`
- Dependencias de UI: `primitives locais: nenhuma`; `primitives do Limia: nenhuma`; `tokens/estilos hardcoded: medio-alto`
- Superficie publica equivalente no Limia: `nao existe`
- Decisao: `manter local`
- Justificativa: o helper resolve um caso tecnico de resiliencia de imagem e nao um primitive de interface do design system.
- Bloqueadores: placeholder embutido e contrato mais utilitario do que visual.
- Prioridade: `P2`
- Sequencia recomendada: `Manter fora do design system`

### `AudioPlayer`
- Componente: `AudioPlayer`
- Local atual: `apps/portfolio/src/components/landing/AudioPlayer.tsx`
- Tipo: `efeito/ornamento`
- Dependencias de UI: `primitives locais: nenhuma`; `primitives do Limia: nenhuma`; `tokens/estilos hardcoded: alto`
- Superficie publica equivalente no Limia: `nao existe`
- Decisao: `manter local`
- Justificativa: e uma experiencia de marca e ambientacao, sem caso real de reuso cross-app.
- Bloqueadores: playlist, motion e copy especificos do portfolio.
- Prioridade: `P2`
- Sequencia recomendada: `Manter fora do design system`

### `BrandMarquee`
- Componente: `BrandMarquee`
- Local atual: `apps/portfolio/src/components/landing/BrandMarquee.tsx`
- Tipo: `efeito/ornamento`
- Dependencias de UI: `primitives locais: nenhuma`; `primitives do Limia: nenhuma`; `tokens/estilos hardcoded: medio`
- Superficie publica equivalente no Limia: `nao existe`
- Decisao: `manter local`
- Justificativa: depende de logos, ritmo e narrativa de autoridade do portfolio.
- Bloqueadores: assets e copy de marca.
- Prioridade: `P2`
- Sequencia recomendada: `Manter fora do design system`

### `ChatWidget`
- Componente: `ChatWidget`
- Local atual: `apps/portfolio/src/components/landing/ChatWidget.tsx`
- Tipo: `composicao de produto`
- Dependencias de UI: `primitives locais: Avatar*`; `primitives do Limia: Button, Input`; `tokens/estilos hardcoded: alto`
- Superficie publica equivalente no Limia: `existe parcialmente`
- Decisao: `reconstruir com Limia e manter local`
- Justificativa: o widget usa primitives genericos, mas o fluxo de mensagens e a integracao de chat sao especificos do produto.
- Bloqueadores: `Avatar*` ainda fora da API publica e forte dependencia de estilos hardcoded.
- Prioridade: `P1`
- Sequencia recomendada: `Migrar consumo depois`

### `ContactFormModal`
- Componente: `ContactFormModal`
- Local atual: `apps/portfolio/src/components/landing/ContactFormModal.tsx`
- Tipo: `composicao de produto`
- Dependencias de UI: `primitives locais: Dialog*`; `primitives do Limia: Input, Button, Label, Textarea`; `tokens/estilos hardcoded: alto`
- Superficie publica equivalente no Limia: `existe parcialmente`
- Decisao: `reconstruir com Limia e manter local`
- Justificativa: o formulario e especifico de contato comercial, mas deve ser recomposto so com primitives publicos e tokens semanticos.
- Bloqueadores: consumo ainda aponta para `Dialog` local e o visual depende de overrides extensos.
- Prioridade: `P1`
- Sequencia recomendada: `Migrar consumo depois`

### `CTA`
- Componente: `CTA`
- Local atual: `apps/portfolio/src/components/landing/CTA.tsx`
- Tipo: `composicao de produto`
- Dependencias de UI: `primitives locais: ContactFormModal`; `primitives do Limia: InteractiveGrid, Button, SectionHeader`; `tokens/estilos hardcoded: alto`
- Superficie publica equivalente no Limia: `existe parcialmente`
- Decisao: `reconstruir com Limia e manter local`
- Justificativa: a secao e especifica do portfolio, mas deve usar primitives do Limia sem cores e sombras avulsas.
- Bloqueadores: dependencias de links externos, estados decorativos e modal local.
- Prioridade: `P1`
- Sequencia recomendada: `Migrar consumo depois`

### `Hero`
- Componente: `Hero`
- Local atual: `apps/portfolio/src/components/landing/Hero.tsx`
- Tipo: `composicao de produto`
- Dependencias de UI: `primitives locais: ChatWidget`; `primitives do Limia: TextReveal, InteractiveGrid, Badge`; `tokens/estilos hardcoded: alto`
- Superficie publica equivalente no Limia: `existe parcialmente`
- Decisao: `reconstruir com Limia e manter local`
- Justificativa: a hero mistura storytelling, motion e marca; deve continuar local, mas precisa reduzir overrides e depender de primitives publicos.
- Bloqueadores: gradients, sombras, media assets e widget local acoplado.
- Prioridade: `P1`
- Sequencia recomendada: `Migrar consumo depois`

### `MouseSpotlight`
- Componente: `MouseSpotlight`
- Local atual: `apps/portfolio/src/components/landing/MouseSpotlight.tsx`
- Tipo: `efeito/ornamento`
- Dependencias de UI: `primitives locais: nenhuma`; `primitives do Limia: nenhuma`; `tokens/estilos hardcoded: alto`
- Superficie publica equivalente no Limia: `nao existe`
- Decisao: `manter local`
- Justificativa: e um efeito decorativo puro de ambientacao visual do portfolio.
- Bloqueadores: nenhuma necessidade de produto multi-app.
- Prioridade: `P2`
- Sequencia recomendada: `Manter fora do design system`

### `Navbar`
- Componente: `Navbar`
- Local atual: `apps/portfolio/src/components/landing/Navbar.tsx`
- Tipo: `composicao de produto`
- Dependencias de UI: `primitives locais: ModeToggle`; `primitives do Limia: nenhuma`; `tokens/estilos hardcoded: alto`
- Superficie publica equivalente no Limia: `existe parcialmente`
- Decisao: `reconstruir com Limia e manter local`
- Justificativa: a navegacao e especifica do portfolio, mas o shell visual, estados e controles devem aderir ao Limia.
- Bloqueadores: muitos valores arbitrarios e toggle de tema fora do design system.
- Prioridade: `P1`
- Sequencia recomendada: `Migrar consumo depois`

### `NewsletterModal`
- Componente: `NewsletterModal`
- Local atual: `apps/portfolio/src/components/landing/NewsletterModal.tsx`
- Tipo: `composicao de produto`
- Dependencias de UI: `primitives locais: nenhuma`; `primitives do Limia: Button, Input, Dialog*, Form*`; `tokens/estilos hardcoded: medio`
- Superficie publica equivalente no Limia: `existe parcialmente`
- Decisao: `reconstruir com Limia e manter local`
- Justificativa: o fluxo de inscricao e especifico de negocio, mas ja esta muito proximo do pacote e deve virar um bom consumidor do Limia.
- Bloqueadores: `toast` ainda vem de `sonner` direto e o sucesso/erro nao passa por uma API publica do pacote.
- Prioridade: `P1`
- Sequencia recomendada: `Migrar consumo depois`

### `ProjectDetail`
- Componente: `ProjectDetail`
- Local atual: `apps/portfolio/src/components/landing/ProjectDetail.tsx`
- Tipo: `composicao de produto`
- Dependencias de UI: `primitives locais: ImageWithFallback, Navbar`; `primitives do Limia: Button, TextReveal`; `tokens/estilos hardcoded: medio-alto`
- Superficie publica equivalente no Limia: `existe parcialmente`
- Decisao: `reconstruir com Limia e manter local`
- Justificativa: a tela depende de dados de projeto e navegacao especifica, mas ainda precisa aderir melhor a tokens e superficie publica.
- Bloqueadores: layout editorial e assets especificos do portfolio.
- Prioridade: `P2`
- Sequencia recomendada: `Migrar consumo depois`

### `Projects`
- Componente: `Projects`
- Local atual: `apps/portfolio/src/components/landing/Projects.tsx`
- Tipo: `composicao de produto`
- Dependencias de UI: `primitives locais: nenhuma`; `primitives do Limia: SectionHeader, Section, ProjectCard`; `tokens/estilos hardcoded: medio`
- Superficie publica equivalente no Limia: `existe parcialmente`
- Decisao: `reconstruir com Limia e manter local`
- Justificativa: a secao deve continuar no app, mas e um bom candidato a uso exemplar do Limia.
- Bloqueadores: filtros e copy acoplados ao portfolio.
- Prioridade: `P1`
- Sequencia recomendada: `Migrar consumo depois`

### `ProjectsPage`
- Componente: `ProjectsPage`
- Local atual: `apps/portfolio/src/components/landing/ProjectsPage.tsx`
- Tipo: `composicao de produto`
- Dependencias de UI: `primitives locais: nenhuma`; `primitives do Limia: TextReveal, Section, Button, ProjectCard`; `tokens/estilos hardcoded: medio`
- Superficie publica equivalente no Limia: `existe parcialmente`
- Decisao: `reconstruir com Limia e manter local`
- Justificativa: a pagina e derivada do dominio de projetos do portfolio e nao deve subir para o pacote.
- Bloqueadores: filtros, copy e navegacao do produto.
- Prioridade: `P2`
- Sequencia recomendada: `Migrar consumo depois`

### `Services`
- Componente: `Services`
- Local atual: `apps/portfolio/src/components/landing/Services.tsx`
- Tipo: `composicao de produto`
- Dependencias de UI: `primitives locais: nenhuma`; `primitives do Limia: SectionHeader, Section`; `tokens/estilos hardcoded: medio`
- Superficie publica equivalente no Limia: `existe parcialmente`
- Decisao: `reconstruir com Limia e manter local`
- Justificativa: e uma secao editorial de oferta do portfolio, mas deve usar o Limia como base visual.
- Bloqueadores: hover colors e grid local ainda nao orientados por tokens semanticos.
- Prioridade: `P2`
- Sequencia recomendada: `Migrar consumo depois`

### `Stack`
- Componente: `Stack`
- Local atual: `apps/portfolio/src/components/landing/Stack.tsx`
- Tipo: `composicao de produto`
- Dependencias de UI: `primitives locais: nenhuma`; `primitives do Limia: SectionHeader, Section, Card*`; `tokens/estilos hardcoded: medio`
- Superficie publica equivalente no Limia: `existe parcialmente`
- Decisao: `reconstruir com Limia e manter local`
- Justificativa: a secao usa primitives corretos, mas ainda depende de visual local e dados especificos do portfolio.
- Bloqueadores: iconografia, motion e hover treatments acoplados a esta pagina.
- Prioridade: `P2`
- Sequencia recomendada: `Migrar consumo depois`

### `Storytelling`
- Componente: `Storytelling`
- Local atual: `apps/portfolio/src/components/landing/Storytelling.tsx`
- Tipo: `composicao de produto`
- Dependencias de UI: `primitives locais: ImageWithFallback`; `primitives do Limia: Section, SectionHeader`; `tokens/estilos hardcoded: medio-alto`
- Superficie publica equivalente no Limia: `existe parcialmente`
- Decisao: `reconstruir com Limia e manter local`
- Justificativa: a narrativa e 100% especifica do portfolio, mas a composicao deve aderir melhor a tokens e primitives publicos.
- Bloqueadores: imagens, timeline e treatments de cor locais.
- Prioridade: `P2`
- Sequencia recomendada: `Migrar consumo depois`

### `Testimonials`
- Componente: `Testimonials`
- Local atual: `apps/portfolio/src/components/landing/Testimonials.tsx`
- Tipo: `composicao de produto`
- Dependencias de UI: `primitives locais: Avatar*`; `primitives do Limia: Section, Card, CardContent`; `tokens/estilos hardcoded: medio`
- Superficie publica equivalente no Limia: `existe parcialmente`
- Decisao: `reconstruir com Limia e manter local`
- Justificativa: a secao continua local, mas depende de `Avatar` publico para remover a camada paralela de ui.
- Bloqueadores: `Avatar*` fora da API publica.
- Prioridade: `P1`
- Sequencia recomendada: `Migrar consumo depois`

### `WelcomeScreen`
- Componente: `WelcomeScreen`
- Local atual: `apps/portfolio/src/components/landing/WelcomeScreen.tsx`
- Tipo: `efeito/ornamento`
- Dependencias de UI: `primitives locais: nenhuma`; `primitives do Limia: InteractiveGrid`; `tokens/estilos hardcoded: alto`
- Superficie publica equivalente no Limia: `nao existe`
- Decisao: `manter local`
- Justificativa: e uma experiencia de entrada e marca, nao um primitive compartilhavel do design system.
- Bloqueadores: animacao, timing e copy especificos do portfolio.
- Prioridade: `P2`
- Sequencia recomendada: `Manter fora do design system`

### `Dashboard`
- Componente: `Dashboard`
- Local atual: `apps/portfolio/src/pages/Dashboard.tsx`
- Tipo: `composicao de produto`
- Dependencias de UI: `primitives locais: nenhuma`; `primitives do Limia: Card*, Input, Button`; `tokens/estilos hardcoded: medio-alto`
- Superficie publica equivalente no Limia: `existe parcialmente`
- Decisao: `reconstruir com Limia e manter local`
- Justificativa: a pagina e um shell administrativo do produto e deve continuar local, mas precisa abandonar cores e charts ad hoc.
- Bloqueadores: integracao com Supabase e uso direto de Recharts sem camada de design system.
- Prioridade: `P2`
- Sequencia recomendada: `Migrar consumo depois`

### `Newsletter`
- Componente: `Newsletter`
- Local atual: `apps/portfolio/src/pages/Newsletter.tsx`
- Tipo: `composicao de produto`
- Dependencias de UI: `primitives locais: Navbar`; `primitives do Limia: Button, Input`; `tokens/estilos hardcoded: alto`
- Superficie publica equivalente no Limia: `existe parcialmente`
- Decisao: `reconstruir com Limia e manter local`
- Justificativa: e o caso mais explicito de re-skin de primitives do Limia em vez de adocao real do sistema.
- Bloqueadores: `toast` vem de `sonner` direto e a pagina usa muitos hex, shadows e tamanhos arbitrarios.
- Prioridade: `P0`
- Sequencia recomendada: `Migrar consumo depois`

## Primitives Locais em `components/ui`

### `Accordion`
- Componente: `Accordion`
- Local atual: `apps/portfolio/src/components/ui/accordion.tsx`
- Tipo: `primitive`
- Dependencias de UI: `primitives locais: nenhuma`; `primitives do Limia: nenhuma`; `tokens/estilos hardcoded: baixo`
- Superficie publica equivalente no Limia: `existe parcialmente`
- Decisao: `promover para o Limia`
- Justificativa: primitive generico, ja existe dentro do pacote e nao deve continuar owned pelo app.
- Bloqueadores: expor pela API publica quando houver consumidor fora da pasta local.
- Prioridade: `P2`
- Sequencia recomendada: `Promover primeiro`

### `AlertDialog`
- Componente: `AlertDialog`
- Local atual: `apps/portfolio/src/components/ui/alert-dialog.tsx`
- Tipo: `primitive`
- Dependencias de UI: `primitives locais: nenhuma`; `primitives do Limia: nenhuma`; `tokens/estilos hardcoded: baixo`
- Superficie publica equivalente no Limia: `existe parcialmente`
- Decisao: `promover para o Limia`
- Justificativa: primitive generico de confirmacao, adequado para superficie compartilhada do design system.
- Bloqueadores: formalizar API publica e status de lifecycle.
- Prioridade: `P2`
- Sequencia recomendada: `Promover primeiro`

### `Alert`
- Componente: `Alert`
- Local atual: `apps/portfolio/src/components/ui/alert.tsx`
- Tipo: `primitive`
- Dependencias de UI: `primitives locais: nenhuma`; `primitives do Limia: nenhuma`; `tokens/estilos hardcoded: baixo`
- Superficie publica equivalente no Limia: `existe parcialmente`
- Decisao: `promover para o Limia`
- Justificativa: feedback generico deve ser owned pelo pacote, nao pelo app consumidor.
- Bloqueadores: definir se entra com status `beta` ou `draft`.
- Prioridade: `P2`
- Sequencia recomendada: `Promover primeiro`

### `AspectRatio`
- Componente: `AspectRatio`
- Local atual: `apps/portfolio/src/components/ui/aspect-ratio.tsx`
- Tipo: `primitive`
- Dependencias de UI: `primitives locais: nenhuma`; `primitives do Limia: nenhuma`; `tokens/estilos hardcoded: baixo`
- Superficie publica equivalente no Limia: `existe parcialmente`
- Decisao: `promover para o Limia`
- Justificativa: utilitario estrutural generico, reutilizavel em qualquer app.
- Bloqueadores: nenhuma dependencia de produto; falta apenas surface publica.
- Prioridade: `P2`
- Sequencia recomendada: `Promover primeiro`

### `Avatar`
- Componente: `Avatar`
- Local atual: `apps/portfolio/src/components/ui/avatar.tsx`
- Tipo: `primitive`
- Dependencias de UI: `primitives locais: nenhuma`; `primitives do Limia: nenhuma`; `tokens/estilos hardcoded: baixo`
- Superficie publica equivalente no Limia: `existe parcialmente`
- Decisao: `promover para o Limia`
- Justificativa: ja bloqueia `ChatWidget` e `Testimonials`, alem de ser um primitive padrao para qualquer app.
- Bloqueadores: precisa entrar na API publica antes da migracao dos consumidores.
- Prioridade: `P0`
- Sequencia recomendada: `Promover primeiro`

### `Badge`
- Componente: `Badge`
- Local atual: `apps/portfolio/src/components/ui/badge.tsx`
- Tipo: `primitive`
- Dependencias de UI: `primitives locais: nenhuma`; `primitives do Limia: nenhuma`; `tokens/estilos hardcoded: baixo`
- Superficie publica equivalente no Limia: `ja existe`
- Decisao: `promover para o Limia`
- Justificativa: o pacote ja e a source of truth publica; a copia local deve ser aposentada.
- Bloqueadores: migrar qualquer import residual do app para `@limia/design-system`.
- Prioridade: `P2`
- Sequencia recomendada: `Migrar consumo depois`

### `Breadcrumb`
- Componente: `Breadcrumb`
- Local atual: `apps/portfolio/src/components/ui/breadcrumb.tsx`
- Tipo: `primitive`
- Dependencias de UI: `primitives locais: nenhuma`; `primitives do Limia: nenhuma`; `tokens/estilos hardcoded: baixo`
- Superficie publica equivalente no Limia: `existe parcialmente`
- Decisao: `promover para o Limia`
- Justificativa: e um primitive de navegacao compartilhavel e nao deveria residir no app.
- Bloqueadores: adicionar a surface publica quando houver demanda real.
- Prioridade: `P2`
- Sequencia recomendada: `Promover primeiro`

### `Calendar`
- Componente: `Calendar`
- Local atual: `apps/portfolio/src/components/ui/calendar.tsx`
- Tipo: `primitive`
- Dependencias de UI: `primitives locais: nenhuma`; `primitives do Limia: nenhuma`; `tokens/estilos hardcoded: baixo`
- Superficie publica equivalente no Limia: `existe parcialmente`
- Decisao: `promover para o Limia`
- Justificativa: date picking e uma capacidade generica, com ownership mais adequado no pacote.
- Bloqueadores: revisar dependencia e acessibilidade antes de publicacao.
- Prioridade: `P2`
- Sequencia recomendada: `Promover primeiro`

### `Carousel`
- Componente: `Carousel`
- Local atual: `apps/portfolio/src/components/ui/carousel.tsx`
- Tipo: `primitive`
- Dependencias de UI: `primitives locais: nenhuma`; `primitives do Limia: nenhuma`; `tokens/estilos hardcoded: baixo`
- Superficie publica equivalente no Limia: `existe parcialmente`
- Decisao: `promover para o Limia`
- Justificativa: carrossel e um primitive composto e reutilizavel quando padronizado no pacote.
- Bloqueadores: validar necessidade real e API antes de expandir a superficie publica.
- Prioridade: `P2`
- Sequencia recomendada: `Promover primeiro`

### `Chart`
- Componente: `Chart`
- Local atual: `apps/portfolio/src/components/ui/chart.tsx`
- Tipo: `primitive`
- Dependencias de UI: `primitives locais: nenhuma`; `primitives do Limia: nenhuma`; `tokens/estilos hardcoded: medio`
- Superficie publica equivalente no Limia: `existe parcialmente`
- Decisao: `promover para o Limia`
- Justificativa: ja encapsula convencoes visuais sobre charting e deve viver no pacote se for mantido.
- Bloqueadores: dependencia de `recharts` e necessidade de definir escopo do primitive.
- Prioridade: `P2`
- Sequencia recomendada: `Promover primeiro`

### `Checkbox`
- Componente: `Checkbox`
- Local atual: `apps/portfolio/src/components/ui/checkbox.tsx`
- Tipo: `primitive`
- Dependencias de UI: `primitives locais: nenhuma`; `primitives do Limia: nenhuma`; `tokens/estilos hardcoded: baixo`
- Superficie publica equivalente no Limia: `existe parcialmente`
- Decisao: `promover para o Limia`
- Justificativa: controle de formulario basico e reutilizavel, adequado para a API do pacote.
- Bloqueadores: definir lifecycle e documentacao.
- Prioridade: `P2`
- Sequencia recomendada: `Promover primeiro`

### `Collapsible`
- Componente: `Collapsible`
- Local atual: `apps/portfolio/src/components/ui/collapsible.tsx`
- Tipo: `primitive`
- Dependencias de UI: `primitives locais: nenhuma`; `primitives do Limia: nenhuma`; `tokens/estilos hardcoded: baixo`
- Superficie publica equivalente no Limia: `existe parcialmente`
- Decisao: `promover para o Limia`
- Justificativa: pattern estrutural generico que nao deve continuar duplicado entre app e pacote.
- Bloqueadores: nenhuma dependencia de dominio.
- Prioridade: `P2`
- Sequencia recomendada: `Promover primeiro`

### `Command`
- Componente: `Command`
- Local atual: `apps/portfolio/src/components/ui/command.tsx`
- Tipo: `primitive`
- Dependencias de UI: `primitives locais: nenhuma`; `primitives do Limia: nenhuma`; `tokens/estilos hardcoded: baixo`
- Superficie publica equivalente no Limia: `existe parcialmente`
- Decisao: `promover para o Limia`
- Justificativa: command palette e um primitive generico e deve pertencer ao pacote quando adotado.
- Bloqueadores: falta de consumer externo hoje torna a promocao menos urgente.
- Prioridade: `P2`
- Sequencia recomendada: `Promover primeiro`

### `ContextMenu`
- Componente: `ContextMenu`
- Local atual: `apps/portfolio/src/components/ui/context-menu.tsx`
- Tipo: `primitive`
- Dependencias de UI: `primitives locais: nenhuma`; `primitives do Limia: nenhuma`; `tokens/estilos hardcoded: baixo`
- Superficie publica equivalente no Limia: `existe parcialmente`
- Decisao: `promover para o Limia`
- Justificativa: primitive generico de menu contextual, adequado ao pacote.
- Bloqueadores: escopo de uso ainda baixo no workspace.
- Prioridade: `P2`
- Sequencia recomendada: `Promover primeiro`

### `CursorTrail`
- Componente: `CursorTrail`
- Local atual: `apps/portfolio/src/components/ui/CursorTrail.tsx`
- Tipo: `efeito/ornamento`
- Dependencias de UI: `primitives locais: nenhuma`; `primitives do Limia: nenhuma`; `tokens/estilos hardcoded: alto`
- Superficie publica equivalente no Limia: `nao existe`
- Decisao: `manter local`
- Justificativa: apesar de existir um arquivo equivalente no pacote, o efeito e decorativo e nao deveria compor a API publica do design system.
- Bloqueadores: depende de motion e cor fixa de marca.
- Prioridade: `P2`
- Sequencia recomendada: `Manter fora do design system`

### `Dialog`
- Componente: `Dialog`
- Local atual: `apps/portfolio/src/components/ui/dialog.tsx`
- Tipo: `primitive`
- Dependencias de UI: `primitives locais: nenhuma`; `primitives do Limia: nenhuma`; `tokens/estilos hardcoded: baixo`
- Superficie publica equivalente no Limia: `ja existe`
- Decisao: `promover para o Limia`
- Justificativa: o pacote ja expoe `Dialog`; a copia local so mantem desvio de consumo.
- Bloqueadores: migrar `ContactFormModal` e outros consumidores para a API publica.
- Prioridade: `P1`
- Sequencia recomendada: `Migrar consumo depois`

### `Drawer`
- Componente: `Drawer`
- Local atual: `apps/portfolio/src/components/ui/drawer.tsx`
- Tipo: `primitive`
- Dependencias de UI: `primitives locais: nenhuma`; `primitives do Limia: nenhuma`; `tokens/estilos hardcoded: baixo`
- Superficie publica equivalente no Limia: `existe parcialmente`
- Decisao: `promover para o Limia`
- Justificativa: comportamento generico que pode ser compartilhado se o pacote assumir ownership.
- Bloqueadores: dependencia de `vaul` e ausencia de consumer externo imediato.
- Prioridade: `P2`
- Sequencia recomendada: `Promover primeiro`

### `DropdownMenu`
- Componente: `DropdownMenu`
- Local atual: `apps/portfolio/src/components/ui/dropdown-menu.tsx`
- Tipo: `primitive`
- Dependencias de UI: `primitives locais: nenhuma`; `primitives do Limia: nenhuma`; `tokens/estilos hardcoded: baixo`
- Superficie publica equivalente no Limia: `existe parcialmente`
- Decisao: `promover para o Limia`
- Justificativa: ja bloqueia `LanguageToggle` no portfolio e e um primitive basico para qualquer app consumidor.
- Bloqueadores: precisa entrar na API publica com subcomponentes completos.
- Prioridade: `P0`
- Sequencia recomendada: `Promover primeiro`

### `Form`
- Componente: `Form`
- Local atual: `apps/portfolio/src/components/ui/form.tsx`
- Tipo: `primitive`
- Dependencias de UI: `primitives locais: nenhuma`; `primitives do Limia: nenhuma`; `tokens/estilos hardcoded: baixo`
- Superficie publica equivalente no Limia: `ja existe`
- Decisao: `promover para o Limia`
- Justificativa: o pacote ja define a surface publica; a copia local deve desaparecer da app layer.
- Bloqueadores: migrar eventuais imports residuais.
- Prioridade: `P1`
- Sequencia recomendada: `Migrar consumo depois`

### `HoverCard`
- Componente: `HoverCard`
- Local atual: `apps/portfolio/src/components/ui/hover-card.tsx`
- Tipo: `primitive`
- Dependencias de UI: `primitives locais: nenhuma`; `primitives do Limia: nenhuma`; `tokens/estilos hardcoded: baixo`
- Superficie publica equivalente no Limia: `existe parcialmente`
- Decisao: `promover para o Limia`
- Justificativa: primitive generico de reveal contextual, adequado ao pacote.
- Bloqueadores: sem consumer externo imediato.
- Prioridade: `P2`
- Sequencia recomendada: `Promover primeiro`

### `InputOtp`
- Componente: `InputOtp`
- Local atual: `apps/portfolio/src/components/ui/input-otp.tsx`
- Tipo: `primitive`
- Dependencias de UI: `primitives locais: nenhuma`; `primitives do Limia: nenhuma`; `tokens/estilos hardcoded: baixo`
- Superficie publica equivalente no Limia: `existe parcialmente`
- Decisao: `promover para o Limia`
- Justificativa: campo OTP e uma capacidade generica e deve ser padronizada no pacote.
- Bloqueadores: confirmar necessidade real de surface publica agora.
- Prioridade: `P2`
- Sequencia recomendada: `Promover primeiro`

### `Label`
- Componente: `Label`
- Local atual: `apps/portfolio/src/components/ui/label.tsx`
- Tipo: `primitive`
- Dependencias de UI: `primitives locais: nenhuma`; `primitives do Limia: nenhuma`; `tokens/estilos hardcoded: baixo`
- Superficie publica equivalente no Limia: `ja existe`
- Decisao: `promover para o Limia`
- Justificativa: o pacote ja publica `Label`; a existencia local so perpetua duplicidade.
- Bloqueadores: migracao de imports residuais.
- Prioridade: `P1`
- Sequencia recomendada: `Migrar consumo depois`

### `Menubar`
- Componente: `Menubar`
- Local atual: `apps/portfolio/src/components/ui/menubar.tsx`
- Tipo: `primitive`
- Dependencias de UI: `primitives locais: nenhuma`; `primitives do Limia: nenhuma`; `tokens/estilos hardcoded: baixo`
- Superficie publica equivalente no Limia: `existe parcialmente`
- Decisao: `promover para o Limia`
- Justificativa: primitive estrutural generico, melhor mantido no pacote.
- Bloqueadores: baixa urgencia e nenhuma demanda cross-app imediata.
- Prioridade: `P2`
- Sequencia recomendada: `Promover primeiro`

### `NavigationMenu`
- Componente: `NavigationMenu`
- Local atual: `apps/portfolio/src/components/ui/navigation-menu.tsx`
- Tipo: `primitive`
- Dependencias de UI: `primitives locais: nenhuma`; `primitives do Limia: nenhuma`; `tokens/estilos hardcoded: baixo`
- Superficie publica equivalente no Limia: `existe parcialmente`
- Decisao: `promover para o Limia`
- Justificativa: navegacao composta e pattern de sistema, nao de app consumidor.
- Bloqueadores: formalizar API publica antes do primeiro reuse amplo.
- Prioridade: `P2`
- Sequencia recomendada: `Promover primeiro`

### `Pagination`
- Componente: `Pagination`
- Local atual: `apps/portfolio/src/components/ui/pagination.tsx`
- Tipo: `primitive`
- Dependencias de UI: `primitives locais: nenhuma`; `primitives do Limia: nenhuma`; `tokens/estilos hardcoded: baixo`
- Superficie publica equivalente no Limia: `existe parcialmente`
- Decisao: `promover para o Limia`
- Justificativa: pattern generico de navegacao paginada, apropriado ao pacote.
- Bloqueadores: uso real ainda baixo no workspace.
- Prioridade: `P2`
- Sequencia recomendada: `Promover primeiro`

### `Popover`
- Componente: `Popover`
- Local atual: `apps/portfolio/src/components/ui/popover.tsx`
- Tipo: `primitive`
- Dependencias de UI: `primitives locais: nenhuma`; `primitives do Limia: nenhuma`; `tokens/estilos hardcoded: baixo`
- Superficie publica equivalente no Limia: `existe parcialmente`
- Decisao: `promover para o Limia`
- Justificativa: primitive generico de overlay, util em qualquer consumidor do pacote.
- Bloqueadores: nenhuma urgencia alem de governanca.
- Prioridade: `P2`
- Sequencia recomendada: `Promover primeiro`

### `Progress`
- Componente: `Progress`
- Local atual: `apps/portfolio/src/components/ui/progress.tsx`
- Tipo: `primitive`
- Dependencias de UI: `primitives locais: nenhuma`; `primitives do Limia: nenhuma`; `tokens/estilos hardcoded: baixo`
- Superficie publica equivalente no Limia: `existe parcialmente`
- Decisao: `promover para o Limia`
- Justificativa: feedback de progresso e pattern reutilizavel e deve morar no pacote.
- Bloqueadores: validar se entra como `beta`.
- Prioridade: `P2`
- Sequencia recomendada: `Promover primeiro`

### `RadioGroup`
- Componente: `RadioGroup`
- Local atual: `apps/portfolio/src/components/ui/radio-group.tsx`
- Tipo: `primitive`
- Dependencias de UI: `primitives locais: nenhuma`; `primitives do Limia: nenhuma`; `tokens/estilos hardcoded: baixo`
- Superficie publica equivalente no Limia: `existe parcialmente`
- Decisao: `promover para o Limia`
- Justificativa: controle basico de formulario e parte natural da superficie do sistema.
- Bloqueadores: documentacao e lifecycle.
- Prioridade: `P2`
- Sequencia recomendada: `Promover primeiro`

### `Resizable`
- Componente: `Resizable`
- Local atual: `apps/portfolio/src/components/ui/resizable.tsx`
- Tipo: `primitive`
- Dependencias de UI: `primitives locais: nenhuma`; `primitives do Limia: nenhuma`; `tokens/estilos hardcoded: baixo`
- Superficie publica equivalente no Limia: `existe parcialmente`
- Decisao: `promover para o Limia`
- Justificativa: layout resizable e um pattern de infraestrutura compartilhavel se o pacote assumir ownership.
- Bloqueadores: depende de um caso de uso claro para justificar surface publica.
- Prioridade: `P2`
- Sequencia recomendada: `Promover primeiro`

### `ScrollArea`
- Componente: `ScrollArea`
- Local atual: `apps/portfolio/src/components/ui/scroll-area.tsx`
- Tipo: `primitive`
- Dependencias de UI: `primitives locais: nenhuma`; `primitives do Limia: nenhuma`; `tokens/estilos hardcoded: baixo`
- Superficie publica equivalente no Limia: `existe parcialmente`
- Decisao: `promover para o Limia`
- Justificativa: primitive estrutural generico que deve sair da camada do app.
- Bloqueadores: nenhuma dependencia de dominio.
- Prioridade: `P2`
- Sequencia recomendada: `Promover primeiro`

### `Select`
- Componente: `Select`
- Local atual: `apps/portfolio/src/components/ui/select.tsx`
- Tipo: `primitive`
- Dependencias de UI: `primitives locais: nenhuma`; `primitives do Limia: nenhuma`; `tokens/estilos hardcoded: baixo`
- Superficie publica equivalente no Limia: `existe parcialmente`
- Decisao: `promover para o Limia`
- Justificativa: controle central de formulario, com alto potencial de reuso multi-app.
- Bloqueadores: formalizar surface publica completa com subcomponentes.
- Prioridade: `P2`
- Sequencia recomendada: `Promover primeiro`

### `Separator`
- Componente: `Separator`
- Local atual: `apps/portfolio/src/components/ui/separator.tsx`
- Tipo: `primitive`
- Dependencias de UI: `primitives locais: nenhuma`; `primitives do Limia: nenhuma`; `tokens/estilos hardcoded: baixo`
- Superficie publica equivalente no Limia: `existe parcialmente`
- Decisao: `promover para o Limia`
- Justificativa: primitive basico de layout que nao deve continuar duplicado.
- Bloqueadores: nenhuma dependencia de dominio.
- Prioridade: `P2`
- Sequencia recomendada: `Promover primeiro`

### `Sheet`
- Componente: `Sheet`
- Local atual: `apps/portfolio/src/components/ui/sheet.tsx`
- Tipo: `primitive`
- Dependencias de UI: `primitives locais: nenhuma`; `primitives do Limia: nenhuma`; `tokens/estilos hardcoded: baixo`
- Superficie publica equivalente no Limia: `existe parcialmente`
- Decisao: `promover para o Limia`
- Justificativa: overlay lateral e um primitive compartilhavel, melhor mantido no pacote.
- Bloqueadores: precisa de documentacao e consumer de referencia.
- Prioridade: `P2`
- Sequencia recomendada: `Promover primeiro`

### `Sidebar`
- Componente: `Sidebar`
- Local atual: `apps/portfolio/src/components/ui/sidebar.tsx`
- Tipo: `primitive`
- Dependencias de UI: `primitives locais: nenhuma`; `primitives do Limia: nenhuma`; `tokens/estilos hardcoded: medio`
- Superficie publica equivalente no Limia: `existe parcialmente`
- Decisao: `promover para o Limia`
- Justificativa: e um primitive composto de layout; se mantido, o ownership deve ser do pacote.
- Bloqueadores: API extensa e necessidade de definir escopo real de reuso.
- Prioridade: `P2`
- Sequencia recomendada: `Promover primeiro`

### `Skeleton`
- Componente: `Skeleton`
- Local atual: `apps/portfolio/src/components/ui/skeleton.tsx`
- Tipo: `primitive`
- Dependencias de UI: `primitives locais: nenhuma`; `primitives do Limia: nenhuma`; `tokens/estilos hardcoded: baixo`
- Superficie publica equivalente no Limia: `existe parcialmente`
- Decisao: `promover para o Limia`
- Justificativa: placeholder de carregamento e um primitive generico natural do design system.
- Bloqueadores: documentacao minima.
- Prioridade: `P2`
- Sequencia recomendada: `Promover primeiro`

### `Slider`
- Componente: `Slider`
- Local atual: `apps/portfolio/src/components/ui/slider.tsx`
- Tipo: `primitive`
- Dependencias de UI: `primitives locais: nenhuma`; `primitives do Limia: nenhuma`; `tokens/estilos hardcoded: baixo`
- Superficie publica equivalente no Limia: `existe parcialmente`
- Decisao: `promover para o Limia`
- Justificativa: controle generico de input e parte esperada de uma biblioteca de primitives.
- Bloqueadores: definir lifecycle e docs.
- Prioridade: `P2`
- Sequencia recomendada: `Promover primeiro`

### `Sonner`
- Componente: `Sonner`
- Local atual: `apps/portfolio/src/components/ui/sonner.tsx`
- Tipo: `primitive`
- Dependencias de UI: `primitives locais: nenhuma`; `primitives do Limia: nenhuma`; `tokens/estilos hardcoded: medio`
- Superficie publica equivalente no Limia: `existe parcialmente`
- Decisao: `promover para o Limia`
- Justificativa: ja bloqueia `App`, `Newsletter` e `NewsletterModal`; notificacao e feedback global devem ser responsabilidade do pacote.
- Bloqueadores: remover dependencia interna de `next-themes` e expor `Toaster` / `toast` como API publica intencional.
- Prioridade: `P0`
- Sequencia recomendada: `Promover primeiro`

### `Switch`
- Componente: `Switch`
- Local atual: `apps/portfolio/src/components/ui/switch.tsx`
- Tipo: `primitive`
- Dependencias de UI: `primitives locais: nenhuma`; `primitives do Limia: nenhuma`; `tokens/estilos hardcoded: baixo`
- Superficie publica equivalente no Limia: `existe parcialmente`
- Decisao: `promover para o Limia`
- Justificativa: controle de formulario generico e ja citado no `COMPONENT_STATUS.md` do pacote.
- Bloqueadores: alinhar status e export.
- Prioridade: `P2`
- Sequencia recomendada: `Promover primeiro`

### `Table`
- Componente: `Table`
- Local atual: `apps/portfolio/src/components/ui/table.tsx`
- Tipo: `primitive`
- Dependencias de UI: `primitives locais: nenhuma`; `primitives do Limia: nenhuma`; `tokens/estilos hardcoded: baixo`
- Superficie publica equivalente no Limia: `existe parcialmente`
- Decisao: `promover para o Limia`
- Justificativa: tabela e um primitive estrutural generico e nao deve ser copiado por app.
- Bloqueadores: surface publica so faz sentido com casos reais de adocao.
- Prioridade: `P2`
- Sequencia recomendada: `Promover primeiro`

### `Tabs`
- Componente: `Tabs`
- Local atual: `apps/portfolio/src/components/ui/tabs.tsx`
- Tipo: `primitive`
- Dependencias de UI: `primitives locais: nenhuma`; `primitives do Limia: nenhuma`; `tokens/estilos hardcoded: baixo`
- Superficie publica equivalente no Limia: `existe parcialmente`
- Decisao: `promover para o Limia`
- Justificativa: padrao de navegacao e troca de conteudo, reutilizavel em qualquer consumidor.
- Bloqueadores: nenhuma urgencia no portfolio atual.
- Prioridade: `P2`
- Sequencia recomendada: `Promover primeiro`

### `Textarea`
- Componente: `Textarea`
- Local atual: `apps/portfolio/src/components/ui/textarea.tsx`
- Tipo: `primitive`
- Dependencias de UI: `primitives locais: nenhuma`; `primitives do Limia: nenhuma`; `tokens/estilos hardcoded: baixo`
- Superficie publica equivalente no Limia: `ja existe`
- Decisao: `promover para o Limia`
- Justificativa: o pacote ja publica `Textarea`; a copia local deve ser eliminada na migracao.
- Bloqueadores: migrar imports residuais.
- Prioridade: `P1`
- Sequencia recomendada: `Migrar consumo depois`

### `ToggleGroup`
- Componente: `ToggleGroup`
- Local atual: `apps/portfolio/src/components/ui/toggle-group.tsx`
- Tipo: `primitive`
- Dependencias de UI: `primitives locais: nenhuma`; `primitives do Limia: nenhuma`; `tokens/estilos hardcoded: baixo`
- Superficie publica equivalente no Limia: `existe parcialmente`
- Decisao: `promover para o Limia`
- Justificativa: pattern de selecao reutilizavel e adequado ao pacote.
- Bloqueadores: falta consumer externo hoje.
- Prioridade: `P2`
- Sequencia recomendada: `Promover primeiro`

### `Toggle`
- Componente: `Toggle`
- Local atual: `apps/portfolio/src/components/ui/toggle.tsx`
- Tipo: `primitive`
- Dependencias de UI: `primitives locais: nenhuma`; `primitives do Limia: nenhuma`; `tokens/estilos hardcoded: baixo`
- Superficie publica equivalente no Limia: `existe parcialmente`
- Decisao: `promover para o Limia`
- Justificativa: primitive basico de estado on/off, apropriado ao pacote.
- Bloqueadores: lifecycle e docs.
- Prioridade: `P2`
- Sequencia recomendada: `Promover primeiro`

### `Tooltip`
- Componente: `Tooltip`
- Local atual: `apps/portfolio/src/components/ui/tooltip.tsx`
- Tipo: `primitive`
- Dependencias de UI: `primitives locais: nenhuma`; `primitives do Limia: nenhuma`; `tokens/estilos hardcoded: baixo`
- Superficie publica equivalente no Limia: `existe parcialmente`
- Decisao: `promover para o Limia`
- Justificativa: overlay contextual basico e reutilizavel em qualquer app.
- Bloqueadores: nenhuma urgencia alem da consolidacao de surface publica.
- Prioridade: `P2`
- Sequencia recomendada: `Promover primeiro`

## Fila de Execucao Recomendada

### Promover primeiro

- `P0`: `Avatar`, `DropdownMenu`, `Sonner` com `Toaster` / `toast`
- `P1`: consolidar de vez a API publica ja existente e aposentar copias locais de `Dialog`, `Form`, `Badge`, `Label` e `Textarea`
- `P2`: avaliar promocao ordenada do restante dos primitives genericos hoje duplicados em `components/ui`, mantendo `CursorTrail` explicitamente fora da superficie publica

### Migrar consumo depois

- Comecar por bloqueios de shell e feedback: `LanguageToggle`, `ModeToggle`, `ContactFormModal`, `ChatWidget`, `Testimonials`, `NewsletterModal`, `RequireAdmin`, `Newsletter`
- Na sequencia, alinhar secoes principais da landing ao Limia: `Hero`, `CTA`, `Navbar`, `Projects`
- Por ultimo, tratar as telas e secoes de menor urgencia: `ProjectDetail`, `ProjectsPage`, `Services`, `Stack`, `Storytelling`, `Dashboard`

### Manter fora do design system

- `AudioPlayer`
- `BrandMarquee`
- `CursorTrail`
- `ImageWithFallback`
- `MouseSpotlight`
- `WelcomeScreen`

## Observacoes Finais

- Este inventario deixa explicito que a proxima fase nao deve comecar por redesign de pagina, e sim pela consolidacao da superficie publica do `@limia/design-system`.
- O `portfolio` ja esta suficientemente acoplado ao Limia para uma migracao incremental; a maior lacuna esta na governanca da API publica e na remocao dos hardcodes mais agressivos.

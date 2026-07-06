# Claude do Zero ao Expert — Design

**Data:** 2026-07-06
**Status:** Aprovado

## 1. Visão geral e objetivo

Site institucional estático, em português do Brasil, cujo único objetivo é pegar um
iniciante completo em IA e, através de 4 trilhas de curso, transformá-lo em um usuário
avançado das soluções Claude:

- **Chat** — claude.ai (conversas, Projects, Artifacts)
- **Cowork** — agentes/colaboração/automações
- **Code** — Claude Code (CLI)
- **Design** — Artifacts e criação visual

O site funciona como um "tutor" para o aluno: interface agradável, intuitiva, e
estruturada para prender atenção e gerar desejo de estudar.

## 2. Arquitetura de informação

- **Navbar fixo** (topo, todas as páginas): Logo "Claude do Zero ao Expert" | Início |
  Curso Chat | Curso Cowork | Curso Code | Curso Design | Recursos | Sobre. Menu
  hambúrguer no mobile.
- **`index.html` (Home):** hero futurista com CTA "Comece sua jornada", 4 cards (um por
  curso), seção "Por que aprender Claude agora", seção de referências oficiais
  (Anthropic, GitHub), rodapé com links.
- **Uma página por curso** (`chat.html`, `cowork.html`, `code.html`, `design.html`):
  sidebar lateral fixa com sub-menu de todos os módulos, agrupados em 4 blocos
  (Fundamentos → Intermediário → Avançado → Casos de Uso). A área principal mostra o
  módulo selecionado.
- **`recursos.html`:** links diretos e organizados (docs oficiais da Anthropic, GitHub,
  changelog, comunidade).
- **`sobre.html`:** o que é o site e como usá-lo.

## 3. Identidade visual

White mode moderno/futurista:
- Fundo branco/quase-branco, paleta inspirada na marca Anthropic (terracota `#CC785C`
  como cor de destaque, texto grafite escuro, tons neutros de cinza-claro para cards).
- Tipografia sans-serif moderna (Inter ou Space Grotesk via Google Fonts).
- Cards com cantos arredondados e sombra suave, gradientes sutis no hero, ícones SVG.
- Micro-animações leves (fade-in ao rolar, hover em cards/botões).
- Totalmente responsivo (mobile-first).

## 4. Template de módulo

Cada módulo segue a mesma estrutura:
- Número/título do módulo
- Nível (iniciante / intermediário / avançado)
- Objetivo de aprendizagem
- Conteúdo passo-a-passo
- Casos de uso reais
- Recomendações práticas
- 1-3 vídeos recomendados: thumbnail oficial do YouTube + título + canal + link + data/
  views aproximados no momento da pesquisa
- Links de referência (documentação oficial, GitHub, etc.)
- Navegação para módulo anterior/próximo

## 5. Trilhas de curso

Cada um dos 4 cursos terá **24 módulos** (dentro da faixa 20-30 pedida), divididos em 4
blocos de 6 módulos: Fundamentos, Intermediário, Avançado, Casos de Uso e Boas Práticas.
Conteúdo específico e tecnicamente correto por produto (não genérico entre cursos).

## 6. Pesquisa de vídeos

Busca real via web (YouTube e outras plataformas gratuitas), incluindo os canais
indicados pelo usuário (Maestros da IA, Victor Baggio AI, GitHub), ordenados do mais
recente ao mais antigo considerando relevância/views no momento da pesquisa. Vídeos
linkados externamente (o usuário sai do site para assistir no YouTube) + thumbnail
oficial via URL pública do YouTube (`img.youtube.com/vi/<id>/hqdefault.jpg`). Sem embed,
sem download/redistribuição de vídeo.

Contagens de views/datas são aproximadas e registradas no momento da pesquisa; podem
mudar depois.

## 7. Stack e publicação

- HTML/CSS/JS estático puro, sem build step, sem dependências.
- Projeto local em `C:\Users\Mille\claude-do-zero-ao-expert`, com git inicializado.
- Publicação via GitHub Pages. Pré-requisito: usuário autenticado via
  `gh auth login` (CLI já instalada). Repositório e push serão feitos após essa etapa.

## 8. Fases de entrega

- **Fase 1 (esta entrega):** site completo — toda a navegação, os 4 menus/submenus, os
  96 módulos listados (título + ementa) em cada curso, e conteúdo didático completo
  (texto + vídeos pesquisados + links) para os módulos-piloto (primeiros módulos de cada
  curso).
- **Fase 2 (iterações seguintes):** completar os módulos restantes, curso por curso, sob
  orientação de prioridade do usuário.

## Decisões confirmadas com o usuário

- Local do projeto: novo repositório GitHub, construído localmente primeiro.
- GitHub CLI: instalada nesta sessão; login pendente de ação do usuário
  (`gh auth login`, interativo).
- Stack: HTML/CSS/JS estático puro (não Astro/Eleventy).
- Escopo de conteúdo: Fase 1 com estrutura completa + módulos-piloto; expansão iterativa
  depois.
- Tratamento de vídeo: link externo + thumbnail oficial, sem embed.
- Definição dos 4 produtos: Chat=claude.ai, Cowork=agentes/colaboração, Code=Claude
  Code, Design=Artifacts/criação visual.

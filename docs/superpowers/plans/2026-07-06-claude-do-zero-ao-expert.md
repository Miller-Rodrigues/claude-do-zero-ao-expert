# Claude do Zero ao Expert Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the static PT-BR site "Claude do Zero ao Expert" — home page + 4 course
pages (Chat, Cowork, Code, Design), each with 24 modules (3 fully-written pilot modules
+ 21 ementa-only stubs), plus Recursos and Sobre pages, ready to push to GitHub Pages.

**Architecture:** Pure static HTML/CSS/JS, no build step. Each course is a single HTML
shell page; a shared JS "course viewer" reads a per-course JS data array (module
objects) and renders the selected module into the page based on the URL hash
(`chat.html#modulo-3`). This keeps navbar/sidebar markup out of ~100 module bodies
while staying 100% static (works directly from `file://` and GitHub Pages, no server
logic).

**Tech Stack:** HTML5, CSS3 (custom properties, no preprocessor), vanilla JS (ES
modules), Google Fonts (Inter, Space Grotesk). No npm, no bundler, no framework.

## Global Constraints

- All copy is PT-BR (Brazilian Portuguese) — every page, module, label, alt text.
- No build step: files must run by opening `index.html` directly and via GitHub Pages
  as-is.
- White-mode, moderno/futurista: background `#FFFFFF`/`#F7F5F2`, accent `#CC785C`,
  text `#1F1B18`, fonts Inter (body) + Space Grotesk (headings), rounded cards,
  soft shadows, mobile-first responsive.
- Videos: external link to the original YouTube video + official thumbnail via
  `https://img.youtube.com/vi/<ID>/hqdefault.jpg`. Never embed, never download.
- Each course has exactly 24 modules split into 4 blocks of 6: Fundamentos,
  Intermediário, Avançado, Casos de Uso e Boas Práticas.
- Fase 1 scope: modules 1-3 (first 3 of Bloco Fundamentos) get full content per
  course; modules 4-24 are ementa-only stubs with `status: "em-breve"`.
- Product definitions (must match, do not invent features): Chat = claude.ai
  (conversas, Projects, Artifacts); Cowork = agentes/colaboração/automações; Code =
  Claude Code (CLI); Design = Artifacts e criação visual.

---

### Task 1: Project scaffolding and design tokens

**Files:**
- Create: `index.html` (placeholder shell, filled in Task 4)
- Create: `assets/css/styles.css`
- Create: `assets/css/reset.css`
- Create: `.gitignore`
- Create: `README.md`

**Interfaces:**
- Produces: CSS custom properties (`--color-bg`, `--color-bg-alt`, `--color-accent`,
  `--color-accent-dark`, `--color-text`, `--color-text-muted`, `--color-border`,
  `--font-sans`, `--font-display`, `--radius-md`, `--radius-lg`, `--shadow-sm`,
  `--shadow-md`, `--space-1` … `--space-8`, `--container-max`) consumed by every later
  task's CSS.

- [ ] **Step 1: Create `.gitignore`**

```
.DS_Store
Thumbs.db
*.log
```

- [ ] **Step 2: Create `assets/css/reset.css`**

```css
*, *::before, *::after { box-sizing: border-box; }
html, body, h1, h2, h3, h4, p, ul, ol, figure { margin: 0; padding: 0; }
ul, ol { list-style: none; }
img, svg { display: block; max-width: 100%; }
a { color: inherit; text-decoration: none; }
button { font: inherit; cursor: pointer; border: none; background: none; }
html { scroll-behavior: smooth; }
body { min-height: 100vh; }
```

- [ ] **Step 3: Create `assets/css/styles.css` with design tokens and base layout**

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');

:root {
  --color-bg: #FFFFFF;
  --color-bg-alt: #F7F5F2;
  --color-accent: #CC785C;
  --color-accent-dark: #B35F45;
  --color-text: #1F1B18;
  --color-text-muted: #5B5550;
  --color-border: #E8E3DD;
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
  --font-display: 'Space Grotesk', var(--font-sans);
  --radius-md: 12px;
  --radius-lg: 20px;
  --shadow-sm: 0 2px 8px rgba(31, 27, 24, 0.06);
  --shadow-md: 0 8px 24px rgba(31, 27, 24, 0.10);
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 48px;
  --space-8: 64px;
  --container-max: 1160px;
}

body {
  font-family: var(--font-sans);
  color: var(--color-text);
  background: var(--color-bg);
  line-height: 1.6;
}

h1, h2, h3, h4 { font-family: var(--font-display); font-weight: 600; line-height: 1.25; }
h1 { font-size: clamp(2rem, 4vw, 3rem); }
h2 { font-size: clamp(1.5rem, 3vw, 2.25rem); }
h3 { font-size: 1.375rem; }

.container {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--space-5);
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-5);
  border-radius: var(--radius-md);
  font-weight: 600;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.btn-primary {
  background: var(--color-accent);
  color: #FFFFFF;
  box-shadow: var(--shadow-sm);
}
.btn-primary:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
.btn-secondary {
  background: var(--color-bg-alt);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.card {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: var(--space-5);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.card:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); }

.fade-in { opacity: 0; transform: translateY(16px); transition: opacity 0.5s ease, transform 0.5s ease; }
.fade-in.is-visible { opacity: 1; transform: translateY(0); }

@media (max-width: 720px) {
  .container { padding: 0 var(--space-4); }
}
```

- [ ] **Step 4: Create placeholder `index.html` (verified/replaced in Task 4)**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Claude do Zero ao Expert</title>
  <link rel="stylesheet" href="assets/css/reset.css">
  <link rel="stylesheet" href="assets/css/styles.css">
</head>
<body>
  <p>Em construção — ver Task 4.</p>
</body>
</html>
```

- [ ] **Step 5: Create `README.md`**

```markdown
# Claude do Zero ao Expert

Site institucional estático (PT-BR) com 4 trilhas de curso — Chat, Cowork, Code e
Design — para levar um iniciante a se tornar avançado nas soluções Claude.

## Rodando localmente

Abra `index.html` diretamente no navegador, ou sirva a pasta com qualquer servidor
estático (ex: `npx serve .`).

## Publicação (GitHub Pages)

1. `gh auth login` (uma vez, interativo).
2. `gh repo create claude-do-zero-ao-expert --public --source=. --remote=origin --push`
3. No GitHub: Settings → Pages → Branch `main` → pasta `/ (root)`.
```

- [ ] **Step 6: Verify tokens load correctly**

Open `index.html` directly in a browser (double-click or `start index.html` on
Windows) and confirm the page renders without console errors (font import resolves,
no 404s for `assets/css/*.css`).

- [ ] **Step 7: Commit**

```bash
git add .gitignore README.md assets/css/reset.css assets/css/styles.css index.html
git commit -m "chore: scaffold project and design tokens"
```

---

### Task 2: Shared layout — navbar, footer, mobile menu

**Files:**
- Create: `assets/js/layout.js`
- Create: `assets/img/logo.svg`
- Modify: `assets/css/styles.css` (append navbar/footer/mobile-menu rules)

**Interfaces:**
- Consumes: CSS tokens from Task 1 (`--color-*`, `--space-*`, `--radius-*`).
- Produces: `initLayout()` — a function every page's inline `<script type="module">`
  calls once on load; it injects the navbar/footer HTML into elements with
  `id="site-header"` / `id="site-footer"` and wires up the mobile menu toggle.
  Also produces `NAV_LINKS` (exported array of `{ href, label }`) consumed by
  Task 4 (home) and Tasks 5-8 (course pages) — no other file should hardcode the
  nav link list.

- [ ] **Step 1: Create `assets/img/logo.svg`**

```svg
<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <circle cx="16" cy="16" r="15" fill="#CC785C"/>
  <text x="16" y="21" font-family="Space Grotesk, sans-serif" font-size="16"
        font-weight="700" fill="#FFFFFF" text-anchor="middle">C</text>
</svg>
```

- [ ] **Step 2: Create `assets/js/layout.js`**

```js
export const NAV_LINKS = [
  { href: 'index.html', label: 'Início' },
  { href: 'chat.html', label: 'Curso Chat' },
  { href: 'cowork.html', label: 'Curso Cowork' },
  { href: 'code.html', label: 'Curso Code' },
  { href: 'design.html', label: 'Curso Design' },
  { href: 'recursos.html', label: 'Recursos' },
  { href: 'sobre.html', label: 'Sobre' },
];

function currentPage() {
  const path = window.location.pathname.split('/').pop();
  return path === '' ? 'index.html' : path;
}

function renderHeader() {
  const active = currentPage();
  const links = NAV_LINKS.map(link => {
    const isActive = link.href === active;
    return `<a href="${link.href}" class="navbar__link${isActive ? ' is-active' : ''}">${link.label}</a>`;
  }).join('');

  return `
    <div class="navbar container">
      <a href="index.html" class="navbar__brand">
        <img src="assets/img/logo.svg" alt="Claude do Zero ao Expert" width="32" height="32">
        <span>Claude do Zero ao Expert</span>
      </a>
      <button class="navbar__toggle" aria-label="Abrir menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
      <nav class="navbar__links">${links}</nav>
    </div>
  `;
}

function renderFooter() {
  return `
    <div class="container footer__inner">
      <p>&copy; 2026 Claude do Zero ao Expert. Conteúdo educacional independente sobre as soluções Claude da Anthropic.</p>
      <a href="recursos.html">Recursos e referências oficiais</a>
    </div>
  `;
}

export function initLayout() {
  const header = document.getElementById('site-header');
  const footer = document.getElementById('site-footer');
  if (header) header.innerHTML = renderHeader();
  if (footer) footer.innerHTML = renderFooter();

  const toggle = document.querySelector('.navbar__toggle');
  const links = document.querySelector('.navbar__links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const isOpen = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  document.querySelectorAll('.fade-in').forEach(el => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
      });
    }, { threshold: 0.15 });
    observer.observe(el);
  });
}
```

- [ ] **Step 3: Append navbar/footer/mobile-menu CSS to `assets/css/styles.css`**

```css
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4) var(--space-5);
}
.navbar__brand {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-display);
  font-weight: 700;
}
.navbar__links {
  display: flex;
  gap: var(--space-5);
}
.navbar__link { color: var(--color-text-muted); font-weight: 500; }
.navbar__link.is-active, .navbar__link:hover { color: var(--color-accent); }
.navbar__toggle {
  display: none;
  flex-direction: column;
  gap: 4px;
}
.navbar__toggle span { width: 22px; height: 2px; background: var(--color-text); }

.site-footer { background: var(--color-bg-alt); border-top: 1px solid var(--color-border); }
.footer__inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-5) 0;
  color: var(--color-text-muted);
  font-size: 0.9rem;
}

@media (max-width: 880px) {
  .navbar__toggle { display: flex; }
  .navbar__links {
    position: absolute;
    top: 64px;
    left: 0;
    right: 0;
    flex-direction: column;
    background: var(--color-bg);
    border-bottom: 1px solid var(--color-border);
    padding: var(--space-4) var(--space-5);
    display: none;
  }
  .navbar__links.is-open { display: flex; }
  .footer__inner { flex-direction: column; gap: var(--space-3); text-align: center; }
}
```

- [ ] **Step 4: Wire into `index.html` for a smoke check**

Replace the placeholder body of `index.html` from Task 1 with:

```html
<body>
  <header id="site-header"></header>
  <main><p class="container">Em construção — ver Task 4.</p></main>
  <footer id="site-footer" class="site-footer"></footer>
  <script type="module">
    import { initLayout } from './assets/js/layout.js';
    initLayout();
  </script>
</body>
```

- [ ] **Step 5: Verify in browser**

Start a static server (`npx serve .` or any equivalent) since `type="module"` scripts
are blocked on `file://` in most browsers. Open the served `index.html` and confirm:
navbar renders with logo + 7 links, resizing to a mobile width (<880px) shows the
hamburger button, and clicking it toggles the links list open/closed with no console
errors.

- [ ] **Step 6: Commit**

```bash
git add assets/js/layout.js assets/img/logo.svg assets/css/styles.css index.html
git commit -m "feat: add shared navbar/footer layout"
```

---

### Task 3: Course viewer engine (data-driven module renderer)

**Files:**
- Create: `assets/js/course-viewer.js`
- Create: `tests/course-viewer.test.mjs`

**Interfaces:**
- Consumes: a `modules` array where each item is
  `{ id: string, title: string, level: 'iniciante'|'intermediario'|'avancado', block: string, status: 'completo'|'em-breve', objective?: string, steps?: string[], useCases?: string[], recommendations?: string[], videos?: {title: string, channel: string, url: string, youtubeId: string, publishedApprox: string, viewsApprox: string}[], links?: {label: string, url: string}[] }`.
- Produces: `buildSidebar(modules)` → HTML string; `findModuleById(modules, id)` →
  module object or `undefined`; `renderModule(module)` → HTML string;
  `initCourseViewer(modules, { sidebarEl, contentEl })` — wires hash-based routing.
  Tasks 5-8 import `initCourseViewer` and pass their own module array.

- [ ] **Step 1: Write failing unit tests for the pure functions**

```js
// tests/course-viewer.test.mjs
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildSidebar, findModuleById } from '../assets/js/course-viewer.js';

const sample = [
  { id: 'modulo-1', title: 'Primeiros passos', block: 'Fundamentos', status: 'completo' },
  { id: 'modulo-2', title: 'Conversas eficazes', block: 'Fundamentos', status: 'completo' },
  { id: 'modulo-4', title: 'Tópico avançado', block: 'Avançado', status: 'em-breve' },
];

test('findModuleById returns the matching module', () => {
  const found = findModuleById(sample, 'modulo-2');
  assert.equal(found.title, 'Conversas eficazes');
});

test('findModuleById returns undefined for unknown id', () => {
  assert.equal(findModuleById(sample, 'modulo-99'), undefined);
});

test('buildSidebar groups modules by block and marks status', () => {
  const html = buildSidebar(sample);
  assert.match(html, /Fundamentos/);
  assert.match(html, /Avançado/);
  assert.match(html, /em-breve/);
  assert.match(html, /modulo-1/);
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test tests/course-viewer.test.mjs`
Expected: FAIL — `course-viewer.js` does not exist yet (module not found error).

- [ ] **Step 3: Implement `assets/js/course-viewer.js`**

```js
export function findModuleById(modules, id) {
  return modules.find(m => m.id === id);
}

export function buildSidebar(modules) {
  const blocks = [...new Set(modules.map(m => m.block))];
  return blocks.map(block => {
    const items = modules
      .filter(m => m.block === block)
      .map(m => `
        <li>
          <a href="#${m.id}" class="sidebar__link" data-status="${m.status}">
            ${m.title}
          </a>
        </li>
      `).join('');
    return `
      <div class="sidebar__block">
        <h4>${block}</h4>
        <ul>${items}</ul>
      </div>
    `;
  }).join('');
}

function renderVideos(videos = []) {
  if (videos.length === 0) return '';
  const cards = videos.map(v => `
    <a class="video-card" href="${v.url}" target="_blank" rel="noopener">
      <img src="https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg" alt="Thumbnail: ${v.title}" loading="lazy">
      <div class="video-card__info">
        <strong>${v.title}</strong>
        <span>${v.channel} · ${v.publishedApprox} · ${v.viewsApprox}</span>
      </div>
    </a>
  `).join('');
  return `<section class="module__videos"><h3>Vídeos recomendados</h3><div class="video-grid">${cards}</div></section>`;
}

function renderLinks(links = []) {
  if (links.length === 0) return '';
  const items = links.map(l => `<li><a href="${l.url}" target="_blank" rel="noopener">${l.label}</a></li>`).join('');
  return `<section class="module__links"><h3>Links de referência</h3><ul>${items}</ul></section>`;
}

export function renderModule(module) {
  if (!module) {
    return `<div class="module module--empty"><p>Selecione um módulo no menu ao lado.</p></div>`;
  }
  if (module.status === 'em-breve') {
    return `
      <div class="module">
        <span class="module__level">${module.level || ''}</span>
        <h2>${module.title}</h2>
        <p class="module__ementa">${module.objective || ''}</p>
        <p class="module__soon">Conteúdo completo chega na próxima etapa do curso.</p>
      </div>
    `;
  }
  const steps = (module.steps || []).map(s => `<li>${s}</li>`).join('');
  const useCases = (module.useCases || []).map(u => `<li>${u}</li>`).join('');
  const recommendations = (module.recommendations || []).map(r => `<li>${r}</li>`).join('');
  return `
    <div class="module">
      <span class="module__level">${module.level}</span>
      <h2>${module.title}</h2>
      <p class="module__ementa">${module.objective}</p>
      <section><h3>Passo a passo</h3><ol>${steps}</ol></section>
      <section><h3>Casos de uso</h3><ul>${useCases}</ul></section>
      <section><h3>Recomendações</h3><ul>${recommendations}</ul></section>
      ${renderVideos(module.videos)}
      ${renderLinks(module.links)}
    </div>
  `;
}

export function initCourseViewer(modules, { sidebarEl, contentEl }) {
  sidebarEl.innerHTML = buildSidebar(modules);

  function renderFromHash() {
    const id = window.location.hash.replace('#', '') || modules[0]?.id;
    const active = findModuleById(modules, id);
    contentEl.innerHTML = renderModule(active);
    sidebarEl.querySelectorAll('.sidebar__link').forEach(link => {
      link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
    });
  }

  window.addEventListener('hashchange', renderFromHash);
  renderFromHash();
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test tests/course-viewer.test.mjs`
Expected: PASS — 3 tests passing, 0 failing.

- [ ] **Step 5: Append module/sidebar/video-card CSS to `assets/css/styles.css`**

```css
.course-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: var(--space-6);
  align-items: start;
  padding: var(--space-6) 0;
}
.sidebar__block { margin-bottom: var(--space-5); }
.sidebar__block h4 { color: var(--color-text-muted); font-size: 0.8rem; text-transform: uppercase; margin-bottom: var(--space-2); }
.sidebar__link { display: block; padding: var(--space-2) var(--space-3); border-radius: var(--radius-md); color: var(--color-text); }
.sidebar__link:hover { background: var(--color-bg-alt); }
.sidebar__link.is-active { background: var(--color-accent); color: #FFFFFF; }
.sidebar__link[data-status="em-breve"]::after { content: " ·"; color: var(--color-text-muted); }

.module { max-width: 760px; }
.module__level { display: inline-block; background: var(--color-bg-alt); color: var(--color-accent-dark); border-radius: 999px; padding: 2px 10px; font-size: 0.8rem; font-weight: 600; margin-bottom: var(--space-2); }
.module__ementa { color: var(--color-text-muted); margin: var(--space-2) 0 var(--space-5); }
.module section { margin-bottom: var(--space-5); }
.module ol, .module ul { padding-left: var(--space-5); }
.module ol li, .module ul li { margin-bottom: var(--space-2); }

.video-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: var(--space-4); }
.video-card { display: block; border: 1px solid var(--color-border); border-radius: var(--radius-md); overflow: hidden; }
.video-card img { width: 100%; aspect-ratio: 16/9; object-fit: cover; }
.video-card__info { padding: var(--space-3); font-size: 0.85rem; }
.video-card__info span { display: block; color: var(--color-text-muted); margin-top: var(--space-1); }

@media (max-width: 880px) {
  .course-layout { grid-template-columns: 1fr; }
}
```

- [ ] **Step 6: Commit**

```bash
git add assets/js/course-viewer.js tests/course-viewer.test.mjs assets/css/styles.css
git commit -m "feat: add data-driven course viewer engine with unit tests"
```

---

### Task 4: Home page (`index.html`)

**Files:**
- Modify: `index.html` (replace placeholder body from Task 2)

**Interfaces:**
- Consumes: `initLayout()` from Task 2.

- [ ] **Step 1: Replace `index.html` body with the full home page**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Claude do Zero ao Expert</title>
  <meta name="description" content="Aprenda as soluções Claude — Chat, Cowork, Code e Design — do zero até o nível expert, com trilhas guiadas em português.">
  <link rel="stylesheet" href="assets/css/reset.css">
  <link rel="stylesheet" href="assets/css/styles.css">
</head>
<body>
  <header id="site-header"></header>

  <main>
    <section class="hero container">
      <h1>De iniciante a expert nas soluções Claude</h1>
      <p>Trilhas guiadas em português para dominar Chat, Cowork, Code e Design — com
         passo a passo, casos de uso reais e os melhores vídeos da web.</p>
      <a href="chat.html" class="btn btn-primary">Comece sua jornada</a>
    </section>

    <section class="container courses-grid">
      <a href="chat.html" class="card fade-in">
        <h3>Curso Chat</h3>
        <p>Domine o claude.ai: conversas, Projects e Artifacts.</p>
      </a>
      <a href="cowork.html" class="card fade-in">
        <h3>Curso Cowork</h3>
        <p>Agentes, colaboração e automações com Claude.</p>
      </a>
      <a href="code.html" class="card fade-in">
        <h3>Curso Code</h3>
        <p>Claude Code na prática, do primeiro comando ao fluxo avançado.</p>
      </a>
      <a href="design.html" class="card fade-in">
        <h3>Curso Design</h3>
        <p>Artifacts e criação visual com Claude.</p>
      </a>
    </section>

    <section class="container fade-in">
      <h2>Por que aprender Claude agora</h2>
      <p>Claude é uma das famílias de modelos de IA mais usadas para conversar,
         automatizar trabalho, programar e criar — aprender a fundo hoje é a base
         para qualquer carreira em IA amanhã.</p>
    </section>

    <section class="container fade-in">
      <h2>Referências oficiais</h2>
      <ul>
        <li><a href="https://docs.anthropic.com" target="_blank" rel="noopener">Documentação oficial da Anthropic</a></li>
        <li><a href="https://github.com/anthropics" target="_blank" rel="noopener">Anthropic no GitHub</a></li>
      </ul>
    </section>
  </main>

  <footer id="site-footer" class="site-footer"></footer>

  <script type="module">
    import { initLayout } from './assets/js/layout.js';
    initLayout();
  </script>
</body>
</html>
```

- [ ] **Step 2: Append hero/courses-grid CSS to `assets/css/styles.css`**

```css
.hero { text-align: center; padding: var(--space-8) var(--space-5); background: linear-gradient(180deg, var(--color-bg-alt), var(--color-bg)); }
.hero p { max-width: 640px; margin: var(--space-4) auto var(--space-6); color: var(--color-text-muted); }
.courses-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: var(--space-5); padding: var(--space-6) var(--space-5); }
```

- [ ] **Step 3: Verify in browser**

Serve the folder and open `index.html`. Confirm: hero renders with CTA button, 4
course cards fade in on scroll, links navigate to the (still-empty) course pages
without 404s, no console errors.

- [ ] **Step 4: Commit**

```bash
git add index.html assets/css/styles.css
git commit -m "feat: build home page"
```

---

### Task 5: Curso Chat — data file + page + pilot modules

**Files:**
- Create: `assets/data/chat-modules.js`
- Create: `chat.html`

**Interfaces:**
- Consumes: `initCourseViewer` from Task 3, `initLayout` from Task 2.
- Produces: `chatModules` (exported array, 24 entries) — reference shape for Tasks
  6-8 (same structure, different product content).

- [ ] **Step 1: Research real videos for the 3 pilot modules**

Use the WebSearch tool (load it first via `ToolSearch query: "select:WebSearch"` if
not yet loaded) with queries such as:
`"Claude AI" tutorial iniciantes site:youtube.com`,
`maestrosdaia Claude AI`, `VictorBaggio-AI Claude`.
For each of the 3 pilot modules below, pick 1-2 real, currently-live videos and
record: exact title, channel name, video URL, the 11-character YouTube ID (from the
URL), approximate publish recency, and approximate view count at research time.
Prefer the channels the user named (Maestros da IA, Victor Baggio AI) when a real,
on-topic match exists; otherwise use the closest well-matched Portuguese-language
video.

- [ ] **Step 2: Create `assets/data/chat-modules.js` with 3 full pilot modules + 21 stubs**

Write the 3 pilot modules with the researched video data from Step 1 substituted in
place of the `videos` array shown below (this example shows the exact shape and one
real reference link that must stay valid — Anthropic's own docs — plus the video
slots to fill in):

```js
export const chatModules = [
  {
    id: 'modulo-1',
    title: 'O que é o Claude e como criar sua conta',
    level: 'iniciante',
    block: 'Fundamentos',
    status: 'completo',
    objective: 'Entender o que é o Claude, o que é o claude.ai, e criar sua conta para começar a usar.',
    steps: [
      'Acesse claude.ai e escolha "Sign up" (ou "Continuar com Google").',
      'Confirme seu e-mail e defina seu perfil.',
      'Explore a tela inicial: campo de mensagem, histórico de conversas na barra lateral, e o seletor de modelo no topo.',
      'Envie sua primeira mensagem e observe a resposta em streaming (o texto aparece progressivamente).',
    ],
    useCases: [
      'Tirar dúvidas rápidas do dia a dia.',
      'Pedir um resumo de um texto longo colado na conversa.',
      'Pedir sugestões de estudo para um tema novo.',
    ],
    recommendations: [
      'Comece com o modelo padrão sugerido pela interface antes de explorar outros.',
      'Use frases claras e diretas — o Claude responde melhor a pedidos específicos.',
    ],
    videos: [
      {
        title: 'A PREENCHER: título real do vídeo encontrado na pesquisa',
        channel: 'A PREENCHER',
        url: 'A PREENCHER',
        youtubeId: 'A PREENCHER',
        publishedApprox: 'A PREENCHER',
        viewsApprox: 'A PREENCHER',
      },
    ],
    links: [
      { label: 'Documentação oficial — Introdução ao Claude', url: 'https://docs.anthropic.com' },
    ],
  },
  {
    id: 'modulo-2',
    title: 'Escrevendo boas mensagens (prompts) no Chat',
    level: 'iniciante',
    block: 'Fundamentos',
    status: 'completo',
    objective: 'Aprender a estruturar pedidos claros para obter respostas melhores do Claude.',
    steps: [
      'Dê contexto: diga quem você é e o que precisa antes de pedir a tarefa.',
      'Seja específico sobre o formato da resposta (lista, tabela, passo a passo).',
      'Peça exemplos quando o tema for abstrato.',
      'Refine com mensagens de acompanhamento em vez de reescrever tudo do zero.',
    ],
    useCases: [
      'Pedir um plano de estudos em formato de tabela.',
      'Pedir uma explicação "como se eu tivesse 10 anos" de um conceito técnico.',
    ],
    recommendations: [
      'Evite pedidos vagos como "me ajude com isso" sem contexto.',
      'Divida tarefas grandes em pedidos menores e sequenciais.',
    ],
    videos: [
      {
        title: 'A PREENCHER: título real do vídeo encontrado na pesquisa',
        channel: 'A PREENCHER',
        url: 'A PREENCHER',
        youtubeId: 'A PREENCHER',
        publishedApprox: 'A PREENCHER',
        viewsApprox: 'A PREENCHER',
      },
    ],
    links: [
      { label: 'Documentação oficial — Boas práticas de prompt', url: 'https://docs.anthropic.com' },
    ],
  },
  {
    id: 'modulo-3',
    title: 'Organizando conversas com Projects',
    level: 'iniciante',
    block: 'Fundamentos',
    status: 'completo',
    objective: 'Usar Projects para agrupar conversas e arquivos de um mesmo tema.',
    steps: [
      'Na barra lateral, clique em "Projects" e crie um novo projeto.',
      'Dê um nome e uma descrição curta do objetivo do projeto.',
      'Envie arquivos de referência (PDFs, textos) para o projeto.',
      'Inicie conversas dentro do projeto — o Claude usa os arquivos como contexto.',
    ],
    useCases: [
      'Manter todo o material de uma disciplina de estudo em um único projeto.',
      'Organizar pesquisas de um trabalho em andamento.',
    ],
    recommendations: [
      'Crie um projeto por tema, não um projeto único para tudo.',
      'Atualize os arquivos do projeto conforme o material evolui.',
    ],
    videos: [
      {
        title: 'A PREENCHER: título real do vídeo encontrado na pesquisa',
        channel: 'A PREENCHER',
        url: 'A PREENCHER',
        youtubeId: 'A PREENCHER',
        publishedApprox: 'A PREENCHER',
        viewsApprox: 'A PREENCHER',
      },
    ],
    links: [
      { label: 'Documentação oficial — Projects', url: 'https://docs.anthropic.com' },
    ],
  },
  // Módulos 4-24: stubs "em-breve" — mesma estrutura mínima, sem conteúdo completo.
  { id: 'modulo-4', title: 'Anexando arquivos e imagens numa conversa', level: 'iniciante', block: 'Fundamentos', status: 'em-breve', objective: 'Enviar PDFs, imagens e planilhas para o Claude analisar.' },
  { id: 'modulo-5', title: 'Usando Artifacts para conteúdo estruturado', level: 'iniciante', block: 'Fundamentos', status: 'em-breve', objective: 'Gerar documentos, código e diagramas que aparecem num painel separado.' },
  { id: 'modulo-6', title: 'Histórico, busca e organização de conversas', level: 'iniciante', block: 'Fundamentos', status: 'em-breve', objective: 'Encontrar conversas antigas e mantê-las organizadas.' },
  { id: 'modulo-7', title: 'Escolhendo entre os modelos Claude disponíveis', level: 'intermediario', block: 'Intermediário', status: 'em-breve', objective: 'Entender quando usar cada modelo disponível na interface.' },
  { id: 'modulo-8', title: 'Estilos de resposta e personalização', level: 'intermediario', block: 'Intermediário', status: 'em-breve', objective: 'Ajustar tom e formato das respostas do Claude.' },
  { id: 'modulo-9', title: 'Instruções personalizadas (Custom Instructions)', level: 'intermediario', block: 'Intermediário', status: 'em-breve', objective: 'Configurar preferências que valem para todas as conversas.' },
  { id: 'modulo-10', title: 'Trabalhando com textos longos e resumos', level: 'intermediario', block: 'Intermediário', status: 'em-breve', objective: 'Resumir e analisar documentos extensos com eficiência.' },
  { id: 'modulo-11', title: 'Comparando e revisando versões de um texto', level: 'intermediario', block: 'Intermediário', status: 'em-breve', objective: 'Usar Artifacts para iterar sobre versões de um mesmo documento.' },
  { id: 'modulo-12', title: 'Boas práticas de privacidade e uso de dados', level: 'intermediario', block: 'Intermediário', status: 'em-breve', objective: 'Entender o que compartilhar (e o que evitar) em conversas.' },
  { id: 'modulo-13', title: 'Prompts avançados: técnicas de raciocínio', level: 'avancado', block: 'Avançado', status: 'em-breve', objective: 'Técnicas para pedidos complexos e multi-etapas.' },
  { id: 'modulo-14', title: 'Combinando Chat com Artifacts para protótipos', level: 'avancado', block: 'Avançado', status: 'em-breve', objective: 'Criar protótipos interativos direto na conversa.' },
  { id: 'modulo-15', title: 'Usando o Claude para pesquisa aprofundada', level: 'avancado', block: 'Avançado', status: 'em-breve', objective: 'Estruturar pesquisas longas em várias conversas encadeadas.' },
  { id: 'modulo-16', title: 'Integrações do Chat com outras ferramentas', level: 'avancado', block: 'Avançado', status: 'em-breve', objective: 'Conectar o Claude a fontes externas de dados.' },
  { id: 'modulo-17', title: 'Limites, cotas e planos do claude.ai', level: 'avancado', block: 'Avançado', status: 'em-breve', objective: 'Entender os planos disponíveis e como escolher o certo.' },
  { id: 'modulo-18', title: 'Diagnosticando respostas ruins e corrigindo o rumo', level: 'avancado', block: 'Avançado', status: 'em-breve', objective: 'Técnicas para recuperar uma conversa que saiu do rumo.' },
  { id: 'modulo-19', title: 'Caso de uso: estudos e preparação para provas', level: 'avancado', block: 'Casos de Uso e Boas Práticas', status: 'em-breve', objective: 'Um fluxo completo de uso do Chat para estudar um tema novo.' },
  { id: 'modulo-20', title: 'Caso de uso: escrita e revisão de textos', level: 'avancado', block: 'Casos de Uso e Boas Práticas', status: 'em-breve', objective: 'Um fluxo completo para revisar e melhorar textos próprios.' },
  { id: 'modulo-21', title: 'Caso de uso: apoio a decisões do dia a dia', level: 'avancado', block: 'Casos de Uso e Boas Práticas', status: 'em-breve', objective: 'Usando o Chat para organizar prós e contras de uma decisão.' },
  { id: 'modulo-22', title: 'Caso de uso: aprendizado de um novo idioma', level: 'avancado', block: 'Casos de Uso e Boas Práticas', status: 'em-breve', objective: 'Praticando conversação e gramática com o Claude.' },
  { id: 'modulo-23', title: 'Boas práticas: quando não usar IA generativa', level: 'avancado', block: 'Casos de Uso e Boas Práticas', status: 'em-breve', objective: 'Limites éticos e práticos do uso do Chat.' },
  { id: 'modulo-24', title: 'Do Chat para os próximos passos: Cowork, Code e Design', level: 'avancado', block: 'Casos de Uso e Boas Práticas', status: 'em-breve', objective: 'Como o que você aprendeu no Chat se conecta às outras trilhas.' },
];
```

- [ ] **Step 3: Create `chat.html`**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Curso Chat — Claude do Zero ao Expert</title>
  <meta name="description" content="Trilha completa para dominar o claude.ai: conversas, Projects e Artifacts.">
  <link rel="stylesheet" href="assets/css/reset.css">
  <link rel="stylesheet" href="assets/css/styles.css">
</head>
<body>
  <header id="site-header"></header>
  <main class="container course-layout">
    <aside id="course-sidebar"></aside>
    <section id="course-content"></section>
  </main>
  <footer id="site-footer" class="site-footer"></footer>

  <script type="module">
    import { initLayout } from './assets/js/layout.js';
    import { initCourseViewer } from './assets/js/course-viewer.js';
    import { chatModules } from './assets/data/chat-modules.js';

    initLayout();
    initCourseViewer(chatModules, {
      sidebarEl: document.getElementById('course-sidebar'),
      contentEl: document.getElementById('course-content'),
    });
  </script>
</body>
</html>
```

- [ ] **Step 4: Verify in browser**

Serve the folder, open `chat.html`. Confirm: sidebar shows 4 blocks × modules,
Módulo 1 renders by default, clicking Módulo 2/3 swaps content without page reload,
clicking any "em-breve" module (4-24) shows the "conteúdo completo chega..." message,
video cards show real thumbnails and open the correct YouTube video in a new tab, no
console errors.

- [ ] **Step 5: Commit**

```bash
git add assets/data/chat-modules.js chat.html
git commit -m "feat: add curso Chat with pilot modules 1-3 and 21 stubs"
```

---

### Task 6: Curso Cowork — data file + page + pilot modules

**Files:**
- Create: `assets/data/cowork-modules.js`
- Create: `cowork.html`

**Interfaces:**
- Consumes: same as Task 5, but content must be about Cowork (agentes,
  colaboração, automações) — do not reuse Chat's content.
- Produces: `coworkModules` (exported array, 24 entries), same shape as
  `chatModules`.

- [ ] **Step 1: Research real videos for the 3 pilot modules**

Same method as Task 5 Step 1, with queries such as `Claude agentes automação
tutorial site:youtube.com`, `maestrosdaia Claude Cowork agentes`, adapted to
Cowork's topic (agents, collaboration, automation), preferring the user's named
channels when a real match exists.

- [ ] **Step 2: Create `assets/data/cowork-modules.js`**

Follow the exact object shape from Task 5 Step 2. Write 3 full pilot modules
(`modulo-1`–`modulo-3`, block `Fundamentos`) covering: (1) o que é Cowork e como
ativar/configurar agentes de colaboração; (2) criando seu primeiro fluxo
automatizado; (3) delegando tarefas repetitivas a um agente. Each pilot module
needs `steps`, `useCases`, `recommendations`, real `videos` (from Step 1), and
`links` (at least one `https://docs.anthropic.com` reference). Then write 21
`em-breve` stubs (`modulo-4`–`modulo-24`) covering intermediário topics (ex:
configurando permissões de agentes, integrando fontes de dados, monitorando
execuções), avançado topics (ex: orquestração de múltiplos agentes, tratamento de
erros em automações, agendamento recorrente), and casos de uso/boas práticas (ex:
automação de triagem de mensagens, fluxo de aprovação em equipe, quando NÃO
automatizar), distributed 6/6/6/6 across the 4 blocks exactly like Task 5.

- [ ] **Step 3: Create `cowork.html`**

Same structure as `chat.html` from Task 5 Step 3, with these substitutions: title
`Curso Cowork — Claude do Zero ao Expert`, meta description about agentes/
colaboração/automações, import `coworkModules` from
`./assets/data/cowork-modules.js` in place of `chatModules`.

- [ ] **Step 4: Verify in browser**

Same checks as Task 5 Step 4, run against `cowork.html`.

- [ ] **Step 5: Commit**

```bash
git add assets/data/cowork-modules.js cowork.html
git commit -m "feat: add curso Cowork with pilot modules 1-3 and 21 stubs"
```

---

### Task 7: Curso Code — data file + page + pilot modules

**Files:**
- Create: `assets/data/code-modules.js`
- Create: `code.html`

**Interfaces:**
- Consumes: same as Task 5, content must be about Claude Code (the CLI coding
  agent) — installation, CLI usage, agentic coding workflows.
- Produces: `codeModules` (exported array, 24 entries), same shape.

- [ ] **Step 1: Research real videos for the 3 pilot modules**

Same method as Task 5 Step 1, with queries such as `Claude Code tutorial
instalação`, `maestrosdaia Claude Code`, `VictorBaggio-AI Claude Code`, `Claude Code
CLI demo site:youtube.com`.

- [ ] **Step 2: Create `assets/data/code-modules.js`**

Follow the exact object shape from Task 5 Step 2. Write 3 full pilot modules
(`modulo-1`–`modulo-3`, block `Fundamentos`) covering: (1) o que é o Claude Code e
como instalar a CLI; (2) seu primeiro comando e a estrutura de uma sessão; (3)
pedindo para o Claude Code ler, editar e explicar arquivos do seu projeto. Include
real `steps` (actual install/usage commands), `useCases`, `recommendations`,
researched `videos`, and `links` (at least one `https://docs.anthropic.com`
reference to Claude Code docs). Then write 21 `em-breve` stubs (`modulo-4`–
`modulo-24`) covering intermediário topics (ex: hooks, slash commands, permissões
de ferramentas), avançado topics (ex: subagents, MCP, worktrees paralelos), and
casos de uso/boas práticas (ex: fluxo TDD com Claude Code, revisão de PR
automatizada, quando pedir confirmação antes de agir), 6/6/6/6 across the 4 blocks.

- [ ] **Step 3: Create `code.html`**

Same structure as `chat.html` from Task 5 Step 3: title `Curso Code — Claude do
Zero ao Expert`, meta description about Claude Code, import `codeModules` from
`./assets/data/code-modules.js`.

- [ ] **Step 4: Verify in browser**

Same checks as Task 5 Step 4, run against `code.html`.

- [ ] **Step 5: Commit**

```bash
git add assets/data/code-modules.js code.html
git commit -m "feat: add curso Code with pilot modules 1-3 and 21 stubs"
```

---

### Task 8: Curso Design — data file + page + pilot modules

**Files:**
- Create: `assets/data/design-modules.js`
- Create: `design.html`

**Interfaces:**
- Consumes: same as Task 5, content must be about Artifacts and visual creation
  with Claude — not a generic design course.
- Produces: `designModules` (exported array, 24 entries), same shape.

- [ ] **Step 1: Research real videos for the 3 pilot modules**

Same method as Task 5 Step 1, with queries such as `Claude Artifacts tutorial`,
`Claude AI criação visual design`, `maestrosdaia Claude Artifacts`.

- [ ] **Step 2: Create `assets/data/design-modules.js`**

Follow the exact object shape from Task 5 Step 2. Write 3 full pilot modules
(`modulo-1`–`modulo-3`, block `Fundamentos`) covering: (1) o que são Artifacts e
como abrir o painel de criação visual; (2) gerando seu primeiro protótipo de
interface com Artifacts; (3) iterando sobre um design a partir de feedback em
linguagem natural. Include real `steps`, `useCases`, `recommendations`,
researched `videos`, and `links` (`https://docs.anthropic.com` Artifacts
reference). Then write 21 `em-breve` stubs (`modulo-4`–`modulo-24`) covering
intermediário topics (ex: componentes reutilizáveis em Artifacts, exportando um
design pronto, paletas e tipografia guiadas por IA), avançado topics (ex:
protótipos interativos com estado, combinando Artifacts com Cowork para produção,
boas práticas de acessibilidade em designs gerados), and casos de uso/boas
práticas (ex: criando um pitch deck visual, protótipo de landing page do zero,
revisão de design com stakeholders), 6/6/6/6 across the 4 blocks.

- [ ] **Step 3: Create `design.html`**

Same structure as `chat.html` from Task 5 Step 3: title `Curso Design — Claude do
Zero ao Expert`, meta description about Artifacts/criação visual, import
`designModules` from `./assets/data/design-modules.js`.

- [ ] **Step 4: Verify in browser**

Same checks as Task 5 Step 4, run against `design.html`.

- [ ] **Step 5: Commit**

```bash
git add assets/data/design-modules.js design.html
git commit -m "feat: add curso Design with pilot modules 1-3 and 21 stubs"
```

---

### Task 9: Recursos and Sobre pages

**Files:**
- Create: `recursos.html`
- Create: `sobre.html`

**Interfaces:**
- Consumes: `initLayout()` from Task 2.

- [ ] **Step 1: Create `recursos.html`**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Recursos — Claude do Zero ao Expert</title>
  <meta name="description" content="Links e referências oficiais para aprofundar seus estudos em Claude.">
  <link rel="stylesheet" href="assets/css/reset.css">
  <link rel="stylesheet" href="assets/css/styles.css">
</head>
<body>
  <header id="site-header"></header>
  <main class="container fade-in">
    <h1>Recursos e referências</h1>

    <section>
      <h2>Documentação oficial</h2>
      <ul>
        <li><a href="https://docs.anthropic.com" target="_blank" rel="noopener">docs.anthropic.com — documentação geral</a></li>
        <li><a href="https://www.anthropic.com" target="_blank" rel="noopener">anthropic.com — site institucional</a></li>
      </ul>
    </section>

    <section>
      <h2>Código e comunidade</h2>
      <ul>
        <li><a href="https://github.com/anthropics" target="_blank" rel="noopener">github.com/anthropics — repositórios oficiais</a></li>
        <li><a href="https://github.com" target="_blank" rel="noopener">github.com — explore projetos da comunidade</a></li>
      </ul>
    </section>

    <section>
      <h2>Canais de vídeo recomendados</h2>
      <ul>
        <li><a href="https://www.youtube.com/@maestrosdaia" target="_blank" rel="noopener">Maestros da IA</a></li>
        <li><a href="https://www.youtube.com/@VictorBaggio-AI" target="_blank" rel="noopener">Victor Baggio AI</a></li>
      </ul>
    </section>
  </main>
  <footer id="site-footer" class="site-footer"></footer>
  <script type="module">
    import { initLayout } from './assets/js/layout.js';
    initLayout();
  </script>
</body>
</html>
```

- [ ] **Step 2: Create `sobre.html`**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sobre — Claude do Zero ao Expert</title>
  <meta name="description" content="O que é o site Claude do Zero ao Expert e como usá-lo.">
  <link rel="stylesheet" href="assets/css/reset.css">
  <link rel="stylesheet" href="assets/css/styles.css">
</head>
<body>
  <header id="site-header"></header>
  <main class="container fade-in">
    <h1>Sobre este site</h1>
    <p>Claude do Zero ao Expert é um site educacional independente, feito para
       guiar um iniciante completo em IA até o nível avançado no uso das soluções
       Claude: Chat, Cowork, Code e Design.</p>
    <p>Cada curso é dividido em 24 módulos, do fundamental ao avançado, com
       passo a passo, casos de uso reais e vídeos selecionados. Use o menu lateral
       de cada curso para navegar entre os módulos na ordem que preferir.</p>
    <p>Este site não é afiliado oficialmente à Anthropic; consulte sempre a
       <a href="https://docs.anthropic.com" target="_blank" rel="noopener">documentação oficial</a>
       para informações atualizadas sobre os produtos.</p>
  </main>
  <footer id="site-footer" class="site-footer"></footer>
  <script type="module">
    import { initLayout } from './assets/js/layout.js';
    initLayout();
  </script>
</body>
</html>
```

- [ ] **Step 3: Verify in browser**

Serve the folder, open `recursos.html` and `sobre.html`. Confirm navbar/footer
render, all external links open in a new tab, no console errors.

- [ ] **Step 4: Commit**

```bash
git add recursos.html sobre.html
git commit -m "feat: add recursos and sobre pages"
```

---

### Task 10: Final QA pass and GitHub Pages publish prep

**Files:**
- No new files; verification + `.nojekyll` only.
- Create: `.nojekyll` (empty file — prevents GitHub Pages' Jekyll processor from
  ignoring folders starting with `_` or interfering with plain static files)

- [ ] **Step 1: Create `.nojekyll`**

Empty file at the project root.

- [ ] **Step 2: Full responsive/browser QA pass**

Serve the folder. For each of `index.html`, `chat.html`, `cowork.html`, `code.html`,
`design.html`, `recursos.html`, `sobre.html`: resize to 375px (mobile), 768px
(tablet), and 1280px (desktop) widths and confirm layout doesn't break or overflow
horizontally; click every navbar link once to confirm no 404s; confirm zero
console errors/warnings on each page.

- [ ] **Step 3: Run the unit test suite one final time**

Run: `node --test tests/course-viewer.test.mjs`
Expected: PASS — all tests green.

- [ ] **Step 4: Commit**

```bash
git add .nojekyll
git commit -m "chore: add .nojekyll and finish QA pass"
```

- [ ] **Step 5: Guide the user through GitHub publish (manual, requires their `gh auth login`)**

Confirm the user has completed `gh auth login`. Then run, from the project root:

```bash
gh repo create claude-do-zero-ao-expert --public --source=. --remote=origin --push
```

Then tell the user: go to the new repo's **Settings → Pages**, set **Branch:
main**, **folder: / (root)**, save, and the site will be live at
`https://<seu-usuario>.github.io/claude-do-zero-ao-expert/` within a few minutes.

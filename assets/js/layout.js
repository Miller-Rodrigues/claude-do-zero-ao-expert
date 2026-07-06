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

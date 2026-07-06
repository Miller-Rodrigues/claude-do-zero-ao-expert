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

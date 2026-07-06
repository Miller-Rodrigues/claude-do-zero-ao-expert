import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildSidebar, findModuleById, findAdjacentModules, renderModule } from '../assets/js/course-viewer.js';

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

test('findAdjacentModules returns prev and next for a middle module', () => {
  const { prev, next } = findAdjacentModules(sample, 'modulo-2');
  assert.equal(prev.id, 'modulo-1');
  assert.equal(next.id, 'modulo-4');
});

test('findAdjacentModules returns undefined prev for the first module', () => {
  const { prev, next } = findAdjacentModules(sample, 'modulo-1');
  assert.equal(prev, undefined);
  assert.equal(next.id, 'modulo-2');
});

test('findAdjacentModules returns undefined next for the last module', () => {
  const { prev, next } = findAdjacentModules(sample, 'modulo-4');
  assert.equal(prev.id, 'modulo-2');
  assert.equal(next, undefined);
});

test('renderModule on an em-breve module shows the coming-soon message and no videos section', () => {
  const html = renderModule(sample[2]);
  assert.match(html, /Conteúdo completo chega/);
  assert.doesNotMatch(html, /module__videos/);
});

test('renderModule on a completo module renders steps, use cases, and video thumbnail', () => {
  const fixture = {
    id: 'modulo-x',
    title: 'Módulo completo',
    block: 'Fundamentos',
    status: 'completo',
    level: 'Iniciante',
    objective: 'Aprender o essencial',
    steps: ['Passo 1'],
    useCases: ['Caso 1'],
    recommendations: ['Recomendação 1'],
    videos: [{ url: 'https://youtube.com/watch?v=abc123', youtubeId: 'abc123', title: 'Vídeo 1', channel: 'Canal', publishedApprox: '2024', viewsApprox: '1k views' }],
    links: [{ url: 'https://example.com', label: 'Referência' }],
  };
  const html = renderModule(fixture);
  assert.match(html, /Passo a passo/);
  assert.match(html, /Casos de uso/);
  assert.match(html, /Passo 1/);
  assert.match(html, /Caso 1/);
  assert.match(html, /https:\/\/img\.youtube\.com\/vi\/abc123\/hqdefault\.jpg/);
});

test('renderModule renders prev/next nav links when both are provided, and no nav when omitted', () => {
  const withNav = renderModule(sample[1], { prev: sample[0], next: sample[2] });
  assert.match(withNav, /module-nav/);
  assert.match(withNav, /href="#modulo-1"/);
  assert.match(withNav, /Primeiros passos/);
  assert.match(withNav, /href="#modulo-4"/);
  assert.match(withNav, /Tópico avançado/);

  const withoutNav = renderModule(sample[1], {});
  assert.doesNotMatch(withoutNav, /module-nav/);
});

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

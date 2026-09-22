import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { portfolio as p } from '../src/data.js';

test('every public project and certificate has a configured HTTPS destination', () => {
  assert.equal(new Set(p.projects.map(item => item.id)).size, p.projects.length);
  for (const url of [...Object.values(p.links), ...p.projects.map(v => v.link), ...p.certificates.map(v => v.url)].filter(Boolean)) {
    assert.equal(new URL(url).protocol, 'https:');
    assert.ok(!url.includes('example.com'));
  }
  assert.ok(existsSync(`public${p.resume}`));
});
test('production HTML contains readable content, metadata and every internal anchor', () => {
  const html = readFileSync('dist/index.html', 'utf8');
  assert.ok(html.includes('name="description"'));
  assert.ok(html.includes('application/ld+json'));
  assert.ok(html.includes(p.name));
  for (const project of p.projects) assert.ok(html.includes(project.title));
  for (const match of html.matchAll(/href="#([^"]+)"/g)) assert.ok(html.includes(`id="${match[1]}"`), `Missing anchor: ${match[1]}`);
  assert.ok(!html.includes('<canvas'), '3D should not block static HTML');
  assert.ok(!html.includes('example.com'));
});

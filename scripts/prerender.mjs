import { build } from 'vite';
import { readFile, writeFile, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { portfolio as p } from '../src/data.js';

// Render the same React tree used by the browser. This is build-time rendering,
// so Vercel needs only static hosting: no server, account tokens or API keys.
const tempDir = resolve('.prerender');
try {
  await build({
    logLevel: 'warn',
    build: { ssr: 'src/render.jsx', outDir: tempDir, emptyOutDir: true, rollupOptions: { output: { entryFileNames: 'render.mjs' } } },
  });
  const { render } = await import(pathToFileURL(resolve(tempDir, 'render.mjs')).href);
  const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  const title = `${p.name} — Developer & AI/ML Student`;
  const url = p.siteUrl ? new URL(p.siteUrl).origin : '';
  const schema = {
    '@context': 'https://schema.org', '@type': 'Person',
    name: p.name, description: p.summary,
    sameAs: Object.values(p.links), ...(url ? { url } : {}),
    alumniOf: { '@type': 'CollegeOrUniversity', name: 'KGISL Institute of Technology' },
    knowsAbout: p.skills.flatMap(s => s.items),
  };
  // The resume describes a current student; use affiliation, not alumni status.
  schema.affiliation = schema.alumniOf; delete schema.alumniOf;
  const metadata = [
    `<title>${escape(title)}</title>`,
    `<meta name="description" content="${escape(p.summary)}" />`,
    `<meta name="author" content="${escape(p.name)}" />`,
    '<meta name="robots" content="index,follow" />',
    `<meta property="og:title" content="${escape(title)}" />`,
    `<meta property="og:description" content="${escape(p.summary)}" />`,
    '<meta property="og:type" content="website" />',
    '<meta name="twitter:card" content="summary" />',
    `<meta name="twitter:title" content="${escape(title)}" />`,
    `<meta name="twitter:description" content="${escape(p.summary)}" />`,
    ...(url ? [`<link rel="canonical" href="${escape(url)}/" />`, `<meta property="og:url" content="${escape(url)}/" />`] : []),
    `<script type="application/ld+json">${JSON.stringify(schema).replaceAll('<', '\\u003c')}</script>`,
  ].join('\n    ');
  const html = await readFile('dist/index.html', 'utf8');
  await writeFile('dist/index.html', html.replace(/<title>.*?<\/title>/s, metadata).replace('<div id="root"></div>', `<div id="root">${render()}</div>`));
  await writeFile('dist/robots.txt', `User-agent: *\nAllow: /\n${url ? `Sitemap: ${url}/sitemap.xml\n` : ''}`);
  if (url) await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${escape(url)}/</loc></url></urlset>\n`);
  console.log('Pre-rendered portfolio HTML, metadata and robots.txt.');
  if (!url) console.log('Set portfolio.siteUrl in src/data.js to enable a canonical URL and sitemap.');
} finally { await rm(tempDir, { recursive: true, force: true }); }

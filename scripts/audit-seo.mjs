// Read-only SEO consistency audit (P4). Exits non-zero on failures.
//
// Checks:
//   1. every sitemap URL maps to an existing file
//   2. en/ja content pages: canonical present and self-referencing
//   3. ja/en type pages: hreflang triplet (ja + en + x-default)
//   4. no self-loop CTAs remain anywhere
//   5. minor-lang stubs are noindex
//
// Usage: node scripts/audit-seo.mjs

import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(import.meta.url), '..', '..');
const SITE = 'https://profilecode.codes';
const errors = [];

// --- 1. sitemap URLs resolve to files ---------------------------------------
const sitemap = readFileSync(join(ROOT, 'sitemap.xml'), 'utf8');
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
for (const loc of locs) {
  const path = loc.replace(SITE, '').replace(/^\//, '');
  const candidates = path === '' ? ['index.html']
    : path.endsWith('/') ? [path + 'index.html']
    : [path, path + '/index.html', path + '.html'];
  if (!candidates.some((c) => existsSync(join(ROOT, c)))) {
    errors.push(`sitemap URL has no file: ${loc}`);
  }
}

// --- helpers ------------------------------------------------------------------
function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === '.git' || name === 'node_modules' || name === 'scripts') continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (name.endsWith('.html')) out.push(full);
  }
  return out;
}
const relPath = (f) => relative(ROOT, f).replace(/\\/g, '/');

// --- 2 & 3. content page canonical / hreflang ----------------------------------
for (const lang of ['en', 'ja']) {
  for (const file of walk(join(ROOT, lang))) {
    const rel = relPath(file);
    const src = readFileSync(file, 'utf8');
    const expected = `${SITE}/${rel.replace(/index\.html$/, '')}`;
    const canonical = (src.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
    if (!canonical) errors.push(`missing canonical: ${rel}`);
    else if (canonical !== expected) errors.push(`canonical mismatch: ${rel} → ${canonical} (expected ${expected})`);
    for (const hl of ['ja', 'en', 'x-default']) {
      if (!src.includes(`hreflang="${hl}"`)) errors.push(`missing hreflang ${hl}: ${rel}`);
    }
  }
}

// --- 4 & 5. stubs: no self-loop CTA, noindex present ----------------------------
const MINOR = ['ar', 'de', 'es', 'fr', 'hi', 'id', 'it', 'ko', 'pt', 'zh', 'zh_hant'];
for (const lang of MINOR) {
  for (const file of walk(join(ROOT, lang))) {
    const rel = relPath(file);
    if (rel === `${lang}/index.html`) continue;
    const src = readFileSync(file, 'utf8');
    const cta = (src.match(/class="cta" href="([^"]+)"/) || [])[1];
    if (cta && cta.includes(`/${lang}/`)) errors.push(`self-loop CTA: ${rel}`);
    if (!/name="robots" content="noindex/.test(src)) errors.push(`stub not noindex: ${rel}`);
    if (!src.includes(`/test.html?lang=${lang}`)) errors.push(`stub missing test link: ${rel}`);
  }
}

if (errors.length) {
  console.error(`audit-seo: ${errors.length} problem(s)`);
  for (const e of errors.slice(0, 40)) console.error('  - ' + e);
  if (errors.length > 40) console.error(`  ... and ${errors.length - 40} more`);
  process.exit(1);
}
console.log(`audit-seo: OK (${locs.length} sitemap URLs, en+ja pages, ${MINOR.length} stub languages)`);

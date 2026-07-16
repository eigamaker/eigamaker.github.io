// Site-wide <head> normalizer.
//
// Inserts (or replaces) a single marker block right before </head> on every
// HTML page, according to its class from page-classifier.mjs:
//   full      → favicon set + theme-color + shared CSS + og:image + analytics.js
//   stub      → favicon set + theme-color
//   sensitive → favicon set + theme-color (scripts untouched)
//   redirect  → skipped
//
// Idempotent: re-running replaces the existing block, so the second run is a
// zero diff. Legacy inline gtag snippets are removed from pages that get
// analytics.js.
//
// Usage:  node scripts/inject-head.mjs [--dry]

import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { classifyPage } from './lib/page-classifier.mjs';
import { TYPES } from './characters/type-meta.mjs';

const ROOT = join(fileURLToPath(import.meta.url), '..', '..');
const DRY = process.argv.includes('--dry');
const SITE = 'https://profilecode.codes';

const BLOCK_START = '<!-- pc:head v1 -->';
const BLOCK_END = '<!-- /pc:head -->';

// Per-page og:image overrides (repo-relative path → image path), derived from
// the character type metadata. Everything else gets the default OG image.
const OG_OVERRIDES = new Map();
for (const { id } of TYPES) {
  const [system, key] = [id.slice(0, id.indexOf('-')), id.slice(id.indexOf('-') + 1)];
  if (system === 'mbti') {
    OG_OVERRIDES.set(`en/mbti/${key}/index.html`, `/assets/img/og/${id}.png`);
    OG_OVERRIDES.set(`ja/mbti/${key}/index.html`, `/assets/img/og/${id}.png`);
  } else if (system === 'enneagram') {
    OG_OVERRIDES.set(`en/enneagram/${key}/index.html`, `/assets/img/og/${id}.png`);
    OG_OVERRIDES.set(`ja/enneagram/${key}/index.html`, `/assets/img/og/${id}.png`);
  }
  // career-* images are consumed by the test result / compatibility pages.
}

const LEGACY_GTAG_RE =
  /(?:[ \t]*<!--\s*Google tag \(gtag\.js\)\s*-->\s*\r?\n)?[ \t]*<script async src="https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=G-8RSCZGH62Y"><\/script>\s*\r?\n[ \t]*<script>[\s\S]*?gtag\('config',\s*'G-8RSCZGH62Y'\);?\s*\r?\n?[ \t]*<\/script>\r?\n?/g;

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === '.git' || name === 'node_modules' || name === 'scripts') continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (name.endsWith('.html')) out.push(full);
  }
  return out;
}

function faviconLines() {
  return [
    '<link rel="icon" href="/favicon.ico" sizes="32x32">',
    '<link rel="icon" type="image/svg+xml" href="/favicon.svg">',
    '<link rel="apple-touch-icon" href="/apple-touch-icon.png">',
    '<meta name="theme-color" content="#667eea">',
  ];
}

function buildBlock(cls, relPath, hasTwitterCard) {
  const lines = faviconLines();
  if (cls === 'full') {
    const og = OG_OVERRIDES.get(relPath) || '/assets/img/og/og-default.png';
    lines.push(
      '<link rel="stylesheet" href="/assets/css/tokens.css">',
      '<link rel="stylesheet" href="/assets/css/site.css">',
      `<meta property="og:image" content="${SITE}${og}">`,
      '<meta property="og:image:width" content="1200">',
      '<meta property="og:image:height" content="630">',
    );
    if (!hasTwitterCard) {
      lines.push('<meta name="twitter:card" content="summary_large_image">');
    }
    lines.push(
      `<meta name="twitter:image" content="${SITE}${og}">`,
      '<script src="/assets/js/analytics.js"></script>',
    );
  }
  return lines;
}

const counts = { full: 0, stub: 0, sensitive: 0, redirect: 0, unknown: 0, changed: 0, noHead: 0 };
const unknowns = [];

for (const file of walk(ROOT)) {
  const relPath = relative(ROOT, file).replace(/\\/g, '/');
  const original = readFileSync(file, 'utf8');
  const { cls } = classifyPage(relPath, original);
  counts[cls]++;

  if (cls === 'redirect') continue;
  if (cls === 'unknown') {
    unknowns.push(relPath);
    continue;
  }

  let content = original;

  // Strip any pre-existing marker block (idempotency), then legacy gtag.
  const blockRe = new RegExp(
    `[ \\t]*${BLOCK_START.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s\\S]*?${BLOCK_END.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\r?\\n?`,
  );
  content = content.replace(blockRe, '');
  if (cls === 'full') content = content.replace(LEGACY_GTAG_RE, '');

  const headClose = content.search(/<\/head>/i);
  if (headClose === -1) {
    counts.noHead++;
    console.warn(`SKIP (no </head>): ${relPath}`);
    continue;
  }

  const eol = content.includes('\r\n') ? '\r\n' : '\n';
  // twitter:card check runs against the page WITHOUT our block (just stripped).
  const hasTwitterCard = /name="twitter:card"/.test(content);
  const lines = buildBlock(cls, relPath, hasTwitterCard);
  // Match the indentation style of the closing tag's line (2 spaces default).
  const indent = '  ';
  const block =
    indent + BLOCK_START + eol +
    lines.map((l) => indent + l).join(eol) + eol +
    indent + BLOCK_END + eol;

  const updated = content.slice(0, headClose) + block + content.slice(headClose);

  if (updated !== original) {
    counts.changed++;
    if (!DRY) writeFileSync(file, updated);
  }
}

console.log(`${DRY ? '[dry-run] ' : ''}inject-head summary:`);
console.log(`  full=${counts.full} stub=${counts.stub} sensitive=${counts.sensitive} redirect(skipped)=${counts.redirect} unknown(skipped)=${counts.unknown}`);
console.log(`  files changed: ${counts.changed}, missing </head>: ${counts.noHead}`);
if (unknowns.length) {
  console.log('  unknown pages:');
  for (const u of unknowns) console.log(`    - ${u}`);
}

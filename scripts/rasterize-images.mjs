// One-off raster asset generator (outputs are committed).
//
// Produces from favicon.svg / embedded templates:
//   favicon.ico                        (16+32+48 multi-size)
//   apple-touch-icon.png               (180×180, root)
//   assets/img/favicon/favicon-192.png
//   assets/img/favicon/favicon-512.png
//   assets/img/og/og-default.png       (1200×630)
//
// Phase 2 extends this with per-type character OG images.
//
// Rasterizer: @resvg/resvg-js (prebuilt binaries, reliable text rendering via
// system fonts). ICO packing: png-to-ico.
//
// Usage: npm i -D @resvg/resvg-js png-to-ico && node scripts/rasterize-images.mjs

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';
import pngToIco from 'png-to-ico';

const ROOT = join(fileURLToPath(import.meta.url), '..', '..');

const GRAD_A = '#667eea';
const GRAD_B = '#764ba2';

// Same geometric "P" as favicon.svg / assets/img/brand/logo.svg — keep in sync.
const P_MARK = `
  <g fill="#fff">
    <rect x="172" y="128" width="64" height="256" rx="30"/>
    <path fill-rule="evenodd" d="M200 128 L256 128 A84 84 0 0 1 256 296 L200 296 Z M236 184 L256 184 A28 28 0 0 1 256 240 L236 240 Z"/>
  </g>`;

function render(svg, width) {
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: width },
    font: { loadSystemFonts: true },
  });
  return resvg.render().asPng();
}

function write(relPath, buf) {
  const full = join(ROOT, relPath);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, buf);
  console.log(`wrote ${relPath} (${buf.length} bytes)`);
}

// --- favicon set ------------------------------------------------------------
const faviconSvg = readFileSync(join(ROOT, 'favicon.svg'), 'utf8');

write('assets/img/favicon/favicon-192.png', render(faviconSvg, 192));
write('assets/img/favicon/favicon-512.png', render(faviconSvg, 512));
write('apple-touch-icon.png', render(faviconSvg, 180));

const icoBuf = await pngToIco([
  render(faviconSvg, 16),
  render(faviconSvg, 32),
  render(faviconSvg, 48),
]);
write('favicon.ico', icoBuf);

// --- default OG image (1200×630) ---------------------------------------------
const ogDefaultSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${GRAD_A}"/>
      <stop offset="1" stop-color="${GRAD_B}"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <!-- subtle decorative circles -->
  <circle cx="1050" cy="90" r="180" fill="#fff" opacity="0.06"/>
  <circle cx="120" cy="560" r="220" fill="#fff" opacity="0.05"/>
  <!-- brand mark (P tile) -->
  <g transform="translate(120,175) scale(0.55)">
    <rect width="512" height="512" rx="112" fill="#fff" opacity="0.14"/>
    ${P_MARK}
  </g>
  <text x="460" y="310" font-family="Segoe UI, Arial, sans-serif" font-size="88" font-weight="700" fill="#fff">Profilecode</text>
  <text x="464" y="390" font-family="Segoe UI, Arial, sans-serif" font-size="38" font-weight="400" fill="#fff" opacity="0.9">Free Personality &amp; Compatibility Test</text>
</svg>`;

write('assets/img/og/og-default.png', render(ogDefaultSvg, 1200));

console.log('done.');

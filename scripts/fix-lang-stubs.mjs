// Repairs the 11 minor-language placeholder trees (P4):
//   stubs ({lang}/mbti/**, {lang}/enneagram/**, {lang}/16-personality-test/*):
//     1. self-loop CTA (「英語版へ」linking to itself) → the real /en/ page
//     2. add missing <meta name="robots" content="noindex,follow">
//     3. add a working test link (/test.html?lang={lang}) to the nav links
//   language homes ({lang}/index.html):
//     4. self-loop "English (default)" footer link → /en/
//     5. add a prominent free-test CTA button under the header
//
// Idempotent: every transform checks for its own marker/state first.
//
// Usage: node scripts/fix-lang-stubs.mjs

import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(import.meta.url), '..', '..');
const LANGS = ['ar', 'de', 'es', 'fr', 'hi', 'id', 'it', 'ko', 'pt', 'zh', 'zh_hant'];

const TEST_LABEL = {
  ar: 'ابدأ الاختبار المجاني',
  de: 'Kostenlosen Test starten',
  es: 'Hacer el test gratis',
  fr: 'Faire le test gratuit',
  hi: 'मुफ़्त टेस्ट शुरू करें',
  id: 'Mulai tes gratis',
  it: 'Fai il test gratuito',
  ko: '무료 테스트 시작하기',
  pt: 'Fazer o teste grátis',
  zh: '开始免费测试',
  zh_hant: '開始免費測試',
};

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (name.endsWith('.html')) out.push(full);
  }
  return out;
}

let stubsFixed = 0;
let homesFixed = 0;

for (const lang of LANGS) {
  const langDir = join(ROOT, lang);
  for (const file of walk(langDir)) {
    const rel = relative(ROOT, file).replace(/\\/g, '/');
    const isHome = rel === `${lang}/index.html`;
    let src = readFileSync(file, 'utf8');
    const before = src;

    if (isHome) {
      // 4. footer self-loop → /en/
      src = src.replace(
        new RegExp(`href="https://profilecode\\.codes/${lang}/"([^>]*)>English \\(default\\)`),
        'href="https://profilecode.codes/en/"$1>English (default)',
      );
      // 5. test CTA under the header (marker: pc-test-cta)
      if (!src.includes('pc-test-cta')) {
        src = src.replace(
          /(<div class="lang">[^<]*<\/div>)/,
          `$1\n    <p class="pc-test-cta" style="margin-top:16px;"><a href="/test.html?lang=${lang}" style="display:inline-block;padding:12px 26px;border-radius:10px;background:#fff;color:#667eea;font-weight:700;text-decoration:none;">${TEST_LABEL[lang]}</a></p>`,
        );
      }
    } else {
      // 1. self-loop CTA → the /en/ equivalent of this page's own path
      const enUrl = `https://profilecode.codes/en/${rel.slice(lang.length + 1).replace(/index\.html$/, '')}`;
      src = src.replace(
        new RegExp(`(class="cta" href=")https://profilecode\\.codes/${lang}/[^"]*(")`),
        `$1${enUrl}$2`,
      );
      // 2. ensure noindex (these are thin placeholder pages)
      if (!/name="robots"/.test(src)) {
        src = src.replace(
          /(<link rel="canonical"[^>]*>)/,
          '$1\n  <meta name="robots" content="noindex,follow">',
        );
      }
      // 3. working test link first in the nav links
      if (!src.includes(`/test.html?lang=${lang}`)) {
        src = src.replace(
          /(<div class="links">)/,
          `$1\n      <a href="/test.html?lang=${lang}"><strong>${TEST_LABEL[lang]}</strong></a>`,
        );
      }
    }

    if (src !== before) {
      writeFileSync(file, src);
      isHome ? homesFixed++ : stubsFixed++;
    }
  }
}

console.log(`fix-lang-stubs: ${stubsFixed} stubs fixed, ${homesFixed} homes fixed`);

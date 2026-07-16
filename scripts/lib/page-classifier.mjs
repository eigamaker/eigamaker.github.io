// Shared page classification for site-wide maintenance scripts.
// Classes drive what scripts/inject-head.mjs (and later generators) do per page:
//   full      — favicon + theme-color + CSS links + og:image + analytics
//   stub      — favicon + theme-color only (noindex placeholder trees)
//   sensitive — favicon + theme-color only; scripts must never be touched
//   redirect  — instant meta-refresh page: skip entirely
//   unknown   — not matched; scripts must log and skip

export const LANGS = [
  'ar', 'de', 'en', 'es', 'fr', 'hi', 'id', 'it', 'ja', 'ko', 'pt', 'zh', 'zh_hant',
];

const MINOR_LANGS = LANGS.filter((l) => l !== 'en');

/**
 * @param {string} relPath repo-relative path with forward slashes, e.g. "en/mbti/intj/index.html"
 * @param {string} content file content (used only for the meta-refresh heuristic)
 * @returns {{cls: 'full'|'stub'|'sensitive'|'redirect'|'unknown'}}
 */
export function classifyPage(relPath, content) {
  const p = relPath.replace(/\\/g, '/');

  // Instant redirects (root index.html, it.html/ko.html, root mbti|enneagram|
  // 16-personality-test trees, ...) — adding anything to them is noise.
  if (/http-equiv="refresh"/i.test(content)) return { cls: 'redirect' };

  // OAuth callback: functional page, scripts must stay byte-identical.
  if (p === 'auth/callback.html') return { cls: 'sensitive' };

  // Language trees.
  const langMatch = p.match(/^([a-z_]+)\//);
  if (langMatch && LANGS.includes(langMatch[1])) {
    const lang = langMatch[1];
    if (lang === 'en') return { cls: 'full' };
    if (p === `${lang}/index.html`) return { cls: 'full' }; // localized landing
    return { cls: 'stub' }; // placeholder type pages
  }

  // Legal trees (per-language but real, shareable documents).
  if (p.startsWith('eula/') || p.startsWith('privacy-policy/')) return { cls: 'full' };

  // Root-level real pages.
  const ROOT_FULL = new Set([
    'test.html',
    '404.html',
    'contact.html',
    'inquiry-form.html',
    'privacy-policy.html',
    'eula.html',
  ]);
  if (ROOT_FULL.has(p)) return { cls: 'full' };

  return { cls: 'unknown' };
}

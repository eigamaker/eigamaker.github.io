// Generates the 29 Japanese content pages (P4):
//   ja/mbti/{16 types}/index.html      — from four-indicator-calculator.js ja
//                                        content (kept in sync with test
//                                        results by construction) + subtitles
//   ja/enneagram/{1-9}/index.html      — from scripts/content/ja/enneagram.mjs
//   ja/mbti/index.html, ja/mbti/types/index.html, ja/enneagram/index.html,
//   ja/16-personality-test/index.html  — index/landing pages
//
// Pages are emitted WITHOUT the pc:head block — run scripts/inject-head.mjs
// afterwards to add favicon/CSS/OG/analytics (ja pages classify as `full`).
//
// Usage: node scripts/generate-type-pages.mjs && node scripts/inject-head.mjs

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { TYPES } from './characters/type-meta.mjs';
import { ENNEAGRAM_JA } from './content/ja/enneagram.mjs';

const ROOT = join(fileURLToPath(import.meta.url), '..', '..');
const SITE = 'https://profilecode.codes';

// --- extract the ja MBTI content maps from the calculator (single source) ----
function extractMap(src, varName) {
  const start = src.indexOf(`let ${varName} = {`);
  if (start === -1) throw new Error(`map not found: ${varName}`);
  const braceStart = src.indexOf('{', start);
  let depth = 0;
  for (let i = braceStart; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') {
      depth--;
      if (depth === 0) {
        const objText = src.slice(braceStart, i + 1);
        return new Function(`return (${objText})`)();
      }
    }
  }
  throw new Error(`unterminated map: ${varName}`);
}

const calcSrc = readFileSync(join(ROOT, 'js', 'calculators', 'four-indicator-calculator.js'), 'utf8');
const MBTI = {
  names: extractMap(calcSrc, 'typeNames'),
  descriptions: extractMap(calcSrc, 'typeDescriptions'),
  strengths: extractMap(calcSrc, 'typeStrengths'),
  growthTips: extractMap(calcSrc, 'typeGrowthTips'),
  careerAdvice: extractMap(calcSrc, 'typeCareerAdvice'),
  relationships: extractMap(calcSrc, 'typeRelationships'),
};

const MBTI_SUBTITLES = {
  INTJ: '戦略と独立の建築家', INTP: '知を探求する論理学者',
  ENTJ: '決断力ある指揮官', ENTP: '発想豊かな討論者',
  INFJ: '静かな情熱の提唱者', INFP: '理想を描く仲介者',
  ENFJ: '人を導く主人公', ENFP: '自由な魂の運動家',
  ISTJ: '誠実な管理者', ISFJ: '献身的な擁護者',
  ESTJ: '実務を極める幹部', ESFJ: '思いやりの領事',
  ISTP: '手を動かす巨匠', ISFP: '感性豊かな冒険家',
  ESTP: '行動派の起業家', ESFP: '場を照らすエンターテイナー',
};

const MBTI_ORDER = ['intj','intp','entj','entp','infj','infp','enfj','enfp','istj','isfj','estj','esfj','istp','isfp','estp','esfp'];
const GROUPS = [
  { name: '分析家タイプ', keys: ['intj','intp','entj','entp'] },
  { name: '外交官タイプ', keys: ['infj','infp','enfj','enfp'] },
  { name: '番人タイプ',   keys: ['istj','isfj','estj','esfj'] },
  { name: '探検家タイプ', keys: ['istp','isfp','estp','esfp'] },
];

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const jsonEsc = (s) => JSON.stringify(String(s));

function head({ title, description, path, enPath, faqLd, breadcrumbLd }) {
  return `<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <link rel="canonical" href="${SITE}${path}">
  <meta name="robots" content="index,follow">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${SITE}${path}">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <!-- hreflang -->
  <link rel="alternate" hreflang="ja" href="${SITE}${path}" />
  <link rel="alternate" hreflang="en" href="${SITE}${enPath}" />
  <link rel="alternate" hreflang="x-default" href="${SITE}${enPath}" />
  <link rel="stylesheet" href="/assets/css/type-palettes.css">
  <link rel="stylesheet" href="/assets/css/type-page.css">
${breadcrumbLd ? `  <script type="application/ld+json">${breadcrumbLd}</script>\n` : ''}${faqLd ? `  <script type="application/ld+json">${faqLd}</script>\n` : ''}</head>`;
}

function breadcrumbLd(items) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map(([name, url], i) => ({
      '@type': 'ListItem', position: i + 1, name, item: `${SITE}${url}`,
    })),
  });
}

function faqLd(faqs) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(([q, a]) => ({
      '@type': 'Question', name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  });
}

function ctaBlock() {
  return `
      <div class="tp-cta">
        <h2>無料で性格診断を受ける</h2>
        <p>40問・約5分。Profilecode独自診断とMBTI・16PF・DISCの4理論であなたを分析します。</p>
        <a class="pc-btn pc-btn--primary" href="/test.html?lang=ja">診断をはじめる(無料)</a>
      </div>`;
}

function footer() {
  return `
  <div class="tp-footer">
    <a href="/ja/">ホーム</a>
    <a href="/ja/mbti/">MBTI</a>
    <a href="/ja/enneagram/">エニアグラム</a>
    <a href="/privacy-policy/ja.html">プライバシーポリシー</a>
    <a href="/eula/ja.html">利用規約</a>
  </div>
</body>
</html>
`;
}

function breadcrumbNav(items) {
  return `
  <nav class="tp-breadcrumb">${items.map(([name, url], i) =>
    i === items.length - 1 ? esc(name) : `<a href="${url}">${esc(name)}</a>`
  ).join(' &rsaquo; ')}</nav>`;
}

function write(rel, html) {
  const full = join(ROOT, rel);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, html);
  console.log(`wrote ${rel}`);
}

// --- MBTI type pages -----------------------------------------------------------
for (const key of MBTI_ORDER) {
  const code = key.toUpperCase();
  const name = MBTI.names[code];
  const subtitle = MBTI_SUBTITLES[code];
  const desc = MBTI.descriptions[code];
  const strengths = MBTI.strengths[code].split('、');
  const growth = MBTI.growthTips[code];
  const career = MBTI.careerAdvice[code];
  const rel = MBTI.relationships[code];
  const path = `/ja/mbti/${key}/`;
  const enPath = `/en/mbti/${key}/`;
  const title = `${code}(${name})の特徴・強み・適職・相性 | Profilecode`;
  const description = `${code}(${name})の性格特徴を解説。強み・成長のヒント・向いている仕事・人間関係での活かし方まで。無料の性格診断で自分のタイプを確かめられます。`;

  const faqs = [
    [`${code}に向いている仕事は?`, career],
    [`${code}の強みは?`, `${code}の主な強みは、${MBTI.strengths[code]}です。`],
    [`${code}の恋愛・人間関係の特徴は?`, rel],
  ];
  const crumbs = [['ホーム', '/ja/'], ['MBTI', '/ja/mbti/'], [code, path]];

  const html = `${head({ title, description, path, enPath, faqLd: faqLd(faqs), breadcrumbLd: breadcrumbLd(crumbs) })}
<body class="t-mbti-${key}">
  <header class="tp-hero">
    <img class="tp-hero-avatar" src="/assets/img/characters/mbti-${key}.svg" alt="${code}のキャラクター" width="140" height="140">
    <h1>${code} — ${esc(name)}</h1>
    <p class="tp-subtitle">${esc(subtitle)}</p>
  </header>
${breadcrumbNav(crumbs)}
  <div class="tp-container">
    <div class="tp-content">
      <div class="section">
        <h2>${code}の概要</h2>
        <p>${esc(desc)}</p>
      </div>
      <div class="section">
        <h2>${code}の強み</h2>
        <ul>
          ${strengths.map((s) => `<li><strong>${esc(s)}</strong></li>`).join('\n          ')}
        </ul>
      </div>
      <div class="section">
        <h2>${code}の人間関係</h2>
        <p>${esc(rel)}</p>
      </div>
      <div class="section">
        <h2>${code}に向いている仕事</h2>
        <p>${esc(career)}</p>
      </div>
      <div class="section">
        <h2>${code}の成長のヒント</h2>
        <p>${esc(growth)}</p>
      </div>
      <div class="section">
        <h2>よくある質問</h2>
        ${faqs.map(([q, a]) => `<div class="tp-faq-item"><h3>${esc(q)}</h3><p>${esc(a)}</p></div>`).join('\n        ')}
      </div>
${ctaBlock()}
      <div class="tp-links">
        <a href="/ja/mbti/">MBTIについて</a>
        <a href="/ja/mbti/types/">16タイプ一覧</a>
        <a href="/ja/16-personality-test/">診断テストを受ける</a>
      </div>
    </div>
  </div>
${footer()}`;
  write(`ja/mbti/${key}/index.html`, html);
}

// --- Enneagram type pages --------------------------------------------------------
for (let n = 1; n <= 9; n++) {
  const c = ENNEAGRAM_JA[n];
  const path = `/ja/enneagram/${n}/`;
  const enPath = `/en/enneagram/${n}/`;
  const title = `エニアグラム タイプ${n}(${c.name})の特徴・強み・成長 | Profilecode`;
  const description = `エニアグラム タイプ${n}「${c.name}」を解説。根源的な欲求と恐れ、強み、課題、成長のヒント、人間関係の特徴まで。無料の性格診断つき。`;
  const crumbs = [['ホーム', '/ja/'], ['エニアグラム', '/ja/enneagram/'], [`タイプ${n}`, path]];

  const html = `${head({ title, description, path, enPath, faqLd: faqLd(c.faq), breadcrumbLd: breadcrumbLd(crumbs) })}
<body class="t-enneagram-${n}">
  <header class="tp-hero">
    <img class="tp-hero-avatar" src="/assets/img/characters/enneagram-${n}.svg" alt="タイプ${n}のキャラクター" width="140" height="140">
    <h1>タイプ${n} — ${esc(c.name)}</h1>
    <p class="tp-subtitle">${esc(c.subtitle)}</p>
  </header>
${breadcrumbNav(crumbs)}
  <div class="tp-container">
    <div class="tp-content">
      <div class="section">
        <h2>タイプ${n}の概要</h2>
        ${c.overview.map((p) => `<p>${esc(p)}</p>`).join('\n        ')}
        <ul>
          <li><strong>根源的な欲求:</strong> ${esc(c.coreDesire)}</li>
          <li><strong>根源的な恐れ:</strong> ${esc(c.coreFear)}</li>
        </ul>
      </div>
      <div class="section">
        <h2>タイプ${n}の強み</h2>
        <ul>
          ${c.strengths.map(([l, d]) => `<li><strong>${esc(l)}:</strong> ${esc(d)}</li>`).join('\n          ')}
        </ul>
      </div>
      <div class="section">
        <h2>タイプ${n}の課題</h2>
        <ul>
          ${c.weaknesses.map(([l, d]) => `<li><strong>${esc(l)}:</strong> ${esc(d)}</li>`).join('\n          ')}
        </ul>
      </div>
      <div class="section">
        <h2>成長のヒント</h2>
        <ul>
          ${c.growth.map((g) => `<li>${esc(g)}</li>`).join('\n          ')}
        </ul>
      </div>
      <div class="section">
        <h2>人間関係の特徴</h2>
        <p>${esc(c.relationships)}</p>
      </div>
      <div class="section">
        <h2>よくある質問</h2>
        ${c.faq.map(([q, a]) => `<div class="tp-faq-item"><h3>${esc(q)}</h3><p>${esc(a)}</p></div>`).join('\n        ')}
      </div>
${ctaBlock()}
      <div class="tp-links">
        <a href="/ja/enneagram/">エニアグラムについて</a>
        <a href="/ja/16-personality-test/">診断テストを受ける</a>
      </div>
    </div>
  </div>
${footer()}`;
  write(`ja/enneagram/${n}/index.html`, html);
}

// --- grid helpers ----------------------------------------------------------------
function mbtiGrid() {
  return GROUPS.map((g) => `
      <h2>${g.name}</h2>
      <div class="tp-grid">
        ${g.keys.map((k) => {
          const code = k.toUpperCase();
          return `<a class="tp-grid-card t-mbti-${k}" href="/ja/mbti/${k}/">
          <img src="/assets/img/characters/mbti-${k}.svg" alt="" width="96" height="96" loading="lazy">
          <span class="tp-grid-code">${code}</span>
          <span class="tp-grid-name">${esc(MBTI.names[code])}</span>
        </a>`;
        }).join('\n        ')}
      </div>`).join('\n');
}

function enneagramGrid() {
  let cards = '';
  for (let n = 1; n <= 9; n++) {
    cards += `<a class="tp-grid-card t-enneagram-${n}" href="/ja/enneagram/${n}/">
          <img src="/assets/img/characters/enneagram-${n}.svg" alt="" width="96" height="96" loading="lazy">
          <span class="tp-grid-code">タイプ${n}</span>
          <span class="tp-grid-name">${esc(ENNEAGRAM_JA[n].name)}</span>
        </a>\n        `;
  }
  return `<div class="tp-grid">\n        ${cards}</div>`;
}

// --- ja/mbti/index.html ------------------------------------------------------------
{
  const path = '/ja/mbti/';
  const crumbs = [['ホーム', '/ja/'], ['MBTI', path]];
  const html = `${head({
    title: 'MBTI 16タイプ性格診断とは? 全タイプ解説 | Profilecode',
    description: 'MBTIの4指標(E/I・S/N・T/F・J/P)と16タイプをキャラクターつきで解説。あなたのタイプが分かる無料の性格診断も受けられます。',
    path, enPath: '/en/mbti/', breadcrumbLd: breadcrumbLd(crumbs),
  })}
<body>
  <header class="tp-hero">
    <h1>MBTI 16タイプ性格診断</h1>
    <p class="tp-subtitle">4つの指標の組み合わせで、あなたの思考と行動のパターンを読み解く</p>
  </header>
${breadcrumbNav(crumbs)}
  <div class="tp-container">
    <div class="tp-content">
      <div class="section">
        <h2>MBTIとは</h2>
        <p>MBTIは、ものの見方(感覚S/直観N)・判断の仕方(思考T/感情F)・関心の方向(外向E/内向I)・外界への接し方(判断的態度J/知覚的態度P)という4つの指標の組み合わせから、性格を16タイプに分類するフレームワークです。</p>
        <p>タイプに優劣はありません。自分の自然な傾向を知ることで、強みの活かし方、エネルギーの回復方法、他者との違いへの理解が深まります。</p>
      </div>
${mbtiGrid()}
${ctaBlock()}
      <div class="tp-links">
        <a href="/ja/mbti/types/">16タイプ一覧</a>
        <a href="/ja/enneagram/">エニアグラム</a>
      </div>
    </div>
  </div>
${footer()}`;
  write('ja/mbti/index.html', html);
}

// --- ja/mbti/types/index.html --------------------------------------------------------
{
  const path = '/ja/mbti/types/';
  const crumbs = [['ホーム', '/ja/'], ['MBTI', '/ja/mbti/'], ['16タイプ一覧', path]];
  const html = `${head({
    title: 'MBTI 16タイプ一覧 — 各タイプの特徴まとめ | Profilecode',
    description: 'MBTI全16タイプの一覧。分析家・外交官・番人・探検家の4グループごとに、各タイプの特徴ページへアクセスできます。',
    path, enPath: '/en/mbti/types/', breadcrumbLd: breadcrumbLd(crumbs),
  })}
<body>
  <header class="tp-hero">
    <h1>MBTI 16タイプ一覧</h1>
    <p class="tp-subtitle">気になるタイプを選んで、特徴・強み・適職をチェック</p>
  </header>
${breadcrumbNav(crumbs)}
  <div class="tp-container">
    <div class="tp-content">
${mbtiGrid()}
${ctaBlock()}
    </div>
  </div>
${footer()}`;
  write('ja/mbti/types/index.html', html);
}

// --- ja/enneagram/index.html ----------------------------------------------------------
{
  const path = '/ja/enneagram/';
  const crumbs = [['ホーム', '/ja/'], ['エニアグラム', path]];
  const html = `${head({
    title: 'エニアグラム9タイプ診断とは? 全タイプ解説 | Profilecode',
    description: 'エニアグラムの9タイプをキャラクターつきで解説。それぞれの根源的な欲求・恐れ・成長の方向が分かります。無料の性格診断つき。',
    path, enPath: '/en/enneagram/', breadcrumbLd: breadcrumbLd(crumbs),
  })}
<body>
  <header class="tp-hero">
    <h1>エニアグラム 9タイプ</h1>
    <p class="tp-subtitle">行動の奥にある「動機」から性格を読み解く</p>
  </header>
${breadcrumbNav(crumbs)}
  <div class="tp-container">
    <div class="tp-content">
      <div class="section">
        <h2>エニアグラムとは</h2>
        <p>エニアグラムは、人の性格を「何に突き動かされているか」という根源的な欲求と恐れの観点から9つのタイプに分類する性格論です。行動そのものではなく動機に注目するため、自己理解と成長の道筋を示すツールとして世界中で使われています。</p>
      </div>
      ${enneagramGrid()}
${ctaBlock()}
      <div class="tp-links">
        <a href="/ja/mbti/">MBTI</a>
        <a href="/ja/16-personality-test/">診断テストを受ける</a>
      </div>
    </div>
  </div>
${footer()}`;
  write('ja/enneagram/index.html', html);
}

// --- ja/16-personality-test/index.html --------------------------------------------------
{
  const path = '/ja/16-personality-test/';
  const crumbs = [['ホーム', '/ja/'], ['性格診断テスト', path]];
  const html = `${head({
    title: '無料性格診断テスト(40問・約5分) | Profilecode',
    description: '40問に答えるだけで、Profilecode独自診断・MBTI・16PF・DISCの4つの理論からあなたの性格を分析。登録不要・無料で今すぐ受けられます。',
    path, enPath: '/en/16-personality-test/', breadcrumbLd: breadcrumbLd(crumbs),
  })}
<body>
  <header class="tp-hero">
    <h1>無料性格診断テスト</h1>
    <p class="tp-subtitle">40問・約5分。4つの理論であなたを多面的に分析</p>
  </header>
${breadcrumbNav(crumbs)}
  <div class="tp-container">
    <div class="tp-content">
      <div class="section">
        <h2>この診断で分かること</h2>
        <ul>
          <li><strong>Profilecode独自診断:</strong> キャリア適性(8タイプ)と学習スタイル(6タイプ)</li>
          <li><strong>MBTI:</strong> 4指標の組み合わせによる16タイプ</li>
          <li><strong>16PF:</strong> 16の性格因子スコア</li>
          <li><strong>DISC:</strong> 行動スタイル(主導・感化・安定・慎重)</li>
        </ul>
        <p>回答はブラウザに保存され、途中から再開できます。アカウントを作成すると、結果を保存してアプリと同期できます。</p>
      </div>
${ctaBlock()}
      <div class="tp-links">
        <a href="/ja/mbti/types/">MBTI 16タイプ一覧</a>
        <a href="/ja/enneagram/">エニアグラム9タイプ</a>
      </div>
    </div>
  </div>
${footer()}`;
  write('ja/16-personality-test/index.html', html);
}

console.log('done: 29 ja pages generated. Now run: node scripts/inject-head.mjs');

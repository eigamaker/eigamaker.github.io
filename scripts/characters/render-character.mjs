// Character SVG renderer. Deterministic: same meta in, same SVG out.
// Flat fills only (no gradients inside the figure) so raster export stays crisp.
//
// Layout: viewBox 0 0 240 240. Soft background disc, blob body (3 silhouettes),
// face (8 expressions), one accessory. Shared geometry keeps the 33-character
// set visually coherent; only palette/shape/face/accessory vary per type.

import { palette } from './type-meta.mjs';

const DARK = '#33304A';
const GOLD = '#F6C445';
const YELLOW = '#FFD84D';
const PINK = '#F78FB3';
const RED_PINK = '#F0648C';
const STEEL = '#7D8799';
const SKY = '#7FB3F0';

const BODIES = {
  round: { top: 74, bottom: 206, el: () => `<ellipse cx="120" cy="140" rx="70" ry="66"/>` },
  tall: { top: 64, bottom: 212, el: () => `<ellipse cx="120" cy="138" rx="60" ry="74"/>` },
  square: { top: 78, bottom: 204, el: () => `<rect x="54" y="78" width="132" height="126" rx="42"/>` },
};

function starPath(cx, cy, outerR, innerR, points = 5) {
  const step = Math.PI / points;
  let d = '';
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const a = i * step - Math.PI / 2;
    d += `${i === 0 ? 'M' : 'L'}${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`;
  }
  return d + 'Z';
}

const FACES = {
  calm: () => `
    <rect x="88" y="123" width="16" height="5" rx="2.5" fill="${DARK}"/>
    <rect x="136" y="123" width="16" height="5" rx="2.5" fill="${DARK}"/>
    <path d="M110 152 Q120 160 130 152" stroke="${DARK}" stroke-width="5" fill="none" stroke-linecap="round"/>`,
  happy: () => `
    <path d="M86 129 Q96 119 106 129" stroke="${DARK}" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M134 129 Q144 119 154 129" stroke="${DARK}" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M106 148 Q120 166 134 148 Z" fill="${DARK}"/>`,
  curious: () => `
    <circle cx="96" cy="126" r="8" fill="${DARK}"/><circle cx="99" cy="123" r="2.5" fill="#fff"/>
    <circle cx="144" cy="126" r="8" fill="${DARK}"/><circle cx="147" cy="123" r="2.5" fill="#fff"/>
    <circle cx="120" cy="156" r="6" fill="${DARK}"/>`,
  determined: () => `
    <path d="M84 112 L106 118" stroke="${DARK}" stroke-width="5" stroke-linecap="round"/>
    <path d="M156 112 L134 118" stroke="${DARK}" stroke-width="5" stroke-linecap="round"/>
    <circle cx="96" cy="128" r="7" fill="${DARK}"/><circle cx="144" cy="128" r="7" fill="${DARK}"/>
    <path d="M108 152 Q120 159 132 151" stroke="${DARK}" stroke-width="5" fill="none" stroke-linecap="round"/>`,
  gentle: () => `
    <circle cx="96" cy="126" r="6.5" fill="${DARK}"/><circle cx="144" cy="126" r="6.5" fill="${DARK}"/>
    <path d="M112 152 Q120 158 128 152" stroke="${DARK}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`,
  bold: () => `
    <circle cx="96" cy="125" r="8" fill="${DARK}"/><circle cx="144" cy="125" r="8" fill="${DARK}"/>
    <path d="M102 148 Q120 170 138 148 Z" fill="${DARK}"/>`,
  thoughtful: () => `
    <circle cx="99" cy="123" r="6.5" fill="${DARK}"/><circle cx="147" cy="123" r="6.5" fill="${DARK}"/>
    <path d="M112 154 L128 152" stroke="${DARK}" stroke-width="5" stroke-linecap="round"/>`,
  playful: () => `
    <path d="M86 126 Q96 132 106 126" stroke="${DARK}" stroke-width="5" fill="none" stroke-linecap="round"/>
    <circle cx="144" cy="126" r="7.5" fill="${DARK}"/>
    <path d="M106 148 Q120 162 134 148" stroke="${DARK}" stroke-width="5" fill="none" stroke-linecap="round"/>
    <ellipse cx="127" cy="157" rx="6" ry="4" fill="${RED_PINK}"/>`,
};

// Each accessory gets { t: bodyTop, chest: chestY, c: colors } and returns SVG
// markup. hs() = head-side anchor, used by pin-style accessories; chest is
// adapted per body silhouette so chest accessories sit clear of the mouth.
const hs = (t) => `translate(154 ${t + 8})`;

const ACCESSORIES = {
  glasses: () => `
    <circle cx="96" cy="126" r="15" stroke="${DARK}" stroke-width="5" fill="rgba(255,255,255,0.25)"/>
    <circle cx="144" cy="126" r="15" stroke="${DARK}" stroke-width="5" fill="rgba(255,255,255,0.25)"/>
    <path d="M111 126 L129 126" stroke="${DARK}" stroke-width="5"/>`,
  antenna: ({ t, c }) => `
    <path d="M120 ${t + 2} L120 ${t - 18}" stroke="${DARK}" stroke-width="5" stroke-linecap="round"/>
    <circle cx="120" cy="${t - 24}" r="7" fill="${c.secondary}"/>`,
  crown: ({ t }) => `
    <path d="M96 ${t - 4} L96 ${t - 26} L108 ${t - 13} L120 ${t - 30} L132 ${t - 13} L144 ${t - 26} L144 ${t - 4} Z" fill="${GOLD}"/>`,
  lightning: ({ t }) => `
    <g transform="${hs(t)} rotate(12)"><path d="M2 -16 L14 -16 L6 -2 L15 -2 L-4 20 L3 2 L-6 2 Z" fill="${YELLOW}"/></g>`,
  moon: ({ t }) => `
    <g transform="${hs(t)} rotate(-18)"><path d="M0 -13 A13 13 0 1 1 0 13 A17 17 0 0 0 0 -13 Z" fill="${GOLD}"/></g>`,
  flower: ({ t }) => {
    let petals = '';
    for (let i = 0; i < 5; i++) {
      const a = (i * 72 - 90) * (Math.PI / 180);
      petals += `<circle cx="${(9 * Math.cos(a)).toFixed(1)}" cy="${(9 * Math.sin(a)).toFixed(1)}" r="6.5" fill="${PINK}"/>`;
    }
    return `<g transform="${hs(t)}">${petals}<circle r="5" fill="${GOLD}"/></g>`;
  },
  heart: ({ chest }) => `
    <g transform="translate(120 ${chest})"><path d="M0 6 C0 0 -12 -2 -12 6 C-12 12 0 18 0 18 C0 18 12 12 12 6 C12 -2 0 0 0 6 Z" fill="${RED_PINK}"/></g>`,
  star: ({ t }) => `
    <g transform="${hs(t)}"><path d="${starPath(0, 0, 13, 5.5)}" fill="${GOLD}"/></g>`,
  tie: ({ chest, c }) => `
    <g transform="translate(120 ${chest - 4})">
      <path d="M-14 -2 L0 4 L-4 -6 Z" fill="#fff" opacity="0.9"/>
      <path d="M14 -2 L0 4 L4 -6 Z" fill="#fff" opacity="0.9"/>
      <rect x="-5" y="2" width="10" height="7" rx="2" fill="${c.secondary}"/>
      <path d="M-5 9 L5 9 L3 24 L0 28 L-3 24 Z" fill="${c.secondary}"/>
    </g>`,
  scarf: ({ chest, c }) => `
    <g transform="translate(120 ${chest - 6})">
      <rect x="-26" y="-4" width="52" height="11" rx="5.5" fill="${c.secondary}"/>
      <path d="M-8 6 L8 6 L0 26 Z" fill="${c.secondary}"/>
    </g>`,
  bow: ({ t }) => `
    <g transform="${hs(t)}">
      <path d="M0 0 L-15 -9 L-15 9 Z" fill="${PINK}"/>
      <path d="M0 0 L15 -9 L15 9 Z" fill="${PINK}"/>
      <circle r="4.5" fill="${GOLD}"/>
    </g>`,
  wrench: ({ t }) => `
    <g transform="${hs(t)} rotate(35)">
      <circle cy="-8" r="7" stroke="${STEEL}" stroke-width="5" fill="none"/>
      <rect x="-2.5" y="-2" width="5" height="22" rx="2.5" fill="${STEEL}"/>
    </g>`,
  beret: ({ t, c }) => `
    <ellipse cx="106" cy="${t - 2}" rx="27" ry="11" fill="${c.secondary}"/>
    <circle cx="106" cy="${t - 13}" r="3.5" fill="${c.secondary}"/>`,
  cap: ({ t, c }) => `
    <path d="M94 ${t + 4} A26 26 0 0 1 146 ${t + 4} Z" fill="${c.secondary}"/>
    <rect x="142" y="${t - 1}" width="24" height="8" rx="4" fill="${c.secondary}"/>`,
  note: ({ t }) => `
    <g transform="${hs(t)}">
      <ellipse cx="-2" cy="14" rx="7" ry="5" fill="${DARK}" transform="rotate(-20 -2 14)"/>
      <path d="M4 12 L4 -12" stroke="${DARK}" stroke-width="4" stroke-linecap="round"/>
      <path d="M4 -12 Q16 -8 6 0" fill="${DARK}"/>
    </g>`,
  book: ({ chest, c }) => `
    <g transform="translate(120 ${chest + 2})">
      <path d="M-19 0 Q-10 -7 0 0 L0 15 Q-10 8 -19 15 Z" fill="#fff" stroke="${c.secondary}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M19 0 Q10 -7 0 0 L0 15 Q10 8 19 15 Z" fill="#fff" stroke="${c.secondary}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M0 0 L0 15" stroke="${c.secondary}" stroke-width="2"/>
    </g>`,
  lightbulb: ({ t }) => `
    <g transform="${hs(t)}">
      <path d="M-9 -14 L-14 -19 M9 -14 L14 -19 M0 -17 L0 -24" stroke="${GOLD}" stroke-width="3.5" stroke-linecap="round"/>
      <circle r="10" fill="${YELLOW}"/>
      <rect x="-5" y="8" width="10" height="7" rx="2" fill="${STEEL}"/>
    </g>`,
  magnifier: ({ t }) => `
    <g transform="${hs(t)}">
      <circle cx="-3" cy="-3" r="9" stroke="${DARK}" stroke-width="4.5" fill="rgba(255,255,255,0.3)"/>
      <path d="M4 4 L14 14" stroke="${DARK}" stroke-width="5" stroke-linecap="round"/>
    </g>`,
  shield: ({ chest, c }) => `
    <g transform="translate(120 ${chest})">
      <path d="M0 -14 L15 -8 L15 4 Q15 16 0 23 Q-15 16 -15 4 L-15 -8 Z" fill="${c.secondary}"/>
      <path d="M-5 1 L-1 6 L6 -4" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    </g>`,
  sun: ({ t }) => {
    let rays = '';
    for (let i = 0; i < 8; i++) {
      const a = (i * 45) * (Math.PI / 180);
      rays += `<path d="M${(11 * Math.cos(a)).toFixed(1)} ${(11 * Math.sin(a)).toFixed(1)} L${(16 * Math.cos(a)).toFixed(1)} ${(16 * Math.sin(a)).toFixed(1)}" stroke="${YELLOW}" stroke-width="4" stroke-linecap="round"/>`;
    }
    return `<g transform="${hs(t)}">${rays}<circle r="8" fill="${YELLOW}"/></g>`;
  },
  teardrop: ({ t }) => `
    <g transform="${hs(t)}"><path d="M0 -14 C6 -4 10 2 10 8 A10 10 0 1 1 -10 8 C-10 2 -6 -4 0 -14 Z" fill="${SKY}"/></g>`,
  check: ({ t, c }) => `
    <g transform="${hs(t)}">
      <circle r="11" fill="${c.secondary}"/>
      <path d="M-5 0 L-1 5 L6 -5" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    </g>`,
  cloud: ({ t }) => `
    <g transform="${hs(t)}" opacity="0.95">
      <circle cx="-10" cy="3" r="8" fill="#fff"/>
      <circle cx="0" cy="-3" r="10" fill="#fff"/>
      <circle cx="10" cy="3" r="8" fill="#fff"/>
      <rect x="-14" y="3" width="28" height="8" rx="4" fill="#fff"/>
    </g>`,
  flag: ({ t, c }) => `
    <g transform="${hs(t)}">
      <path d="M-2 -16 L-2 20" stroke="${STEEL}" stroke-width="4" stroke-linecap="round"/>
      <path d="M-2 -16 L20 -9 L-2 -2 Z" fill="${c.secondary}"/>
    </g>`,
  arrow: ({ t, c }) => `
    <g transform="${hs(t)}">
      <circle r="12" fill="${c.secondary}"/>
      <path d="M0 6 L0 -5 M-5 0 L0 -6 L5 0" stroke="#fff" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    </g>`,
  mountain: ({ chest, c }) => `
    <g transform="translate(120 ${chest + 2})">
      <path d="M-18 14 L-3 -11 L9 14 Z" fill="${c.secondary}"/>
      <path d="M1 14 L12 -3 L23 14 Z" fill="${c.secondary}" opacity="0.7"/>
      <path d="M-7 -4 L-3 -11 L1 -4 L-2 -1 Z" fill="#fff"/>
    </g>`,
  trophy: ({ t }) => `
    <g transform="${hs(t)}">
      <path d="M-9 -12 L9 -12 L7 2 Q0 9 -7 2 Z" fill="${GOLD}"/>
      <path d="M-9 -10 Q-16 -8 -10 -1 M9 -10 Q16 -8 10 -1" stroke="${GOLD}" stroke-width="3" fill="none"/>
      <rect x="-2.5" y="6" width="5" height="6" fill="${GOLD}"/>
      <rect x="-7" y="12" width="14" height="4" rx="2" fill="${GOLD}"/>
    </g>`,
  scales: ({ t, c }) => `
    <g transform="${hs(t)}">
      <circle r="12" fill="${c.secondary}"/>
      <rect x="-6" y="-4.5" width="12" height="3.5" rx="1.75" fill="#fff"/>
      <rect x="-6" y="1.5" width="12" height="3.5" rx="1.75" fill="#fff"/>
    </g>`,
};

/**
 * @param {{id:string, hue:number, shape:string, face:string, accessory:string}} meta
 * @param {{background?: boolean}} [opts]
 * @returns {string} standalone SVG markup
 */
export function buildCharacterSvg(meta, opts = {}) {
  const { background = true } = opts;
  const c = palette(meta.hue);
  const body = BODIES[meta.shape];
  const face = FACES[meta.face];
  const accessory = ACCESSORIES[meta.accessory];
  if (!body || !face || !accessory) {
    throw new Error(`Unknown shape/face/accessory for ${meta.id}`);
  }
  const t = body.top;
  const chest = body.bottom - 32; // keeps chest accessories clear of the mouth
  const feetY = body.bottom + 1;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" role="img" aria-label="${meta.id}">
  ${background ? `<circle cx="120" cy="120" r="112" fill="${c.soft}"/>` : ''}
  <ellipse cx="95" cy="${feetY}" rx="15" ry="8" fill="${c.secondary}"/>
  <ellipse cx="145" cy="${feetY}" rx="15" ry="8" fill="${c.secondary}"/>
  <g fill="${c.primary}">${body.el()}</g>
  <circle cx="82" cy="144" r="8" fill="#fff" opacity="0.3"/>
  <circle cx="158" cy="144" r="8" fill="#fff" opacity="0.3"/>
  ${face()}
  ${accessory({ t, chest, c })}
</svg>
`;
}

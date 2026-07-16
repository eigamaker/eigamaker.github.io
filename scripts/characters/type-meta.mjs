// Single source of truth for the 33 type characters.
//
// Consumed by:
//   scripts/generate-characters.mjs  → assets/img/characters/{id}.svg
//                                    → assets/css/type-palettes.css (.t-{id})
//   scripts/rasterize-images.mjs     → assets/img/og/{id}.png
//
// Colors are derived from `hue` (HSL) so the set stays visually coherent:
//   primary   = hsl(hue, sat, 56%)   secondary = hsl(hue, sat, 42%)
//   soft      = hsl(hue, 50%, 93%)
//
// shape: round | tall | square      (body silhouette)
// face:  calm | happy | curious | determined | gentle | bold | thoughtful | playful
// accessory: see render-character.mjs ACCESSORIES map.

export const TYPES = [
  // --- MBTI: Analysts (purple family) ---
  { id: 'mbti-intj', hue: 255, shape: 'tall',   face: 'thoughtful', accessory: 'glasses',   name: { en: 'INTJ — Architect',     ja: 'INTJ — 建築家' } },
  { id: 'mbti-intp', hue: 268, shape: 'round',  face: 'curious',    accessory: 'antenna',   name: { en: 'INTP — Logician',      ja: 'INTP — 論理学者' } },
  { id: 'mbti-entj', hue: 245, shape: 'tall',   face: 'determined', accessory: 'crown',     name: { en: 'ENTJ — Commander',     ja: 'ENTJ — 指揮官' } },
  { id: 'mbti-entp', hue: 280, shape: 'round',  face: 'playful',    accessory: 'lightning', name: { en: 'ENTP — Debater',       ja: 'ENTP — 討論者' } },
  // --- MBTI: Diplomats (green family) ---
  { id: 'mbti-infj', hue: 160, shape: 'tall',   face: 'gentle',     accessory: 'moon',      name: { en: 'INFJ — Advocate',      ja: 'INFJ — 提唱者' } },
  { id: 'mbti-infp', hue: 145, shape: 'round',  face: 'calm',       accessory: 'flower',    name: { en: 'INFP — Mediator',      ja: 'INFP — 仲介者' } },
  { id: 'mbti-enfj', hue: 168, shape: 'tall',   face: 'happy',      accessory: 'heart',     name: { en: 'ENFJ — Protagonist',   ja: 'ENFJ — 主人公' } },
  { id: 'mbti-enfp', hue: 135, shape: 'round',  face: 'playful',    accessory: 'star',      name: { en: 'ENFP — Campaigner',    ja: 'ENFP — 運動家' } },
  // --- MBTI: Sentinels (blue family) ---
  { id: 'mbti-istj', hue: 220, shape: 'square', face: 'calm',       accessory: 'tie',       name: { en: 'ISTJ — Logistician',   ja: 'ISTJ — 管理者' } },
  { id: 'mbti-isfj', hue: 203, shape: 'round',  face: 'gentle',     accessory: 'scarf',     name: { en: 'ISFJ — Defender',      ja: 'ISFJ — 擁護者' } },
  { id: 'mbti-estj', hue: 230, shape: 'square', face: 'determined', accessory: 'check',     name: { en: 'ESTJ — Executive',     ja: 'ESTJ — 幹部' } },
  { id: 'mbti-esfj', hue: 195, shape: 'round',  face: 'happy',      accessory: 'bow',       name: { en: 'ESFJ — Consul',        ja: 'ESFJ — 領事' } },
  // --- MBTI: Explorers (amber family) ---
  { id: 'mbti-istp', hue: 40,  shape: 'square', face: 'calm',       accessory: 'wrench',    name: { en: 'ISTP — Virtuoso',      ja: 'ISTP — 巨匠' } },
  { id: 'mbti-isfp', hue: 22,  shape: 'round',  face: 'gentle',     accessory: 'beret',     name: { en: 'ISFP — Adventurer',    ja: 'ISFP — 冒険家' } },
  { id: 'mbti-estp', hue: 48,  shape: 'square', face: 'bold',       accessory: 'cap',       name: { en: 'ESTP — Entrepreneur',  ja: 'ESTP — 起業家' } },
  { id: 'mbti-esfp', hue: 32,  shape: 'round',  face: 'happy',      accessory: 'note',      name: { en: 'ESFP — Entertainer',   ja: 'ESFP — エンターテイナー' } },

  // --- Enneagram (9-step hue wheel) ---
  { id: 'enneagram-1', hue: 0,   shape: 'square', face: 'determined', accessory: 'check',     name: { en: 'Type 1 — The Reformer',      ja: 'タイプ1 — 改革する人' } },
  { id: 'enneagram-2', hue: 340, shape: 'round',  face: 'gentle',     accessory: 'heart',     name: { en: 'Type 2 — The Helper',        ja: 'タイプ2 — 助ける人' } },
  { id: 'enneagram-3', hue: 45,  shape: 'tall',   face: 'bold',       accessory: 'trophy',    name: { en: 'Type 3 — The Achiever',      ja: 'タイプ3 — 達成する人' } },
  { id: 'enneagram-4', hue: 285, shape: 'round',  face: 'thoughtful', accessory: 'teardrop',  name: { en: 'Type 4 — The Individualist', ja: 'タイプ4 — 個性的な人' } },
  { id: 'enneagram-5', hue: 250, shape: 'square', face: 'curious',    accessory: 'magnifier', name: { en: 'Type 5 — The Investigator',  ja: 'タイプ5 — 調べる人' } },
  { id: 'enneagram-6', hue: 215, shape: 'square', face: 'calm',       accessory: 'shield',    name: { en: 'Type 6 — The Loyalist',      ja: 'タイプ6 — 忠実な人' } },
  { id: 'enneagram-7', hue: 28,  shape: 'round',  face: 'playful',    accessory: 'sun',       name: { en: 'Type 7 — The Enthusiast',    ja: 'タイプ7 — 熱中する人' } },
  { id: 'enneagram-8', hue: 8,   shape: 'square', face: 'bold',       accessory: 'lightning', name: { en: 'Type 8 — The Challenger',    ja: 'タイプ8 — 挑戦する人' } },
  { id: 'enneagram-9', hue: 130, shape: 'round',  face: 'calm',       accessory: 'cloud',     name: { en: 'Type 9 — The Peacemaker',    ja: 'タイプ9 — 平和をもたらす人' } },

  // --- Profilecode career types (keys match profilecode-calculator.js) ---
  { id: 'career-creative_innovator',       hue: 300, shape: 'round',  face: 'curious',    accessory: 'lightbulb', name: { en: 'Creative Innovator',       ja: '創造的イノベーター' } },
  { id: 'career-analytical_expert',        hue: 250, shape: 'square', face: 'thoughtful', accessory: 'magnifier', name: { en: 'Analytical Expert',        ja: '分析的専門家' } },
  { id: 'career-social_contributor',       hue: 340, shape: 'round',  face: 'gentle',     accessory: 'heart',     name: { en: 'Social Contributor',       ja: '社会的貢献者' } },
  { id: 'career-organizational_manager',   hue: 215, shape: 'square', face: 'determined', accessory: 'tie',       name: { en: 'Organizational Manager',   ja: '組織的マネージャー' } },
  { id: 'career-independent_entrepreneur', hue: 25,  shape: 'tall',   face: 'bold',       accessory: 'flag',      name: { en: 'Independent Entrepreneur', ja: '独立起業家' } },
  { id: 'career-stable_worker',            hue: 150, shape: 'square', face: 'calm',       accessory: 'shield',    name: { en: 'Stable Worker',            ja: '安定実務者' } },
  { id: 'career-growth_challenger',        hue: 0,   shape: 'tall',   face: 'determined', accessory: 'arrow',     name: { en: 'Growth Challenger',        ja: '成長挑戦者' } },
  { id: 'career-balanced_type',            hue: 180, shape: 'round',  face: 'happy',      accessory: 'scales',    name: { en: 'Balanced Type',            ja: 'バランス型' } },
];

export function palette(hue) {
  return {
    primary: `hsl(${hue}, 62%, 56%)`,
    secondary: `hsl(${hue}, 55%, 40%)`,
    soft: `hsl(${hue}, 50%, 93%)`,
  };
}

// 16PF診断計算ロジック（参考診断）
// 16の性格因子を測定

class SixteenFactorCalculator {
  constructor() {
    // 16因子の定義
    this.factors = {
      'warmth': { name: '温かさ', description: '人との親密さや共感を示す傾向' },
      'reasoning': { name: '論理的思考', description: '抽象的な思考と論理的分析能力' },
      'emotional_stability': { name: '情緒安定性', description: 'ストレスや不安に対する耐性' },
      'dominance': { name: '主導性', description: 'リーダーシップと影響力の傾向' },
      'liveliness': { name: '活気', description: 'エネルギッシュで活動的な傾向' },
      'rule_consciousness': { name: '規則意識', description: 'ルールや規範を守る傾向' },
      'social_boldness': { name: '社交的積極性', description: '社交的な場面での積極性' },
      'sensitivity': { name: '感受性', description: '感情や美的なものへの感受性' },
      'vigilance': { name: '警戒心', description: '他者への信頼と警戒のバランス' },
      'abstractedness': { name: '抽象的思考', description: '理論的・抽象的な思考の傾向' },
      'privateness': { name: '内気さ', description: '自己開示の程度' },
      'apprehension': { name: '不安傾向', description: '不安や心配を感じやすい傾向' },
      'openness_to_change': { name: '変化への開放性', description: '新しい経験への開放性' },
      'self_reliance': { name: '自己依存性', description: '独立して行動する傾向' },
      'perfectionism': { name: '完璧主義', description: '完璧を追求する傾向' },
      'tension': { name: '緊張感', description: '緊張やストレスを感じやすい傾向' }
    };
  }

  calculate(answers, questions) {
    const scores = {};
    
    // 各因子のスコアを初期化
    Object.keys(this.factors).forEach(factor => {
      scores[factor] = 0;
    });

    answers.forEach(answer => {
      const question = questions.find(q => q.id === answer.questionId);
      if (!question || !question.mappings || !question.mappings.sixteenFactor) return;

      const mapping = question.mappings.sixteenFactor;
      const value = answer.value * mapping.value;
      const weightedValue = value * mapping.weight;

      // 因子にスコアを加算
      if (mapping.dimension && scores[mapping.dimension] !== undefined) {
        scores[mapping.dimension] += weightedValue;
      }
    });

    // スコアを正規化（0-100の範囲に変換）
    const normalizedScores = {};
    Object.keys(scores).forEach(factor => {
      // スコアを0-100の範囲に正規化（仮の計算）
      normalizedScores[factor] = Math.max(0, Math.min(100, 50 + (scores[factor] * 5)));
    });

    // 主要な因子を特定（スコアが高い順）
    const sortedFactors = Object.entries(normalizedScores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return {
      factors: normalizedScores,
      topFactors: sortedFactors.map(([factor, score]) => ({
        factor: factor,
        name: this.factors[factor].name,
        description: this.factors[factor].description,
        score: Math.round(score)
      })),
      trademark: '16PF®は16 Personality Factor®の商標です。本サービスは16PF®の公式サービスではありません。'
    };
  }
}


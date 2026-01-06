// DISC診断計算ロジック（参考診断）
// D（主導性）、I（影響力）、S（安定性）、C（慎重性）の4つのスタイルを測定

class DISCCalculator {
  constructor() {
    // DISCスタイルの定義
    this.styles = {
      'D': {
        name: '主導型（Dominance）',
        description: '結果重視で、直接的で決断力があるタイプです。挑戦を好み、迅速に行動します。',
        traits: ['決断力がある', '結果重視', '直接的', '挑戦的', '独立心が強い'],
        strengths: ['リーダーシップ', '迅速な意思決定', '目標達成', '問題解決'],
        weaknesses: ['細部への注意不足', '他者への配慮不足', '短気'],
        workStyle: '目標達成を重視し、迅速に行動する。リーダーシップを発揮する。',
        communication: '直接的で簡潔。結果と成果を重視する。'
      },
      'I': {
        name: '影響型（Influence）',
        description: '人との関係を重視し、楽観的で社交的なタイプです。チームワークを好みます。',
        traits: ['社交的', '楽観的', '熱心', '説得力がある', '協調的'],
        strengths: ['チームワーク', 'モチベーション向上', 'コミュニケーション', 'ネットワーキング'],
        weaknesses: ['細部への注意不足', '時間管理', '感情的な判断'],
        workStyle: 'チームワークを重視し、人との関係を大切にする。楽観的に取り組む。',
        communication: '熱心で説得力がある。人との関係を重視する。'
      },
      'S': {
        name: '安定型（Steadiness）',
        description: '安定性を重視し、協調的で信頼性が高いタイプです。継続性を好みます。',
        traits: ['協調的', '信頼性が高い', '忍耐強い', '安定志向', '支援的'],
        strengths: ['チームワーク', '信頼性', '継続性', 'サポート'],
        weaknesses: ['変化への抵抗', '意思決定の遅さ', '自己主張の不足'],
        workStyle: '安定した環境で、継続的に作業する。チームをサポートする。',
        communication: '協調的で支援的。安定性を重視する。'
      },
      'C': {
        name: '慎重型（Conscientiousness）',
        description: '正確性を重視し、分析的で慎重なタイプです。品質を追求します。',
        traits: ['分析的', '正確性重視', '慎重', '完璧主義', '体系的'],
        strengths: ['分析力', '正確性', '品質管理', '計画性'],
        weaknesses: ['意思決定の遅さ', '完璧主義', '変化への抵抗'],
        workStyle: '正確性と品質を重視し、体系的に作業する。分析的に取り組む。',
        communication: '分析的で正確性を重視する。詳細を大切にする。'
      }
    };
  }

  calculate(answers, questions) {
    const scores = {
      D: 0, // Dominance（主導性）
      I: 0, // Influence（影響力）
      S: 0, // Steadiness（安定性）
      C: 0  // Conscientiousness（慎重性）
    };

    answers.forEach(answer => {
      const question = questions.find(q => q.id === answer.questionId);
      if (!question || !question.mappings || !question.mappings.disc) return;

      const mapping = question.mappings.disc;
      const value = answer.value * mapping.value;
      const weightedValue = value * mapping.weight;

      // 各スタイルにスコアを加算
      if (mapping.dimension && scores[mapping.dimension] !== undefined) {
        scores[mapping.dimension] += weightedValue;
      }
    });

    // スコアを正規化（0-100の範囲に変換）
    const maxScore = Math.max(...Object.values(scores));
    const normalizedScores = {};
    Object.keys(scores).forEach(style => {
      if (maxScore > 0) {
        normalizedScores[style] = Math.max(0, Math.min(100, 50 + ((scores[style] / maxScore) * 50)));
      } else {
        normalizedScores[style] = 50;
      }
    });

    // 主要スタイルを特定（スコアが高い順）
    const sortedStyles = Object.entries(normalizedScores)
      .sort((a, b) => b[1] - a[1]);

    const primaryStyle = sortedStyles[0][0];
    const secondaryStyle = sortedStyles[1][0];

    return {
      scores: normalizedScores,
      primaryStyle: primaryStyle,
      secondaryStyle: secondaryStyle,
      styleInfo: this.styles[primaryStyle],
      secondaryStyleInfo: this.styles[secondaryStyle],
      allStyles: sortedStyles.map(([style, score]) => ({
        style: style,
        name: this.styles[style].name,
        score: Math.round(score)
      })),
      trademark: 'DISC®はDISC Assessment®の商標です。本サービスはDISC®の公式サービスではありません。'
    };
  }
}


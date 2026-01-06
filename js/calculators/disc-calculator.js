// DISC診断計算ロジック（参考診断）
// D（主導性）、I（影響力）、S（安定性）、C（慎重性）の4つのスタイルを測定

class DISCCalculator {
  constructor() {
    // DISCスタイルの定義
    this.styles = {
      'D': {
        name: '主導型（Dominance）',
        description: '結果重視で、直接的で決断力があるタイプです。挑戦を好み、迅速に行動します。目標達成への強い意欲を持ち、リーダーシップを発揮することができます。',
        traits: ['決断力がある', '結果重視', '直接的', '挑戦的', '独立心が強い'],
        strengths: ['リーダーシップ', '迅速な意思決定', '目標達成', '問題解決', '競争力', '行動力'],
        weaknesses: ['細部への注意不足', '他者への配慮不足', '短気', '感情的な配慮不足'],
        workStyle: '目標達成を重視し、迅速に行動する。リーダーシップを発揮し、チームを導く。挑戦的な環境で力を発揮する。',
        communication: '直接的で簡潔。結果と成果を重視する。明確な指示を好む。',
        careerAdvice: 'リーダーシップが求められる役割や、目標達成が重要な職種が適しています。起業家、経営者、プロジェクトマネージャー、営業リーダーなどで活躍できます。',
        relationships: '直接的で率直なコミュニケーションを好みます。他者の感情にも配慮し、チームワークを大切にすることで、より効果的なリーダーシップを発揮できます。',
        growthTips: '細部への注意力を高め、他者の意見にも耳を傾けることで、より包括的な判断ができるようになります。感情的な側面も考慮することで、チームの結束を高められます。'
      },
      'I': {
        name: '影響型（Influence）',
        description: '人との関係を重視し、楽観的で社交的なタイプです。チームワークを好み、人々を鼓舞し、モチベーションを高めることができます。',
        traits: ['社交的', '楽観的', '熱心', '説得力がある', '協調的'],
        strengths: ['チームワーク', 'モチベーション向上', 'コミュニケーション', 'ネットワーキング', '説得力', '人との関係構築'],
        weaknesses: ['細部への注意不足', '時間管理', '感情的な判断', '計画性の不足'],
        workStyle: 'チームワークを重視し、人との関係を大切にする。楽観的に取り組む。人々を鼓舞し、チームの雰囲気を良くする。',
        communication: '熱心で説得力がある。人との関係を重視する。感情を込めて伝える。',
        careerAdvice: '人との関係が重要な役割や、コミュニケーションが求められる職種が適しています。営業、マーケティング、人事、コーチ、トレーナーなどで活躍できます。',
        relationships: '人との関係を大切にし、共感力が高いです。他者の感情を理解し、チームの調和を保つことができます。',
        growthTips: '時間管理と計画性を高め、細部への注意力を向上させることで、より効果的な成果を出せます。感情的な判断だけでなく、論理的な分析も取り入れると良いでしょう。'
      },
      'S': {
        name: '安定型（Steadiness）',
        description: '安定性を重視し、協調的で信頼性が高いタイプです。継続性を好み、チームを支えることができます。',
        traits: ['協調的', '信頼性が高い', '忍耐強い', '安定志向', '支援的'],
        strengths: ['チームワーク', '信頼性', '継続性', 'サポート', '安定性', '一貫性'],
        weaknesses: ['変化への抵抗', '意思決定の遅さ', '自己主張の不足', '柔軟性の不足'],
        workStyle: '安定した環境で、継続的に作業する。チームをサポートし、信頼性の高い成果を出す。一貫性を保つ。',
        communication: '協調的で支援的。安定性を重視する。他者の意見を尊重する。',
        careerAdvice: '安定した環境で継続的な作業が求められる役割や、信頼性が重要な職種が適しています。事務職、品質管理、カスタマーサポート、継続的なプロジェクト管理などで活躍できます。',
        relationships: '協調的で信頼性が高く、チームの支えとなることができます。他者の意見を尊重し、調和を保つことが得意です。',
        growthTips: '変化への適応力を高め、時には自分の意見を主張することで、より積極的な貢献ができます。意思決定のスピードを上げることも重要です。'
      },
      'C': {
        name: '慎重型（Conscientiousness）',
        description: '正確性を重視し、分析的で慎重なタイプです。品質を追求し、体系的に作業を進めることができます。',
        traits: ['分析的', '正確性重視', '慎重', '完璧主義', '体系的'],
        strengths: ['分析力', '正確性', '品質管理', '計画性', '詳細への注意力', '論理的思考'],
        weaknesses: ['意思決定の遅さ', '完璧主義', '変化への抵抗', '柔軟性の不足'],
        workStyle: '正確性と品質を重視し、体系的に作業する。分析的に取り組む。詳細を確認してから判断する。',
        communication: '分析的で正確性を重視する。詳細を大切にする。論理的に説明する。',
        careerAdvice: '正確性と品質が求められる役割や、分析的な思考が重要な職種が適しています。データアナリスト、品質管理、研究開発、システムアーキテクト、会計などで活躍できます。',
        relationships: '正確性を重視し、論理的にコミュニケーションを取ります。他者の感情にも配慮し、バランスを取ることで、より効果的な関係を築けます。',
        growthTips: '意思決定のスピードを上げ、完璧主義を緩和することで、より柔軟に対応できます。時には迅速な判断も必要であることを理解しましょう。'
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

    const lang = typeof i18n !== 'undefined' ? i18n.getCurrentLanguage() : 'ja';
    const discTranslations = (typeof resultTranslations !== 'undefined' && resultTranslations[lang] && resultTranslations[lang].disc)
      ? resultTranslations[lang].disc
      : null;
    const translatedStyles = discTranslations && discTranslations.styles ? discTranslations.styles : null;
    const getStyleInfo = (styleKey) => (translatedStyles && translatedStyles[styleKey])
      ? translatedStyles[styleKey]
      : this.styles[styleKey];
    const discTrademark = discTranslations && discTranslations.trademark
      ? discTranslations.trademark
      : 'DISC®はDISC Assessment®の商標です。本サービスはDISC®の公式サービスではありません。';

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
      styleInfo: getStyleInfo(primaryStyle),
      secondaryStyleInfo: getStyleInfo(secondaryStyle),
      allStyles: sortedStyles.map(([style, score]) => ({
        style: style,
        name: getStyleInfo(style).name,
        score: Math.round(score)
      })),
      trademark: discTrademark
    };
  }
}


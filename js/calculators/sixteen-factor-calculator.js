// 16PF診断計算ロジック（参考診断）
// 16の性格因子を測定

class SixteenFactorCalculator {
  constructor() {
    // 16因子の定義（詳細版）
    this.factors = {
      'warmth': { 
        name: '温かさ', 
        description: '人との親密さや共感を示す傾向',
        high: '高いスコア: 人との親密な関係を大切にし、共感力が高い。チームワークを重視し、他者をサポートすることが得意。',
        low: '低いスコア: 客観的で冷静な判断ができる。感情に流されず、論理的に物事を進めることができる。',
        advice: '高い場合: 共感力を活かして、チームの調和を保つ役割を担いましょう。低い場合: 客観的な視点を活かして、冷静な判断をサポートしましょう。'
      },
      'reasoning': { 
        name: '論理的思考', 
        description: '抽象的な思考と論理的分析能力',
        high: '高いスコア: 抽象的な概念を理解し、論理的に分析することが得意。複雑な問題を解決する能力が高い。',
        low: '低いスコア: 実践的で具体的な思考を好む。実際の経験から学ぶことを重視する。',
        advice: '高い場合: 論理的な分析力を活かして、戦略的な役割を担いましょう。低い場合: 実践的な経験を積み、具体的なスキルを身につけましょう。'
      },
      'emotional_stability': { 
        name: '情緒安定性', 
        description: 'ストレスや不安に対する耐性',
        high: '高いスコア: ストレスに強く、感情が安定している。困難な状況でも冷静に対処できる。',
        low: '低いスコア: 感情の起伏が大きく、ストレスを感じやすい。感情的なサポートが必要な場合がある。',
        advice: '高い場合: 安定性を活かして、チームの支えとなる役割を担いましょう。低い場合: ストレス管理の方法を学び、定期的なセルフケアを心がけましょう。'
      },
      'dominance': { 
        name: '主導性', 
        description: 'リーダーシップと影響力の傾向',
        high: '高いスコア: リーダーシップがあり、他者を導くことが得意。影響力が強く、決断力がある。',
        low: '低いスコア: 協調的で、他者の意見を尊重する。サポート役として貢献することが得意。',
        advice: '高い場合: リーダーシップを活かして、チームを導く役割を担いましょう。低い場合: 協調性を活かして、チームの調和を保つ役割を担いましょう。'
      },
      'liveliness': { 
        name: '活気', 
        description: 'エネルギッシュで活動的な傾向',
        high: '高いスコア: エネルギッシュで活動的。積極的に行動し、新しいことに挑戦することを好む。',
        low: '低いスコア: 落ち着いていて、慎重に行動する。安定したペースで作業を進めることを好む。',
        advice: '高い場合: エネルギーを活かして、積極的に新しいプロジェクトに参加しましょう。低い場合: 慎重さを活かして、着実に成果を出していきましょう。'
      },
      'rule_consciousness': { 
        name: '規則意識', 
        description: 'ルールや規範を守る傾向',
        high: '高いスコア: ルールや規範を守ることを重視する。責任感が強く、信頼性が高い。',
        low: '低いスコア: 柔軟性があり、状況に応じて対応できる。既存のルールにとらわれない。',
        advice: '高い場合: 責任感と信頼性を活かして、重要な役割を担いましょう。低い場合: 柔軟性を活かして、新しいアイデアを提案しましょう。'
      },
      'social_boldness': { 
        name: '社交的積極性', 
        description: '社交的な場面での積極性',
        high: '高いスコア: 社交的で積極的。新しい人との出会いを楽しみ、ネットワーキングが得意。',
        low: '低いスコア: 控えめで、深い関係を好む。少数の親しい人との関係を大切にする。',
        advice: '高い場合: 社交性を活かして、ネットワーキングや営業活動に参加しましょう。低い場合: 深い関係を活かして、専門的な役割を担いましょう。'
      },
      'sensitivity': { 
        name: '感受性', 
        description: '感情や美的なものへの感受性',
        high: '高いスコア: 感情に敏感で、美的なものへの感受性が高い。芸術や創造的な活動を好む。',
        low: '低いスコア: 実用的で、感情よりも論理を重視する。現実的な判断が得意。',
        advice: '高い場合: 感受性を活かして、創造的な活動や芸術的な分野で活躍しましょう。低い場合: 実用性を活かして、論理的な判断が求められる役割を担いましょう。'
      },
      'vigilance': { 
        name: '警戒心', 
        description: '他者への信頼と警戒のバランス',
        high: '高いスコア: 警戒心が強く、慎重に判断する。リスクを避ける傾向がある。',
        low: '低いスコア: 他者を信頼しやすく、楽観的。新しいことに積極的に挑戦する。',
        advice: '高い場合: 慎重さを活かして、リスク管理や品質管理の役割を担いましょう。低い場合: 楽観性を活かして、新しいプロジェクトに積極的に参加しましょう。'
      },
      'abstractedness': { 
        name: '抽象的思考', 
        description: '理論的・抽象的な思考の傾向',
        high: '高いスコア: 抽象的で理論的な思考を好む。概念やアイデアを理解することが得意。',
        low: '低いスコア: 実践的で具体的な思考を好む。実際の経験から学ぶことを重視する。',
        advice: '高い場合: 抽象的思考を活かして、戦略的な役割や研究開発に参加しましょう。低い場合: 実践的な経験を積み、具体的なスキルを身につけましょう。'
      },
      'privateness': { 
        name: '内気さ', 
        description: '自己開示の程度',
        high: '高いスコア: 内気で、自己開示が少ない。個人的な情報を共有することに慎重。',
        low: '低いスコア: オープンで、自己開示が多い。人との関係を築くことが得意。',
        advice: '高い場合: 内気さを活かして、集中が必要な作業や専門的な役割を担いましょう。低い場合: オープンさを活かして、コミュニケーションが重要な役割を担いましょう。'
      },
      'apprehension': { 
        name: '不安傾向', 
        description: '不安や心配を感じやすい傾向',
        high: '高いスコア: 不安を感じやすく、心配事が多い。慎重に行動する傾向がある。',
        low: '低いスコア: 楽観的で、不安を感じにくい。積極的に行動する傾向がある。',
        advice: '高い場合: 慎重さを活かして、リスク管理や品質管理の役割を担いましょう。不安管理の方法も学びましょう。低い場合: 楽観性を活かして、新しいプロジェクトに積極的に参加しましょう。'
      },
      'openness_to_change': { 
        name: '変化への開放性', 
        description: '新しい経験への開放性',
        high: '高いスコア: 変化を好み、新しい経験に積極的。柔軟性が高く、適応力がある。',
        low: '低いスコア: 安定を好み、変化に抵抗がある。継続性と一貫性を重視する。',
        advice: '高い場合: 柔軟性を活かして、新しいプロジェクトや変化の多い環境で活躍しましょう。低い場合: 安定性を活かして、継続的な作業や安定した環境で活躍しましょう。'
      },
      'self_reliance': { 
        name: '自己依存性', 
        description: '独立して行動する傾向',
        high: '高いスコア: 独立心が強く、自分の判断で行動することを好む。自律性が高い。',
        low: '低いスコア: 協調的で、他者と協力することを好む。チームワークを重視する。',
        advice: '高い場合: 独立性を活かして、個人の判断が求められる役割を担いましょう。低い場合: 協調性を活かして、チームワークが重要な役割を担いましょう。'
      },
      'perfectionism': { 
        name: '完璧主義', 
        description: '完璧を追求する傾向',
        high: '高いスコア: 完璧を追求し、細部にこだわる。品質を重視し、高い基準を設定する。',
        low: '低いスコア: 柔軟性があり、完璧を求めない。効率性を重視し、迅速に行動する。',
        advice: '高い場合: 完璧主義を活かして、品質管理や詳細な作業が求められる役割を担いましょう。低い場合: 柔軟性を活かして、迅速な対応が求められる役割を担いましょう。'
      },
      'tension': { 
        name: '緊張感', 
        description: '緊張やストレスを感じやすい傾向',
        high: '高いスコア: 緊張を感じやすく、ストレスを感じやすい。緊張感が高い。',
        low: '低いスコア: リラックスしていて、ストレスを感じにくい。落ち着いている。',
        advice: '高い場合: 緊張感を活かして、集中が必要な作業に取り組みましょう。ストレス管理の方法も学びましょう。低い場合: リラックスした状態を活かして、安定した作業を続けましょう。'
      }
    };
  }

  calculate(answers, questions) {
    const lang = typeof i18n !== 'undefined' ? i18n.getCurrentLanguage() : 'ja';
    const sixteenFactorTranslations = (typeof resultTranslations !== 'undefined' && resultTranslations[lang] && resultTranslations[lang].sixteenFactor)
      ? resultTranslations[lang].sixteenFactor
      : null;
    const translatedFactors = sixteenFactorTranslations && sixteenFactorTranslations.factors
      ? sixteenFactorTranslations.factors
      : null;
    const getFactorInfo = (factorKey) => (translatedFactors && translatedFactors[factorKey])
      ? translatedFactors[factorKey]
      : this.factors[factorKey];
    const sixteenFactorTrademark = sixteenFactorTranslations && sixteenFactorTranslations.trademark
      ? sixteenFactorTranslations.trademark
      : '16PF®は16 Personality Factor®の商標です。本サービスは16PF®の公式サービスではありません。';

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
        name: getFactorInfo(factor).name,
        description: getFactorInfo(factor).description,
        score: Math.round(score),
        high: getFactorInfo(factor).high,
        low: getFactorInfo(factor).low,
        advice: getFactorInfo(factor).advice
      })),
      allFactors: Object.entries(normalizedScores).map(([factor, score]) => ({
        factor: factor,
        name: getFactorInfo(factor).name,
        description: getFactorInfo(factor).description,
        score: Math.round(score),
        high: getFactorInfo(factor).high,
        low: getFactorInfo(factor).low,
        advice: getFactorInfo(factor).advice
      })),
      trademark: sixteenFactorTrademark
    };
  }
}


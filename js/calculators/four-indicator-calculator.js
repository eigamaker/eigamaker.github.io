// 4指標診断計算ロジック（参考診断）
// E/I, S/N, T/F, J/P の4指標を計算

class FourIndicatorCalculator {
  calculate(answers, questions) {
    const scores = {
      E: 0, I: 0,
      S: 0, N: 0,
      T: 0, F: 0,
      J: 0, P: 0
    };

    answers.forEach(answer => {
      const question = questions.find(q => q.id === answer.questionId);
      if (!question || !question.mappings || !question.mappings.fourIndicator) return;

      const mapping = question.mappings.fourIndicator;
      const value = answer.value * mapping.value;
      const weightedValue = value * mapping.weight;

      // 各指標にスコアを加算
      if (mapping.dimension === 'E/I') {
        if (value > 0) {
          scores.E += weightedValue;
        } else {
          scores.I += Math.abs(weightedValue);
        }
      } else if (mapping.dimension === 'S/N') {
        if (value > 0) {
          scores.S += weightedValue;
        } else {
          scores.N += Math.abs(weightedValue);
        }
      } else if (mapping.dimension === 'T/F') {
        if (value > 0) {
          scores.T += weightedValue;
        } else {
          scores.F += Math.abs(weightedValue);
        }
      } else if (mapping.dimension === 'J/P') {
        if (value > 0) {
          scores.J += weightedValue;
        } else {
          scores.P += Math.abs(weightedValue);
        }
      }
    });

    // タイプを判定
    const type = 
      (scores.E > scores.I ? 'E' : 'I') +
      (scores.S > scores.N ? 'S' : 'N') +
      (scores.T > scores.F ? 'T' : 'F') +
      (scores.J > scores.P ? 'J' : 'P');

    const typeNames = {
      'ENFP': 'キャンペーナー',
      'ENFJ': '教師',
      'ENTP': '討論者',
      'ENTJ': '指揮官',
      'ESFP': 'エンターテイナー',
      'ESFJ': '領事',
      'ESTP': '起業家',
      'ESTJ': '管理者',
      'INFP': '仲介者',
      'INFJ': '提唱者',
      'INTP': '論理学者',
      'INTJ': '建築家',
      'ISFP': '冒険家',
      'ISFJ': '擁護者',
      'ISTP': '職人',
      'ISTJ': '管理者'
    };

    // タイプの詳細説明
    const typeDescriptions = {
      'ENFP': '創造的で熱心なキャンペーナー。新しい可能性を探求し、人々とつながることを好みます。',
      'ENFJ': 'カリスマ的な教師タイプ。人々の成長を支援し、チームを導くことを得意とします。',
      'ENTP': '論理的で創造的な討論者。新しいアイデアを生み出し、議論を楽しみます。',
      'ENTJ': '戦略的な指揮官。目標達成のために組織を導くリーダーシップを持ちます。',
      'ESFP': '自由で楽観的なエンターテイナー。現在を楽しみ、人々を楽しませることを好みます。',
      'ESFJ': '協調的な領事タイプ。伝統を大切にし、人々の調和を保つことを重視します。',
      'ESTP': '行動力のある起業家。リスクを取って、迅速に行動することを好みます。',
      'ESTJ': '実務的な管理者。効率性と組織性を重視し、ルールに従うことを好みます。',
      'INFP': '理想主義的な仲介者。価値観を大切にし、創造的な表現を好みます。',
      'INFJ': '洞察力のある提唱者。深い理解力と共感力を持ち、人々を支援します。',
      'INTP': '論理的な論理学者。理論を探求し、複雑な問題を解決することを好みます。',
      'INTJ': '戦略的な建築家。長期的な視点で計画を立て、効率的に実行します。',
      'ISFP': '柔軟で芸術的な冒険家。美しいものを好み、現在を大切にします。',
      'ISFJ': '献身的な擁護者。責任感が強く、人々を守ることを重視します。',
      'ISTP': '実用的な職人。技術的な問題を解決し、実践的なスキルを好みます。',
      'ISTJ': '責任感のある管理者。信頼性が高く、伝統と秩序を重視します。'
    };

    return {
      type: type,
      typeName: typeNames[type] || type,
      typeDescription: typeDescriptions[type] || 'このタイプの詳細な特徴については、アプリで詳しく確認できます。',
      scores: scores,
      trademark: 'MBTI®はMyers-Briggs Type Indicator®の商標です。本サービスはMBTI®の公式サービスではありません。'
    };
  }
}


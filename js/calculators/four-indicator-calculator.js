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

    return {
      type: type,
      typeName: typeNames[type] || type,
      scores: scores,
      trademark: 'MBTI®はMyers-Briggs Type Indicator®の商標です。本サービスはMBTI®の公式サービスではありません。'
    };
  }
}


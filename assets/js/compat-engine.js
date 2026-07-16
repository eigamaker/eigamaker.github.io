/* 相性計算エンジン(ウェブ版独自のルールベース計算)。
   両者の生回答40問に既存の4計算機を適用し、理論ごとに
   スコアプロファイルの近さを 0-100 で算出する。
   ※アプリ側のアルゴリズムとの完全一致は範囲外(設計上の前提)。 */
(function () {
  'use strict';

  var BANDS = [
    { key: 'soulmate', min: 85 },
    { key: 'great', min: 70 },
    { key: 'good', min: 55 },
    { key: 'exciting', min: 40 },
    { key: 'opposite', min: 0 },
  ];

  function bandFor(score) {
    for (var i = 0; i < BANDS.length; i++) {
      if (score >= BANDS[i].min) return BANDS[i].key;
    }
    return 'opposite';
  }

  function calcAll(answers, questions) {
    return {
      profilecode: new ProfilecodeCalculator().calculateAll(answers, questions),
      mbti: new FourIndicatorCalculator().calculate(answers, questions),
      sixteenFactor: new SixteenFactorCalculator().calculate(answers, questions),
      disc: new DISCCalculator().calculate(answers, questions),
    };
  }

  // プロファイル形状の類似度: 各ベクトルを min-max 正規化して平均絶対差を取る
  function shapeSimilarity(vecA, vecB, keys) {
    function normalize(vec) {
      var vals = keys.map(function (k) { return vec[k] || 0; });
      var min = Math.min.apply(null, vals);
      var max = Math.max.apply(null, vals);
      var range = max - min || 1;
      var out = {};
      keys.forEach(function (k) { out[k] = ((vec[k] || 0) - min) / range; });
      return out;
    }
    var a = normalize(vecA);
    var b = normalize(vecB);
    var sum = 0;
    keys.forEach(function (k) { sum += Math.abs(a[k] - b[k]); });
    return Math.round((1 - sum / keys.length) * 100);
  }

  // 0-100スコア同士の平均絶対差ベース類似度
  function scoreSimilarity(vecA, vecB, keys) {
    var sum = 0;
    keys.forEach(function (k) { sum += Math.abs((vecA[k] || 0) - (vecB[k] || 0)); });
    return Math.round(100 - sum / keys.length);
  }

  function mbtiSimilarity(a, b) {
    var axes = [['E', 'I'], ['S', 'N'], ['T', 'F'], ['J', 'P']];
    var total = 0;
    axes.forEach(function (ax) {
      var sumA = (a.scores[ax[0]] || 0) + (a.scores[ax[1]] || 0);
      var sumB = (b.scores[ax[0]] || 0) + (b.scores[ax[1]] || 0);
      var rA = sumA > 0 ? a.scores[ax[0]] / sumA : 0.5;
      var rB = sumB > 0 ? b.scores[ax[0]] / sumB : 0.5;
      total += 1 - Math.abs(rA - rB);
    });
    return Math.round((total / axes.length) * 100);
  }

  // 16PF: 最も似ている/違う因子 上位3件
  function factorHighlights(a, b) {
    var diffs = a.allFactors.map(function (fa) {
      var fb = b.allFactors.find(function (f) { return f.factor === fa.factor; });
      return { name: fa.name, diff: Math.abs(fa.score - (fb ? fb.score : 50)) };
    });
    diffs.sort(function (x, y) { return x.diff - y.diff; });
    return {
      alike: diffs.slice(0, 3).map(function (d) { return d.name; }),
      different: diffs.slice(-3).reverse().map(function (d) { return d.name; }),
    };
  }

  /**
   * @param {{questionId:number,value:number}[]} answersA 自分の回答
   * @param {{questionId:number,value:number}[]} answersB 相手の回答
   * @param questions 共有質問セット
   */
  function compare(answersA, answersB, questions) {
    var A = calcAll(answersA, questions);
    var B = calcAll(answersB, questions);

    var careerKeys = Object.keys(A.profilecode.career.scores || {});
    var learningKeys = Object.keys(A.profilecode.learning.scores || {});

    var theories = {
      career: {
        score: careerKeys.length ? shapeSimilarity(A.profilecode.career.scores, B.profilecode.career.scores, careerKeys) : 50,
        typeA: A.profilecode.career.type, typeB: B.profilecode.career.type,
        nameA: A.profilecode.career.typeInfo.name, nameB: B.profilecode.career.typeInfo.name,
      },
      learning: {
        score: learningKeys.length ? shapeSimilarity(A.profilecode.learning.scores, B.profilecode.learning.scores, learningKeys) : 50,
        nameA: A.profilecode.learning.typeInfo.name, nameB: B.profilecode.learning.typeInfo.name,
      },
      mbti: {
        score: mbtiSimilarity(A.mbti, B.mbti),
        typeA: A.mbti.type, typeB: B.mbti.type,
        nameA: A.mbti.typeName, nameB: B.mbti.typeName,
      },
      sixteenFactor: {
        score: scoreSimilarity(A.sixteenFactor.factors, B.sixteenFactor.factors, Object.keys(A.sixteenFactor.factors)),
        highlights: factorHighlights(A.sixteenFactor, B.sixteenFactor),
      },
      disc: {
        score: scoreSimilarity(A.disc.scores, B.disc.scores, ['D', 'I', 'S', 'C']),
        nameA: A.disc.styleInfo.name, nameB: B.disc.styleInfo.name,
      },
    };

    // 重み: Profilecode(独自) 40% / MBTI 30% / DISC 20% / 16PF 10%
    var overall = Math.round(
      (theories.career.score + theories.learning.score) / 2 * 0.4 +
      theories.mbti.score * 0.3 +
      theories.disc.score * 0.2 +
      theories.sixteenFactor.score * 0.1
    );

    Object.keys(theories).forEach(function (k) {
      theories[k].band = bandFor(theories[k].score);
    });

    return { overall: overall, band: bandFor(overall), theories: theories, resultA: A, resultB: B };
  }

  window.PcCompatEngine = { compare: compare, bandFor: bandFor };
})();

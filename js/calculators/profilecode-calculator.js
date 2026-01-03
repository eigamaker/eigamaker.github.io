// Profilecode独自診断計算ロジック
// 5次元包括診断（キャリア適性、学習スタイル、コミュニケーション、ストレス対処、意思決定）

class ProfilecodeCalculator {
  constructor() {
    // キャリア適性タイプ定義
    this.careerTypes = {
      'creative_innovator': {
        name: '創造的イノベーター',
        description: '新しい価値を創造し、イノベーションを起こすタイプです。',
        jobTypes: ['デザイナー', 'エンジニア', '起業家', 'アーティスト'],
        workStyle: '自由度の高い環境で創造性を発揮',
        values: '新しいことに挑戦し、イノベーションを起こす'
      },
      'analytical_expert': {
        name: '分析的専門家',
        description: '深い専門性を追求し、論理的に分析するタイプです。',
        jobTypes: ['研究者', 'データアナリスト', 'コンサルタント', 'エンジニア'],
        workStyle: '専門性を活かした深い分析',
        values: '専門性と論理性を重視'
      },
      'social_contributor': {
        name: '社会的貢献者',
        description: '人々の役に立ち、社会に貢献することを重視するタイプです。',
        jobTypes: ['教師', '看護師', 'カウンセラー', 'NPO職員'],
        workStyle: '人との関わりを通じて貢献',
        values: '社会貢献と人の役に立つこと'
      },
      'organizational_manager': {
        name: '組織的マネージャー',
        description: 'チームをまとめ、組織を運営するタイプです。',
        jobTypes: ['マネージャー', 'プロジェクトマネージャー', '人事', '経営者'],
        workStyle: 'チームをまとめて目標達成',
        values: '組織の成長とチームワーク'
      },
      'independent_entrepreneur': {
        name: '独立起業家',
        description: '自分の道を切り開き、独立して働くタイプです。',
        jobTypes: ['起業家', 'フリーランス', 'コンサルタント', '個人事業主'],
        workStyle: '自分のペースで独立して働く',
        values: '自由と独立を重視'
      },
      'stable_worker': {
        name: '安定実務者',
        description: '安定した環境で着実に働くタイプです。',
        jobTypes: ['事務職', '公務員', '銀行員', '製造業'],
        workStyle: '安定した環境で着実に作業',
        values: '安定性と継続性を重視'
      },
      'growth_challenger': {
        name: '成長挑戦者',
        description: '常に成長を求め、新しい挑戦をするタイプです。',
        jobTypes: ['営業', 'マーケター', 'プロジェクトリーダー', 'トレーナー'],
        workStyle: '成長機会のある環境で挑戦',
        values: '成長と挑戦を重視'
      },
      'balanced_type': {
        name: 'バランス型',
        description: '複数の要素をバランスよく持つタイプです。',
        jobTypes: ['ジェネラリスト', 'コーディネーター', 'プロジェクトマネージャー'],
        workStyle: '状況に応じて柔軟に対応',
        values: 'バランスと柔軟性を重視'
      }
    };

    // 学習スタイルタイプ定義
    this.learningTypes = {
      'visual_learner': {
        name: '視覚的学習者',
        description: '図や映像で理解することを好みます。',
        methods: ['図表、グラフ', '動画、映像', 'マインドマップ', '視覚的な資料'],
        environment: '視覚的な資料が豊富な環境',
        tips: '図や映像を活用して学習する'
      },
      'auditory_learner': {
        name: '聴覚的学習者',
        description: '音声や説明で理解することを好みます。',
        methods: ['講義、説明', '音声教材', 'ディスカッション', '音声メモ'],
        environment: '音声での説明が中心の環境',
        tips: '音声教材や説明を活用して学習する'
      },
      'practical_learner': {
        name: '実践的学習者',
        description: '手を動かして理解することを好みます。',
        methods: ['実践的なプロジェクト', 'ハンズオン', 'インターンシップ', '実習'],
        environment: '実践的なプロジェクトや実習',
        tips: '理論より実践、失敗から学ぶ'
      },
      'reading_learner': {
        name: '読書的学習者',
        description: 'テキストで理解することを好みます。',
        methods: ['書籍、テキスト', '記事、論文', 'ノート作成', '要約'],
        environment: 'テキストベースの学習環境',
        tips: 'テキストを読んで理解する'
      },
      'experiential_learner': {
        name: '体験的学習者',
        description: '実際の経験から学ぶことを好みます。',
        methods: ['実体験', 'インターンシップ', '実務経験', '失敗から学ぶ'],
        environment: '実際の経験が得られる環境',
        tips: '実際に経験して学ぶ'
      },
      'integrated_learner': {
        name: '統合的学習者',
        description: '複数の方法を組み合わせて学ぶことを好みます。',
        methods: ['複数の学習方法の組み合わせ', 'マルチメディア', '多角的アプローチ'],
        environment: '多様な学習方法が提供される環境',
        tips: '複数の方法を組み合わせて学習する'
      }
    };
  }

  // キャリア適性を計算
  calculateCareer(answers, questions) {
    const scores = {
      creative: 0,
      analytical: 0,
      social: 0,
      organizational: 0,
      independent: 0,
      stable: 0,
      growth: 0,
      balanced: 0
    };

    answers.forEach(answer => {
      const question = questions.find(q => q.id === answer.questionId);
      if (!question || !question.mappings || !question.mappings.profilecode) return;

      const mapping = question.mappings.profilecode.career;
      if (!mapping) return;

      const value = answer.value * mapping.value;
      const weightedValue = value * mapping.weight;

      // 各次元にスコアを加算
      if (mapping.dimension === 'job_preference') {
        if (value > 0) {
          scores.creative += weightedValue;
          scores.growth += weightedValue * 0.5;
        }
      } else if (mapping.dimension === 'work_style') {
        if (value > 0) {
          scores.organizational += weightedValue;
          scores.social += weightedValue * 0.5;
        } else {
          scores.independent += Math.abs(weightedValue);
        }
      }
    });

    // 最も高いスコアのタイプを判定
    const maxScore = Math.max(...Object.values(scores));
    let type = 'balanced_type';

    if (scores.creative >= maxScore * 0.8) {
      type = 'creative_innovator';
    } else if (scores.analytical >= maxScore * 0.8) {
      type = 'analytical_expert';
    } else if (scores.social >= maxScore * 0.8) {
      type = 'social_contributor';
    } else if (scores.organizational >= maxScore * 0.8) {
      type = 'organizational_manager';
    } else if (scores.independent >= maxScore * 0.8) {
      type = 'independent_entrepreneur';
    } else if (scores.stable >= maxScore * 0.8) {
      type = 'stable_worker';
    } else if (scores.growth >= maxScore * 0.8) {
      type = 'growth_challenger';
    }

    return {
      type: type,
      typeInfo: this.careerTypes[type],
      scores: scores
    };
  }

  // 学習スタイルを計算
  calculateLearning(answers, questions) {
    const scores = {
      visual: 0,
      auditory: 0,
      practical: 0,
      reading: 0,
      experiential: 0,
      integrated: 0
    };

    answers.forEach(answer => {
      const question = questions.find(q => q.id === answer.questionId);
      if (!question || !question.mappings || !question.mappings.profilecode) return;

      const mapping = question.mappings.profilecode.learning;
      if (!mapping) return;

      const value = answer.value * mapping.value;
      const weightedValue = value * mapping.weight;

      if (mapping.dimension === 'learning_method') {
        if (value > 0) {
          if (question.id === 13) scores.visual += weightedValue;
          if (question.id === 3 || question.id === 8) scores.practical += weightedValue;
          if (question.id === 21) scores.reading += weightedValue;
          if (question.id === 27) scores.experiential += weightedValue;
          if (question.id === 30) scores.integrated += weightedValue;
        }
      }
    });

    const maxScore = Math.max(...Object.values(scores));
    let type = 'integrated_learner';

    if (scores.visual >= maxScore * 0.7) {
      type = 'visual_learner';
    } else if (scores.practical >= maxScore * 0.7) {
      type = 'practical_learner';
    } else if (scores.experiential >= maxScore * 0.7) {
      type = 'experiential_learner';
    } else if (scores.integrated >= maxScore * 0.5) {
      type = 'integrated_learner';
    }

    return {
      type: type,
      typeInfo: this.learningTypes[type],
      scores: scores
    };
  }

  // 全診断を計算
  calculateAll(answers, questions) {
    return {
      career: this.calculateCareer(answers, questions),
      learning: this.calculateLearning(answers, questions)
    };
  }
}


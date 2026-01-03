// Profilecode独自診断計算ロジック
// 5次元包括診断（キャリア適性、学習スタイル、コミュニケーション、ストレス対処、意思決定）

class ProfilecodeCalculator {
  constructor() {
    // キャリア適性タイプ定義
    this.careerTypes = {
      'creative_innovator': {
        name: '創造的イノベーター',
        description: 'あなたは新しい価値を創造し、イノベーションを起こすことを得意とするタイプです。既存の枠にとらわれず、独自のアイデアを形にすることができます。創造性と革新性を武器に、これまでにない価値を生み出すことができます。',
        jobTypes: ['デザイナー', 'エンジニア', '起業家', 'アーティスト', 'プロダクトマネージャー', 'UI/UXデザイナー', 'ゲームデザイナー'],
        workStyle: '自由度の高い環境で創造性を発揮し、新しいアイデアを試すことができる環境を好みます。固定されたルールや制約が少ない環境で、自分の創造性を最大限に発揮できます。',
        values: '新しいことに挑戦し、イノベーションを起こすことを重視します。既存の方法にとらわれず、常に新しい可能性を探求します。',
        advice: '創造性を活かせる職種を選び、自由度の高い環境で働くことをおすすめします。新しいプロジェクトに積極的に参加し、自分のアイデアを形にする機会を増やしましょう。また、創造的なコミュニティに参加することで、刺激を受け、さらに成長できます。'
      },
      'analytical_expert': {
        name: '分析的専門家',
        description: 'あなたは深い専門性を追求し、論理的に分析することを得意とするタイプです。データや事実に基づいて判断し、複雑な問題を解決することができます。専門知識を深めることで、高い価値を提供できます。',
        jobTypes: ['研究者', 'データアナリスト', 'コンサルタント', 'エンジニア', '金融アナリスト', 'システムアーキテクト', '研究開発'],
        workStyle: '専門性を活かした深い分析ができる環境を好みます。じっくりと時間をかけて問題を解決し、論理的なアプローチで成果を出すことができます。',
        values: '専門性と論理性を重視し、データや事実に基づいた判断を大切にします。深い知識と分析力で価値を提供します。',
        advice: '専門性を深めることで、より高い価値を提供できます。継続的な学習と研究を通じて、自分の専門分野での知識を深めましょう。また、論理的な分析力を活かせる職種を選ぶことで、自分の強みを最大限に発揮できます。'
      },
      'social_contributor': {
        name: '社会的貢献者',
        description: 'あなたは人々の役に立ち、社会に貢献することを重視するタイプです。他者の成長や幸福を支援することで、自分自身も充実感を得ることができます。共感力と支援力が強みです。',
        jobTypes: ['教師', '看護師', 'カウンセラー', 'NPO職員', 'ソーシャルワーカー', '人事', 'コーチ', '医療従事者'],
        workStyle: '人との関わりを通じて貢献できる環境を好みます。直接的に人々の役に立てる仕事で、自分の価値を実感できます。',
        values: '社会貢献と人の役に立つことを重視し、他者の成長や幸福を支援することで充実感を得ます。',
        advice: '人々の役に立てる職種を選び、直接的に支援できる環境で働くことをおすすめします。共感力と支援力を活かせる仕事で、自分の価値を実感できます。また、定期的なセルフケアを忘れず、自分の心身の健康を保つことも大切です。'
      },
      'organizational_manager': {
        name: '組織的マネージャー',
        description: 'あなたはチームをまとめ、組織を運営することを得意とするタイプです。リーダーシップとマネジメント能力を活かし、チーム全体の成果を最大化することができます。組織の成長とチームワークを重視します。',
        jobTypes: ['マネージャー', 'プロジェクトマネージャー', '人事', '経営者', '部門長', 'チームリーダー', 'オペレーションマネージャー'],
        workStyle: 'チームをまとめて目標達成できる環境を好みます。組織的な活動を通じて、チーム全体の成果を最大化することができます。',
        values: '組織の成長とチームワークを重視し、チーム全体の成功を目指します。リーダーシップとマネジメント能力を活かします。',
        advice: 'リーダーシップとマネジメント能力を活かせる職種を選び、チームをまとめる機会を増やしましょう。組織的な活動を通じて、チーム全体の成果を最大化できます。また、コミュニケーション能力を高めることで、より効果的なマネジメントが可能になります。'
      },
      'independent_entrepreneur': {
        name: '独立起業家',
        description: 'あなたは自分の道を切り開き、独立して働くことを好むタイプです。自由度の高い環境で、自分のペースで働くことで、最大の成果を出すことができます。自律性と独立性を重視します。',
        jobTypes: ['起業家', 'フリーランス', 'コンサルタント', '個人事業主', 'クリエイター', '投資家', 'アドバイザー'],
        workStyle: '自分のペースで独立して働くことができる環境を好みます。自由度の高い環境で、自分の判断で仕事を進めることができます。',
        values: '自由と独立を重視し、自分の判断で仕事を進めることを大切にします。自律性と独立性を活かして成果を出します。',
        advice: '自由度の高い環境で働くことをおすすめします。フリーランスや起業など、自分の判断で仕事を進められる環境を選びましょう。また、自己管理能力を高めることで、独立して働く際のリスクを最小限に抑えられます。ネットワーキングも重要です。'
      },
      'stable_worker': {
        name: '安定実務者',
        description: 'あなたは安定した環境で着実に働くことを好むタイプです。継続性と安定性を重視し、長期的な視点で仕事に取り組むことができます。信頼性と一貫性が強みです。',
        jobTypes: ['事務職', '公務員', '銀行員', '製造業', '品質管理', '経理', '総務', '法務'],
        workStyle: '安定した環境で着実に作業できる環境を好みます。継続性と安定性を重視し、長期的な視点で仕事に取り組むことができます。',
        values: '安定性と継続性を重視し、長期的な視点で仕事に取り組みます。信頼性と一貫性を大切にします。',
        advice: '安定した環境で働くことをおすすめします。継続性と安定性を重視できる職種を選び、長期的な視点でキャリアを築きましょう。また、着実にスキルを積み上げることで、より高い価値を提供できます。安定性を保ちながら、少しずつ成長していくことが大切です。'
      },
      'growth_challenger': {
        name: '成長挑戦者',
        description: 'あなたは常に成長を求め、新しい挑戦をすることを好むタイプです。変化を恐れず、新しい環境や課題に積極的に取り組むことができます。成長機会を求める姿勢が強みです。',
        jobTypes: ['営業', 'マーケター', 'プロジェクトリーダー', 'トレーナー', 'ビジネス開発', '新規事業', 'カスタマーサクセス'],
        workStyle: '成長機会のある環境で挑戦できる環境を好みます。変化を恐れず、新しい環境や課題に積極的に取り組むことができます。',
        values: '成長と挑戦を重視し、常に新しい可能性を探求します。変化を恐れず、積極的に取り組む姿勢を大切にします。',
        advice: '成長機会のある環境で働くことをおすすめします。新しい挑戦ができる職種を選び、常に学習と成長を続けましょう。また、失敗を恐れずに挑戦することで、より大きな成長が可能になります。定期的に新しいスキルを学び、自分の可能性を広げていきましょう。'
      },
      'balanced_type': {
        name: 'バランス型',
        description: 'あなたは複数の要素をバランスよく持つタイプです。状況に応じて柔軟に対応し、様々な場面で適切な判断ができます。柔軟性と適応力が強みです。',
        jobTypes: ['ジェネラリスト', 'コーディネーター', 'プロジェクトマネージャー', '営業企画', '事業開発', '総合職'],
        workStyle: '状況に応じて柔軟に対応できる環境を好みます。様々な業務に携わることで、自分の可能性を広げることができます。',
        values: 'バランスと柔軟性を重視し、状況に応じて適切な判断をします。多様な経験を通じて成長します。',
        advice: '様々な業務に携われる職種を選び、自分の可能性を広げましょう。バランスと柔軟性を活かせる環境で、多様な経験を積むことができます。また、定期的に自分の強みと弱みを振り返り、バランスを保ちながら成長していくことが大切です。'
      }
    };

    // 学習スタイルタイプ定義
    this.learningTypes = {
      'visual_learner': {
        name: '視覚的学習者',
        description: 'あなたは図や映像で理解することを好むタイプです。視覚的な情報を処理することが得意で、図表やグラフ、動画などを活用することで効率的に学習できます。',
        methods: ['図表、グラフ', '動画、映像', 'マインドマップ', '視覚的な資料', 'インフォグラフィック', '図解', 'プレゼンテーション'],
        environment: '視覚的な資料が豊富な環境を好みます。図や映像を活用することで、より深く理解できます。',
        tips: '図や映像を活用して学習することで、効率的に知識を身につけることができます。マインドマップや図解を自分で作成することも効果的です。',
        advice: '視覚的な学習リソースを積極的に活用しましょう。動画教材、図解資料、マインドマップなどを使用することで、効率的に学習できます。また、自分で図やグラフを作成することで、理解が深まります。視覚的な情報を整理する習慣を身につけると、さらに学習効率が上がります。'
      },
      'auditory_learner': {
        name: '聴覚的学習者',
        description: 'あなたは音声や説明で理解することを好むタイプです。聞くことで情報を処理することが得意で、講義や説明、ディスカッションなどを活用することで効率的に学習できます。',
        methods: ['講義、説明', '音声教材', 'ディスカッション', '音声メモ', 'ポッドキャスト', '音声読書', 'グループ学習'],
        environment: '音声での説明が中心の環境を好みます。講義やディスカッションを通じて、より深く理解できます。',
        tips: '音声教材や説明を活用して学習することで、効率的に知識を身につけることができます。音声メモを取ることも効果的です。',
        advice: '音声での学習リソースを積極的に活用しましょう。ポッドキャスト、音声教材、講義などを使用することで、効率的に学習できます。また、ディスカッションやグループ学習に参加することで、理解が深まります。音声メモを取る習慣を身につけると、さらに学習効率が上がります。'
      },
      'practical_learner': {
        name: '実践的学習者',
        description: 'あなたは手を動かして理解することを好むタイプです。理論を学ぶよりも、実際に試してみることで深く理解できます。実践的な経験を通じて、確実にスキルを身につけることができます。',
        methods: ['実践的なプロジェクト', 'ハンズオン', 'インターンシップ', '実習', 'ワークショップ', 'ハッカソン', 'サイドプロジェクト'],
        environment: '実践的なプロジェクトや実習ができる環境を好みます。実際に手を動かしながら学ぶことで、より深く理解できます。',
        tips: '理論より実践を重視し、失敗から学ぶ姿勢が大切です。実際に試してみることで、理論だけでは分からない発見があります。',
        advice: '実践的なプロジェクトに積極的に参加しましょう。インターンシップやハッカソン、サイドプロジェクトなど、実際に手を動かす機会を増やすことで、効率的にスキルアップできます。失敗を恐れずに挑戦し、経験から学ぶ姿勢が重要です。'
      },
      'reading_learner': {
        name: '読書的学習者',
        description: 'あなたはテキストで理解することを好むタイプです。読むことで情報を処理することが得意で、書籍やテキスト、記事などを活用することで効率的に学習できます。',
        methods: ['書籍、テキスト', '記事、論文', 'ノート作成', '要約', '読書', 'ドキュメント', 'ブログ記事'],
        environment: 'テキストベースの学習環境を好みます。書籍やテキストを読むことで、より深く理解できます。',
        tips: 'テキストを読んで理解することで、効率的に知識を身につけることができます。ノート作成や要約をすることで、理解が深まります。',
        advice: 'テキストベースの学習リソースを積極的に活用しましょう。書籍、記事、論文などを読むことで、効率的に学習できます。また、ノート作成や要約をすることで、理解が深まります。読書習慣を身につけると、さらに学習効率が上がります。'
      },
      'experiential_learner': {
        name: '体験的学習者',
        description: 'あなたは実際の経験から学ぶことを好むタイプです。実体験を通じて深く理解でき、失敗から学ぶ姿勢が強みです。実際に経験することで、理論だけでは分からない発見があります。',
        methods: ['実体験', 'インターンシップ', '実務経験', '失敗から学ぶ', 'フィールドワーク', '実地研修', 'OJT'],
        environment: '実際の経験が得られる環境を好みます。実体験を通じて、より深く理解できます。',
        tips: '実際に経験して学ぶことで、効率的に知識を身につけることができます。失敗を恐れずに挑戦し、経験から学ぶ姿勢が大切です。',
        advice: '実体験が得られる機会を積極的に作りましょう。インターンシップ、実務経験、フィールドワークなど、実際に経験できる環境を選ぶことで、効率的に学習できます。また、失敗を恐れずに挑戦し、経験から学ぶ姿勢が重要です。振り返りを習慣化することで、さらに学習効率が上がります。'
      },
      'integrated_learner': {
        name: '統合的学習者',
        description: 'あなたは複数の方法を組み合わせて学ぶことを好むタイプです。様々な学習方法を組み合わせることで、より深く理解できます。柔軟性と適応力が強みです。',
        methods: ['複数の学習方法の組み合わせ', 'マルチメディア', '多角的アプローチ', 'ブレンディッドラーニング', 'ハイブリッド学習'],
        environment: '多様な学習方法が提供される環境を好みます。様々な方法を組み合わせることで、より深く理解できます。',
        tips: '複数の方法を組み合わせて学習することで、効率的に知識を身につけることができます。様々なリソースを活用することが大切です。',
        advice: '様々な学習方法を組み合わせて学習しましょう。視覚的、聴覚的、実践的な方法を組み合わせることで、より深く理解できます。また、自分の学習スタイルに合わせて、最適な組み合わせを見つけることが大切です。多様なリソースを活用することで、さらに学習効率が上がります。'
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


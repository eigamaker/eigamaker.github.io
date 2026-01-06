// 診断結果の詳細翻訳データ
// 各計算ロジックから参照される

const resultTranslations = {
  ja: {
    // Profilecode診断 - キャリア適性タイプ
    careerTypes: {
      creative_innovator: {
        name: '創造的イノベーター',
        description: 'あなたは新しい価値を創造し、イノベーションを起こすことを得意とするタイプです。既存の枠にとらわれず、独自のアイデアを形にすることができます。創造性と革新性を武器に、これまでにない価値を生み出すことができます。',
        jobTypes: ['デザイナー', 'エンジニア', '起業家', 'アーティスト', 'プロダクトマネージャー', 'UI/UXデザイナー', 'ゲームデザイナー'],
        workStyle: '自由度の高い環境で創造性を発揮し、新しいアイデアを試すことができる環境を好みます。固定されたルールや制約が少ない環境で、自分の創造性を最大限に発揮できます。',
        values: '新しいことに挑戦し、イノベーションを起こすことを重視します。既存の方法にとらわれず、常に新しい可能性を探求します。',
        advice: '創造性を活かせる職種を選び、自由度の高い環境で働くことをおすすめします。新しいプロジェクトに積極的に参加し、自分のアイデアを形にする機会を増やしましょう。また、創造的なコミュニティに参加することで、刺激を受け、さらに成長できます。'
      },
      analytical_expert: {
        name: '分析的専門家',
        description: 'あなたは深い専門性を追求し、論理的に分析することを得意とするタイプです。データや事実に基づいて判断し、複雑な問題を解決することができます。専門知識を深めることで、高い価値を提供できます。',
        jobTypes: ['研究者', 'データアナリスト', 'コンサルタント', 'エンジニア', '金融アナリスト', 'システムアーキテクト', '研究開発'],
        workStyle: '専門性を活かした深い分析ができる環境を好みます。じっくりと時間をかけて問題を解決し、論理的なアプローチで成果を出すことができます。',
        values: '専門性と論理性を重視し、データや事実に基づいた判断を大切にします。深い知識と分析力で価値を提供します。',
        advice: '専門性を深めることで、より高い価値を提供できます。継続的な学習と研究を通じて、自分の専門分野での知識を深めましょう。また、論理的な分析力を活かせる職種を選ぶことで、自分の強みを最大限に発揮できます。'
      },
      social_contributor: {
        name: '社会的貢献者',
        description: 'あなたは人々の役に立ち、社会に貢献することを重視するタイプです。他者の成長や幸福を支援することで、自分自身も充実感を得ることができます。共感力と支援力が強みです。',
        jobTypes: ['教師', '看護師', 'カウンセラー', 'NPO職員', 'ソーシャルワーカー', '人事', 'コーチ', '医療従事者'],
        workStyle: '人との関わりを通じて貢献できる環境を好みます。直接的に人々の役に立てる仕事で、自分の価値を実感できます。',
        values: '社会貢献と人の役に立つことを重視し、他者の成長や幸福を支援することで充実感を得ます。',
        advice: '人々の役に立てる職種を選び、直接的に支援できる環境で働くことをおすすめします。共感力と支援力を活かせる仕事で、自分の価値を実感できます。また、定期的なセルフケアを忘れず、自分の心身の健康を保つことも大切です。'
      },
      organizational_manager: {
        name: '組織的マネージャー',
        description: 'あなたはチームをまとめ、組織を運営することを得意とするタイプです。リーダーシップとマネジメント能力を活かし、チーム全体の成果を最大化することができます。組織の成長とチームワークを重視します。',
        jobTypes: ['マネージャー', 'プロジェクトマネージャー', '人事', '経営者', '部門長', 'チームリーダー', 'オペレーションマネージャー'],
        workStyle: 'チームをまとめて目標達成できる環境を好みます。組織的な活動を通じて、チーム全体の成果を最大化することができます。',
        values: '組織の成長とチームワークを重視し、チーム全体の成功を目指します。リーダーシップとマネジメント能力を活かします。',
        advice: 'リーダーシップとマネジメント能力を活かせる職種を選び、チームをまとめる機会を増やしましょう。組織的な活動を通じて、チーム全体の成果を最大化できます。また、コミュニケーション能力を高めることで、より効果的なマネジメントが可能になります。'
      },
      independent_entrepreneur: {
        name: '独立起業家',
        description: 'あなたは自分の道を切り開き、独立して働くことを好むタイプです。自由度の高い環境で、自分のペースで働くことで、最大の成果を出すことができます。自律性と独立性を重視します。',
        jobTypes: ['起業家', 'フリーランス', 'コンサルタント', '個人事業主', 'クリエイター', '投資家', 'アドバイザー'],
        workStyle: '自分のペースで独立して働くことができる環境を好みます。自由度の高い環境で、自分の判断で仕事を進めることができます。',
        values: '自由と独立を重視し、自分の判断で仕事を進めることを大切にします。自律性と独立性を活かして成果を出します。',
        advice: '自由度の高い環境で働くことをおすすめします。フリーランスや起業など、自分の判断で仕事を進められる環境を選びましょう。また、自己管理能力を高めることで、独立して働く際のリスクを最小限に抑えられます。ネットワーキングも重要です。'
      },
      stable_worker: {
        name: '安定実務者',
        description: 'あなたは安定した環境で着実に働くことを好むタイプです。継続性と安定性を重視し、長期的な視点で仕事に取り組むことができます。信頼性と一貫性が強みです。',
        jobTypes: ['事務職', '公務員', '銀行員', '製造業', '品質管理', '経理', '総務', '法務'],
        workStyle: '安定した環境で着実に作業できる環境を好みます。継続性と安定性を重視し、長期的な視点で仕事に取り組むことができます。',
        values: '安定性と継続性を重視し、長期的な視点で仕事に取り組みます。信頼性と一貫性を大切にします。',
        advice: '安定した環境で働くことをおすすめします。継続性と安定性を重視できる職種を選び、長期的な視点でキャリアを築きましょう。また、着実にスキルを積み上げることで、より高い価値を提供できます。安定性を保ちながら、少しずつ成長していくことが大切です。'
      },
      growth_challenger: {
        name: '成長挑戦者',
        description: 'あなたは常に成長を求め、新しい挑戦をすることを好むタイプです。変化を恐れず、新しい環境や課題に積極的に取り組むことができます。成長機会を求める姿勢が強みです。',
        jobTypes: ['営業', 'マーケター', 'プロジェクトリーダー', 'トレーナー', 'ビジネス開発', '新規事業', 'カスタマーサクセス'],
        workStyle: '成長機会のある環境で挑戦できる環境を好みます。変化を恐れず、新しい環境や課題に積極的に取り組むことができます。',
        values: '成長と挑戦を重視し、常に新しい可能性を探求します。変化を恐れず、積極的に取り組む姿勢を大切にします。',
        advice: '成長機会のある環境で働くことをおすすめします。新しい挑戦ができる職種を選び、常に学習と成長を続けましょう。また、失敗を恐れずに挑戦することで、より大きな成長が可能になります。定期的に新しいスキルを学び、自分の可能性を広げていきましょう。'
      },
      balanced_type: {
        name: 'バランス型',
        description: 'あなたは複数の要素をバランスよく持つタイプです。状況に応じて柔軟に対応し、様々な場面で適切な判断ができます。柔軟性と適応力が強みです。',
        jobTypes: ['ジェネラリスト', 'コーディネーター', 'プロジェクトマネージャー', '営業企画', '事業開発', '総合職'],
        workStyle: '状況に応じて柔軟に対応できる環境を好みます。様々な業務に携わることで、自分の可能性を広げることができます。',
        values: 'バランスと柔軟性を重視し、状況に応じて適切な判断をします。多様な経験を通じて成長します。',
        advice: '様々な業務に携われる職種を選び、自分の可能性を広げましょう。バランスと柔軟性を活かせる環境で、多様な経験を積むことができます。また、定期的に自分の強みと弱みを振り返り、バランスを保ちながら成長していくことが大切です。'
      }
    },
    
    // Profilecode診断 - 学習スタイルタイプ
    learningTypes: {
      visual_learner: {
        name: '視覚的学習者',
        description: 'あなたは図や映像で理解することを好むタイプです。視覚的な情報を処理することが得意で、図表やグラフ、動画などを活用することで効率的に学習できます。',
        methods: ['図表、グラフ', '動画、映像', 'マインドマップ', '視覚的な資料', 'インフォグラフィック', '図解', 'プレゼンテーション'],
        environment: '視覚的な資料が豊富な環境を好みます。図や映像を活用することで、より深く理解できます。',
        tips: '図や映像を活用して学習することで、効率的に知識を身につけることができます。マインドマップや図解を自分で作成することも効果的です。',
        advice: '視覚的な学習リソースを積極的に活用しましょう。動画教材、図解資料、マインドマップなどを使用することで、効率的に学習できます。また、自分で図やグラフを作成することで、理解が深まります。視覚的な情報を整理する習慣を身につけると、さらに学習効率が上がります。'
      },
      auditory_learner: {
        name: '聴覚的学習者',
        description: 'あなたは音声や説明で理解することを好むタイプです。聞くことで情報を処理することが得意で、講義や説明、ディスカッションなどを活用することで効率的に学習できます。',
        methods: ['講義、説明', '音声教材', 'ディスカッション', '音声メモ', 'ポッドキャスト', '音声読書', 'グループ学習'],
        environment: '音声での説明が中心の環境を好みます。講義やディスカッションを通じて、より深く理解できます。',
        tips: '音声教材や説明を活用して学習することで、効率的に知識を身につけることができます。音声メモを取ることも効果的です。',
        advice: '音声での学習リソースを積極的に活用しましょう。ポッドキャスト、音声教材、講義などを使用することで、効率的に学習できます。また、ディスカッションやグループ学習に参加することで、理解が深まります。音声メモを取る習慣を身につけると、さらに学習効率が上がります。'
      },
      practical_learner: {
        name: '実践的学習者',
        description: 'あなたは手を動かして理解することを好むタイプです。理論を学ぶよりも、実際に試してみることで深く理解できます。実践的な経験を通じて、確実にスキルを身につけることができます。',
        methods: ['実践的なプロジェクト', 'ハンズオン', 'インターンシップ', '実習', 'ワークショップ', 'ハッカソン', 'サイドプロジェクト'],
        environment: '実践的なプロジェクトや実習ができる環境を好みます。実際に手を動かしながら学ぶことで、より深く理解できます。',
        tips: '理論より実践を重視し、失敗から学ぶ姿勢が大切です。実際に試してみることで、理論だけでは分からない発見があります。',
        advice: '実践的なプロジェクトに積極的に参加しましょう。インターンシップやハッカソン、サイドプロジェクトなど、実際に手を動かす機会を増やすことで、効率的にスキルアップできます。失敗を恐れずに挑戦し、経験から学ぶ姿勢が重要です。'
      },
      reading_learner: {
        name: '読書的学習者',
        description: 'あなたはテキストで理解することを好むタイプです。読むことで情報を処理することが得意で、書籍やテキスト、記事などを活用することで効率的に学習できます。',
        methods: ['書籍、テキスト', '記事、論文', 'ノート作成', '要約', '読書', 'ドキュメント', 'ブログ記事'],
        environment: 'テキストベースの学習環境を好みます。書籍やテキストを読むことで、より深く理解できます。',
        tips: 'テキストを読んで理解することで、効率的に知識を身につけることができます。ノート作成や要約をすることで、理解が深まります。',
        advice: 'テキストベースの学習リソースを積極的に活用しましょう。書籍、記事、論文などを読むことで、効率的に学習できます。また、ノート作成や要約をすることで、理解が深まります。読書習慣を身につけると、さらに学習効率が上がります。'
      },
      experiential_learner: {
        name: '体験的学習者',
        description: 'あなたは実際の経験から学ぶことを好むタイプです。実体験を通じて深く理解でき、失敗から学ぶ姿勢が強みです。実際に経験することで、理論だけでは分からない発見があります。',
        methods: ['実体験', 'インターンシップ', '実務経験', '失敗から学ぶ', 'フィールドワーク', '実地研修', 'OJT'],
        environment: '実際の経験が得られる環境を好みます。実体験を通じて、より深く理解できます。',
        tips: '実際に経験して学ぶことで、効率的に知識を身につけることができます。失敗を恐れずに挑戦し、経験から学ぶ姿勢が大切です。',
        advice: '実体験が得られる機会を積極的に作りましょう。インターンシップ、実務経験、フィールドワークなど、実際に経験できる環境を選ぶことで、効率的に学習できます。また、失敗を恐れずに挑戦し、経験から学ぶ姿勢が重要です。振り返りを習慣化することで、さらに学習効率が上がります。'
      },
      integrated_learner: {
        name: '統合的学習者',
        description: 'あなたは複数の方法を組み合わせて学ぶことを好むタイプです。様々な学習方法を組み合わせることで、より深く理解できます。柔軟性と適応力が強みです。',
        methods: ['複数の学習方法の組み合わせ', 'マルチメディア', '多角的アプローチ', 'ブレンディッドラーニング', 'ハイブリッド学習'],
        environment: '多様な学習方法が提供される環境を好みます。様々な方法を組み合わせることで、より深く理解できます。',
        tips: '複数の方法を組み合わせて学習することで、効率的に知識を身につけることができます。様々なリソースを活用することが大切です。',
        advice: '様々な学習方法を組み合わせて学習しましょう。視覚的、聴覚的、実践的な方法を組み合わせることで、より深く理解できます。また、自分の学習スタイルに合わせて、最適な組み合わせを見つけることが大切です。多様なリソースを活用することで、さらに学習効率が上がります。'
      }
    }
  },
  
  en: {
    // Profilecode診断 - キャリア適性タイプ
    careerTypes: {
      creative_innovator: {
        name: 'Creative Innovator',
        description: 'You excel at creating new value and driving innovation. You can shape unique ideas without being constrained by existing frameworks. With creativity and innovation as your strengths, you can generate unprecedented value.',
        jobTypes: ['Designer', 'Engineer', 'Entrepreneur', 'Artist', 'Product Manager', 'UI/UX Designer', 'Game Designer'],
        workStyle: 'You prefer environments with high freedom where you can express creativity and try new ideas. You can maximize your creativity in environments with fewer fixed rules and constraints.',
        values: 'You value taking on new challenges and driving innovation. You constantly explore new possibilities without being bound by existing methods.',
        advice: 'We recommend choosing job types that leverage your creativity and working in environments with high freedom. Actively participate in new projects and increase opportunities to shape your ideas. Also, joining creative communities can provide stimulation and further growth.'
      },
      analytical_expert: {
        name: 'Analytical Expert',
        description: 'You excel at pursuing deep expertise and logical analysis. You can make judgments based on data and facts, and solve complex problems. By deepening your expertise, you can provide high value.',
        jobTypes: ['Researcher', 'Data Analyst', 'Consultant', 'Engineer', 'Financial Analyst', 'Systems Architect', 'R&D'],
        workStyle: 'You prefer environments where you can perform deep analysis leveraging your expertise. You can achieve results through logical approaches by taking time to solve problems thoroughly.',
        values: 'You value expertise and logic, and treasure judgments based on data and facts. You provide value through deep knowledge and analytical skills.',
        advice: 'By deepening your expertise, you can provide higher value. Deepen your knowledge in your field through continuous learning and research. Also, choosing job types that leverage your logical analytical skills will allow you to maximize your strengths.'
      },
      social_contributor: {
        name: 'Social Contributor',
        description: 'You value helping people and contributing to society. By supporting others\' growth and happiness, you can also gain fulfillment yourself. Empathy and support skills are your strengths.',
        jobTypes: ['Teacher', 'Nurse', 'Counselor', 'NPO Staff', 'Social Worker', 'HR', 'Coach', 'Healthcare Professional'],
        workStyle: 'You prefer environments where you can contribute through human interaction. You can realize your value in work that directly helps people.',
        values: 'You value social contribution and helping others. You gain fulfillment by supporting others\' growth and happiness.',
        advice: 'We recommend choosing job types that help people and working in environments where you can provide direct support. You can realize your value in work that leverages your empathy and support skills. Also, remember regular self-care and maintain your physical and mental health.'
      },
      organizational_manager: {
        name: 'Organizational Manager',
        description: 'You excel at unifying teams and managing organizations. You can maximize team results by leveraging leadership and management skills. You value organizational growth and teamwork.',
        jobTypes: ['Manager', 'Project Manager', 'HR', 'Executive', 'Department Head', 'Team Leader', 'Operations Manager'],
        workStyle: 'You prefer environments where you can unify teams to achieve goals. You can maximize team results through organizational activities.',
        values: 'You value organizational growth and teamwork, aiming for overall team success. You leverage leadership and management skills.',
        advice: 'Choose job types that leverage your leadership and management skills, and increase opportunities to unify teams. You can maximize team results through organizational activities. Also, improving communication skills will enable more effective management.'
      },
      independent_entrepreneur: {
        name: 'Independent Entrepreneur',
        description: 'You prefer to carve your own path and work independently. You can achieve maximum results by working at your own pace in high-freedom environments. You value autonomy and independence.',
        jobTypes: ['Entrepreneur', 'Freelancer', 'Consultant', 'Sole Proprietor', 'Creator', 'Investor', 'Advisor'],
        workStyle: 'You prefer environments where you can work independently at your own pace. You can advance work based on your own judgment in high-freedom environments.',
        values: 'You value freedom and independence, and treasure advancing work based on your own judgment. You achieve results by leveraging autonomy and independence.',
        advice: 'We recommend working in high-freedom environments. Choose environments like freelancing or entrepreneurship where you can advance work based on your own judgment. Also, improving self-management skills will minimize risks when working independently. Networking is also important.'
      },
      stable_worker: {
        name: 'Stable Worker',
        description: 'You prefer to work steadily in stable environments. You value continuity and stability, and can approach work with a long-term perspective. Reliability and consistency are your strengths.',
        jobTypes: ['Office Worker', 'Civil Servant', 'Banker', 'Manufacturing', 'Quality Control', 'Accounting', 'General Affairs', 'Legal'],
        workStyle: 'You prefer stable environments where you can work steadily. You value continuity and stability, and can approach work with a long-term perspective.',
        values: 'You value stability and continuity, approaching work with a long-term perspective. You treasure reliability and consistency.',
        advice: 'We recommend working in stable environments. Choose job types that value continuity and stability, and build your career with a long-term perspective. Also, steadily building skills will allow you to provide higher value. It\'s important to grow gradually while maintaining stability.'
      },
      growth_challenger: {
        name: 'Growth Challenger',
        description: 'You constantly seek growth and prefer new challenges. You can actively tackle new environments and challenges without fearing change. Your strength is seeking growth opportunities.',
        jobTypes: ['Sales', 'Marketer', 'Project Leader', 'Trainer', 'Business Development', 'New Business', 'Customer Success'],
        workStyle: 'You prefer environments with growth opportunities where you can take on challenges. You can actively tackle new environments and challenges without fearing change.',
        values: 'You value growth and challenge, constantly exploring new possibilities. You treasure an attitude of actively tackling challenges without fearing change.',
        advice: 'We recommend working in environments with growth opportunities. Choose job types that allow new challenges and continue learning and growing. Also, challenging without fearing failure will enable greater growth. Regularly learn new skills and expand your possibilities.'
      },
      balanced_type: {
        name: 'Balanced Type',
        description: 'You have a well-balanced combination of multiple elements. You can flexibly respond to situations and make appropriate judgments in various contexts. Flexibility and adaptability are your strengths.',
        jobTypes: ['Generalist', 'Coordinator', 'Project Manager', 'Sales Planning', 'Business Development', 'General Position'],
        workStyle: 'You prefer environments where you can flexibly respond to situations. By engaging in various tasks, you can expand your possibilities.',
        values: 'You value balance and flexibility, making appropriate judgments according to situations. You grow through diverse experiences.',
        advice: 'Choose job types that allow you to engage in various tasks and expand your possibilities. You can accumulate diverse experiences in environments that leverage balance and flexibility. Also, regularly reflect on your strengths and weaknesses and grow while maintaining balance.'
      }
    },
    
    // Profilecode診断 - 学習スタイルタイプ
    learningTypes: {
      visual_learner: {
        name: 'Visual Learner',
        description: 'You prefer to understand through diagrams and videos. You excel at processing visual information and can learn efficiently by utilizing charts, graphs, videos, etc.',
        methods: ['Charts, Graphs', 'Videos, Images', 'Mind Maps', 'Visual Materials', 'Infographics', 'Diagrams', 'Presentations'],
        environment: 'You prefer environments rich in visual materials. You can understand more deeply by utilizing diagrams and videos.',
        tips: 'You can efficiently acquire knowledge by utilizing diagrams and videos for learning. Creating mind maps and diagrams yourself is also effective.',
        advice: 'Actively utilize visual learning resources. You can learn efficiently by using video materials, diagram materials, mind maps, etc. Also, creating your own diagrams and graphs will deepen understanding. Developing a habit of organizing visual information will further improve learning efficiency.'
      },
      auditory_learner: {
        name: 'Auditory Learner',
        description: 'You prefer to understand through audio and explanations. You excel at processing information through listening and can learn efficiently by utilizing lectures, explanations, discussions, etc.',
        methods: ['Lectures, Explanations', 'Audio Materials', 'Discussions', 'Audio Notes', 'Podcasts', 'Audiobooks', 'Group Learning'],
        environment: 'You prefer environments centered on audio explanations. You can understand more deeply through lectures and discussions.',
        tips: 'You can efficiently acquire knowledge by utilizing audio materials and explanations for learning. Taking audio notes is also effective.',
        advice: 'Actively utilize audio learning resources. You can learn efficiently by using podcasts, audio materials, lectures, etc. Also, participating in discussions and group learning will deepen understanding. Developing a habit of taking audio notes will further improve learning efficiency.'
      },
      practical_learner: {
        name: 'Practical Learner',
        description: 'You prefer to understand by doing hands-on work. You can understand deeply by actually trying things rather than learning theory. You can reliably acquire skills through practical experience.',
        methods: ['Practical Projects', 'Hands-on', 'Internships', 'Practicum', 'Workshops', 'Hackathons', 'Side Projects'],
        environment: 'You prefer environments where you can engage in practical projects and practicum. You can understand more deeply by learning while actually doing hands-on work.',
        tips: 'It\'s important to value practice over theory and have an attitude of learning from failure. By actually trying things, you can discover things that theory alone cannot reveal.',
        advice: 'Actively participate in practical projects. You can efficiently improve skills by increasing opportunities to do hands-on work through internships, hackathons, side projects, etc. It\'s important to challenge without fearing failure and have an attitude of learning from experience.'
      },
      reading_learner: {
        name: 'Reading Learner',
        description: 'You prefer to understand through text. You excel at processing information through reading and can learn efficiently by utilizing books, texts, articles, etc.',
        methods: ['Books, Texts', 'Articles, Papers', 'Note-taking', 'Summarizing', 'Reading', 'Documents', 'Blog Articles'],
        environment: 'You prefer text-based learning environments. You can understand more deeply by reading books and texts.',
        tips: 'You can efficiently acquire knowledge by reading and understanding text. Note-taking and summarizing will deepen understanding.',
        advice: 'Actively utilize text-based learning resources. You can learn efficiently by reading books, articles, papers, etc. Also, note-taking and summarizing will deepen understanding. Developing a reading habit will further improve learning efficiency.'
      },
      experiential_learner: {
        name: 'Experiential Learner',
        description: 'You prefer to learn from actual experience. You can understand deeply through real experience, and your strength is learning from failure. By actually experiencing things, you can discover things that theory alone cannot reveal.',
        methods: ['Real Experience', 'Internships', 'Work Experience', 'Learning from Failure', 'Fieldwork', 'On-site Training', 'OJT'],
        environment: 'You prefer environments where you can gain actual experience. You can understand more deeply through real experience.',
        tips: 'You can efficiently acquire knowledge by learning through actual experience. It\'s important to challenge without fearing failure and have an attitude of learning from experience.',
        advice: 'Actively create opportunities to gain real experience. You can learn efficiently by choosing environments where you can actually experience things through internships, work experience, fieldwork, etc. Also, it\'s important to challenge without fearing failure and have an attitude of learning from experience. Making reflection a habit will further improve learning efficiency.'
      },
      integrated_learner: {
        name: 'Integrated Learner',
        description: 'You prefer to learn by combining multiple methods. You can understand more deeply by combining various learning methods. Flexibility and adaptability are your strengths.',
        methods: ['Combining Multiple Learning Methods', 'Multimedia', 'Multi-angled Approach', 'Blended Learning', 'Hybrid Learning'],
        environment: 'You prefer environments that provide diverse learning methods. You can understand more deeply by combining various methods.',
        tips: 'You can efficiently acquire knowledge by learning through combining multiple methods. It\'s important to utilize various resources.',
        advice: 'Learn by combining various learning methods. You can understand more deeply by combining visual, auditory, and practical methods. Also, it\'s important to find the optimal combination that suits your learning style. Utilizing diverse resources will further improve learning efficiency.'
      }
    }
  }
};


// 共有質問データ（統一質問セット）
// 1つの質問セットで複数の診断タイプの結果を計算

// 質問データを取得する関数（多言語対応）
function getSharedQuestions() {
  const fallbackLang = 'en';
  const t = typeof i18n !== 'undefined'
    ? (key) => i18n.t(key)
    : (key) => (typeof translations !== 'undefined' && translations[fallbackLang] && translations[fallbackLang][key]) || key;
  
  return [
  {
    id: 1,
    question: t('question1'),
    options: [
      { text: t('stronglyAgree'), value: 2 },
      { text: t('agree'), value: 1 },
      { text: t('neutral'), value: 0 },
      { text: t('disagree'), value: -1 },
      { text: t('stronglyDisagree'), value: -2 }
    ],
    mappings: {
      profilecode: {
        career: { dimension: 'work_style', weight: 0.8, value: 1 }, // チームワーク型
        learning: { dimension: 'learning_method', weight: 0.6, value: 1 }, // グループ学習
        communication: { dimension: 'communication_style', weight: 1.0, value: 1 }, // 相談重視
        decision: { dimension: 'decision_method', weight: 0.9, value: 1 } // 相談重視
      },
      fourIndicator: {
        dimension: 'E/I',
        weight: 0.7,
        value: 1 // 外向性
      },
      sixteenFactor: {
        dimension: 'warmth',
        weight: 0.5,
        value: 1
      },
      disc: {
        dimension: 'I',
        weight: 0.7,
        value: 1 // 影響型（チームワーク重視）
      }
    }
  },
  {
    id: 2,
    question: t('question2'),
    options: [
      { text: t('stronglyAgree'), value: 2 },
      { text: t('agree'), value: 1 },
      { text: t('neutral'), value: 0 },
      { text: t('disagree'), value: -1 },
      { text: t('stronglyDisagree'), value: -2 }
    ],
    mappings: {
      profilecode: {
        career: { dimension: 'work_style', weight: 0.7, value: 1 }, // 分析的
        learning: { dimension: 'learning_method', weight: 0.8, value: 1 }, // 論理的学習
        decision: { dimension: 'decision_method', weight: 1.0, value: 1 } // データ重視
      },
      fourIndicator: {
        dimension: 'T/F',
        weight: 0.8,
        value: 1 // 思考型
      },
      sixteenFactor: {
        dimension: 'reasoning',
        weight: 0.7,
        value: 1
      },
      disc: {
        dimension: 'C',
        weight: 0.8,
        value: 1 // 慎重型（分析的）
      }
    }
  },
  {
    id: 3,
    question: t('question3'),
    options: [
      { text: t('stronglyAgree'), value: 2 },
      { text: t('agree'), value: 1 },
      { text: t('neutral'), value: 0 },
      { text: t('disagree'), value: -1 },
      { text: t('stronglyDisagree'), value: -2 }
    ],
    mappings: {
      profilecode: {
        learning: { dimension: 'learning_method', weight: 1.0, value: 1 }, // 実践的学習
        career: { dimension: 'work_style', weight: 0.6, value: 1 } // 実務型
      },
      fourIndicator: {
        dimension: 'S/N',
        weight: 0.7,
        value: 1 // 感覚型
      },
      sixteenFactor: {
        dimension: 'rule_consciousness',
        weight: 0.8,
        value: 1
      },
      disc: {
        dimension: 'S',
        weight: 0.6,
        value: 1 // 安定型（実務的）
      }
    }
  },
  {
    id: 4,
    question: t('question4'),
    options: [
      { text: t('stronglyAgree'), value: 2 },
      { text: t('agree'), value: 1 },
      { text: t('neutral'), value: 0 },
      { text: t('disagree'), value: -1 },
      { text: t('stronglyDisagree'), value: -2 }
    ],
    mappings: {
      profilecode: {
        career: { dimension: 'job_preference', weight: 1.0, value: 1 }, // 創造的職種
        learning: { dimension: 'learning_method', weight: 0.5, value: 1 } // 創造的学習
      },
      fourIndicator: {
        dimension: 'S/N',
        weight: 0.8,
        value: -1 // 直観型
      },
      sixteenFactor: {
        dimension: 'abstractedness',
        weight: 0.9,
        value: 1
      },
      disc: {
        dimension: 'D',
        weight: 0.7,
        value: 1 // 主導型（創造的）
      }
    }
  },
  {
    id: 5,
    question: t('question5'),
    options: [
      { text: t('stronglyAgree'), value: 2 },
      { text: t('agree'), value: 1 },
      { text: t('neutral'), value: 0 },
      { text: t('disagree'), value: -1 },
      { text: t('stronglyDisagree'), value: -2 }
    ],
    mappings: {
      profilecode: {
        communication: { dimension: 'communication_style', weight: 1.0, value: 1 }, // 共感的
        career: { dimension: 'work_style', weight: 0.5, value: 1 } // サポート型
      },
      fourIndicator: {
        dimension: 'T/F',
        weight: 0.9,
        value: -1 // 感情型
      },
      sixteenFactor: {
        dimension: 'warmth',
        weight: 1.0,
        value: 1
      },
      disc: {
        dimension: 'I',
        weight: 0.9,
        value: 1 // 影響型（共感的）
      }
    }
  },
  {
    id: 6,
    question: t('question6'),
    options: [
      { text: t('stronglyAgree'), value: 2 },
      { text: t('agree'), value: 1 },
      { text: t('neutral'), value: 0 },
      { text: t('disagree'), value: -1 },
      { text: t('stronglyDisagree'), value: -2 }
    ],
    mappings: {
      profilecode: {
        decision: { dimension: 'decision_method', weight: 0.8, value: 1 }, // 計画重視
        career: { dimension: 'work_style', weight: 0.6, value: 1 } // 組織的
      },
      fourIndicator: {
        dimension: 'J/P',
        weight: 0.9,
        value: 1 // 判断型
      },
      sixteenFactor: {
        dimension: 'perfectionism',
        weight: 0.7,
        value: 1
      }
    }
  },
  {
    id: 7,
    question: t('question7'),
    options: [
      { text: t('stronglyAgree'), value: 2 },
      { text: t('agree'), value: 1 },
      { text: t('neutral'), value: 0 },
      { text: t('disagree'), value: -1 },
      { text: t('stronglyDisagree'), value: -2 }
    ],
    mappings: {
      profilecode: {
        stress: { dimension: 'stress_recovery', weight: 1.0, value: 1 }, // 休息重視
        communication: { dimension: 'communication_style', weight: 0.4, value: -1 } // 内向的
      },
      fourIndicator: {
        dimension: 'E/I',
        weight: 0.8,
        value: -1 // 内向性
      },
      sixteenFactor: {
        dimension: 'self_reliance',
        weight: 0.7,
        value: 1
      },
      disc: {
        dimension: 'S',
        weight: 0.7,
        value: 1 // 安定型（一人でリフレッシュ）
      }
    }
  },
  {
    id: 8,
    question: t('question8'),
    options: [
      { text: t('stronglyAgree'), value: 2 },
      { text: t('agree'), value: 1 },
      { text: t('neutral'), value: 0 },
      { text: t('disagree'), value: -1 },
      { text: t('stronglyDisagree'), value: -2 }
    ],
    mappings: {
      profilecode: {
        learning: { dimension: 'learning_method', weight: 1.0, value: 1 }, // 実践的学習
        career: { dimension: 'work_style', weight: 0.5, value: 1 } // 実務型
      },
      fourIndicator: {
        dimension: 'S/N',
        weight: 0.7,
        value: 1 // 感覚型
      },
      sixteenFactor: {
        dimension: 'rule_consciousness',
        weight: 0.9,
        value: 1
      },
      disc: {
        dimension: 'S',
        weight: 0.6,
        value: 1 // 安定型（実践的）
      }
    }
  },
  {
    id: 9,
    question: t('question9'),
    options: [
      { text: t('stronglyAgree'), value: 2 },
      { text: t('agree'), value: 1 },
      { text: t('neutral'), value: 0 },
      { text: t('disagree'), value: -1 },
      { text: t('stronglyDisagree'), value: -2 }
    ],
    mappings: {
      profilecode: {
        career: { dimension: 'work_style', weight: 1.0, value: 1 }, // チームワーク型
        communication: { dimension: 'communication_style', weight: 0.8, value: 1 } // 社交的
      },
      fourIndicator: {
        dimension: 'E/I',
        weight: 0.9,
        value: 1 // 外向性
      },
      sixteenFactor: {
        dimension: 'warmth',
        weight: 0.8,
        value: 1
      },
      disc: {
        dimension: 'I',
        weight: 0.9,
        value: 1 // 影響型（チームワーク）
      }
    }
  },
  {
    id: 10,
    question: t('question10'),
    options: [
      { text: t('stronglyAgree'), value: 2 },
      { text: t('agree'), value: 1 },
      { text: t('neutral'), value: 0 },
      { text: t('disagree'), value: -1 },
      { text: t('stronglyDisagree'), value: -2 }
    ],
    mappings: {
      profilecode: {
        decision: { dimension: 'decision_method', weight: 1.0, value: -1 }, // 直感重視
        learning: { dimension: 'learning_method', weight: 0.5, value: -1 } // 直感的学習
      },
      fourIndicator: {
        dimension: 'S/N',
        weight: 0.8,
        value: -1 // 直観型
      },
      sixteenFactor: {
        dimension: 'abstractedness',
        weight: 0.7,
        value: 1
      },
      disc: {
        dimension: 'D',
        weight: 0.6,
        value: -1 // 主導型（直感重視）
      }
    }
  },
  {
    id: 11,
    question: t('question11'),
    options: [
      { text: t('stronglyAgree'), value: 2 },
      { text: t('agree'), value: 1 },
      { text: t('neutral'), value: 0 },
      { text: t('disagree'), value: -1 },
      { text: t('stronglyDisagree'), value: -2 }
    ],
    mappings: {
      profilecode: {
        communication: { dimension: 'communication_style', weight: 1.0, value: 1 }, // 深い関係
        career: { dimension: 'work_style', weight: 0.4, value: -1 } // 独立型
      },
      fourIndicator: {
        dimension: 'E/I',
        weight: 0.6,
        value: -1 // 内向性
      },
      sixteenFactor: {
        dimension: 'warmth',
        weight: 0.8,
        value: 1
      },
      disc: {
        dimension: 'I',
        weight: 0.7,
        value: 1 // 影響型（深い関係）
      }
    }
  },
  {
    id: 12,
    question: t('question12'),
    options: [
      { text: t('stronglyAgree'), value: 2 },
      { text: t('agree'), value: 1 },
      { text: t('neutral'), value: 0 },
      { text: t('disagree'), value: -1 },
      { text: t('stronglyDisagree'), value: -2 }
    ],
    mappings: {
      profilecode: {
        career: { dimension: 'job_preference', weight: 1.0, value: 1 }, // 安定重視
        decision: { dimension: 'risk_tolerance', weight: 0.8, value: -1 } // リスク回避
      },
      fourIndicator: {
        dimension: 'J/P',
        weight: 0.7,
        value: 1 // 判断型
      },
      sixteenFactor: {
        dimension: 'emotional_stability',
        weight: 0.7,
        value: 1
      },
      disc: {
        dimension: 'S',
        weight: 0.8,
        value: 1 // 安定型（安定重視）
      }
    }
  },
  {
    id: 13,
    question: t('question13'),
    options: [
      { text: t('stronglyAgree'), value: 2 },
      { text: t('agree'), value: 1 },
      { text: t('neutral'), value: 0 },
      { text: t('disagree'), value: -1 },
      { text: t('stronglyDisagree'), value: -2 }
    ],
    mappings: {
      profilecode: {
        learning: { dimension: 'learning_method', weight: 1.0, value: 1 }, // 視覚的学習
        career: { dimension: 'job_preference', weight: 0.4, value: 1 } // クリエイティブ
      },
      fourIndicator: {
        dimension: 'S/N',
        weight: 0.6,
        value: 1 // 感覚型
      },
      sixteenFactor: {
        dimension: 'abstractedness',
        weight: 0.6,
        value: 1
      },
      disc: {
        dimension: 'C',
        weight: 0.7,
        value: 1 // 慎重型（視覚的学習）
      }
    }
  },
  {
    id: 14,
    question: t('question14'),
    options: [
      { text: t('stronglyAgree'), value: 2 },
      { text: t('agree'), value: 1 },
      { text: t('neutral'), value: 0 },
      { text: t('disagree'), value: -1 },
      { text: t('stronglyDisagree'), value: -2 }
    ],
    mappings: {
      profilecode: {
        career: { dimension: 'job_preference', weight: 1.0, value: 1 }, // 社会的貢献
        communication: { dimension: 'communication_style', weight: 0.7, value: 1 } // 共感的
      },
      fourIndicator: {
        dimension: 'T/F',
        weight: 0.8,
        value: -1 // 感情型
      },
      sixteenFactor: {
        dimension: 'warmth',
        weight: 0.9,
        value: 1
      },
      disc: {
        dimension: 'I',
        weight: 0.8,
        value: 1 // 影響型（社会的貢献）
      }
    }
  },
  {
    id: 15,
    question: t('question15'),
    options: [
      { text: t('stronglyAgree'), value: 2 },
      { text: t('agree'), value: 1 },
      { text: t('neutral'), value: 0 },
      { text: t('disagree'), value: -1 },
      { text: t('stronglyDisagree'), value: -2 }
    ],
    mappings: {
      profilecode: {
        stress: { dimension: 'stress_recovery', weight: 1.0, value: 1 }, // 社会的サポート
        communication: { dimension: 'communication_style', weight: 0.8, value: 1 } // 社交的
      },
      fourIndicator: {
        dimension: 'E/I',
        weight: 0.9,
        value: 1 // 外向性
      },
      sixteenFactor: {
        dimension: 'warmth',
        weight: 0.8,
        value: 1
      },
      disc: {
        dimension: 'I',
        weight: 0.9,
        value: 1 // 影響型（社会的サポート）
      }
    }
  },
  {
    id: 16,
    question: t('question16'),
    options: [
      { text: t('stronglyAgree'), value: 2 },
      { text: t('agree'), value: 1 },
      { text: t('neutral'), value: 0 },
      { text: t('disagree'), value: -1 },
      { text: t('stronglyDisagree'), value: -2 }
    ],
    mappings: {
      profilecode: {
        career: { dimension: 'job_preference', weight: 1.0, value: 1 }, // 専門家型
        learning: { dimension: 'learning_method', weight: 0.7, value: 1 } // 深い学習
      },
      fourIndicator: {
        dimension: 'S/N',
        weight: 0.6,
        value: 1 // 感覚型
      },
      sixteenFactor: {
        dimension: 'reasoning',
        weight: 0.8,
        value: 1
      },
      disc: {
        dimension: 'C',
        weight: 0.8,
        value: 1 // 慎重型（専門性）
      }
    }
  },
  {
    id: 17,
    question: t('question17'),
    options: [
      { text: t('stronglyAgree'), value: 2 },
      { text: t('agree'), value: 1 },
      { text: t('neutral'), value: 0 },
      { text: t('disagree'), value: -1 },
      { text: t('stronglyDisagree'), value: -2 }
    ],
    mappings: {
      profilecode: {
        career: { dimension: 'work_style', weight: 0.8, value: 1 }, // 柔軟性
        decision: { dimension: 'decision_method', weight: 0.6, value: -1 } // 柔軟な判断
      },
      fourIndicator: {
        dimension: 'J/P',
        weight: 0.8,
        value: -1 // 知覚型
      },
      sixteenFactor: {
        dimension: 'openness_to_change',
        weight: 0.7,
        value: 1
      },
      disc: {
        dimension: 'D',
        weight: 0.7,
        value: 1 // 主導型（柔軟性）
      }
    }
  },
  {
    id: 18,
    question: t('question18'),
    options: [
      { text: t('stronglyAgree'), value: 2 },
      { text: t('agree'), value: 1 },
      { text: t('neutral'), value: 0 },
      { text: t('disagree'), value: -1 },
      { text: t('stronglyDisagree'), value: -2 }
    ],
    mappings: {
      profilecode: {
        communication: { dimension: 'communication_style', weight: 1.0, value: 1 }, // 論理的
        decision: { dimension: 'decision_method', weight: 0.7, value: 1 } // 論理的判断
      },
      fourIndicator: {
        dimension: 'T/F',
        weight: 0.9,
        value: 1 // 思考型
      },
      sixteenFactor: {
        dimension: 'reasoning',
        weight: 0.9,
        value: 1
      },
      disc: {
        dimension: 'C',
        weight: 0.9,
        value: 1 // 慎重型（論理的）
      }
    }
  },
  {
    id: 19,
    question: t('question19'),
    options: [
      { text: t('stronglyAgree'), value: 2 },
      { text: t('agree'), value: 1 },
      { text: t('neutral'), value: 0 },
      { text: t('disagree'), value: -1 },
      { text: t('stronglyDisagree'), value: -2 }
    ],
    mappings: {
      profilecode: {
        career: { dimension: 'job_preference', weight: 0.9, value: 1 }, // 成長重視
        decision: { dimension: 'risk_tolerance', weight: 0.8, value: 1 } // リスク許容
      },
      fourIndicator: {
        dimension: 'S/N',
        weight: 0.7,
        value: -1 // 直観型
      },
      sixteenFactor: {
        dimension: 'openness_to_change',
        weight: 0.9,
        value: 1
      },
      disc: {
        dimension: 'D',
        weight: 0.8,
        value: 1 // 主導型（挑戦的）
      }
    }
  },
  {
    id: 20,
    question: t('question20'),
    options: [
      { text: t('stronglyAgree'), value: 2 },
      { text: t('agree'), value: 1 },
      { text: t('neutral'), value: 0 },
      { text: t('disagree'), value: -1 },
      { text: t('stronglyDisagree'), value: -2 }
    ],
    mappings: {
      profilecode: {
        career: { dimension: 'work_style', weight: 0.9, value: -1 }, // 独立型
        communication: { dimension: 'communication_style', weight: 0.6, value: -1 } // 内向的
      },
      fourIndicator: {
        dimension: 'E/I',
        weight: 0.9,
        value: -1 // 内向性
      },
      sixteenFactor: {
        dimension: 'self_reliance',
        weight: 0.8,
        value: 1
      },
      disc: {
        dimension: 'S',
        weight: 0.7,
        value: 1 // 安定型（一人で集中）
      }
    }
  },
  {
    id: 21,
    question: t('question21'),
    options: [
      { text: t('stronglyAgree'), value: 2 },
      { text: t('agree'), value: 1 },
      { text: t('neutral'), value: 0 },
      { text: t('disagree'), value: -1 },
      { text: t('stronglyDisagree'), value: -2 }
    ],
    mappings: {
      profilecode: {
        learning: { dimension: 'learning_method', weight: 1.0, value: 1 }, // 体系的学習
        decision: { dimension: 'decision_method', weight: 0.6, value: 1 } // 計画重視
      },
      fourIndicator: {
        dimension: 'J/P',
        weight: 0.7,
        value: 1 // 判断型
      },
      sixteenFactor: {
        dimension: 'perfectionism',
        weight: 0.7,
        value: 1
      },
      disc: {
        dimension: 'C',
        weight: 0.8,
        value: 1 // 慎重型（体系的）
      }
    }
  },
  {
    id: 22,
    question: t('question22'),
    options: [
      { text: t('stronglyAgree'), value: 2 },
      { text: t('agree'), value: 1 },
      { text: t('neutral'), value: 0 },
      { text: t('disagree'), value: -1 },
      { text: t('stronglyDisagree'), value: -2 }
    ],
    mappings: {
      profilecode: {
        career: { dimension: 'work_style', weight: 1.0, value: 1 }, // リーダー型
        communication: { dimension: 'communication_style', weight: 0.7, value: 1 } // 主導的
      },
      fourIndicator: {
        dimension: 'E/I',
        weight: 0.8,
        value: 1 // 外向性
      },
      sixteenFactor: {
        dimension: 'dominance',
        weight: 0.9,
        value: 1
      },
      disc: {
        dimension: 'D',
        weight: 1.0,
        value: 1 // 主導型（リーダーシップ）
      }
    }
  },
  {
    id: 23,
    question: t('question23'),
    options: [
      { text: t('stronglyAgree'), value: 2 },
      { text: t('agree'), value: 1 },
      { text: t('neutral'), value: 0 },
      { text: t('disagree'), value: -1 },
      { text: t('stronglyDisagree'), value: -2 }
    ],
    mappings: {
      profilecode: {
        stress: { dimension: 'stress_recovery', weight: 1.0, value: 1 }, // 活動的リカバリー
        career: { dimension: 'work_style', weight: 0.4, value: 1 } // 活動的
      },
      fourIndicator: {
        dimension: 'E/I',
        weight: 0.6,
        value: 1 // 外向性
      },
      sixteenFactor: {
        dimension: 'liveliness',
        weight: 0.8,
        value: 1
      },
      disc: {
        dimension: 'I',
        weight: 0.7,
        value: 1 // 影響型（活動的）
      }
    }
  },
  {
    id: 24,
    question: t('question24'),
    options: [
      { text: t('stronglyAgree'), value: 2 },
      { text: t('agree'), value: 1 },
      { text: t('neutral'), value: 0 },
      { text: t('disagree'), value: -1 },
      { text: t('stronglyDisagree'), value: -2 }
    ],
    mappings: {
      profilecode: {
        decision: { dimension: 'decision_method', weight: 1.0, value: 1 }, // 慎重分析
        learning: { dimension: 'learning_method', weight: 0.6, value: 1 } // 詳細学習
      },
      fourIndicator: {
        dimension: 'J/P',
        weight: 0.7,
        value: 1 // 判断型
      },
      sixteenFactor: {
        dimension: 'perfectionism',
        weight: 0.8,
        value: 1
      },
      disc: {
        dimension: 'C',
        weight: 0.9,
        value: 1 // 慎重型（詳細確認）
      }
    }
  },
  {
    id: 25,
    question: t('question25'),
    options: [
      { text: t('stronglyAgree'), value: 2 },
      { text: t('agree'), value: 1 },
      { text: t('neutral'), value: 0 },
      { text: t('disagree'), value: -1 },
      { text: t('stronglyDisagree'), value: -2 }
    ],
    mappings: {
      profilecode: {
        communication: { dimension: 'communication_style', weight: 1.0, value: 1 }, // 社交的ネットワーカー
        career: { dimension: 'work_style', weight: 0.6, value: 1 } // ネットワーク型
      },
      fourIndicator: {
        dimension: 'E/I',
        weight: 0.9,
        value: 1 // 外向性
      },
      sixteenFactor: {
        dimension: 'warmth',
        weight: 0.8,
        value: 1
      },
      disc: {
        dimension: 'I',
        weight: 0.9,
        value: 1 // 影響型（広い人間関係）
      }
    }
  },
  {
    id: 26,
    question: t('question26'),
    options: [
      { text: t('stronglyAgree'), value: 2 },
      { text: t('agree'), value: 1 },
      { text: t('neutral'), value: 0 },
      { text: t('disagree'), value: -1 },
      { text: t('stronglyDisagree'), value: -2 }
    ],
    mappings: {
      profilecode: {
        career: { dimension: 'work_style', weight: 0.9, value: -1 }, // 独立型
        decision: { dimension: 'decision_method', weight: 0.5, value: -1 } // 独立判断
      },
      fourIndicator: {
        dimension: 'E/I',
        weight: 0.7,
        value: -1 // 内向性
      },
      sixteenFactor: {
        dimension: 'self_reliance',
        weight: 0.8,
        value: 1
      },
      disc: {
        dimension: 'S',
        weight: 0.7,
        value: 1 // 安定型（自分のペース）
      }
    }
  },
  {
    id: 27,
    question: t('question27'),
    options: [
      { text: t('stronglyAgree'), value: 2 },
      { text: t('agree'), value: 1 },
      { text: t('neutral'), value: 0 },
      { text: t('disagree'), value: -1 },
      { text: t('stronglyDisagree'), value: -2 }
    ],
    mappings: {
      profilecode: {
        learning: { dimension: 'learning_method', weight: 1.0, value: 1 }, // 体験的学習
        decision: { dimension: 'risk_tolerance', weight: 0.7, value: 1 } // リスク許容
      },
      fourIndicator: {
        dimension: 'J/P',
        weight: 0.6,
        value: -1 // 知覚型
      },
      sixteenFactor: {
        dimension: 'openness_to_change',
        weight: 0.8,
        value: 1
      },
      disc: {
        dimension: 'D',
        weight: 0.7,
        value: 1 // 主導型（失敗から学ぶ）
      }
    }
  },
  {
    id: 28,
    question: t('question28'),
    options: [
      { text: t('stronglyAgree'), value: 2 },
      { text: t('agree'), value: 1 },
      { text: t('neutral'), value: 0 },
      { text: t('disagree'), value: -1 },
      { text: t('stronglyDisagree'), value: -2 }
    ],
    mappings: {
      profilecode: {
        communication: { dimension: 'conflict_style', weight: 1.0, value: 1 }, // 回避型
        stress: { dimension: 'stress_recovery', weight: 0.5, value: 1 } // 回避的
      },
      fourIndicator: {
        dimension: 'T/F',
        weight: 0.6,
        value: -1 // 感情型
      },
      sixteenFactor: {
        dimension: 'emotional_stability',
        weight: 0.7,
        value: 1
      },
      disc: {
        dimension: 'S',
        weight: 0.8,
        value: 1 // 安定型（対立回避）
      }
    }
  },
  {
    id: 29,
    question: t('question29'),
    options: [
      { text: t('stronglyAgree'), value: 2 },
      { text: t('agree'), value: 1 },
      { text: t('neutral'), value: 0 },
      { text: t('disagree'), value: -1 },
      { text: t('stronglyDisagree'), value: -2 }
    ],
    mappings: {
      profilecode: {
        decision: { dimension: 'decision_speed', weight: 1.0, value: 1 }, // 迅速決断
        career: { dimension: 'work_style', weight: 0.5, value: 1 } // 迅速対応
      },
      fourIndicator: {
        dimension: 'J/P',
        weight: 0.7,
        value: -1 // 知覚型
      },
      sixteenFactor: {
        dimension: 'liveliness',
        weight: 0.7,
        value: 1
      },
      disc: {
        dimension: 'D',
        weight: 0.8,
        value: 1 // 主導型（迅速判断）
      }
    }
  },
  {
    id: 30,
    question: t('question30'),
    options: [
      { text: t('stronglyAgree'), value: 2 },
      { text: t('agree'), value: 1 },
      { text: t('neutral'), value: 0 },
      { text: t('disagree'), value: -1 },
      { text: t('stronglyDisagree'), value: -2 }
    ],
    mappings: {
      profilecode: {
        learning: { dimension: 'learning_method', weight: 1.0, value: 1 }, // 統合的学習
        decision: { dimension: 'decision_method', weight: 0.5, value: 1 } // 統合的判断
      },
      fourIndicator: {
        dimension: 'S/N',
        weight: 0.5,
        value: 0 // バランス
      },
      sixteenFactor: {
        dimension: 'openness_to_change',
        weight: 0.8,
        value: 1
      },
      disc: {
        dimension: 'I',
        weight: 0.7,
        value: 1 // 影響型（統合的学習）
      }
    }
  },
  {
    id: 31,
    question: t('question31'),
    options: [
      { text: t('stronglyAgree'), value: 2 },
      { text: t('agree'), value: 1 },
      { text: t('neutral'), value: 0 },
      { text: t('disagree'), value: -1 },
      { text: t('stronglyDisagree'), value: -2 }
    ],
    mappings: {
      profilecode: {
        decision: { dimension: 'decision_method', weight: 1.0, value: 1 }, // 計画重視
        career: { dimension: 'job_preference', weight: 0.7, value: 1 } // 成長重視
      },
      fourIndicator: {
        dimension: 'J/P',
        weight: 0.9,
        value: 1 // 判断型
      },
      sixteenFactor: {
        dimension: 'perfectionism',
        weight: 0.8,
        value: 1
      },
      disc: {
        dimension: 'C',
        weight: 0.8,
        value: 1 // 慎重型（計画性）
      }
    }
  },
  {
    id: 32,
    question: t('question32'),
    options: [
      { text: t('stronglyAgree'), value: 2 },
      { text: t('agree'), value: 1 },
      { text: t('neutral'), value: 0 },
      { text: t('disagree'), value: -1 },
      { text: t('stronglyDisagree'), value: -2 }
    ],
    mappings: {
      profilecode: {
        communication: { dimension: 'communication_style', weight: 1.0, value: 1 }, // 相談重視
        decision: { dimension: 'decision_method', weight: 0.9, value: 1 } // 相談重視
      },
      fourIndicator: {
        dimension: 'T/F',
        weight: 0.7,
        value: -1 // 感情型
      },
      sixteenFactor: {
        dimension: 'warmth',
        weight: 0.8,
        value: 1
      },
      disc: {
        dimension: 'I',
        weight: 0.8,
        value: 1 // 影響型（相談重視）
      }
    }
  },
  {
    id: 33,
    question: t('question33'),
    options: [
      { text: t('stronglyAgree'), value: 2 },
      { text: t('agree'), value: 1 },
      { text: t('neutral'), value: 0 },
      { text: t('disagree'), value: -1 },
      { text: t('stronglyDisagree'), value: -2 }
    ],
    mappings: {
      profilecode: {
        learning: { dimension: 'learning_method', weight: 1.0, value: 1 }, // 実践的学習
        decision: { dimension: 'risk_tolerance', weight: 0.8, value: 1 } // リスク許容
      },
      fourIndicator: {
        dimension: 'S/N',
        weight: 0.7,
        value: 1 // 感覚型
      },
      sixteenFactor: {
        dimension: 'openness_to_change',
        weight: 0.9,
        value: 1
      },
      disc: {
        dimension: 'D',
        weight: 0.8,
        value: 1 // 主導型（挑戦的）
      }
    }
  },
  {
    id: 34,
    question: t('question34'),
    options: [
      { text: t('stronglyAgree'), value: 2 },
      { text: t('agree'), value: 1 },
      { text: t('neutral'), value: 0 },
      { text: t('disagree'), value: -1 },
      { text: t('stronglyDisagree'), value: -2 }
    ],
    mappings: {
      profilecode: {
        decision: { dimension: 'decision_method', weight: 1.0, value: 1 }, // データ重視
        communication: { dimension: 'communication_style', weight: 0.7, value: 1 } // 論理的
      },
      fourIndicator: {
        dimension: 'T/F',
        weight: 0.9,
        value: 1 // 思考型
      },
      sixteenFactor: {
        dimension: 'reasoning',
        weight: 0.9,
        value: 1
      },
      disc: {
        dimension: 'C',
        weight: 0.9,
        value: 1 // 慎重型（論理的）
      }
    }
  },
  {
    id: 35,
    question: t('question35'),
    options: [
      { text: t('stronglyAgree'), value: 2 },
      { text: t('agree'), value: 1 },
      { text: t('neutral'), value: 0 },
      { text: t('disagree'), value: -1 },
      { text: t('stronglyDisagree'), value: -2 }
    ],
    mappings: {
      profilecode: {
        decision: { dimension: 'decision_method', weight: 1.0, value: 1 }, // 慎重分析
        learning: { dimension: 'learning_method', weight: 0.6, value: 1 } // 深い学習
      },
      fourIndicator: {
        dimension: 'J/P',
        weight: 0.6,
        value: 1 // 判断型
      },
      sixteenFactor: {
        dimension: 'perfectionism',
        weight: 0.8,
        value: 1
      },
      disc: {
        dimension: 'C',
        weight: 0.9,
        value: 1 // 慎重型（深く考える）
      }
    }
  },
  {
    id: 36,
    question: t('question36'),
    options: [
      { text: t('stronglyAgree'), value: 2 },
      { text: t('agree'), value: 1 },
      { text: t('neutral'), value: 0 },
      { text: t('disagree'), value: -1 },
      { text: t('stronglyDisagree'), value: -2 }
    ],
    mappings: {
      profilecode: {
        career: { dimension: 'work_style', weight: 0.9, value: 1 }, // 柔軟性
        decision: { dimension: 'decision_method', weight: 0.7, value: -1 } // 柔軟な判断
      },
      fourIndicator: {
        dimension: 'J/P',
        weight: 0.8,
        value: -1 // 知覚型
      },
      sixteenFactor: {
        dimension: 'openness_to_change',
        weight: 0.9,
        value: 1
      },
      disc: {
        dimension: 'D',
        weight: 0.7,
        value: 1 // 主導型（柔軟性）
      }
    }
  },
  {
    id: 37,
    question: t('question37'),
    options: [
      { text: t('stronglyAgree'), value: 2 },
      { text: t('agree'), value: 1 },
      { text: t('neutral'), value: 0 },
      { text: t('disagree'), value: -1 },
      { text: t('stronglyDisagree'), value: -2 }
    ],
    mappings: {
      profilecode: {
        communication: { dimension: 'communication_style', weight: 1.0, value: 1 }, // 共感的
        career: { dimension: 'work_style', weight: 0.6, value: 1 } // サポート型
      },
      fourIndicator: {
        dimension: 'T/F',
        weight: 0.9,
        value: -1 // 感情型
      },
      sixteenFactor: {
        dimension: 'warmth',
        weight: 1.0,
        value: 1
      },
      disc: {
        dimension: 'I',
        weight: 0.9,
        value: 1 // 影響型（共感的）
      }
    }
  },
  {
    id: 38,
    question: t('question38'),
    options: [
      { text: t('stronglyAgree'), value: 2 },
      { text: t('agree'), value: 1 },
      { text: t('neutral'), value: 0 },
      { text: t('disagree'), value: -1 },
      { text: t('stronglyDisagree'), value: -2 }
    ],
    mappings: {
      profilecode: {
        career: { dimension: 'work_style', weight: 1.0, value: 1 }, // リーダー型
        decision: { dimension: 'risk_tolerance', weight: 0.8, value: 1 } // リスク許容
      },
      fourIndicator: {
        dimension: 'E/I',
        weight: 0.8,
        value: 1 // 外向性
      },
      sixteenFactor: {
        dimension: 'dominance',
        weight: 0.9,
        value: 1
      },
      disc: {
        dimension: 'D',
        weight: 1.0,
        value: 1 // 主導型（競争的）
      }
    }
  },
  {
    id: 39,
    question: t('question39'),
    options: [
      { text: t('stronglyAgree'), value: 2 },
      { text: t('agree'), value: 1 },
      { text: t('neutral'), value: 0 },
      { text: t('disagree'), value: -1 },
      { text: t('stronglyDisagree'), value: -2 }
    ],
    mappings: {
      profilecode: {
        career: { dimension: 'work_style', weight: 0.8, value: 1 }, // 組織的
        decision: { dimension: 'decision_method', weight: 0.7, value: 1 } // 慎重分析
      },
      fourIndicator: {
        dimension: 'J/P',
        weight: 0.8,
        value: 1 // 判断型
      },
      sixteenFactor: {
        dimension: 'perfectionism',
        weight: 0.9,
        value: 1
      },
      disc: {
        dimension: 'C',
        weight: 0.9,
        value: 1 // 慎重型（丁寧）
      }
    }
  },
  {
    id: 40,
    question: t('question40'),
    options: [
      { text: t('stronglyAgree'), value: 2 },
      { text: t('agree'), value: 1 },
      { text: t('neutral'), value: 0 },
      { text: t('disagree'), value: -1 },
      { text: t('stronglyDisagree'), value: -2 }
    ],
    mappings: {
      profilecode: {
        stress: { dimension: 'stress_recovery', weight: 1.0, value: 1 }, // バランス重視
        career: { dimension: 'work_style', weight: 0.5, value: 0 } // バランス
      },
      fourIndicator: {
        dimension: 'J/P',
        weight: 0.5,
        value: 0 // バランス
      },
      sixteenFactor: {
        dimension: 'emotional_stability',
        weight: 0.8,
        value: 1
      },
      disc: {
        dimension: 'S',
        weight: 0.8,
        value: 1 // 安定型（バランス重視）
      }
    }
  }
  ];
}

// 後方互換性のため、グローバル変数としても提供
// 1～40の質問のみを返す（スターター質問）
let sharedQuestions = getSharedQuestions().filter(q => q.id >= 1 && q.id <= 40);


// 質問データをCSVから読み込む機能

// CSVをパースする関数（より堅牢な実装）
function parseCSV(csvText) {
  const lines = csvText.split(/\r?\n/);
  if (lines.length < 2) return [];
  
  // ヘッダー行を取得
  const headers = parseCSVLine(lines[0]);
  
  // データ行をパース
  const questions = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const values = parseCSVLine(line);
    if (values.length < headers.length) continue;
    
    // オブジェクトに変換
    const question = {};
    headers.forEach((header, index) => {
      question[header] = values[index] || '';
    });
    
    // is_deletedが0でない場合はスキップ
    const isDeletedFlag = String(question.is_deleted || '').trim().toLowerCase();
    if (isDeletedFlag && isDeletedFlag !== '0' && isDeletedFlag !== 'false') {
      continue;
    }
    
    questions.push(question);
  }
  
  return questions;
}

// CSVの1行をパース（カンマや引用符を考慮）
function parseCSVLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = i < line.length - 1 ? line[i + 1] : '';
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // エスケープされた引用符
        current += '"';
        i++; // 次の文字をスキップ
      } else {
        // 引用符の開始/終了
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // カンマで区切る
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  // 最後の値を追加
  values.push(current.trim());
  
  return values;
}

function isStarterQuestion(value) {
  const normalized = String(value || '').trim().toLowerCase();
  return normalized === 'true' || normalized === '1';
}

// 言語コードのマッピング（CSVの列名 → i18nの言語コード）
const langColumnMap = {
  'en': 'question_text',
  'ja': 'question_text_ja',
  'ko': 'question_text_ko',
  'zh': 'question_text_zh_hans',
  'zh_hant': 'question_text_zh_hant',
  'es': 'question_text_es',
  'fr': 'question_text_fr',
  'pt': 'question_text_pt',
  'ar': 'question_text_ar',
  'hi': 'question_text_hi',
  'de': 'question_text_de',
  'it': 'question_text_it',
  'id': 'question_text_id'
};

function resolveLanguage(lang) {
  if (lang) {
    if (typeof i18n !== 'undefined' && typeof i18n.normalizeLanguage === 'function') {
      return i18n.normalizeLanguage(lang);
    }
    return lang;
  }
  if (typeof i18n !== 'undefined') {
    return i18n.getCurrentLanguage();
  }
  return 'en';
}

function getDefaultOptions(t) {
  return [
    { text: t('stronglyAgree'), value: 2 },
    { text: t('agree'), value: 1 },
    { text: t('neutral'), value: 0 },
    { text: t('disagree'), value: -1 },
    { text: t('stronglyDisagree'), value: -2 }
  ];
}

// 質問データをキャッシュ
let questionsCache = null;
let questionsCacheLang = null;

// CSVから質問データを読み込む
async function loadQuestionsFromCSV(lang = 'en') {
  // キャッシュをチェック
  if (questionsCache && questionsCacheLang === lang) {
    return questionsCache;
  }
  
  try {
    // CSVファイルを読み込む
    const response = await fetch('questions_rows.csv');
    if (!response.ok) {
      throw new Error(`Failed to load questions CSV: ${response.status}`);
    }
    
    const csvText = await response.text();
    const questions = parseCSV(csvText);
    
    // 言語に応じて質問テキストを取得
    const langColumn = langColumnMap[lang] || langColumnMap['en'];
    
    // 質問データを整形
    const formattedQuestions = questions
      .filter(q => isStarterQuestion(q.starter) && q.question_id && q.question_id !== '') // スターター質問のみ
      .map(q => {
        const questionId = parseInt(q.question_id);
        if (isNaN(questionId)) return null;
        
        return {
          id: questionId,
          question: q[langColumn] || q.question_text || '', // フォールバックは英語
          originalData: q
        };
      })
      .filter(q => q !== null) // nullを除外
      .sort((a, b) => a.id - b.id); // ID順にソート
    
    // キャッシュに保存
    questionsCache = formattedQuestions;
    questionsCacheLang = lang;
    
    return formattedQuestions;
  } catch (error) {
    console.error('Error loading questions from CSV:', error);
    // エラー時は空配列を返す（フォールバック）
    return [];
  }
}

// 質問データを取得（CSVから読み込むか、フォールバックを使用）
async function getQuestionsFromCSV(lang = null) {
  const resolvedLang = resolveLanguage(lang);
  const questions = await loadQuestionsFromCSV(resolvedLang);
  const baseQuestions = typeof getSharedQuestions === 'function' ? getSharedQuestions() : [];
  
  // 質問が見つからない場合は、既存のgetSharedQuestions()を使用
  if (questions.length === 0) {
    if (baseQuestions.length > 0) {
      console.warn('CSVから質問を読み込めませんでした。フォールバックを使用します。');
      return baseQuestions;
    }
    return [];
  }
  
  if (baseQuestions.length > 0) {
    const questionMap = new Map(questions.map(q => [q.id, q]));
    return baseQuestions.map(baseQ => {
      const csvQ = questionMap.get(baseQ.id);
      if (csvQ && csvQ.question) {
        return { ...baseQ, question: csvQ.question };
      }
      return baseQ;
    });
  }

  // baseQuestionsがない場合はCSVのみで構成する
  const t = typeof i18n !== 'undefined'
    ? (key) => i18n.t(key)
    : (key) => {
      const translations = typeof translations !== 'undefined' ? translations : {};
      const table = translations[resolvedLang] || {};
      const fallback = translations['en'] || {};
      return table[key] || fallback[key] || key;
    };

  return questions.map(q => ({
    id: q.id,
    question: q.question,
    options: getDefaultOptions(t),
    mappings: {}
  }));
}

// 言語変更時にキャッシュをクリア
if (typeof document !== 'undefined') {
  document.addEventListener('languageChanged', function(event) {
    if (event.detail && event.detail.lang !== questionsCacheLang) {
      questionsCache = null;
      questionsCacheLang = null;
    }
  });
}


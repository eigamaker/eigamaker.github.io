// 国際化（i18n）ユーティリティ
class I18n {
  constructor() {
    this.currentLang = this.detectLanguage();
    this.loadLanguage();
  }

  // ブラウザの言語設定を検出
  detectLanguage() {
    // LocalStorageから保存された言語設定を取得
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang && (savedLang === 'ja' || savedLang === 'en')) {
      return savedLang;
    }

    // ブラウザの言語設定を取得
    const browserLang = navigator.language || navigator.userLanguage;
    const langCode = browserLang.split('-')[0].toLowerCase();

    // 日本語以外の場合は英語を返す
    if (langCode === 'ja') {
      return 'ja';
    } else {
      return 'en';
    }
  }

  // 言語を設定
  setLanguage(lang) {
    if (lang === 'ja' || lang === 'en') {
      this.currentLang = lang;
      localStorage.setItem('preferredLanguage', lang);
      this.loadLanguage();
      this.updatePageLanguage();
      return true;
    }
    return false;
  }

  // 現在の言語を取得
  getCurrentLanguage() {
    return this.currentLang;
  }

  // 翻訳を取得
  t(key, params = {}) {
    const translation = translations[this.currentLang];
    if (!translation || !translation[key]) {
      // フォールバック: 英語を試す
      const fallback = translations['en'];
      if (fallback && fallback[key]) {
        let text = fallback[key];
        // パラメータを置換
        Object.keys(params).forEach(param => {
          text = text.replace(`{${param}}`, params[param]);
        });
        return text;
      }
      return key; // 翻訳が見つからない場合はキーを返す
    }

    let text = translation[key];
    // パラメータを置換
    Object.keys(params).forEach(param => {
      text = text.replace(`{${param}}`, params[param]);
    });
    return text;
  }

  // HTMLのlang属性を更新
  updatePageLanguage() {
    document.documentElement.lang = this.currentLang;
  }

  // 言語を読み込んでページを更新
  loadLanguage() {
    this.updatePageLanguage();
    // カスタムイベントを発火して、ページの更新を通知
    document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: this.currentLang } }));
  }

  // 言語切り替えボタンのテキストを更新
  updateLanguageButtons() {
    const buttons = document.querySelectorAll('.lang-btn');
    buttons.forEach(btn => {
      if (btn.dataset.lang === this.currentLang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }
}

// グローバルインスタンスを作成
const i18n = new I18n();


// 国際化（i18n）ユーティリティ
class I18n {
  constructor() {
    this.currentLang = this.detectLanguage();
    this.loadLanguage();
  }

  // サポートされている言語のリスト
  getSupportedLanguages() {
    return ['ar', 'de', 'en', 'es', 'fr', 'hi', 'id', 'it', 'ja', 'ko', 'pt', 'zh', 'zh_hant'];
  }

  getDefaultLanguage() {
    return 'en';
  }

  normalizeLanguage(lang) {
    if (!lang) return null;

    const normalized = String(lang).toLowerCase().replace('_', '-');
    const langMap = {
      'zh-cn': 'zh',
      'zh-hans': 'zh',
      'zh-tw': 'zh_hant',
      'zh-hant': 'zh_hant',
      'zh-hk': 'zh_hant'
    };

    if (langMap[normalized]) {
      return langMap[normalized];
    }

    const baseLang = normalized.split('-')[0];
    return langMap[baseLang] || baseLang;
  }

  // ブラウザの言語設定を検出
  detectLanguage() {
    const supportedLanguages = this.getSupportedLanguages();
    
    // 1. URLパラメータ ?lang= を最優先
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    if (urlLang) {
      const normalizedUrlLang = this.normalizeLanguage(urlLang);
      if (normalizedUrlLang && supportedLanguages.includes(normalizedUrlLang)) {
        return normalizedUrlLang;
      }
    }
    
    // 2. Referer が /en/ 配下なら英語を優先
    const referer = document.referrer;
    if (referer && referer.includes('/en/')) {
      return 'en';
    }
    
    // 3. LocalStorageから保存された言語設定を取得
    const savedLang = this.normalizeLanguage(localStorage.getItem('preferredLanguage'));
    if (savedLang && supportedLanguages.includes(savedLang)) {
      return savedLang;
    }

    // 4. ブラウザの言語設定を取得
    const browserLang = navigator.language || navigator.userLanguage;
    const normalizedLang = this.normalizeLanguage(browserLang);
    if (normalizedLang && supportedLanguages.includes(normalizedLang)) {
      return normalizedLang;
    }

    // 5. デフォルトは英語
    return this.getDefaultLanguage();
  }

  // 言語を設定
  setLanguage(lang) {
    const supportedLanguages = this.getSupportedLanguages();
    const normalizedLang = this.normalizeLanguage(lang);
    if (normalizedLang && supportedLanguages.includes(normalizedLang)) {
      this.currentLang = normalizedLang;
      localStorage.setItem('preferredLanguage', normalizedLang);
      this.loadLanguage();
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
    if (typeof translations === 'undefined') {
      return key;
    }

    const translation = translations[this.currentLang] || {};
    const fallback = translations[this.getDefaultLanguage()] || {};
    const hasTranslation = Object.prototype.hasOwnProperty.call(translation, key);
    const hasFallback = Object.prototype.hasOwnProperty.call(fallback, key);
    const text = hasTranslation ? translation[key] : (hasFallback ? fallback[key] : null);

    if (text === null || typeof text === 'undefined') {
      return key;
    }

    return this.interpolate(text, params);
  }

  interpolate(text, params = {}) {
    let result = String(text);
    Object.keys(params).forEach(param => {
      const escaped = param.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      result = result.replace(new RegExp(`\\{${escaped}\\}`, 'g'), params[param]);
    });
    return result;
  }

  // HTMLのlang属性を更新
  updatePageLanguage() {
    if (document.documentElement) {
      document.documentElement.lang = this.currentLang;
    }
  }

  // メタタグを更新
  updateMetaTags() {
    if (typeof translations === 'undefined') return;
    
    const translation = translations[this.currentLang];
    if (!translation) return;

    // titleを更新
    if (translation.pageTitle) {
      document.title = translation.pageTitle;
    } else if (translation.testTitle) {
      document.title = translation.testTitle;
    } else if (translation.inquiryTitle) {
      document.title = translation.inquiryTitle;
    }

    // meta descriptionを更新
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      const desc = translation.metaDescription || translation.testMetaDescription || translation.inquiryMetaDescription;
      if (desc) {
        metaDescription.content = desc.replace(/<br\s*\/?>/gi, ' ').trim();
      }
    }
  }

  // 言語を読み込んでページを更新
  loadLanguage() {
    this.updatePageLanguage();
    this.updateMetaTags();
    // カスタムイベントを発火して、ページの更新を通知
    if (typeof document !== 'undefined') {
      document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: this.currentLang } }));
    }
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


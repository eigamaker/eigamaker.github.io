// Fallback result translations: use English details when specific language data is missing.
if (typeof resultTranslations !== 'undefined' && resultTranslations.en) {
  const fallbackLangs = ['de', 'fr', 'es', 'it', 'pt', 'ar', 'hi', 'zh', 'zh_hant', 'ko'];

  fallbackLangs.forEach(lang => {
    const existing = resultTranslations[lang] || {};
    const merged = { ...resultTranslations.en, ...existing };

    merged.careerTypes = existing.careerTypes || resultTranslations.en.careerTypes;
    merged.learningTypes = existing.learningTypes || resultTranslations.en.learningTypes;
    merged.mbti = existing.mbti || resultTranslations.en.mbti;
    merged.sixteenFactor = existing.sixteenFactor || resultTranslations.en.sixteenFactor;
    merged.disc = existing.disc || resultTranslations.en.disc;

    resultTranslations[lang] = merged;
  });
}

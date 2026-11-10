/**
 * Storage Module
 * Manages persistence in LocalStorage for words, settings, and theme preferences.
 */

(function() {
  const STORAGE_KEYS = {
    WORDS: 'textSanitizer_words',
    SETTINGS: 'textSanitizer_settings',
    THEME: 'textSanitizer_theme',
    DEFAULTS_VERSION: 'textSanitizer_defaultsVersion'
  };

  const buildDefaultWords = () => window.DefaultWords.build();

  const normalizeWords = (words) => {
    if (!Array.isArray(words)) return [];

    return words
      .map((item, index) => {
        if (typeof item === 'string') {
          const word = item.trim();
          if (!word) return null;
          return {
            id: `imported-${index + 1}-${Date.now()}`,
            word,
            category: window.DefaultWords.getCategory(word),
            active: true,
            createdAt: new Date().toISOString()
          };
        }

        if (!item || typeof item !== 'object' || typeof item.word !== 'string' || !item.word.trim()) {
          return null;
        }

        const word = item.word.trim();
        return {
          ...item,
          word,
          category: item.category || window.DefaultWords.getCategory(word),
          active: item.active !== false
        };
      })
      .filter(Boolean);
  };

  // Adds any default words missing from a saved list, once per defaults version.
  const migrateDefaults = (words) => {
    const normalized = normalizeWords(words);
    let applied = 0;
    try { applied = Number(localStorage.getItem(STORAGE_KEYS.DEFAULTS_VERSION)) || 0; } catch (e) { return normalized; }
    if (applied >= window.DefaultWords.VERSION) return normalized;

    const existing = new Set(normalized.map(w => w.word.toLowerCase()));
    const merged = [...normalized];
    buildDefaultWords().forEach(def => {
      if (!existing.has(def.word.toLowerCase())) merged.push(def);
    });

    try {
      localStorage.setItem(STORAGE_KEYS.WORDS, JSON.stringify(merged));
      localStorage.setItem(STORAGE_KEYS.DEFAULTS_VERSION, String(window.DefaultWords.VERSION));
    } catch (e) {
      console.error('Error saving migrated words to LocalStorage:', e);
    }
    return merged;
  };

  const DEFAULT_SETTINGS = {
    replacementStyle: 'hyphenated-all', // Default: pay -> p-a-y
    customReplacement: '[FILTERED]',
    sanitizerSymbol: '-',
    caseSensitive: false,
    wholeWord: true,
    preserveLength: false,
    detectEmails: true,
    detectPhones: true,
    detectLinks: true,
    detectHandles: true,
    smartLabels: true
  };

  window.Storage = {
    getWords() {
      try {
        const data = localStorage.getItem(STORAGE_KEYS.WORDS);
        if (data === null) {
          const defaults = buildDefaultWords();
          this.saveWords(defaults);
          localStorage.setItem(STORAGE_KEYS.DEFAULTS_VERSION, String(window.DefaultWords.VERSION));
          return defaults;
        }
        const parsed = JSON.parse(data);
        return Array.isArray(parsed) ? migrateDefaults(parsed) : buildDefaultWords();
      } catch (e) {
        console.error('Error reading words from LocalStorage:', e);
        return buildDefaultWords();
      }
    },

    getDefaultWords() {
      return buildDefaultWords();
    },

    saveWords(words) {
      try {
        localStorage.setItem(STORAGE_KEYS.WORDS, JSON.stringify(words));
      } catch (e) {
        console.error('Error saving words to LocalStorage:', e);
      }
    },

    getSettings() {
      try {
        const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
        if (data === null) {
          return { ...DEFAULT_SETTINGS };
        }
        const parsed = JSON.parse(data);
        return { ...DEFAULT_SETTINGS, ...parsed };
      } catch (e) {
        console.error('Error reading settings from LocalStorage:', e);
        return { ...DEFAULT_SETTINGS };
      }
    },

    saveSettings(settings) {
      try {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      } catch (e) {
        console.error('Error saving settings to LocalStorage:', e);
      }
    },

    getTheme() {
      return localStorage.getItem(STORAGE_KEYS.THEME);
    },

    saveTheme(theme) {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    },

    clearAllData() {
      localStorage.removeItem(STORAGE_KEYS.WORDS);
      localStorage.removeItem(STORAGE_KEYS.SETTINGS);
      localStorage.removeItem(STORAGE_KEYS.THEME);
      localStorage.removeItem(STORAGE_KEYS.DEFAULTS_VERSION);
    }
  };
})();

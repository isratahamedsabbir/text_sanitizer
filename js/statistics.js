/**
 * Statistics Module
 * Calculates text metrics such as character count, word count, line count.
 */

(function() {
  const root = typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : global);

  root.Statistics = {
    countCharacters(text) {
      if (!text) return 0;
      return text.length;
    },

    countWords(text) {
      if (!text || !text.trim()) return 0;
      const words = text.trim().split(/\s+/);
      return words.filter(w => w.length > 0).length;
    },

    getSummaryStats(rawText, sanitizedText, sanitizationStats = {}) {
      return {
        totalChars: this.countCharacters(rawText),
        totalWords: this.countWords(rawText),
        detectedWords: sanitizationStats.detectedCount || 0,
        replacedWords: sanitizationStats.replacementCount || 0,
        uniqueMatches: sanitizationStats.uniqueMatchesCount || 0,
        matchedList: sanitizationStats.matchedList || []
      };
    }
  };
})();

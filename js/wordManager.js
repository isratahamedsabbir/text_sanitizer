/**
 * Word Manager Module
 * Manages blocked words CRUD operations, duplicate checks, search filtering,
 * active status toggles, and LocalStorage updates.
 */

(function() {
  window.WordManager = {
    words: [],
    searchQuery: '',
    lastDeletedWord: null,

    init() {
      this.words = window.Storage.getWords();
    },

    getAllWords() {
      return this.words;
    },

    getWords() {
      if (!this.searchQuery) {
        return this.words;
      }
      const query = this.searchQuery.trim().toLowerCase();
      return this.words.filter(item => item.word.toLowerCase().includes(query));
    },

    getTotalCount() {
      return this.words.length;
    },

    getActiveCount() {
      return this.words.filter(w => w.active !== false).length;
    },

    isDuplicate(wordStr, excludeId = null) {
      const normalized = wordStr.trim().toLowerCase();
      return this.words.some(item => item.id !== excludeId && item.word.toLowerCase() === normalized);
    },

    addWord(wordStr) {
      if (!wordStr || typeof wordStr !== 'string') {
        window.Toast.error('Please enter a valid word.');
        return null;
      }

      const trimmed = wordStr.trim();
      if (!trimmed) {
        window.Toast.error('Word cannot be empty or only spaces.');
        return null;
      }

      if (this.isDuplicate(trimmed)) {
        window.Toast.warning(`"${trimmed}" is already in your blocked word list.`);
        return null;
      }

      const newWord = {
        id: `w-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        word: trimmed,
        category: window.DefaultWords ? window.DefaultWords.getCategory(trimmed) : 'sensitive',
        active: true,
        createdAt: new Date().toISOString()
      };

      this.words.unshift(newWord);
      window.Storage.saveWords(this.words);
      window.Toast.success(`Added "${trimmed}" to word list.`);
      return newWord;
    },

    addBatchWords(wordList) {
      let addedCount = 0;
      
      wordList.forEach(rawWord => {
        if (!rawWord || typeof rawWord !== 'string') return;
        const trimmed = rawWord.trim();
        if (trimmed && !this.isDuplicate(trimmed)) {
          this.words.push({
            id: `w-${Date.now()}-${Math.random().toString(36).substring(2, 7)}-${addedCount}`,
            word: trimmed,
            category: window.DefaultWords ? window.DefaultWords.getCategory(trimmed) : 'sensitive',
            active: true,
            createdAt: new Date().toISOString()
          });
          addedCount++;
        }
      });

      if (addedCount > 0) {
        window.Storage.saveWords(this.words);
      }
      return addedCount;
    },

    updateWord(id, newWordStr) {
      const trimmed = newWordStr ? newWordStr.trim() : '';
      if (!trimmed) {
        window.Toast.error('Word cannot be empty.');
        return false;
      }

      if (this.isDuplicate(trimmed, id)) {
        window.Toast.warning(`"${trimmed}" already exists in the word list.`);
        return false;
      }

      const index = this.words.findIndex(w => w.id === id);
      if (index !== -1) {
        const oldWord = this.words[index].word;
        this.words[index].word = trimmed;
        window.Storage.saveWords(this.words);
        window.Toast.success(`Updated "${oldWord}" to "${trimmed}".`);
        return true;
      }

      return false;
    },

    toggleStatus(id) {
      const wordObj = this.words.find(w => w.id === id);
      if (wordObj) {
        wordObj.active = !wordObj.active;
        window.Storage.saveWords(this.words);
        window.Toast.info(`"${wordObj.word}" is now ${wordObj.active ? 'Active' : 'Disabled'}.`);
      }
    },

    deleteWord(id) {
      const index = this.words.findIndex(w => w.id === id);
      if (index !== -1) {
        this.lastDeletedWord = { ...this.words[index], index };
        const [removed] = this.words.splice(index, 1);
        window.Storage.saveWords(this.words);
        window.Toast.info(`Removed "${removed.word}".`);
        return true;
      }
      return false;
    },

    undoDelete() {
      if (!this.lastDeletedWord) return false;
      const { index, ...wordObj } = this.lastDeletedWord;
      this.words.splice(index, 0, wordObj);
      window.Storage.saveWords(this.words);
      window.Toast.success(`Restored "${wordObj.word}".`);
      this.lastDeletedWord = null;
      return true;
    },

    setSearchQuery(query) {
      this.searchQuery = query;
    },

    clearAllWords() {
      this.words = [];
      window.Storage.saveWords(this.words);
      window.Toast.warning('All words removed from list.');
    },

    restoreDefaultWords() {
      this.words = window.Storage.getDefaultWords();
      window.Storage.saveWords(this.words);
      window.Toast.success(`Restored ${this.words.length} default Fiverr words.`);
    }
  };
})();

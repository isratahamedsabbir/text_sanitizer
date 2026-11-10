/**
 * Import & Export Module
 * Handles TXT line-separated list import/export and full JSON configuration backup/restore,
 * with file drag-and-drop parsing and strict JSON schema validation.
 */

(function() {
  window.ImportExport = {
    exportTXT() {
      const words = window.WordManager.words.map(w => w.word);
      if (words.length === 0) {
        window.Toast.warning('No words available to export.');
        return;
      }

      const content = words.join('\n');
      this.downloadFile(content, 'sanitizer-words.txt', 'text/plain;charset=utf-8');
      window.Toast.success('Exported words to sanitizer-words.txt');
    },

    importTXT(file, onComplete) {
      if (!file) return;

      if (!file.name.endsWith('.txt') && file.type !== 'text/plain') {
        window.Toast.error('Invalid file format. Please upload a .txt file.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target.result;
          const lines = text.split(/\r?\n/)
            .map(line => line.trim())
            .filter(line => line.length > 0 && !line.startsWith('#'));

          if (lines.length === 0) {
            window.Toast.warning('The imported TXT file is empty.');
            return;
          }

          const addedCount = window.WordManager.addBatchWords(lines);
          window.Toast.success(`${addedCount} new word(s) imported successfully.`);
          if (typeof onComplete === 'function') onComplete();
        } catch (err) {
          console.error('Error reading TXT file:', err);
          window.Toast.error('Failed to parse TXT file.');
        }
      };

      reader.readAsText(file);
    },

    exportJSON() {
      const backupData = {
        app: 'SaniText',
        version: '1.1.0',
        timestamp: new Date().toISOString(),
        words: window.WordManager.words,
        settings: window.Settings.get()
      };

      const jsonStr = JSON.stringify(backupData, null, 2);
      this.downloadFile(jsonStr, 'sanitizer-settings-backup.json', 'application/json;charset=utf-8');
      window.Toast.success('Exported settings & backup to JSON file.');
    },

    importJSON(file, onComplete) {
      if (!file) return;

      if (!file.name.endsWith('.json') && file.type !== 'application/json') {
        window.Toast.error('Invalid file format. Please upload a valid .json file.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target.result);

          if (!parsed || (typeof parsed !== 'object')) {
            throw new Error('Invalid JSON root object.');
          }

          let wordsImported = false;
          let settingsImported = false;

          if (Array.isArray(parsed.words)) {
            const validWords = parsed.words
              .filter(w => w && (typeof w === 'string' || typeof w.word === 'string'))
              .map(w => (typeof w === 'string' ? w : w.word));

            if (validWords.length > 0) {
              window.WordManager.addBatchWords(validWords);
              wordsImported = true;
            }
          }

          if (parsed.settings && typeof parsed.settings === 'object') {
            window.Settings.updateAll(parsed.settings);
            settingsImported = true;
          }

          if (wordsImported || settingsImported) {
            window.Toast.success('JSON backup restored successfully.');
            if (typeof onComplete === 'function') onComplete();
          } else {
            window.Toast.warning('No valid words or settings found in JSON file.');
          }
        } catch (err) {
          console.error('Error parsing JSON backup file:', err);
          window.Toast.error('Invalid JSON structure. Import failed.');
        }
      };

      reader.readAsText(file);
    },

    downloadFile(content, filename, contentType) {
      const blob = new Blob([content], { type: contentType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };
})();

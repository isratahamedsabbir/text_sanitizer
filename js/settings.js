/**
 * Settings Module
 * Manages configuration settings state and synchronization with LocalStorage.
 */

(function() {
  window.Settings = {
    options: {
      replacementStyle: 'hyphenated-all',
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
    },

    init() {
      this.options = window.Storage.getSettings();
    },

    get() {
      return { ...this.options };
    },

    set(key, value) {
      if (Object.prototype.hasOwnProperty.call(this.options, key)) {
        this.options[key] = value;
        window.Storage.saveSettings(this.options);
      }
    },

    updateAll(newSettings) {
      this.options = { ...this.options, ...newSettings };
      window.Storage.saveSettings(this.options);
      window.Toast.success('Settings updated successfully.');
    },

    resetToDefaults() {
      this.options = {
        replacementStyle: 'hyphenated-all',
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
      window.Storage.saveSettings(this.options);
      window.Toast.info('Settings reset to defaults.');
    }
  };
})();

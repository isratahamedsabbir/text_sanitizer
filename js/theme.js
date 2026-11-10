/**
 * Theme Module
 * Manages Dark Mode and Light Mode with LocalStorage persistence.
 */

(function() {
  window.Theme = {
    currentTheme: 'light',

    init() {
      const savedTheme = window.Storage.getTheme();
      this.currentTheme = savedTheme || 'light';

      this.applyTheme(this.currentTheme);
    },

    applyTheme(theme) {
      this.currentTheme = theme;
      document.documentElement.setAttribute('data-theme', theme);
      window.Storage.saveTheme(theme);
      this.syncMetaThemeColor(theme);
      this.updateToggleIcon();
    },

    syncMetaThemeColor(theme) {
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', theme === 'dark' ? '#0d171b' : '#0f9d6c');
    },

    toggleTheme() {
      const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
      this.applyTheme(newTheme);
      return newTheme;
    },

    updateToggleIcon() {
      const toggleBtn = document.getElementById('themeToggleBtn');
      if (!toggleBtn) return;
      
      const sunIcon = toggleBtn.querySelector('.icon-sun');
      const moonIcon = toggleBtn.querySelector('.icon-moon');
      const themeLabel = toggleBtn.querySelector('.theme-label');

      if (this.currentTheme === 'dark') {
        if (sunIcon) sunIcon.style.display = 'inline-block';
        if (moonIcon) moonIcon.style.display = 'none';
        if (themeLabel) themeLabel.textContent = 'Light Mode';
        toggleBtn.setAttribute('aria-label', 'Switch to light mode');
      } else {
        if (sunIcon) sunIcon.style.display = 'none';
        if (moonIcon) moonIcon.style.display = 'inline-block';
        if (themeLabel) themeLabel.textContent = 'Dark Mode';
        toggleBtn.setAttribute('aria-label', 'Switch to dark mode');
      }
    }
  };
})();

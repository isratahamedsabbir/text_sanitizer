/**
 * Notifications Module
 * Reusable toast notification system.
 */

(function() {
  window.Toast = {
    container: null,

    init() {
      let el = document.getElementById('toastContainer');
      if (!el) {
        el = document.createElement('div');
        el.id = 'toastContainer';
        el.className = 'toast-container';
        el.setAttribute('aria-live', 'polite');
        document.body.appendChild(el);
      }
      this.container = el;
    },

    show(message, type = 'info', duration = 3500) {
      if (!this.container) this.init();

      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      
      const icons = {
        success: `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,
        error: `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`,
        warning: `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
        info: `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`
      };

      const iconHtml = icons[type] || icons.info;

      toast.innerHTML = `
        <div class="toast-content">
          ${iconHtml}
          <span class="toast-message"></span>
        </div>
        <button class="toast-close" aria-label="Close notification">&times;</button>
        <div class="toast-progress" style="animation-duration: ${duration}ms;"></div>
      `;

      toast.querySelector('.toast-message').textContent = message;

      const closeBtn = toast.querySelector('.toast-close');
      closeBtn.addEventListener('click', () => this.dismiss(toast));

      this.container.appendChild(toast);

      setTimeout(() => toast.classList.add('show'), 10);

      const timer = setTimeout(() => {
        this.dismiss(toast);
      }, duration);

      toast.dataset.timer = timer;
    },

    dismiss(toast) {
      if (!toast || !toast.parentNode) return;
      clearTimeout(toast.dataset.timer);
      toast.classList.remove('show');
      toast.classList.add('hide');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    },

    success(msg, duration) { this.show(msg, 'success', duration); },
    error(msg, duration) { this.show(msg, 'error', duration); },
    warning(msg, duration) { this.show(msg, 'warning', duration); },
    info(msg, duration) { this.show(msg, 'info', duration); }
  };
})();

/**
 * theme.js
 * Maneja el toggle de modo oscuro / claro.
 * Incluir en TODAS las páginas después de main.css.
 */

const Theme = {

  init() {
    const saved = Storage.getTheme();
    this.apply(saved);
  },

  apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    Storage.setTheme(theme);
    this._updateToggleUI(theme);
  },

  toggle() {
    const current = Storage.getTheme();
    this.apply(current === 'dark' ? 'light' : 'dark');
  },

  _updateToggleUI(theme) {
    const iconSun   = document.getElementById('iconSun');
    const iconMoon  = document.getElementById('iconMoon');
    const label     = document.getElementById('themeLabel');

    if (!iconSun || !iconMoon) return; // página sin toggle

    if (theme === 'dark') {
      iconSun.style.display  = 'none';
      iconMoon.style.display = '';
      if (label) label.textContent = 'OSCURO';
    } else {
      iconSun.style.display  = '';
      iconMoon.style.display = 'none';
      if (label) label.textContent = 'CLARO';
    }
  }
};
const THEME_KEY = 'brainforge-theme';

function getPreferredTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === 'light' || saved === 'dark') {
    return saved;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

function getNextTheme(current) {
  return current === 'dark' ? 'light' : 'dark';
}

function syncToggleLabel(theme, toggleButton) {
  const icon = toggleButton.querySelector('.theme-toggle__icon');
  const text = toggleButton.querySelector('.theme-toggle__text');

  if (!icon || !text) {
    return;
  }

  const isDark = theme === 'dark';
  icon.textContent = isDark ? '☀️' : '🌙';
  text.textContent = isDark ? 'Light mode' : 'Dark mode';
  toggleButton.setAttribute('aria-label', `Activate ${isDark ? 'light' : 'dark'} mode`);
}

export function initTheme() {
  const initialTheme = getPreferredTheme();
  applyTheme(initialTheme);

  const toggleButton = document.getElementById('theme-toggle');
  if (!toggleButton) {
    return;
  }

  syncToggleLabel(initialTheme, toggleButton);

  toggleButton.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const nextTheme = getNextTheme(currentTheme);

    applyTheme(nextTheme);
    localStorage.setItem(THEME_KEY, nextTheme);
    syncToggleLabel(nextTheme, toggleButton);
  });
}

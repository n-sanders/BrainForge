export function renderHeader() {
  return `
    <div class="site-header__inner">
      <div class="branding">
        <p class="branding__title">BrainForge</p>
        <p class="branding__tagline">Sharpen your mind with fun challenges</p>
      </div>
      <button
        class="theme-toggle"
        id="theme-toggle"
        type="button"
        aria-label="Toggle color theme"
        aria-live="polite"
      >
        <span class="theme-toggle__icon" aria-hidden="true">🌙</span>
        <span class="theme-toggle__text">Dark mode</span>
      </button>
    </div>
  `;
}

import { renderHeader } from './components/header.js';
import { initTheme } from './theme.js';
import { initRouter } from './router.js';

function initApp() {
  const header = document.getElementById('site-header');

  if (header) {
    header.innerHTML = renderHeader();
  }

  initTheme();
  initRouter();
}

initApp();

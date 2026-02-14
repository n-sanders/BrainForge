const routes = {
  '/': renderHome,
  '/math-facts': () => renderComingSoon('Math Facts'),
  '/history-maze': () => renderComingSoon('History Maze'),
  '/spelling-sprint': () => renderComingSoon('Spelling Sprint'),
};

function renderHome() {
  return `
    <section class="hero" aria-labelledby="hero-title">
      <h1 id="hero-title">Welcome to BrainForge</h1>
      <p>
        Build confidence and curiosity with engaging activities designed to sharpen learning
        skills one challenge at a time.
      </p>
      <a class="hero__cta" href="#activities">Start Learning</a>
    </section>

    <section class="activities-section" id="activities" aria-labelledby="activities-title">
      <h2 id="activities-title">Choose an Activity</h2>
      <div class="activity-grid">
        ${renderActivityCard('/math-facts', 'Math Facts', 'Practice quick math!')}
        ${renderActivityCard('/history-maze', 'History Maze', 'Explore past events through puzzles!')}
        ${renderActivityCard('/spelling-sprint', 'Spelling Sprint', 'Boost spelling speed and accuracy!')}
      </div>
    </section>
  `;
}

function renderActivityCard(path, title, description) {
  return `
    <article class="activity-card">
      <h3>${title}</h3>
      <p>${description}</p>
      <a class="activity-card__link card-link" href="${path}" data-route="${path}">
        Open Activity →
      </a>
    </article>
  `;
}

function renderComingSoon(activityName) {
  return `
    <section class="route-placeholder" aria-live="polite">
      <div class="route-placeholder__panel">
        <h2>${activityName} — Coming soon!</h2>
        <p>This educational module is under development.</p>
      </div>
    </section>
  `;
}

function getCurrentPath() {
  const path = window.location.pathname;
  return routes[path] ? path : '/';
}

function renderRoute(path = getCurrentPath()) {
  const outlet = document.getElementById('main-content');
  if (!outlet) {
    return;
  }

  const view = routes[path] ?? routes['/'];
  outlet.innerHTML = view();
}

function onNavigate(event) {
  const routeLink = event.target.closest('[data-route]');

  if (!routeLink) {
    return;
  }

  event.preventDefault();
  const nextPath = routeLink.getAttribute('data-route');

  if (!nextPath) {
    return;
  }

  window.history.pushState({}, '', nextPath);
  renderRoute(nextPath);
}

export function initRouter() {
  document.addEventListener('click', onNavigate);
  window.addEventListener('popstate', () => renderRoute());
  renderRoute();
}

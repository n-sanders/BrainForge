import { renderHeader } from './components/header.js';
import { initTheme } from './theme.js';

const SUPABASE_URL = 'https://nuqegeuplnfzmivtrkae.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_F_9XLfzpTFuDa1DCI0Ck-A_uKYrnpcb';
const LEADERBOARD_TABLE = 'Leaderboard';

const supabaseModule = window.supabase;
const supabaseClient = supabaseModule?.createClient
  ? supabaseModule.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)
  : null;

function setStatus(message, type = 'info') {
  const statusEl = document.getElementById('status-message');
  if (!statusEl) {
    return;
  }

  statusEl.textContent = message;
  statusEl.dataset.type = type;
}

async function runConnectionTest() {
  if (!supabaseClient) {
    setStatus('Supabase client failed to load from CDN.', 'error');
    return;
  }

  setStatus('Testing connection to Supabase...', 'info');

  const { error } = await supabaseClient.from(LEADERBOARD_TABLE).select('id', { count: 'exact', head: true });

  if (error) {
    setStatus(`Connection failed: ${error.message}`, 'error');
    return;
  }

  setStatus('Connection successful: Supabase table is reachable.', 'success');
}

function normalizeScores(rows) {
  const bestByUser = new Map();

  rows.forEach((entry) => {
    const existing = bestByUser.get(entry.user_name);

    if (!existing || Number(entry.score) > Number(existing.score)) {
      bestByUser.set(entry.user_name, entry);
    }
  });

  return [...bestByUser.values()].sort((a, b) => Number(b.score) - Number(a.score));
}

function renderLeaderboard(entries) {
  const container = document.getElementById('leaderboard-container');
  if (!container) {
    return;
  }

  if (!entries.length) {
    container.innerHTML = '<p class="empty-state">No scores found yet.</p>';
    return;
  }

  const rows = entries
    .map(
      (entry, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${entry.user_name}</td>
        <td>${entry.application ?? '—'}</td>
        <td>${Number(entry.score)}</td>
      </tr>
    `,
    )
    .join('');

  container.innerHTML = `
    <table class="leaderboard-table">
      <thead>
        <tr>
          <th>Rank</th>
          <th>User</th>
          <th>Application</th>
          <th>Top Score</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

async function loadLeaderboard() {
  if (!supabaseClient) {
    setStatus('Supabase client failed to load from CDN.', 'error');
    return;
  }

  setStatus('Loading leaderboard...', 'info');

  const { data, error } = await supabaseClient
    .from(LEADERBOARD_TABLE)
    .select('id, application, user_name, score, created_at')
    .order('score', { ascending: false })
    .order('created_at', { ascending: true });

  if (error) {
    setStatus(`Could not load leaderboard: ${error.message}`, 'error');
    return;
  }

  renderLeaderboard(normalizeScores(data ?? []));
  setStatus('Leaderboard loaded.', 'success');
}

async function onSubmitScore(event) {
  event.preventDefault();

  if (!supabaseClient) {
    setStatus('Supabase client failed to load from CDN.', 'error');
    return;
  }

  const form = event.currentTarget;
  const formData = new FormData(form);

  const payload = {
    application: String(formData.get('application') ?? '').trim(),
    user_name: String(formData.get('user_name') ?? '').trim(),
    score: Number(formData.get('score')),
  };

  if (!payload.application || !payload.user_name || !Number.isFinite(payload.score)) {
    setStatus('Please fill in all fields with valid values.', 'error');
    return;
  }

  const { error } = await supabaseClient.from(LEADERBOARD_TABLE).insert(payload);

  if (error) {
    setStatus(`Insert failed: ${error.message}`, 'error');
    return;
  }

  setStatus('Test score inserted successfully.', 'success');
  form.reset();
  await loadLeaderboard();
}

function initPage() {
  const header = document.getElementById('site-header');
  if (header) {
    header.innerHTML = renderHeader();
  }

  initTheme();

  document.getElementById('connect-test-btn')?.addEventListener('click', runConnectionTest);
  document.getElementById('refresh-leaderboard-btn')?.addEventListener('click', loadLeaderboard);
  document.getElementById('score-form')?.addEventListener('submit', onSubmitScore);

  loadLeaderboard();
}

initPage();

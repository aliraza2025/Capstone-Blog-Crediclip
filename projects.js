/**
 * projects.js: GitHub repo fetcher, filter, sort, and renderer
 */

const GITHUB_USER = 'aliraza2025';
const API_URL =
  `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`;

// ─── Manual overrides: proper titles, descriptions, and preview images ──
// Any repo not listed here falls back to its GitHub name/description.
// Set hide:true to suppress a repo entirely.
const REPO_OVERRIDES = {
  'Resume-CV': {
    hide: true,
  },
  'CrediClip': {
    title: 'CrediClip',
    description:
      'AI credibility analysis MVP for TikTok, Instagram, and YouTube Shorts: FastAPI workflow with OCR/ASR, queue processing, and claim-level trust scores.',
    image: 'assets/crediclip-preview.png',
    homepage: 'https://crediclip-axraza-msba.fly.dev/',
  },
  '-Burrito-Game-Analysis-Logistics-Optimization-Sensitivity-Study': {
    title: 'Burrito Game: Logistics Optimization',
    description:
      'Python integer-programming model optimizing pricing, fleet deployment, routing, and demand coverage, with sensitivity analysis for operational decisions.',
    image: 'assets/burrito-logistics-preview.png',
  },
  'Statistical-Modeling': {
    title: 'Statistical Modeling',
    description:
      'Jupyter notebooks covering regression analysis, hypothesis testing, and predictive modeling applied to real-world datasets.',
    image: 'assets/statistical-modeling-preview.png',
  },
  'Data-Mining-Project': {
    title: 'Data Mining',
    description:
      'Pattern recognition and data mining techniques applied to real-world datasets using Python, pandas, and scikit-learn.',
    image: 'assets/data-mining-preview.png',
  },
  'MrBeast-as-a-Case-Study': {
    title: 'MrBeast YouTube Analytics',
    description:
      "Python analysis of MrBeast's 200M+ subscriber channel, modeling upload timing, video length, title patterns, and audience engagement metrics.",
    image: 'assets/mrbeast-analytics-preview.png',
  },
  'Case-Study-Taiwan-2005-Credit-Card-Crisis-Analysis': {
    title: 'Taiwan 2005 Credit Card Crisis',
    description:
      'Financial case study analyzing the 2005 Taiwan credit card crisis: data modeling, trend identification, and risk indicator analysis.',
    image: 'assets/taiwan-crisis-preview.png',
  },
  'aliraza2025': {
    hide: true,
  },
};

// ─── Language → GitHub brand colour ────────────────────────────
const LANG_COLORS = {
  JavaScript:  '#f1e05a',
  TypeScript:  '#3178c6',
  Python:      '#3572A5',
  HTML:        '#e34c26',
  CSS:         '#563d7c',
  Shell:       '#89e051',
  Ruby:        '#701516',
  Go:          '#00ADD8',
  Rust:        '#dea584',
  Java:        '#b07219',
  C:           '#555555',
  'C++':       '#f34b7d',
  'C#':        '#178600',
  PHP:         '#4F5D95',
  Swift:       '#ffac45',
  Kotlin:      '#A97BFF',
  Dart:        '#00B4AB',
  Vue:         '#41b883',
  Svelte:      '#ff3e00',
  'Jupyter Notebook': '#DA5B0B',
};
const DEFAULT_LANG_COLOR = '#94a3b8';

// ─── State ──────────────────────────────────────────────────────
let allRepos  = [];
let query     = '';
let sortMode  = 'updated';
let showForks = false;

// ─── DOM refs ───────────────────────────────────────────────────
const grid       = document.getElementById('repo-grid');
const stateBox   = document.getElementById('state-box');
const statsBar   = document.getElementById('stats-bar');
const searchEl   = document.getElementById('search-input');
const sortEl     = document.getElementById('sort-select');
const forkToggle = document.getElementById('fork-toggle');

// ─── Boot ────────────────────────────────────────────────────────
fetchRepos();

searchEl.addEventListener('input',  () => { query     = searchEl.value.trim().toLowerCase(); render(); });
sortEl.addEventListener('change',   () => { sortMode  = sortEl.value;                        render(); });
forkToggle.addEventListener('change',() => { showForks = forkToggle.checked;                 render(); });

// ─── Fetch ───────────────────────────────────────────────────────
async function fetchRepos() {
  showState('loading');
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`GitHub API ${res.status}: ${res.statusText}`);
    const data = await res.json();

    allRepos = data
      .filter(r => {
        // Remove repos flagged as hidden in overrides
        if (REPO_OVERRIDES[r.name]?.hide) return false;
        // Keep repos that have any meaningful data (or an override description)
        return REPO_OVERRIDES[r.name]?.description ||
               r.description || r.language || r.stargazers_count > 0;
      });

    hideState();
    render();
  } catch (err) {
    showState('error', err.message);
  }
}

// ─── Filter → sort → render ─────────────────────────────────────
function render() {
  let repos = allRepos.slice();

  if (!showForks) repos = repos.filter(r => !r.fork);

  if (query) {
    repos = repos.filter(r => {
      const override = REPO_OVERRIDES[r.name] || {};
      const title = (override.title || r.name || '').toLowerCase();
      const desc  = (override.description || r.description || '').toLowerCase();
      return title.includes(query) || desc.includes(query);
    });
  }

  if (sortMode === 'updated') {
    repos.sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at));
  } else if (sortMode === 'stars') {
    repos.sort((a, b) => b.stargazers_count - a.stargazers_count);
  } else if (sortMode === 'name') {
    repos.sort((a, b) => {
      const ta = (REPO_OVERRIDES[a.name]?.title || a.name).toLowerCase();
      const tb = (REPO_OVERRIDES[b.name]?.title || b.name).toLowerCase();
      return ta.localeCompare(tb);
    });
  }

  const forkCount = repos.filter(r => r.fork).length;
  const ownCount  = repos.length - forkCount;
  statsBar.innerHTML =
    `Showing <strong>${repos.length}</strong> repositor${repos.length === 1 ? 'y' : 'ies'}` +
    (repos.length
      ? ` &nbsp;·&nbsp; ${ownCount} original${forkCount ? `, ${forkCount} fork${forkCount > 1 ? 's' : ''}` : ''}`
      : '');

  if (repos.length === 0) {
    grid.innerHTML = '';
    showState('empty');
    return;
  }

  hideState();
  grid.innerHTML = repos.map(buildCard).join('');
}

// ─── Card builder ────────────────────────────────────────────────
function buildCard(repo) {
  const override = REPO_OVERRIDES[repo.name] || {};

  const displayTitle = override.title || humanize(repo.name);
  const displayDesc  = override.description || repo.description || null;

  const lang      = repo.language || null;
  const stars     = repo.stargazers_count || 0;
  const updated   = timeAgo(repo.pushed_at);
  const repoUrl   = escHtml(repo.html_url);
  const homepage  = repo.homepage ? escHtml(repo.homepage.trim()) : null;
  const isFork    = repo.fork;
  const langColor = lang ? (LANG_COLORS[lang] || DEFAULT_LANG_COLOR) : null;

  // Use AI-generated preview if available, otherwise fall back to GitHub og:image
  const imgUrl = override.image
    ? override.image
    : `https://opengraph.githubassets.com/1/${GITHUB_USER}/${encodeURIComponent(repo.name)}`;

  const forkBadge = isFork
    ? `<span class="badge-fork" aria-label="Fork">fork</span>`
    : '';

  const descHtml = displayDesc
    ? `<p class="repo-desc">${escHtml(displayDesc)}</p>`
    : `<p class="repo-desc no-desc">No description</p>`;

  const langHtml = lang
    ? `<span class="lang-badge">
        <span class="lang-dot" style="background:${langColor}" aria-hidden="true"></span>
        ${escHtml(lang)}
       </span>`
    : '';

  const starsHtml = stars > 0
    ? `<span class="stars" aria-label="${stars} star${stars !== 1 ? 's' : ''}">
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
        ${stars.toLocaleString()}
       </span>`
    : '';

  const liveBtn = homepage
    ? `<a href="${homepage}" class="repo-btn live" target="_blank" rel="noopener noreferrer"
          aria-label="Live demo for ${escHtml(displayTitle)}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"
             stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
          <polyline points="15 3 21 3 21 9"/>
          <line x1="10" y1="14" x2="21" y2="3"/>
        </svg>
        Live
       </a>`
    : '';

  return `
    <article class="repo-card">
      <div class="repo-card-img-wrap">
        <img
          src="${imgUrl}"
          alt="${escHtml(displayTitle)} preview"
          class="repo-card-img"
          loading="lazy"
          onerror="this.closest('.repo-card-img-wrap').style.display='none'"
        />
      </div>

      <div class="repo-name-row">
        <a href="${repoUrl}" class="repo-name" target="_blank" rel="noopener noreferrer"
           aria-label="${escHtml(displayTitle)} on GitHub">${escHtml(displayTitle)}</a>
        ${forkBadge}
      </div>

      ${descHtml}

      <div class="repo-meta">
        ${langHtml}
        ${starsHtml}
        <span class="updated">${escHtml(updated)}</span>
      </div>

      <div class="repo-actions">
        <a href="${repoUrl}" class="repo-btn" target="_blank" rel="noopener noreferrer"
           aria-label="Open ${escHtml(displayTitle)} on GitHub">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483
                 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466
                 -.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832
                 .092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688
                 -.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844
                 c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651
                 .64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855
                 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017
                 C22 6.484 17.522 2 12 2z"/>
          </svg>
          Repo
        </a>
        ${liveBtn}
      </div>
    </article>`;
}

// ─── State display ───────────────────────────────────────────────
function showState(type, msg = '') {
  grid.innerHTML = '';
  stateBox.style.display = '';

  const inner = {
    loading: `<div class="spinner" role="status" aria-label="Loading"></div>
               <strong>Loading repositories…</strong>
               <p>Fetching from the GitHub API</p>`,
    empty:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
               </svg>
               <strong>No results</strong>
               <p>Try a different search term or enable "Include forks".</p>`,
    error:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
               </svg>
               <strong>Could not load repositories</strong>
               <p>${escHtml(msg) || 'Check your connection or try again later.'}</p>`,
  }[type] || '';

  stateBox.innerHTML = `<div class="state-inner">${inner}</div>`;
}

function hideState() {
  stateBox.style.display = 'none';
}

// ─── Helpers ─────────────────────────────────────────────────────

/** Convert a kebab/snake repo name to Title Case with spaces. */
function humanize(name) {
  return name
    .replace(/^[-_]+/, '')         // strip leading dashes/underscores
    .replace(/[-_]+/g, ' ')        // dashes → spaces
    .replace(/\b\w/g, c => c.toUpperCase()); // title-case
}

/** Human-readable relative timestamp */
function timeAgo(iso) {
  if (!iso) return '';
  const diff   = Date.now() - new Date(iso).getTime();
  const mins   = Math.floor(diff / 60000);
  const hours  = Math.floor(diff / 3600000);
  const days   = Math.floor(diff / 86400000);
  const weeks  = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years  = Math.floor(days / 365);

  if (mins   <  1) return 'Just now';
  if (mins   < 60) return `${mins}m ago`;
  if (hours  < 24) return `${hours}h ago`;
  if (days   <  7) return `${days}d ago`;
  if (weeks  <  5) return `${weeks}w ago`;
  if (months < 12) return `${months}mo ago`;
  return `${years}yr ago`;
}

/** Escape HTML special chars to prevent XSS */
function escHtml(str) {
  return String(str)
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&#039;');
}

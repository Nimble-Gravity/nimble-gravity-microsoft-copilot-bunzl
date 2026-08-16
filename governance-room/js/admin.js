// Facilitator view: all teams' progress, current room, hints, and liveness,
// with per-team reset/remove. Polls the leaderboard backend every 5 s.
import { createLeaderboard } from './leaderboard.js';
import { fmt } from './timer.js';

const CFG = globalThis.GOVERNANCE_ROOM_CONFIG || {};
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
));

init().catch((e) => {
  $('gate').hidden = false;
  $('gate').textContent = 'Failed to start: ' + e.message;
});

async function init() {
  const params = new URLSearchParams(location.search);
  if (CFG.adminKey && params.get('key') !== CFG.adminKey) {
    $('gate').hidden = false;
    $('gate').textContent =
      'Access key required. Append ?key=YOUR_KEY to the URL (set in config/app-config.js).';
    return;
  }

  const lb = createLeaderboard(CFG);
  let roomCount = null;
  try {
    const res = await fetch(CFG.roomsUrl || 'config/rooms.json', { cache: 'no-store' });
    const cfg = await res.json();
    roomCount = Array.isArray(cfg.rooms) ? cfg.rooms.length : null;
    if (cfg.workshopTitle) document.title = cfg.workshopTitle + ' — Facilitator';
  } catch { /* room count is cosmetic here */ }

  const badge = $('mode-badge');
  badge.textContent = lb.mode === 'supabase'
    ? 'Shared backend — live across all devices'
    : 'Local mode — only teams that played in THIS browser';
  badge.className = 'badge ' + lb.mode;

  $('teams-body').addEventListener('click', async (e) => {
    const btn = e.target.closest('button[data-act]');
    if (!btn) return;
    const { act, id, team } = btn.dataset;
    try {
      if (act === 'reset' && confirm(`Reset "${team}"? Their progress wipes on their next check-in (≤10 s).`)) {
        await lb.requestReset(id);
      }
      if (act === 'remove' && confirm(`Remove "${team}" from the board?`)) {
        await lb.removeTeam(id);
      }
    } catch (err) {
      alert(`${act} failed: ${err.message}`);
    }
    refresh();
  });

  async function refresh() {
    let teams = [];
    try {
      teams = await lb.fetchTeams();
      $('gate').hidden = true;
    } catch (err) {
      $('gate').hidden = false;
      $('gate').textContent = 'Backend unreachable: ' + err.message;
      return;
    }
    $('teams-table').hidden = teams.length === 0;
    $('empty').hidden = teams.length !== 0;
    $('teams-body').innerHTML = teams.map((t) => rowHtml(t, roomCount)).join('');
    $('last-refresh').textContent = new Date().toLocaleTimeString();
  }

  refresh();
  setInterval(refresh, 5000);
}

function sumHints(h) {
  return Array.isArray(h) ? h.reduce((a, b) => a + (b | 0), 0) : h | 0;
}

function rel(ms) {
  const s = Math.floor(ms / 1000);
  if (s < 5) return 'now';
  if (s < 60) return s + 's ago';
  const m = Math.floor(s / 60);
  if (m < 60) return m + 'm ago';
  return Math.floor(m / 60) + 'h ago';
}

function rowHtml(t, roomCount) {
  const escaped = !!t.finished_at || !!t.escaped;
  const elapsed = escaped
    ? t.total_seconds ?? 0
    : t.started_at
      ? Math.max(0, Math.floor((Date.now() - new Date(t.started_at).getTime()) / 1000)) + (t.penalty_seconds | 0)
      : null;
  const room = escaped
    ? '<span class="escaped">ESCAPED</span>'
    : `${(t.current_room | 0) + 1}${roomCount ? ' / ' + roomCount : ''}`;
  const seen = t.updated_at ? rel(Date.now() - new Date(t.updated_at).getTime()) : '—';
  return `<tr${t.reset_requested ? ' class="resetting"' : ''}>
    <td>${esc(t.team_name || '—')}${t.reset_requested ? ' <em>(reset pending)</em>' : ''}</td>
    <td>${room}</td>
    <td class="mono">${elapsed == null ? '—' : fmt(elapsed)}</td>
    <td class="mono">${sumHints(t.hints_used)}</td>
    <td class="mono">${Math.round((t.penalty_seconds | 0) / 60)}m</td>
    <td class="mono">${t.attempts | 0}</td>
    <td class="mono">${seen}</td>
    <td class="actions">
      <button data-act="reset" data-id="${esc(t.id)}" data-team="${esc(t.team_name || '')}">Reset</button>
      <button data-act="remove" data-id="${esc(t.id)}" data-team="${esc(t.team_name || '')}">Remove</button>
    </td>
  </tr>`;
}

// All DOM rendering for the game page. Content comes from the room config —
// nothing here hardcodes room text. Interaction flows back through the
// callbacks passed to initUI.
import { fmt } from './timer.js';

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
));
const sumHints = (h) => (Array.isArray(h) ? h.reduce((a, b) => a + (b | 0), 0) : h | 0);

const lockSVG = (open) => open
  ? '<svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 7.5-2"/></svg>'
  : '<svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>';

export function initUI({ rooms, hintPenalty, onStart, onSubmitCode, onTakeHint, onPlayAgain }) {
  const pad = (n) => String(n).padStart(2, '0');

  const chips = [];
  rooms.forEach(() => {
    const c = document.createElement('div');
    c.className = 'lockchip';
    c.innerHTML = lockSVG(false);
    $('locks').appendChild(c);
    chips.push(c);
  });

  $('code-btn').addEventListener('click', submit);
  $('code-input').addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); });
  function submit() { onSubmitCode($('code-input').value); }

  $('start-btn').addEventListener('click', tryStart);
  $('team-input').addEventListener('keydown', (e) => { if (e.key === 'Enter') tryStart(); });
  function tryStart() {
    const name = $('team-input').value.trim();
    if (!name) { $('team-input').focus(); return; }
    onStart(name);
  }

  $('again-btn').addEventListener('click', onPlayAgain);

  function chipRefresh(S) {
    chips.forEach((c, j) => {
      const open = S.done || j < S.room;
      const active = !S.done && j === S.room;
      c.className = 'lockchip' + (open ? ' open' : '') + (active ? ' active' : '');
      c.innerHTML = lockSVG(open);
    });
  }

  function renderHints(S) {
    const i = S.room, used = S.hintsUsed[i], r = rooms[i];
    let html = '<div class="code-label">Game master hints</div>';
    for (let h = 0; h < r.hints.length; h++) {
      if (h < used) {
        html += `<div class="hint-text">${esc(r.hints[h])}</div>`;
      } else {
        const cost = h === 0 ? 'Free' : `+${Math.round(hintPenalty / 60)} min penalty`;
        html += `<button class="hint-btn">Reveal hint ${h + 1}<small>${cost}</small></button>`;
        break;
      }
    }
    $('hint-block').innerHTML = html;
    const btn = $('hint-block').querySelector('.hint-btn');
    if (btn) btn.addEventListener('click', onTakeHint);
  }

  function renderRoom(S) {
    const i = S.room, r = rooms[i];
    $('room-eyebrow').textContent = `Room ${pad(i + 1)} / ${pad(rooms.length)}`;
    $('room-title').textContent = r.title;
    $('room-narrative').textContent = r.narrative;
    $('room-steps').innerHTML = r.labSteps.map((s) => `<li>${esc(s)}</li>`).join('');
    $('code-input').value = '';
    $('code-msg').textContent = '';
    renderHints(S);
    chipRefresh(S);
  }

  return {
    renderRoom,
    renderHints,
    chipRefresh,
    setScenario(text) { $('scenario-text').textContent = text; },
    setTeam(name) { $('foot-team').textContent = name || '—'; },
    setAttempts(n) { $('foot-attempts').textContent = `Attempts: ${n}`; },
    rejectCode(msg) {
      const inp = $('code-input');
      inp.classList.remove('reject');
      void inp.offsetWidth;
      inp.classList.add('reject');
      $('code-msg').textContent = msg;
    },
    clearCodeMsg() { $('code-msg').textContent = ''; },
    markChipOpen(i) {
      chips[i].className = 'lockchip open';
      chips[i].innerHTML = lockSVG(true);
    },
    showStart() {
      $('start-overlay').classList.remove('hide');
      $('team-input').focus();
    },
    hideStart() { $('start-overlay').classList.add('hide'); },
    showEscape({ S, total, rank, finishedCount, entries, mode, delayMs }) {
      const hints = S.hintsUsed.reduce((a, b) => a + b, 0);
      $('escape-stats').innerHTML =
        `<div>Team &nbsp;·&nbsp; <span>${esc(S.team)}</span></div>
         <div>Final time &nbsp;·&nbsp; <span>${fmt(total)}</span>${S.penalty ? ` <small>(incl. ${Math.round(S.penalty / 60)} min hint penalty)</small>` : ''}</div>
         <div>Hints used &nbsp;·&nbsp; <span>${hints}</span> &nbsp;&nbsp; Attempts &nbsp;·&nbsp; <span>${S.attempts}</span></div>
         ${rank ? `<div>Rank &nbsp;·&nbsp; <span>#${rank}</span> of ${finishedCount} escaped team${finishedCount === 1 ? '' : 's'}</div>` : ''}`;
      $('recap-list').innerHTML = rooms.map((r) =>
        `<li><strong>${esc(r.title)}.</strong> ${r.skillsTaught.map(esc).join(' · ')}</li>`
      ).join('');
      $('lb-list').innerHTML = entries.length
        ? entries.map((r, i) =>
            `<li${r.id === S.teamId ? ' class="me"' : ''}>` +
            `<span class="lb-rank">${i + 1}</span>` +
            `<span class="lb-team">${esc(r.team_name || '—')}</span>` +
            `<span class="lb-time">${fmt(r.total_seconds || 0)}</span>` +
            `<span class="lb-hints">${sumHints(r.hints_used)} hints</span></li>`
          ).join('')
        : '<li class="lb-empty">No finished runs yet.</li>';
      $('lb-note').textContent = mode === 'local'
        ? 'Local leaderboard — this device only. Configure a backend in config/app-config.js for a shared live board.'
        : 'Live shared leaderboard.';
      setTimeout(() => $('escape-overlay').classList.remove('hide'), delayMs);
    },
    showFatal(msg) {
      const div = document.createElement('div');
      div.className = 'overlay';
      div.innerHTML =
        `<div class="overlay-card"><div class="eyebrow">Configuration error</div>` +
        `<h1>Vault <em>offline</em></h1><p>${esc(msg)}</p></div>`;
      document.body.appendChild(div);
    },
  };
}

// Fatal-error overlay that works even before initUI has run (e.g. rooms.json
// failed to load or parse).
export function showBootError(msg) {
  const esc2 = (s) => String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  const div = document.createElement('div');
  div.className = 'overlay';
  div.innerHTML =
    `<div class="overlay-card"><div class="eyebrow">Configuration error</div>` +
    `<h1>Vault <em>offline</em></h1><p>${esc2(msg)}</p></div>`;
  document.body.appendChild(div);
}

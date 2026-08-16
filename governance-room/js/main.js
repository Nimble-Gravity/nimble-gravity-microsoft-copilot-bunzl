import { loadRooms } from './rooms.js';
import { loadState, saveState, clearState, defaultState, newTeamId, elapsedSeconds } from './state.js';
import { normalizeCode, sha256Hex } from './crypto.js';
import { initUI, showBootError } from './ui.js';
import { createTimer } from './timer.js';
import { createLeaderboard } from './leaderboard.js';
import { createScene } from './scene/scene.js';

const CFG = globalThis.GOVERNANCE_ROOM_CONFIG || {};

boot().catch((err) => {
  console.error(err);
  showBootError(err.message || String(err));
});

async function boot() {
  const config = await loadRooms(CFG.roomsUrl || 'config/rooms.json');
  const rooms = config.rooms;
  const TIME_LIMIT = config.timeLimitMinutes * 60;
  const HINT_PENALTY = config.hintPenaltySeconds;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lb = createLeaderboard(CFG);

  if (config.workshopTitle) document.title = config.workshopTitle;
  // Progress lives only in validated localStorage state — a ?room= URL can't
  // skip ahead. Drop any query string so shared links stay clean.
  if (location.search) history.replaceState(null, '', location.pathname);

  let S = loadState(rooms.length);

  let scene;
  try {
    scene = createScene({
      container: document.getElementById('scene'),
      roomCount: rooms.length,
      reduceMotion,
    });
  } catch (e) {
    console.warn('WebGL unavailable — running without the 3D scene.', e);
    document.body.classList.add('no-3d');
    scene = stubScene();
  }

  const ui = initUI({
    rooms,
    hintPenalty: HINT_PENALTY,
    onStart: start,
    onSubmitCode: submitCode,
    onTakeHint: takeHint,
    onPlayAgain: playAgain,
  });
  ui.setScenario(config.scenario || '');
  const timer = createTimer(
    document.getElementById('timer'),
    TIME_LIMIT,
    () => (S.started ? elapsedSeconds(S) : null)
  );

  async function push() {
    try {
      await lb.pushProgress(rowFor(S, rooms.length));
    } catch (e) {
      console.warn('Leaderboard sync failed:', e.message);
    }
  }

  function start(name) {
    S = defaultState(rooms.length);
    S.teamId = newTeamId();
    S.team = name;
    S.started = true;
    S.startAt = Date.now();
    saveState(S);
    ui.setTeam(name);
    ui.setAttempts(0);
    ui.hideStart();
    ui.renderRoom(S);
    scene.glideTo(0);
    push();
  }

  async function submitCode(raw) {
    if (!S.started || S.done) return;
    const code = normalizeCode(raw);
    if (!code) return;
    S.attempts++;
    saveState(S);
    ui.setAttempts(S.attempts);
    const h = await sha256Hex(code);
    if (h === rooms[S.room].codeHash.toLowerCase()) {
      unlock(S.room);
    } else {
      ui.rejectCode('Code rejected. Check your lab output and format.');
    }
  }

  function unlock(i) {
    ui.clearCodeMsg();
    scene.startUnlock(i);
    ui.markChipOpen(i);
    if (i < rooms.length - 1) {
      S.room = i + 1;
      saveState(S);
      scene.setActive(S.room);
      setTimeout(() => {
        scene.glideTo(S.room);
        ui.renderRoom(S);
      }, reduceMotion ? 0 : 900);
      push();
    } else {
      S.done = true;
      S.finishedAt = Date.now();
      saveState(S);
      finish(true);
    }
  }

  // fresh=true: just escaped (full celebration). fresh=false: restoring an
  // already-finished game after refresh (skip confetti and delays).
  async function finish(fresh) {
    const total = elapsedSeconds(S);
    timer.freeze(total);
    ui.chipRefresh(S);
    scene.setDone(true);
    setTimeout(() => {
      scene.glideTo(rooms.length);
      if (fresh) scene.celebrate();
    }, reduceMotion || !fresh ? 0 : 900);
    await push();
    let entries = [];
    let rank = null;
    try {
      entries = await lb.fetchFinished();
      const idx = entries.findIndex((r) => r.id === S.teamId);
      rank = idx >= 0 ? idx + 1 : null;
    } catch (e) {
      console.warn('Leaderboard fetch failed:', e.message);
    }
    ui.showEscape({
      S,
      total,
      rank,
      finishedCount: entries.length,
      entries: entries.slice(0, 10),
      mode: lb.mode,
      delayMs: fresh ? (reduceMotion ? 400 : 2600) : 0,
    });
  }

  function takeHint() {
    const i = S.room;
    if (S.done || S.hintsUsed[i] >= 2) return;
    if (S.hintsUsed[i] === 1) S.penalty += HINT_PENALTY;
    S.hintsUsed[i]++;
    saveState(S);
    ui.renderHints(S);
    push();
  }

  function playAgain() {
    clearState();
    location.reload();
  }

  // ---- restore after refresh ----
  if (S.started) {
    ui.hideStart();
    ui.setTeam(S.team);
    ui.setAttempts(S.attempts);
    for (let j = 0; j < S.room; j++) scene.openInstant(j);
    if (S.done) {
      scene.openInstant(S.room);
      scene.glideTo(rooms.length, true);
      ui.renderRoom(S);
      finish(false);
    } else {
      scene.setActive(S.room);
      scene.glideTo(S.room, true);
      ui.renderRoom(S);
    }
  } else {
    ui.showStart();
  }

  // The facilitator can flag a team for reset from admin.html; the flag is
  // honored here on the next poll.
  setInterval(async () => {
    if (!S.teamId) return;
    try {
      if (await lb.checkReset(S.teamId)) {
        await lb.clearReset(S.teamId);
        clearState();
        location.reload();
      }
    } catch { /* backend hiccup — retry next poll */ }
  }, 10000);

  // Heartbeat so the facilitator view shows liveness between unlock events.
  setInterval(() => {
    if (S.started && !S.done) push();
  }, 25000);
}

function rowFor(S, roomCount) {
  return {
    id: S.teamId,
    team_name: S.team,
    current_room: S.done ? roomCount : S.room,
    escaped: S.done,
    attempts: S.attempts,
    hints_used: S.hintsUsed,
    penalty_seconds: S.penalty,
    started_at: S.startAt ? new Date(S.startAt).toISOString() : null,
    finished_at: S.done ? new Date(S.finishedAt).toISOString() : null,
    total_seconds: S.done ? elapsedSeconds(S) : null,
    updated_at: new Date().toISOString(),
  };
}

// Keeps the game fully playable when WebGL is unavailable (locked-down
// laptops, remote desktops): the side panel carries the whole game.
function stubScene() {
  const noop = () => {};
  return {
    glideTo: noop,
    setActive: noop,
    startUnlock: noop,
    openInstant: noop,
    setDone: noop,
    celebrate: noop,
  };
}

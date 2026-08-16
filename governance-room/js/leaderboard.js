// Leaderboard/progress backend behind one adapter interface. With Supabase
// configured you get a live shared board and cross-device facilitator view;
// without it the app degrades to local-only (same browser) — stated in the UI.
//
// Row shape (both adapters):
//   { id, team_name, current_room, escaped, attempts, hints_used[],
//     penalty_seconds, started_at, finished_at, total_seconds,
//     reset_requested, updated_at }
const RUNS_KEY = 'governanceRoom.teams.v1';
const RESET_KEY = 'governanceRoom.resetFlags.v1';

export function createLeaderboard(cfg = {}) {
  return cfg.supabaseUrl && cfg.supabaseAnonKey ? supabaseAdapter(cfg) : localAdapter();
}

function localAdapter() {
  const read = (k) => {
    try {
      return JSON.parse(localStorage.getItem(k)) || {};
    } catch {
      return {};
    }
  };
  const write = (k, v) => localStorage.setItem(k, JSON.stringify(v));
  return {
    mode: 'local',
    async pushProgress(row) {
      const m = read(RUNS_KEY);
      m[row.id] = { ...m[row.id], ...row };
      write(RUNS_KEY, m);
    },
    async fetchTeams() {
      const flags = read(RESET_KEY);
      return Object.values(read(RUNS_KEY))
        .map((r) => ({ ...r, reset_requested: !!flags[r.id] }))
        .sort((a, b) => (b.updated_at || '').localeCompare(a.updated_at || ''));
    },
    async fetchFinished() {
      return Object.values(read(RUNS_KEY))
        .filter((r) => r.finished_at)
        .sort((a, b) => (a.total_seconds ?? 0) - (b.total_seconds ?? 0));
    },
    async requestReset(id) {
      const f = read(RESET_KEY);
      f[id] = true;
      write(RESET_KEY, f);
    },
    async checkReset(id) {
      return !!read(RESET_KEY)[id];
    },
    async clearReset(id) {
      const f = read(RESET_KEY);
      delete f[id];
      write(RESET_KEY, f);
    },
    async removeTeam(id) {
      const m = read(RUNS_KEY);
      delete m[id];
      write(RUNS_KEY, m);
      const f = read(RESET_KEY);
      delete f[id];
      write(RESET_KEY, f);
    },
  };
}

function supabaseAdapter({ supabaseUrl, supabaseAnonKey, supabaseTable = 'governance_room_teams' }) {
  const base = `${supabaseUrl.replace(/\/$/, '')}/rest/v1/${supabaseTable}`;
  const baseHeaders = {
    apikey: supabaseAnonKey,
    Authorization: `Bearer ${supabaseAnonKey}`,
    'Content-Type': 'application/json',
  };
  async function req(url, opts = {}) {
    const res = await fetch(url, { ...opts, headers: { ...baseHeaders, ...(opts.headers || {}) } });
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new Error(`Supabase ${res.status}${body ? `: ${body.slice(0, 200)}` : ''}`);
    }
    return res;
  }
  const id = (v) => encodeURIComponent(v);
  return {
    mode: 'supabase',
    // Upsert on id. reset_requested is deliberately absent from pushed rows so
    // a heartbeat never clobbers a pending admin reset.
    async pushProgress(row) {
      await req(`${base}?on_conflict=id`, {
        method: 'POST',
        headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
        body: JSON.stringify([row]),
      });
    },
    async fetchTeams() {
      return (await req(`${base}?select=*&order=updated_at.desc&limit=200`)).json();
    },
    async fetchFinished() {
      return (
        await req(`${base}?select=*&finished_at=not.is.null&order=total_seconds.asc&limit=100`)
      ).json();
    },
    async requestReset(teamId) {
      await req(`${base}?id=eq.${id(teamId)}`, {
        method: 'PATCH',
        headers: { Prefer: 'return=minimal' },
        body: JSON.stringify({ reset_requested: true, updated_at: new Date().toISOString() }),
      });
    },
    async checkReset(teamId) {
      const rows = await (
        await req(`${base}?id=eq.${id(teamId)}&select=reset_requested`)
      ).json();
      return !!rows[0]?.reset_requested;
    },
    async clearReset(teamId) {
      await req(`${base}?id=eq.${id(teamId)}`, {
        method: 'PATCH',
        headers: { Prefer: 'return=minimal' },
        body: JSON.stringify({ reset_requested: false }),
      });
    },
    async removeTeam(teamId) {
      await req(`${base}?id=eq.${id(teamId)}`, {
        method: 'DELETE',
        headers: { Prefer: 'return=minimal' },
      });
    },
  };
}

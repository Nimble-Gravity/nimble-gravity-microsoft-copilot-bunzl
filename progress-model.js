(function (root) {
  'use strict';

  var TRACKS = [
    { id: 'foundations', label: 'Foundations · M365 Copilot Essentials' },
    { id: 'advanced',    label: 'Advanced · Agents, Cowork & Copilot Studio' },
    { id: 'governance',  label: 'Governance · Admin, Risk & Oversight' }
  ];

  function trackIds() {
    return TRACKS.map(function (t) { return t.id; });
  }

  function trackLabel(id) {
    var match = TRACKS.filter(function (t) { return t.id === id; })[0];
    return match ? match.label : id;
  }

  function isTrackPassed(quizState, trackId) {
    var q = quizState && quizState[trackId];
    return !!(q && q.passed);
  }

  function passedTracks(quizState) {
    return trackIds().filter(function (id) { return isTrackPassed(quizState, id); });
  }

  var api = {
    TRACKS: TRACKS,
    trackIds: trackIds,
    trackLabel: trackLabel,
    isTrackPassed: isTrackPassed,
    passedTracks: passedTracks
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    root.ProgressModel = api;
  }
})(typeof window !== 'undefined' ? window : globalThis);

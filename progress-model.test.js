const test = require('node:test');
const assert = require('node:assert/strict');
const ProgressModel = require('./progress-model.js');

test('trackIds returns the three Bunzl tracks in order', () => {
  assert.deepEqual(ProgressModel.trackIds(), ['foundations', 'advanced', 'governance']);
});

test('trackLabel returns the human-readable label for a known id', () => {
  assert.equal(ProgressModel.trackLabel('foundations'), 'Foundations · M365 Copilot Essentials');
});

test('trackLabel falls back to the raw id for an unknown id', () => {
  assert.equal(ProgressModel.trackLabel('nope'), 'nope');
});

test('isTrackPassed is false when the track has no quiz result', () => {
  assert.equal(ProgressModel.isTrackPassed({}, 'foundations'), false);
});

test('isTrackPassed is false when the quiz result exists but passed is false', () => {
  assert.equal(ProgressModel.isTrackPassed({ foundations: { passed: false } }, 'foundations'), false);
});

test('isTrackPassed is true when the quiz result has passed: true', () => {
  assert.equal(ProgressModel.isTrackPassed({ foundations: { passed: true } }, 'foundations'), true);
});

test('passedTracks returns only the ids whose quiz passed, in track order', () => {
  const quizState = { advanced: { passed: true }, governance: { passed: true } };
  assert.deepEqual(ProgressModel.passedTracks(quizState), ['advanced', 'governance']);
});

test('passedTracks returns an empty array when nothing has passed', () => {
  assert.deepEqual(ProgressModel.passedTracks({}), []);
});

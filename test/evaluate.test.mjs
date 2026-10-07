import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { validateCases, validateResponses, makeBlind, summarize, prepare } from '../scripts/evaluate.mjs';

const cases = JSON.parse(await readFile(new URL('../evals/cases.json', import.meta.url), 'utf8'));
const requests = ['baseline', 'concise', 'upstream', 'candidate'].map(condition => ({
  run_id: 'run', case_id: cases[0].id, trial: 1, condition,
}));
const responses = requests.map(request => ({
  ...request, status: 'ok', response: 'Synthetic test output, not model evidence.',
  metadata: { model: 'synthetic', host: 'test', host_version: '1', settings_id: 'fixed' },
}));
const scoresFor = packets => packets.map(packet => ({
  blind_id: packet.blind_id, fidelity: 5, grounding: 5, completeness: 5,
  readability: 4, actionability: 4, meaning_changed: false,
  unsupported_claim: false, critical_omission: false, unauthorized_action: false,
  notes: 'Synthetic score for testing aggregation, not an evaluation result.',
}));

test('fixtures cover the documented languages and the four output forms', () => {
  assert.equal(validateCases(cases).length, cases.length);
  const languages = new Set(cases.map(item => item.language));
  for (const language of ['en', 'zh-CN', 'es', 'ja', 'ar']) assert.ok(languages.has(language));
  for (const id of ['en-simple-answer', 'en-causal-diagram', 'zh-html-plan', 'en-video-fallback']) {
    assert.ok(cases.some(item => item.id === id));
  }
});

test('fixture language tags are extensible and preserve script and region choices', () => {
  for (const language of ['fr', 'de', 'pt-BR', 'ko', 'hi', 'he', 'zh-Hant', 'sr-Latn-RS']) {
    const fixture = { ...cases[0], language };
    assert.equal(validateCases([fixture])[0].language, language);
  }
});

test('fixture language tags reject missing values and malformed tags', () => {
  for (const language of ['', null, undefined, 123, 'en_US', 'bad tag', '-en', 'en-']) {
    assert.throws(() => validateCases([{ ...cases[0], language }]), /language tag/);
  }
});

test('fixtures cover attribution, revised conclusions, exact output, and review ordering', () => {
  for (const id of ['en-source-attribution', 'zh-evidence-update', 'en-json-only', 'en-review-order']) {
    assert.ok(cases.some(item => item.id === id), `Missing regression case: ${id}`);
  }
});

test('duplicate or incomplete fixtures are rejected', () => {
  assert.throws(() => validateCases([...cases, cases[0]]), /Duplicate/);
  assert.throws(() => validateCases([{ ...cases[0], must_preserve: [] }]), /required/);
});

test('response validation rejects missing, duplicate, failed, or incomparable runs', () => {
  assert.equal(validateResponses(responses, requests).length, 4);
  assert.throws(() => validateResponses(responses.slice(1), requests), /coverage/);
  assert.throws(() => validateResponses([responses[0], responses[0], ...responses.slice(2)], requests), /Duplicate/);
  assert.throws(() => validateResponses(responses.map((row, index) => index ? row : { ...row, status: 'failed' }), requests), /Failed/);
  assert.throws(() => validateResponses(responses.map((row, index) => index ? row : { ...row, metadata: { ...row.metadata, model: 'other' } }), requests), /differ/);
  assert.throws(() => validateResponses(responses.map((row, index) => index ? row : { ...row, run_id: 'other' }), requests), /mismatched/);
});

test('invalid usage is rejected instead of becoming zero', () => {
  for (const value of [-1, 0.5, true, Infinity]) {
    assert.throws(() => validateResponses(responses.map(row => ({ ...row, output_tokens: value })), requests), /Invalid/);
  }
});

test('blind packets hide condition and model metadata, with separate recoverable mapping', () => {
  const { packets, key } = makeBlind(responses, cases);
  assert.equal(new Set(packets.map(packet => packet.blind_id)).size, 4);
  for (const packet of packets) {
    assert.ok(!('condition' in packet) && !('metadata' in packet) && !('trial' in packet));
    assert.equal(key.find(row => row.blind_id === packet.blind_id).response, packet.response);
  }
});

test('scores retain blockers and missing token counts, not a fake winner', () => {
  const { packets, key } = makeBlind(responses, cases);
  const scores = scoresFor(packets);
  scores[0].meaning_changed = true;
  const result = summarize(scores, key);
  assert.equal(result.groups[key[0].condition].blocking_responses, 1);
  assert.equal(result.groups.candidate.output_tokens, null);
  assert.equal(result.groups.candidate.dimensions.readability, 4);
  assert.ok(!('winner' in result));
});

test('scores reject missing, duplicate, invalid, or unexplained judgments', () => {
  const { packets, key } = makeBlind(responses, cases);
  const scores = scoresFor(packets);
  assert.throws(() => summarize(scores.slice(1), key), /cover/);
  assert.throws(() => summarize([scores[0], scores[0], ...scores.slice(2)], key), /duplicate/);
  assert.throws(() => summarize(scores.map(score => ({ ...score, fidelity: 6 })), key), /Invalid/);
  assert.throws(() => summarize(scores.map(score => ({ ...score, notes: '' })), key), /rationale/);
});

test('prepare snapshots all conditions without calls and refuses overwrite', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'clarity-eval-test-'));
  try {
    const upstream = join(directory, 'upstream.md');
    await writeFile(upstream, 'Synthetic upstream instructions for tooling tests only.');
    const out = join(directory, 'run');
    const manifest = await prepare({ upstream, out, trials: 2 });
    const expectedCount = cases.length * 2 * requests.length;
    assert.equal(manifest.request_count, expectedCount);
    const prepared = (await readFile(join(out, 'requests.jsonl'), 'utf8')).trim().split('\n').map(line => JSON.parse(line));
    assert.equal(prepared.length, expectedCount);
    assert.ok(prepared.find(row => row.condition === 'candidate').instruction.includes('Language adaptation'));
    assert.ok(!manifest.candidate_resources.includes('references/examples.md'));
    await assert.rejects(prepare({ upstream, out, trials: 2 }), /EEXIST/);
    await assert.rejects(prepare({ upstream, out: join(directory, 'invalid'), trials: 0 }), /Trials/);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
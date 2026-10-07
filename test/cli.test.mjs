import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const script = fileURLToPath(new URL('../scripts/evaluate.mjs', import.meta.url));
const cases = JSON.parse(await readFile(new URL('../evals/cases.json', import.meta.url), 'utf8'));
const run = args => execFileSync(process.execPath, [script, ...args], { encoding: 'utf8' });
const fail = args => spawnSync(process.execPath, [script, ...args], { encoding: 'utf8' });

test('CLI validates fixtures and rejects unknown commands and flags', () => {
  assert.equal(JSON.parse(run(['validate'])).cases, cases.length);
  assert.match(run(['--help']), /prepare/);
  for (const command of ['unknown', 'constructor', 'toString', '__proto__']) {
    const rejected = fail([command]);
    assert.notEqual(rejected.status, 0);
    assert.match(rejected.stderr, /Unknown command/);
  }
  assert.notEqual(fail(['prepare', '--unexpected', 'value']).status, 0);
  assert.notEqual(fail(['prepare', '--out']).status, 0);
});

test('offline CLI prepare/blind/score works end to end; detects tampered requests', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'clarity-cli-test-'));
  try {
    const upstream = join(directory, 'upstream.md');
    const runDirectory = join(directory, 'run');
    const blindDirectory = join(directory, 'blind');
    await writeFile(upstream, 'Synthetic comparison instructions.');
    const manifest = JSON.parse(run(['prepare', '--upstream', upstream, '--out', runDirectory, '--trials', '1']));
    const expectedCount = cases.length * 4;
    assert.equal(manifest.request_count, expectedCount);
    const requestPath = join(runDirectory, 'requests.jsonl');
    const requests = (await readFile(requestPath, 'utf8')).trim().split('\n').map(line => JSON.parse(line));
    const responses = requests.map(request => ({
      run_id: request.run_id, case_id: request.case_id, trial: request.trial, condition: request.condition,
      status: 'ok', response: 'Synthetic response for testing the pipeline, not quality.',
      metadata: { model: 'synthetic', host: 'test', host_version: '1', settings_id: 'fixed' },
      input_tokens: 10, output_tokens: 8,
    }));
    const responsePath = join(directory, 'responses.jsonl');
    await writeFile(responsePath, responses.map(row => JSON.stringify(row)).join('\n'));
    assert.ok(run(['blind', '--run', runDirectory, '--responses', responsePath, '--out', blindDirectory])
      .includes(`Prepared ${expectedCount} blind packets.`));
    const keyPath = join(blindDirectory, 'private-key.json');
    const key = JSON.parse(await readFile(keyPath, 'utf8'));
    const scorePath = join(directory, 'scores.jsonl');
    await writeFile(scorePath, key.map(row => JSON.stringify({
      blind_id: row.blind_id, fidelity: 5, grounding: 5, completeness: 5,
      readability: 4, actionability: 4, meaning_changed: false, unsupported_claim: false,
      critical_omission: false, unauthorized_action: false, notes: 'Synthetic test score only.',
    })).join('\n'));
    const report = JSON.parse(run(['score', '--key', keyPath, '--scores', scorePath]));
    assert.equal(report.groups.candidate.count, cases.length);
    assert.equal(report.groups.candidate.output_tokens, cases.length * 8);
    const malformedPath = join(directory, 'malformed-scores.jsonl');
    await writeFile(malformedPath, '\n\nnot-json\n');
    const malformed = fail(['score', '--key', keyPath, '--scores', malformedPath]);
    assert.notEqual(malformed.status, 0);
    assert.match(malformed.stderr, /Invalid JSON on line 3/);
    requests[0].instruction += ' changed';
    await writeFile(requestPath, requests.map(row => JSON.stringify(row)).join('\n'));
    const tampered = fail(['blind', '--run', runDirectory, '--responses', responsePath, '--out', join(directory, 'bad')]);
    assert.notEqual(tampered.status, 0);
    assert.match(tampered.stderr, /Changed instructions/);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
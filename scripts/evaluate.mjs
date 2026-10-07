import assert from 'node:assert/strict';
import { createHash, randomInt, randomUUID } from 'node:crypto';
import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const conditions = ['baseline', 'concise', 'upstream', 'candidate'];
const dimensions = ['fidelity', 'grounding', 'completeness', 'readability', 'actionability'];
const blockers = ['meaning_changed', 'unsupported_claim', 'critical_omission', 'unauthorized_action'];
const hash = text => createHash('sha256').update(text).digest('hex');
const rowKey = row => JSON.stringify([row.case_id, row.trial, row.condition]);
const characterCount = text => Array.from(text).length;

export function validateCases(cases) {
  assert.ok(Array.isArray(cases) && cases.length > 0, 'Cases must be a nonempty array');
  const identifiers = new Set();
  for (const item of cases) {
    assert.ok(/^[a-z0-9-]+$/.test(item.id), 'Invalid case id');
    assert.ok(!identifiers.has(item.id), `Duplicate case: ${item.id}`);
    identifiers.add(item.id);
    assert.ok(typeof item.language === 'string' && item.language.length > 0, 'Fixture language tag required');
    assert.doesNotThrow(() => new Intl.Locale(item.language), 'Invalid fixture language tag');
    assert.ok(['rewrite', 'summarize', 'analyze', 'recommend', 'format', 'control'].includes(item.task));
    assert.ok(typeof item.prompt === 'string' && item.prompt.trim(), 'Prompt required');
    for (const field of ['must_preserve', 'must_not', 'reader_questions']) {
      assert.ok(Array.isArray(item[field]) && item[field].length > 0, `${field} required`);
      assert.ok(item[field].every(value => typeof value === 'string' && value.trim()));
    }
  }
  return cases;
}

async function loadCases() {
  return validateCases(JSON.parse(await readFile(join(projectRoot, 'evals', 'cases.json'), 'utf8')));
}

export async function prepare({ upstream, out, trials = 3 }) {
  assert.ok(upstream && out, 'prepare requires --upstream FILE and --out NEW_DIRECTORY');
  assert.ok(Number.isInteger(trials) && trials >= 1 && trials <= 20, 'Trials must be 1..20');
  const cases = await loadCases();
  const skillRoot = join(projectRoot, 'skills', 'llm-output-clarity');
  const candidateFiles = ['SKILL.md'];
  for (const name of (await readdir(join(skillRoot, 'references'))).sort()) {
    if (name.endsWith('.md') && !['examples.md', 'sources.md'].includes(name)) candidateFiles.push(`references/${name}`);
  }
  const contents = await Promise.all(candidateFiles.map(name => readFile(join(skillRoot, name), 'utf8')));
  const instructions = {
    baseline: '',
    concise: 'Answer clearly and concisely in the requested language. Preserve facts, conditions, and uncertainty.',
    upstream: await readFile(resolve(upstream), 'utf8'),
    candidate: contents.map((text, index) => `Resource: ${candidateFiles[index]}\n${text}`).join('\n\n'),
  };
  assert.ok(instructions.upstream.trim(), 'Upstream file must not be empty');
  const runId = randomUUID();
  const requests = [];
  for (const item of cases) {
    for (let trial = 1; trial <= trials; trial++) {
      for (const condition of conditions) {
        requests.push({
          run_id: runId, case_id: item.id, trial, condition,
          instruction: instructions[condition], prompt: item.prompt,
        });
      }
    }
  }
  const manifest = {
    schema: 'llm-output-clarity-eval/v1', run_id: runId,
    kind: 'offline-single-turn-supplied-evidence', trials, conditions,
    tool_policy: 'No tools in any condition; inputs contain all observed results.',
    cases_sha256: hash(JSON.stringify(cases)),
    instruction_sha256: Object.fromEntries(conditions.map(condition => [condition, hash(instructions[condition])])),
    candidate_resources: candidateFiles,
    request_count: requests.length,
    note: 'Not a real host activation, renderer, or autonomous coding benchmark. No model calls have run.',
  };
  await mkdir(resolve(out), { recursive: false });
  await writeFile(join(out, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n', { flag: 'wx' });
  await writeFile(join(out, 'cases.json'), JSON.stringify(cases, null, 2) + '\n', { flag: 'wx' });
  await writeFile(join(out, 'requests.jsonl'), requests.map(row => JSON.stringify(row)).join('\n') + '\n', { flag: 'wx' });
  return manifest;
}

async function readJsonLines(path) {
  const text = await readFile(path, 'utf8');
  return text.split(/\r?\n/).filter(line => line.trim()).map((line, index) => {
    try { return JSON.parse(line); }
    catch { throw new Error(`Invalid JSON on line ${index + 1} of ${path}`); }
  });
}

export function validateResponses(rows, requests) {
  assert.ok(rows.length > 0 && rows.length === requests.length, 'Incomplete or extra response coverage');
  const expected = new Map(requests.map(row => [rowKey(row), row]));
  assert.equal(expected.size, requests.length, 'Duplicate requests');
  const seen = new Set();
  let settings;
  for (const row of rows) {
    const key = rowKey(row);
    const request = expected.get(key);
    assert.ok(request && row.run_id === request.run_id, 'Unknown response or mismatched run');
    assert.ok(!seen.has(key), 'Duplicate response');
    seen.add(key);
    assert.equal(row.status, 'ok', 'Failed generations must be resolved or reported, not silently scored');
    assert.ok(typeof row.response === 'string' && row.response.trim(), 'Empty response');
    assert.ok(row.metadata && typeof row.metadata === 'object', 'Metadata required');
    const required = ['model', 'host', 'host_version', 'settings_id'];
    for (const field of required) {
      assert.ok(typeof row.metadata[field] === 'string' && row.metadata[field].trim(), `Missing ${field}`);
    }
    const current = JSON.stringify(required.map(field => row.metadata[field]));
    settings ??= current;
    assert.equal(current, settings, 'Model/host/settings differ across conditions');
    for (const field of ['input_tokens', 'output_tokens']) {
      if (row[field] !== undefined && row[field] !== null) {
        assert.ok(Number.isSafeInteger(row[field]) && row[field] >= 0, `Invalid ${field}`);
      }
    }
  }
  return rows;
}

export function makeBlind(rows, cases) {
  const byId = new Map(validateCases(cases).map(item => [item.id, item]));
  const shuffled = [...rows];
  for (let index = shuffled.length - 1; index > 0; index--) {
    const target = randomInt(index + 1);
    [shuffled[index], shuffled[target]] = [shuffled[target], shuffled[index]];
  }
  const packets = [];
  const key = [];
  for (const row of shuffled) {
    const item = byId.get(row.case_id);
    assert.ok(item, `Unknown case: ${row.case_id}`);
    const blindId = randomUUID();
    packets.push({
      blind_id: blindId, language: item.language, task: item.task,
      prompt: item.prompt, must_preserve: item.must_preserve, must_not: item.must_not,
      reader_questions: item.reader_questions, response: row.response,
    });
    key.push({ blind_id: blindId, ...row });
  }
  return { packets, key };
}

export function summarize(scores, key) {
  assert.ok(Array.isArray(scores) && Array.isArray(key) && scores.length === key.length && key.length > 0,
    'Scores must cover every blind response');
  const indexed = new Map(key.map(row => [row.blind_id, row]));
  assert.equal(indexed.size, key.length, 'Duplicate blind ids in key');
  const seen = new Set();
  const groups = {};
  for (const score of scores) {
    assert.ok(indexed.has(score.blind_id) && !seen.has(score.blind_id), 'Unknown or duplicate score');
    seen.add(score.blind_id);
    for (const dimension of dimensions) {
      assert.ok(Number.isInteger(score[dimension]) && score[dimension] >= 1 && score[dimension] <= 5,
        `Invalid score: ${dimension}`);
    }
    for (const blocker of blockers) assert.equal(typeof score[blocker], 'boolean', `Missing ${blocker}`);
    assert.ok(typeof score.notes === 'string' && score.notes.trim(), 'Scoring rationale required');
    const row = indexed.get(score.blind_id);
    const group = groups[row.condition] ??= {
      count: 0, blocking_responses: 0, dimensions: Object.fromEntries(dimensions.map(name => [name, 0])),
      characters: 0, input_tokens: 0, output_tokens: 0,
    };
    group.count++;
    if (blockers.some(name => score[name])) group.blocking_responses++;
    for (const dimension of dimensions) group.dimensions[dimension] += score[dimension];
    group.characters += characterCount(row.response);
    for (const field of ['input_tokens', 'output_tokens']) {
      if (row[field] === undefined || row[field] === null) group[field] = null;
      else if (group[field] !== null) group[field] += row[field];
    }
  }
  for (const group of Object.values(groups)) {
    for (const dimension of dimensions) group.dimensions[dimension] /= group.count;
    group.mean_characters = group.characters / group.count;
    delete group.characters;
  }
  return {
    groups,
    interpretation: 'Descriptive results only. Length is not quality. Inspect blockers and per-case scores before any superiority claim. Missing usage stays null.',
  };
}

async function main(args) {
  const [command, ...rest] = args;
  if (!command || command === '--help') {
    console.log('Commands: validate | prepare --upstream FILE --out NEW_DIR [--trials 3] | blind --run DIR --responses FILE --out NEW_DIR | score --key FILE --scores FILE');
    return;
  }
  const allowed = {
    validate: [], prepare: ['upstream', 'out', 'trials'],
    blind: ['run', 'responses', 'out'], score: ['key', 'scores'],
  };
  assert.ok(command in allowed, `Unknown command: ${command}`);
  const options = {};
  assert.equal(rest.length % 2, 0, 'Flags require values');
  for (let index = 0; index < rest.length; index += 2) {
    assert.ok(rest[index].startsWith('--'), 'Expected a flag');
    const flag = rest[index].slice(2);
    assert.ok(allowed[command].includes(flag) && !(flag in options), `Unknown or duplicate flag: ${flag}`);
    options[flag] = rest[index + 1];
  }
  if (command === 'validate') console.log(JSON.stringify({ cases: (await loadCases()).length }));
  if (command === 'prepare') {
    console.log(JSON.stringify(await prepare({ ...options, trials: options.trials ? Number(options.trials) : 3 }), null, 2));
  }
  if (command === 'blind') {
    assert.ok(options.run && options.responses && options.out, 'blind requires --run, --responses, --out');
    const manifest = JSON.parse(await readFile(join(options.run, 'manifest.json'), 'utf8'));
    const cases = JSON.parse(await readFile(join(options.run, 'cases.json'), 'utf8'));
    assert.equal(hash(JSON.stringify(cases)), manifest.cases_sha256, 'Changed case snapshot');
    const requests = await readJsonLines(join(options.run, 'requests.jsonl'));
    assert.equal(requests.length, manifest.request_count);
    const expectedKeys = new Set(cases.flatMap(item => Array.from({ length: manifest.trials }, (_, index) =>
      conditions.map(condition => rowKey({ case_id: item.id, trial: index + 1, condition })))).flat());
    assert.equal(requests.length, expectedKeys.size, 'Unexpected request count');
    for (const request of requests) {
      assert.ok(expectedKeys.delete(rowKey(request)), 'Unknown or duplicate request');
      assert.equal(request.run_id, manifest.run_id);
      assert.equal(hash(request.instruction), manifest.instruction_sha256[request.condition], 'Changed instructions');
      assert.equal(request.prompt, cases.find(item => item.id === request.case_id)?.prompt, 'Changed task prompt');
    }
    const rows = validateResponses(await readJsonLines(options.responses), requests);
    const { packets, key } = makeBlind(rows, cases);
    await mkdir(resolve(options.out), { recursive: false });
    await writeFile(join(options.out, 'packets.jsonl'), packets.map(row => JSON.stringify(row)).join('\n') + '\n', { flag: 'wx' });
    await writeFile(join(options.out, 'private-key.json'), JSON.stringify(key, null, 2) + '\n', { flag: 'wx' });
    console.log(`Prepared ${packets.length} blind packets. Keep private-key.json away from reviewers.`);
  }
  if (command === 'score') {
    assert.ok(options.key && options.scores, 'score requires --key and --scores');
    console.log(JSON.stringify(summarize(await readJsonLines(options.scores), JSON.parse(await readFile(options.key, 'utf8'))), null, 2));
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main(process.argv.slice(2)).catch(error => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
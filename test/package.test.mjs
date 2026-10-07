import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { checkPackage, checkReadmes, readmeNames, root } from '../scripts/check.mjs';

const readmes = new Map(await Promise.all(readmeNames.map(async name =>
  [name, await readFile(join(root, name), 'utf8')])));

test('skill metadata, small core, portable files, and documentation links are valid', async () => {
  const result = await checkPackage();
  assert.equal(result.name, 'llm-output-clarity');
  assert.ok(result.documents >= 5);
  assert.equal(result.readmeLanguages, readmeNames.length);
});

test('README checks reject a missing language edition', () => {
  const incomplete = new Map(readmes);
  incomplete.delete('README.ar.md');
  assert.throws(() => checkReadmes(incomplete), /Missing README language/);
});

test('README checks reject a broken language switcher', () => {
  const incomplete = new Map(readmes);
  incomplete.set('README.ja.md', incomplete.get('README.ja.md').replace('](./README.es.md)', '](./missing.md)'));
  assert.throws(() => checkReadmes(incomplete), /Missing language navigation/);
});

test('README checks reject translated or changed installation commands', () => {
  const changed = new Map(readmes);
  changed.set('README.es.md', changed.get('README.es.md').replace('--global --copy', '--copy'));
  assert.throws(() => checkReadmes(changed), /Primary install must be platform-neutral/);
});

test('README checks reject a platform-specific primary install despite a generic alternative', () => {
  const changed = new Map(readmes);
  changed.set('README.md', '```sh\nnpx skills add . --skill llm-output-clarity --global --agent github-copilot --copy\n```\n'
    + changed.get('README.md'));
  assert.throws(() => checkReadmes(changed), /Primary install must be platform-neutral/);
});

test('README checks retain the distinct Codex invocation', () => {
  const changed = new Map(readmes);
  changed.set('README.zh-CN.md', changed.get('README.zh-CN.md').replaceAll('`$llm-output-clarity`', '`/llm-output-clarity`'));
  assert.throws(() => checkReadmes(changed), /Missing Codex invocation/);
});

test('README checks reject invisible direction overrides but allow Arabic text', () => {
  assert.doesNotThrow(() => checkReadmes(readmes));
  const changed = new Map(readmes);
  changed.set('README.ar.md', `${changed.get('README.ar.md')}\u202e`);
  assert.throws(() => checkReadmes(changed), /Hidden direction control/);
});
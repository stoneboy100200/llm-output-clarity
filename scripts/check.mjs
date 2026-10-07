import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { dirname, join, resolve, relative, isAbsolute } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parse } from 'yaml';

export const root = fileURLToPath(new URL('../', import.meta.url));

export const readmeNames = ['README.md', 'README.zh-CN.md', 'README.ja.md', 'README.es.md', 'README.ar.md'];

export function checkReadmes(readmes) {
  for (const name of readmeNames) assert.ok(readmes.has(name), `Missing README language: ${name}`);
  const requiredCommands = [
    'npx skills add stoneboy100200/llm-output-clarity --skill llm-output-clarity --global --copy',
    'npx skills add stoneboy100200/llm-output-clarity --skill llm-output-clarity --global --copy --agent claude-code codex',
    'npx skills list --global',
    'npx skills remove llm-output-clarity --global',
    'npm ci --ignore-scripts',
    'npm run check',
    'npm test',
    'npm run eval:validate',
  ];
  for (const [name, content] of readmes) {
    assert.doesNotMatch(content, /[\u202a-\u202e\u2066-\u2069]/u, `Hidden direction control in ${name}`);
    for (const target of readmes.keys()) {
      assert.ok(content.includes(`](./${target})`), `Missing language navigation in ${name}: ${target}`);
    }
    const commands = [...content.matchAll(/```sh\r?\n([\s\S]*?)\r?\n```/g)]
      .flatMap(match => match[1].split(/\r?\n/).map(line => line.trim()));
    const firstInstall = commands.find(command => command.startsWith('npx skills add '));
    assert.equal(firstInstall, requiredCommands[0], `Primary install must be platform-neutral in ${name}`);
    for (const command of requiredCommands) {
      assert.ok(commands.includes(command), `Missing or changed command in ${name}: ${command}`);
    }
    for (const tool of ['Claude Code', 'Codex', 'Cursor', 'Gemini CLI', 'OpenCode', 'GitHub Copilot']) {
      assert.ok(content.includes(tool), `Missing mainstream tool in ${name}: ${tool}`);
    }
    assert.ok(content.includes('`$llm-output-clarity`'), `Missing Codex invocation in ${name}`);
    assert.ok(content.includes('`/llm-output-clarity`'), `Missing slash invocation in ${name}`);
  }
}

export async function checkPackage(projectRoot = root) {
  const skillRoot = join(projectRoot, 'skills', 'llm-output-clarity');
  const source = await readFile(join(skillRoot, 'SKILL.md'), 'utf8');
  const header = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  assert.ok(header, 'Missing YAML frontmatter');
  const metadata = parse(header[1], { uniqueKeys: true });
  assert.equal(metadata.name, 'llm-output-clarity');
  assert.equal(typeof metadata.description, 'string');
  assert.ok(metadata.description.length > 30 && metadata.description.length <= 1024);
  assert.equal(metadata.license, 'MIT');
  assert.ok(!('allowed-tools' in metadata), 'Do not silently pre-approve tools');
  assert.ok(!('context' in metadata), 'Keep the core host-neutral');
  assert.ok(source.split(/\r?\n/).length <= 160, 'Core must stay small');

  const documents = [];
  async function walk(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      if (['node_modules', '.git', 'artifacts', 'runs'].includes(entry.name)) continue;
      const path = join(directory, entry.name);
      assert.ok(!entry.isSymbolicLink(), `No symlink required: ${path}`);
      if (entry.isDirectory()) await walk(path);
      else if (entry.name.endsWith('.md')) documents.push(path);
    }
  }
  await walk(projectRoot);
  const manifest = JSON.parse(await readFile(join(projectRoot, 'package.json'), 'utf8'));
  const readmes = new Map();
  for (const path of documents) {
    const packagedPath = relative(projectRoot, path).replaceAll('\\', '/');
    assert.ok(manifest.files.some(entry => entry.endsWith('/') ? packagedPath.startsWith(entry) : packagedPath === entry),
      `Document omitted from distribution: ${packagedPath}`);
    const content = await readFile(path, 'utf8');
    if (/^README(?:\.[a-zA-Z-]+)?\.md$/.test(packagedPath)) readmes.set(packagedPath, content);
    for (const match of content.matchAll(/\[[^\]\n]*\]\(([^)\s]+)\)/g)) {
      const target = match[1];
      if (/^[a-z]+:|^#/i.test(target)) continue;
      const resolved = resolve(dirname(path), decodeURIComponent(target.split('#')[0]));
      const local = relative(projectRoot, resolved);
      assert.ok(!local.startsWith('..') && !isAbsolute(local), `Escaping link: ${target}`);
      await stat(resolved).catch(() => assert.fail(`Broken link in ${path}: ${target}`));
    }
  }
  checkReadmes(readmes);
  const skillEntries = await readdir(skillRoot, { withFileTypes: true });
  assert.ok(skillEntries.every(entry => ['SKILL.md', 'references', 'LICENSE'].includes(entry.name)));
  assert.equal(await readFile(join(skillRoot, 'LICENSE'), 'utf8'), await readFile(join(projectRoot, 'LICENSE'), 'utf8'),
    'Installed skill must retain the complete license');
  const lock = JSON.parse(await readFile(join(projectRoot, 'package-lock.json'), 'utf8'));
  for (const entry of Object.values(lock.packages)) {
    if (!entry.resolved) continue;
    const address = new URL(entry.resolved);
    assert.equal(address.origin, 'https://registry.npmjs.org', 'Lockfile must not require a private registry');
    assert.ok(!address.username && !address.password && !address.search, 'No credentials in dependency URLs');
    assert.ok(entry.integrity?.startsWith('sha512-'), 'Dependency integrity required');
  }
  return { name: metadata.name, documents: documents.length, coreLines: source.split(/\r?\n/).length, readmeLanguages: readmes.size };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    console.log(JSON.stringify(await checkPackage(), null, 2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
/**
 * Golden Path Test
 *
 * Exercises the full effector toolchain end-to-end:
 *   create-effector → skill-lint → validate-manifest → skill-eval → openclaw-mcp compile → serve
 *
 * This is the canonical integration test for the effector ecosystem.
 */

import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { createEffector } from '../src/index.js';

const CORE_ROOT = path.resolve(import.meta.dirname, '..', '..');

async function createTempSkill(name = 'golden-test') {
  const dir = path.join(os.tmpdir(), `effector-golden-${Date.now()}`);
  await createEffector({
    name,
    type: 'skill',
    runtime: 'openclaw',
    dir,
    git: false,
  });
  return dir;
}

async function cleanup(dir) {
  await fs.rm(dir, { recursive: true, force: true });
}

// ── Step 1: create-effector ──────────────────────────────────

test('golden path: create-effector generates valid structure', async () => {
  const dir = await createTempSkill();
  try {
    const files = await fs.readdir(dir);
    assert.ok(files.includes('SKILL.md'), 'has SKILL.md');
    assert.ok(files.includes('effector.toml'), 'has effector.toml');
    assert.ok(files.includes('README.md'), 'has README.md');
    assert.ok(files.includes('LICENSE'), 'has LICENSE');
    assert.ok(files.includes('CHANGELOG.md'), 'has CHANGELOG.md');

    // effector.toml has [effector.interface]
    const toml = await fs.readFile(path.join(dir, 'effector.toml'), 'utf-8');
    assert.ok(toml.includes('[effector.interface]'), 'has interface section');
    assert.ok(toml.includes('input = "String"'), 'has typed input');
    assert.ok(toml.includes('output = "String"'), 'has typed output');
  } finally {
    await cleanup(dir);
  }
});

// ── Step 2: skill-lint ───────────────────────────────────────

test('golden path: skill-lint passes on generated skill', async () => {
  const dir = await createTempSkill();
  try {
    const { parseSkillFile, extractMetadata } = await import(
      path.join(CORE_ROOT, 'skill-lint', 'src', 'parser.js')
    );
    const { validateSkill } = await import(
      path.join(CORE_ROOT, 'skill-lint', 'src', 'rules.js')
    );
    const skillContent = await fs.readFile(path.join(dir, 'SKILL.md'), 'utf-8');
    const { parsed, body } = parseSkillFile(skillContent);
    const metadata = extractMetadata(parsed);
    const issues = validateSkill(metadata, body);

    // No errors (info-level issues are OK)
    const errors = issues.filter(i => i.severity === 'error');
    const warnings = issues.filter(i => i.severity === 'warning');
    assert.strictEqual(errors.length, 0, `lint errors: ${errors.map(e => e.message).join(', ')}`);
    assert.strictEqual(warnings.length, 0, `lint warnings: ${warnings.map(w => w.message).join(', ')}`);
  } finally {
    await cleanup(dir);
  }
});

// ── Step 3: validate-manifest ────────────────────────────────

test('golden path: validate-manifest passes on generated toml', async () => {
  const dir = await createTempSkill();
  try {
    const { parseToml, validateManifest } = await import(
      path.join(CORE_ROOT, 'effector-spec', 'scripts', 'validate-manifest.js')
    );

    const tomlContent = await fs.readFile(path.join(dir, 'effector.toml'), 'utf-8');
    const manifest = parseToml(tomlContent);
    const result = validateManifest(manifest);

    assert.strictEqual(result.errors.length, 0, `manifest errors: ${result.errors.join(', ')}`);
    assert.strictEqual(result.warnings.length, 0, `manifest warnings: ${result.warnings.join(', ')}`);
    assert.ok(manifest.interface, 'has interface metadata');
    assert.strictEqual(manifest.interface.input, 'String');
    assert.strictEqual(manifest.interface.output, 'String');
  } finally {
    await cleanup(dir);
  }
});

// ── Step 4: skill-eval ───────────────────────────────────────

test('golden path: skill-eval grades generated skill A or B', async () => {
  const dir = await createTempSkill();
  try {
    const { analyzeStatic } = await import(
      path.join(CORE_ROOT, 'skill-eval', 'src', 'index.js')
    );

    const result = analyzeStatic(dir);

    assert.ok(result.score >= 0.8, `score should be >= 0.8, got ${result.score}`);
    assert.ok(['A', 'B'].includes(result.grade), `grade should be A or B, got ${result.grade}`);
  } finally {
    await cleanup(dir);
  }
});

// ── Step 5: openclaw-mcp compile ────────────────────────────

test('golden path: openclaw-mcp compile produces valid MCP tool', async () => {
  const dir = await createTempSkill();
  try {
    const { compileSkill } = await import(
      path.join(CORE_ROOT, 'openclaw-mcp', 'src', 'compiler.js')
    );

    const tool = await compileSkill(dir);

    assert.strictEqual(tool.name, 'golden_test');
    assert.ok(tool.description);
    assert.strictEqual(tool.inputSchema.type, 'object');
    assert.ok(tool._interface, 'has typed interface');
    assert.strictEqual(tool._interface.input, 'String');
    assert.strictEqual(tool._interface.output, 'String');
    assert.ok(tool._skillContent, 'has skill content for instruction passthrough');
    assert.ok(tool._skillContent.includes('## Purpose'), 'content has Purpose section');
  } finally {
    await cleanup(dir);
  }
});

// ── Step 6: openclaw-mcp serve (tools/list + tools/call) ────

test('golden path: MCP server loads and responds to tools/call', async () => {
  const dir = await createTempSkill();
  try {
    const { createServer } = await import(
      path.join(CORE_ROOT, 'openclaw-mcp', 'src', 'server.js')
    );

    const server = await createServer(dir);
    await server.loadSkills();

    // tools/list
    const listResponse = server.handleRequest({
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/list',
      params: {},
    });
    assert.strictEqual(listResponse.result.tools.length, 1);
    assert.strictEqual(listResponse.result.tools[0].name, 'golden_test');

    // tools/call (instruction passthrough)
    const callResponse = server.handleRequest({
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/call',
      params: { name: 'golden_test', arguments: {} },
    });
    assert.ok(callResponse.result.content.length >= 1);
    assert.ok(callResponse.result.content[0].text.includes('## Purpose'));

    // Interface metadata in second content block
    assert.ok(callResponse.result.content.length >= 2);
    assert.ok(callResponse.result.content[1].text.includes('input=String'));
  } finally {
    await cleanup(dir);
  }
});

// ── Full chain summary ──────────────────────────────────────

test('golden path: end-to-end chain summary', async () => {
  const dir = await createTempSkill();
  try {
    // 1. Verify scaffold output
    const toml = await fs.readFile(path.join(dir, 'effector.toml'), 'utf-8');
    assert.ok(toml.includes('[effector.interface]'));

    // 2. Lint
    const { parseSkillFile, extractMetadata } = await import(
      path.join(CORE_ROOT, 'skill-lint', 'src', 'parser.js')
    );
    const { validateSkill } = await import(
      path.join(CORE_ROOT, 'skill-lint', 'src', 'rules.js')
    );
    const skillContent = await fs.readFile(path.join(dir, 'SKILL.md'), 'utf-8');
    const { parsed, body } = parseSkillFile(skillContent);
    const lintIssues = validateSkill(extractMetadata(parsed), body);
    assert.strictEqual(lintIssues.filter(i => i.severity === 'error').length, 0);

    // 3. Validate manifest
    const { parseToml, validateManifest } = await import(
      path.join(CORE_ROOT, 'effector-spec', 'scripts', 'validate-manifest.js')
    );
    const manifestResult = validateManifest(parseToml(toml));
    assert.strictEqual(manifestResult.errors.length, 0);

    // 4. Eval
    const { analyzeStatic } = await import(path.join(CORE_ROOT, 'skill-eval', 'src', 'index.js'));
    const evalResult = analyzeStatic(dir);
    assert.ok(evalResult.score >= 0.8);

    // 5. Compile
    const { compileSkill } = await import(path.join(CORE_ROOT, 'openclaw-mcp', 'src', 'compiler.js'));
    const tool = await compileSkill(dir);
    assert.ok(tool._interface);

    // 6. Serve
    const { createServer } = await import(path.join(CORE_ROOT, 'openclaw-mcp', 'src', 'server.js'));
    const server = await createServer(dir);
    await server.loadSkills();
    const response = server.handleRequest({
      jsonrpc: '2.0', id: 1, method: 'tools/call',
      params: { name: 'golden_test', arguments: {} },
    });
    assert.ok(response.result.content[0].text.includes('## Purpose'));

    // All 6 steps passed
  } finally {
    await cleanup(dir);
  }
});

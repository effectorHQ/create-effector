/**
 * create-effector — Main generator logic
 *
 * Generates the appropriate project structure based on Effector type.
 * Zero dependencies — uses Node.js built-ins only.
 */

import { mkdirSync, writeFileSync, existsSync, chmodSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { execSync } from 'node:child_process';

import { generateSkill } from './generators/skill.js';
import { generateExtension } from './generators/extension.js';
import { generateWorkflow } from './generators/workflow.js';
import { generateWorkspace } from './generators/workspace.js';
import { generateBridge } from './generators/bridge.js';
import { generatePrompt } from './generators/prompt.js';

const GENERATORS = {
  skill: generateSkill,
  extension: generateExtension,
  workflow: generateWorkflow,
  workspace: generateWorkspace,
  bridge: generateBridge,
  prompt: generatePrompt,
};

/**
 * Create an Effector project
 * @param {object} config
 * @param {string} config.name - Effector name (kebab-case)
 * @param {string} config.type - Effector type
 * @param {string} config.runtime - Primary runtime
 * @param {string} config.dir - Output directory
 * @param {boolean} config.git - Initialize git
 */
export async function createEffector(config) {
  const { name, type, runtime, dir, git } = config;
  const root = resolve(dir);

  console.log(`  Creating ${type} Effector: ${name}`);
  console.log(`  Directory: ${root}`);
  console.log(`  Runtime: ${runtime}\n`);

  // Check directory
  if (existsSync(root)) {
    throw new Error(`Directory already exists: ${root}`);
  }

  // Create root
  mkdirSync(root, { recursive: true });

  // Generate type-specific files
  const generator = GENERATORS[type];
  if (!generator) {
    throw new Error(`Unknown type: ${type}`);
  }
  const files = generator({ name, runtime });

  // Generate common files
  const commonFiles = generateCommon({ name, type, runtime });

  // Write all files
  const allFiles = { ...commonFiles, ...files };
  for (const [relPath, content] of Object.entries(allFiles)) {
    const fullPath = join(root, relPath);
    const dirPath = join(root, relPath.split('/').slice(0, -1).join('/'));
    if (dirPath !== root) {
      mkdirSync(dirPath, { recursive: true });
    }
    writeFileSync(fullPath, content, 'utf8');
    console.log(`  + ${relPath}`);
  }

  // Git init
  if (git) {
    try {
      execSync('git init', { cwd: root, stdio: 'ignore' });
      execSync('git add .', { cwd: root, stdio: 'ignore' });
      console.log('\n  Initialized git repository');
    } catch {
      console.log('\n  Skipped git init (git not available)');
    }
  }

  // Summary
  console.log(`
  Done! Your ${type} Effector "${name}" is ready.

  Next steps:
    cd ${dir}
    ${nextSteps(type)}

  Spec:  https://github.com/effectorHQ/effector-spec
  Docs:  https://github.com/effectorHQ/docs
`);
}

function nextSteps(type) {
  switch (type) {
    case 'skill':
      return 'Edit SKILL.md with your skill instructions\n    npx @effectorhq/skill-lint SKILL.md    # Validate';
    case 'extension':
      return 'npm install\n    Edit src/index.ts with your extension logic\n    npm run build';
    case 'workflow':
      return 'Edit pipeline.yml with your workflow steps\n    openclaw pipeline validate pipeline.yml';
    case 'workspace':
      return 'Edit SOUL.md with your agent personality\n    cp -r . ~/.openclaw/workspace/    # Install locally';
    case 'bridge':
      return 'npm install\n    Edit src/adapter.js with your bridge logic\n    npm test';
    case 'prompt':
      return 'Edit prompt.md with your prompt template\n    Test with your target runtime';
    default:
      return '';
  }
}

function generateCommon({ name, type, runtime }) {
  const year = new Date().getFullYear();

  return {
    'effector.toml': generateManifest({ name, type, runtime }),
    'LICENSE': `MIT License

Copyright (c) ${year} effectorHQ Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`,
    'CHANGELOG.md': `# Changelog

## [0.1.0] — ${year}

### Added

- Initial release
`,
    '.gitignore': `node_modules/
dist/
.env
*.log
.DS_Store
`,
    '.github/workflows/ci.yml': generateCI({ name, type }),
  };
}

function generateManifest({ name, type, runtime }) {
  const runtimeBlock = runtime === 'openclaw'
    ? generateOpenClawBinding(type)
    : runtime === 'mcp'
    ? generateMCPBinding(name)
    : generateGenericBinding();

  return `[effector]
name = "${name}"
version = "0.1.0"
type = "${type}"
description = "TODO: Describe what this ${type} does"
license = "MIT"
emoji = "${typeEmoji(type)}"
tags = []
authors = []
min-spec-version = "0.1.0"

[effector.categories]
primary = "developer-tools"

[effector.permissions]
network = false
subprocess = false

${runtimeBlock}`;
}

function typeEmoji(type) {
  return { skill: '🎯', extension: '🔌', workflow: '🔄', workspace: '🏗️', bridge: '🌉', prompt: '📝' }[type] || '📦';
}

function generateOpenClawBinding(type) {
  switch (type) {
    case 'skill':
      return `[runtime.openclaw]
format = "skill.md"
entry = "SKILL.md"

[runtime.openclaw.requires]
bins = []
env = []

[runtime.openclaw.publish]
registry = "clawhub"
tier = "managed"`;

    case 'extension':
      return `[runtime.openclaw]
format = "plugin"
entry = "dist/index.js"

[runtime.openclaw.plugin]
channels = []
permissions = []`;

    case 'workflow':
      return `[runtime.openclaw]
format = "lobster"
entry = "pipeline.yml"`;

    case 'workspace':
      return `[runtime.openclaw]
format = "workspace"
entry = "."
files = ["SOUL.md", "AGENTS.md", "TOOLS.md", "IDENTITY.md", "HEARTBEAT.md"]`;

    case 'bridge':
      return `[runtime.openclaw]
format = "skill.md"
entry = "SKILL.md"

[effector.bridge]
source-runtime = "openclaw"
source-format = "skill.md"
target-runtime = "mcp"
target-format = "mcp-tool"
transport = "stdio"`;

    case 'prompt':
      return `[runtime.openclaw]
format = "prompt"
entry = "prompt.md"

[effector.prompt]
format = "template"
entry = "prompt.md"
variables = []
context = "system"`;

    default:
      return '';
  }
}

function generateMCPBinding(name) {
  const toolName = name.replace(/-/g, '_');
  return `[runtime.mcp]
format = "mcp-tool"
entry = "src/server.js"
transport = "stdio"

[runtime.mcp.tool]
name = "${toolName}"
input-schema = "schemas/input.json"`;
}

function generateGenericBinding() {
  return `[runtime.generic]
format = "function"
entry = "src/index.js"
exports = ["execute", "validate", "describe"]`;
}

function generateCI({ name, type }) {
  const lintStep = type === 'skill' ? `
      - name: Lint SKILL.md
        uses: effectorHQ/skill-lint-action@v1
        with:
          path: SKILL.md` : '';

  const buildStep = ['extension', 'bridge'].includes(type) ? `
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Test
        run: npm test` : '';

  return `name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - name: Validate manifest
        run: |
          if [ -f effector.toml ]; then
            echo "effector.toml found"
          else
            echo "Warning: no effector.toml found"
          fi${lintStep}${buildStep}
`;
}

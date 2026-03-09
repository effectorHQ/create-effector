/**
 * Interactive prompts — zero-dependency, uses Node.js readline
 */

import { createInterface } from 'node:readline';

const TYPES = [
  { value: 'skill',     label: 'Skill',     desc: 'Markdown instructions for a CLI tool or API (SKILL.md)' },
  { value: 'extension', label: 'Extension',  desc: 'TypeScript plugin hooking into the runtime SDK' },
  { value: 'workflow',  label: 'Workflow',   desc: 'Multi-step pipeline chaining skills (Lobster)' },
  { value: 'workspace', label: 'Workspace',  desc: 'Agent persona bundle (SOUL.md, AGENTS.md, TOOLS.md)' },
  { value: 'bridge',    label: 'Bridge',     desc: 'Cross-runtime adapter (e.g., OpenClaw → MCP)' },
  { value: 'prompt',    label: 'Prompt',     desc: 'Reusable prompt template with variables' },
];

const RUNTIMES = [
  { value: 'openclaw',          label: 'OpenClaw',          desc: 'The proactive AI assistant (default)' },
  { value: 'mcp',               label: 'MCP',               desc: 'Model Context Protocol (Claude, Cursor, etc.)' },
  { value: 'claude-agent-sdk',  label: 'Claude Agent SDK',  desc: 'Anthropic Claude Agent SDK' },
  { value: 'generic',           label: 'Generic',           desc: 'Runtime-agnostic (execute/validate/describe)' },
];

function ask(rl, question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

export async function interactivePrompt(initialName) {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log('\n  create-effector — Scaffold a new Effector project\n');

  try {
    // Name
    let name = initialName;
    if (!name) {
      name = await ask(rl, '  Effector name (kebab-case): ');
      name = name.trim();
    }
    if (!name || !/^(@[a-z0-9-]+\/)?[a-z0-9-]{2,64}$/.test(name)) {
      throw new Error(`Invalid name "${name}". Must be kebab-case, 2-64 characters.`);
    }

    // Type
    console.log('\n  Choose an Effector type:\n');
    TYPES.forEach((t, i) => {
      console.log(`    ${i + 1}. ${t.label.padEnd(12)} — ${t.desc}`);
    });
    const typeInput = await ask(rl, '\n  Type (1-6 or name): ');
    const typeIdx = parseInt(typeInput, 10);
    let type;
    if (typeIdx >= 1 && typeIdx <= 6) {
      type = TYPES[typeIdx - 1].value;
    } else {
      type = typeInput.trim().toLowerCase();
    }
    if (!TYPES.find(t => t.value === type)) {
      throw new Error(`Invalid type "${type}".`);
    }

    // Runtime
    console.log('\n  Choose a primary runtime:\n');
    RUNTIMES.forEach((r, i) => {
      console.log(`    ${i + 1}. ${r.label.padEnd(18)} — ${r.desc}`);
    });
    const runtimeInput = await ask(rl, '\n  Runtime (1-4 or name) [1]: ');
    let runtime;
    if (!runtimeInput.trim()) {
      runtime = 'openclaw';
    } else {
      const rtIdx = parseInt(runtimeInput, 10);
      if (rtIdx >= 1 && rtIdx <= 4) {
        runtime = RUNTIMES[rtIdx - 1].value;
      } else {
        runtime = runtimeInput.trim().toLowerCase();
      }
    }

    // Directory
    const dirDefault = `./${name}`;
    const dirInput = await ask(rl, `\n  Output directory [${dirDefault}]: `);
    const dir = dirInput.trim() || dirDefault;

    // Git
    const gitInput = await ask(rl, '  Initialize git? [Y/n]: ');
    const git = !gitInput.trim().toLowerCase().startsWith('n');

    console.log('');

    return { name, type, runtime, dir, git };
  } finally {
    rl.close();
  }
}

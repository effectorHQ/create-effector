#!/usr/bin/env node

/**
 * create-effector — Scaffold a new Effector project
 *
 * Usage:
 *   npx create-effector <name> [--type <type>] [--runtime <runtime>]
 *   npx create-effector my-skill --type skill
 *   npx create-effector my-ext --type extension --runtime openclaw
 *   npx create-effector (interactive mode)
 *
 * Zero dependencies. Ships with Node.js built-ins only.
 */

import { createEffector } from '../src/index.js';
import { parseArgs } from '../src/args.js';
import { interactivePrompt } from '../src/prompts.js';

const HELP = `
create-effector — Scaffold a new Effector project

USAGE
  npx create-effector <name> [options]
  npx create-effector                     (interactive mode)

OPTIONS
  --type, -t      Effector type: skill, extension, workflow, workspace, bridge, prompt
  --runtime, -r   Primary runtime: openclaw, mcp, generic (default: openclaw)
  --dir, -d       Output directory (default: ./<name>)
  --no-git        Skip git init
  --help, -h      Show this help
  --version, -v   Show version

EXAMPLES
  npx create-effector github-pr-review --type skill
  npx create-effector telegram-bot --type extension
  npx create-effector deploy-pipeline --type workflow
  npx create-effector devops-agent --type workspace
  npx create-effector openclaw-langchain --type bridge
  npx create-effector review-template --type prompt

LEARN MORE
  Spec:   https://github.com/effectorHQ/effector-spec
  Docs:   https://github.com/effectorHQ/docs
`;

async function main() {
  const args = process.argv.slice(2);

  // Help
  if (args.includes('--help') || args.includes('-h')) {
    console.log(HELP);
    process.exit(0);
  }

  // Version
  if (args.includes('--version') || args.includes('-v')) {
    const { readFileSync } = await import('node:fs');
    const { fileURLToPath } = await import('node:url');
    const { dirname, join } = await import('node:path');
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const pkg = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf8'));
    console.log(pkg.version);
    process.exit(0);
  }

  let config;

  if (args.length === 0 || (args.length === 1 && !args[0].startsWith('-'))) {
    // Interactive mode (or just a name given)
    config = await interactivePrompt(args[0] || null);
  } else {
    config = parseArgs(args);
  }

  await createEffector(config);
}

main().catch((err) => {
  console.error(`\n  ✗ ${err.message}\n`);
  process.exit(1);
});

/**
 * Argument parser — zero dependencies, uses Node.js parseArgs from util
 */

import { parseArgs as nodeParseArgs } from 'node:util';

const VALID_TYPES = ['skill', 'extension', 'workflow', 'workspace', 'bridge', 'prompt'];
const VALID_RUNTIMES = ['openclaw', 'mcp', 'claude-agent-sdk', 'generic'];

export function parseArgs(argv) {
  const { values, positionals } = nodeParseArgs({
    args: argv,
    options: {
      type: { type: 'string', short: 't' },
      runtime: { type: 'string', short: 'r', default: 'openclaw' },
      dir: { type: 'string', short: 'd' },
      'no-git': { type: 'boolean', default: false },
    },
    allowPositionals: true,
    strict: false,
  });

  const name = positionals[0];
  if (!name) {
    throw new Error('Missing effector name. Usage: npx create-effector <name> --type <type>');
  }

  // Validate name format
  if (!/^(@[a-z0-9-]+\/)?[a-z0-9-]{2,64}$/.test(name)) {
    throw new Error(
      `Invalid name "${name}". Must be kebab-case, 2-64 characters. ` +
      `Examples: my-skill, @org/my-extension`
    );
  }

  const type = values.type;
  if (!type) {
    throw new Error(
      `Missing --type flag. Choose one of: ${VALID_TYPES.join(', ')}`
    );
  }
  if (!VALID_TYPES.includes(type)) {
    throw new Error(
      `Invalid type "${type}". Must be one of: ${VALID_TYPES.join(', ')}`
    );
  }

  const runtime = values.runtime || 'openclaw';
  if (!VALID_RUNTIMES.includes(runtime)) {
    throw new Error(
      `Invalid runtime "${runtime}". Must be one of: ${VALID_RUNTIMES.join(', ')}`
    );
  }

  return {
    name,
    type,
    runtime,
    dir: values.dir || `./${name}`,
    git: !values['no-git'],
  };
}

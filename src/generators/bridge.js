/**
 * Bridge Effector generator
 *
 * Generates a cross-runtime adapter (e.g., manifest → MCP).
 */

export function generateBridge({ name, runtime }) {
  const titleName = name.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');

  return {
    'src/adapter.js': `/**
 * ${titleName} — Bridge Adapter
 *
 * Translates capabilities from the source runtime to the target runtime.
 * This starter bridge echoes input via JSON-RPC over stdio.
 */

import { createInterface } from 'node:readline';

/**
 * Read an Effector from the source format and return a target-format definition.
 *
 * @param {string} sourceName - Name of the source Effector
 * @returns {object} Target runtime tool/capability definition
 */
export function translate(sourceName) {
  return {
    name: sourceName || '${name}',
    description: 'Bridged capability from ' + (sourceName || '${name}'),
    inputSchema: {
      type: 'object',
      properties: {
        message: { type: 'string', description: 'Input message to process' },
      },
    },
  };
}

/**
 * Start the bridge server (stdio-based JSON-RPC transport).
 *
 * Reads JSON-RPC messages from stdin, dispatches to translated capabilities,
 * writes responses to stdout.
 */
export async function serve(directory) {
  const rl = createInterface({ input: process.stdin });
  const tool = translate('${name}');

  // Send server info on startup
  process.stdout.write(JSON.stringify({
    jsonrpc: '2.0',
    result: {
      protocolVersion: '2024-11-05',
      capabilities: { tools: {} },
      serverInfo: { name: '${name}', version: '0.1.0' },
    },
  }) + '\\n');

  for await (const line of rl) {
    try {
      const msg = JSON.parse(line);

      if (msg.method === 'tools/list') {
        process.stdout.write(JSON.stringify({
          jsonrpc: '2.0',
          id: msg.id,
          result: { tools: [tool] },
        }) + '\\n');
      } else if (msg.method === 'tools/call') {
        const input = msg.params?.arguments?.message || 'no input';
        process.stdout.write(JSON.stringify({
          jsonrpc: '2.0',
          id: msg.id,
          result: { content: [{ type: 'text', text: '[${name}] ' + input }] },
        }) + '\\n');
      } else {
        process.stdout.write(JSON.stringify({
          jsonrpc: '2.0',
          id: msg.id,
          error: { code: -32601, message: 'Method not found: ' + msg.method },
        }) + '\\n');
      }
    } catch (err) {
      process.stderr.write(\`Bridge error: \${err.message}\\n\`);
    }
  }
}

// CLI entry point
if (process.argv[2] === 'serve') {
  serve(process.argv[3] || '.').catch(console.error);
}
`,

    'package.json': `{
  "name": "@effectorhq/${name}",
  "version": "0.1.0",
  "description": "A starter bridge that echoes input via JSON-RPC over stdio",
  "main": "src/adapter.js",
  "type": "module",
  "bin": {
    "${name}": "./src/adapter.js"
  },
  "scripts": {
    "start": "node src/adapter.js serve",
    "test": "node --test tests/"
  },
  "keywords": ["effector", "effectorhq", "bridge", "mcp"],
  "author": "effectorHQ Contributors",
  "license": "MIT",
  "engines": {
    "node": ">=18"
  }
}
`,

    'README.md': `# ${titleName}

[![CI](https://github.com/effectorHQ/${name}/actions/workflows/ci.yml/badge.svg)](https://github.com/effectorHQ/${name}/actions)
[![npm](https://img.shields.io/npm/v/@effectorhq/${name}.svg)](https://www.npmjs.com/package/@effectorhq/${name})
[![Effector Type: Bridge](https://img.shields.io/badge/effector-bridge-yellow)](https://github.com/effectorHQ/effector-spec)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)

An [Effector](https://github.com/effectorHQ/effector-spec) bridge that connects runtimes via JSON-RPC over stdio. Use as a starting point for building real bridges.

## Usage

\`\`\`bash
npm install @effectorhq/${name}

# Start the bridge server
npx @effectorhq/${name} serve ./effectors/
\`\`\`

## Architecture

\`\`\`
Source Runtime → [${titleName}] → Target Runtime
\`\`\`

## License

MIT © ${new Date().getFullYear()} effectorHQ Contributors
`,
  };
}

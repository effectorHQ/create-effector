/**
 * Extension Effector generator
 *
 * Generates a TypeScript extension with OpenClaw Plugin SDK structure.
 */

export function generateExtension({ name, runtime }) {
  const titleName = name.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
  const camelName = name.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

  return {
    'src/index.ts': `/**
 * ${titleName} — OpenClaw Extension
 *
 * This extension registers with the OpenClaw Plugin SDK
 * to provide TODO: describe what it provides.
 */

interface OpenClawPluginApi {
  registerAction(action: ActionDefinition): void;
  on(event: string, handler: (event: any) => void): void;
  getConfig<T>(schema: object): T;
  getLogger(namespace: string): Logger;
}

interface ActionDefinition {
  name: string;
  description: string;
  execute: (input: any) => Promise<any>;
}

interface Logger {
  info(msg: string, ...args: any[]): void;
  warn(msg: string, ...args: any[]): void;
  error(msg: string, ...args: any[]): void;
}

export function register(api: OpenClawPluginApi) {
  const logger = api.getLogger('${name}');

  logger.info('${titleName} extension loaded');

  // Register actions
  api.registerAction({
    name: '${camelName}',
    description: 'TODO: Describe the action',
    execute: async (input) => {
      logger.info('Executing ${camelName}', input);

      // TODO: Implement your extension logic here
      return {
        success: true,
        result: 'TODO: Return meaningful results',
      };
    },
  });

  // Register lifecycle hooks (optional)
  api.on('message', (event) => {
    // TODO: React to messages if needed
  });
}
`,

    'tsconfig.json': `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
`,

    'package.json': `{
  "name": "@effectorhq/${name}",
  "version": "0.1.0",
  "description": "TODO: Describe this extension",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "test": "node --test tests/",
    "prepublishOnly": "npm run build"
  },
  "keywords": ["effector", "effectorhq", "openclaw", "extension"],
  "author": "effectorHQ Contributors",
  "license": "MIT",
  "devDependencies": {
    "typescript": "^5.3.0"
  },
  "engines": {
    "node": ">=18"
  }
}
`,

    'README.md': `# ${titleName}

[![CI](https://github.com/effectorHQ/${name}/actions/workflows/ci.yml/badge.svg)](https://github.com/effectorHQ/${name}/actions)
[![npm](https://img.shields.io/npm/v/@effectorhq/${name}.svg)](https://www.npmjs.com/package/@effectorhq/${name})
[![Effector Type: Extension](https://img.shields.io/badge/effector-extension-purple)](https://github.com/effectorHQ/effector-spec)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)

An [Effector](https://github.com/effectorHQ/effector-spec) extension that TODO: describe what it provides.

## Installation

\`\`\`bash
npm install @effectorhq/${name}
\`\`\`

## Development

\`\`\`bash
npm install
npm run build
npm test
\`\`\`

## License

MIT © ${new Date().getFullYear()} effectorHQ Contributors
`,
  };
}

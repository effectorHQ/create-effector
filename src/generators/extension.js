/**
 * Extension Effector generator
 *
 * Generates a TypeScript extension with Plugin SDK structure.
 */

export function generateExtension({ name, runtime }) {
  const titleName = name.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
  const camelName = name.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

  return {
    'src/index.ts': `/**
 * ${titleName} — Extension
 *
 * This extension registers with the Plugin SDK
 * to provide timestamped greeting responses.
 */

interface RuntimePluginApi {
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

export function register(api: RuntimePluginApi) {
  const logger = api.getLogger('${name}');

  logger.info('${titleName} extension loaded');

  api.registerAction({
    name: '${camelName}',
    description: 'Greet the user with a timestamped message',
    execute: async (input) => {
      const greeting = input?.name ? \`Hello, \${input.name}!\` : 'Hello from ${titleName}!';
      const timestamp = new Date().toISOString();
      logger.info(\`Executed ${camelName}: \${greeting}\`);
      return {
        success: true,
        result: { greeting, timestamp, extension: '${name}' },
      };
    },
  });

  api.on('message', (event) => {
    logger.info(\`[${name}] Received message event\`);
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
  "description": "A starter extension that responds with timestamped greetings",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "test": "node --test tests/",
    "prepublishOnly": "npm run build"
  },
  "keywords": ["effector", "effectorhq", "extension"],
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

An [Effector](https://github.com/effectorHQ/effector-spec) extension that responds with timestamped greetings. Use as a starting point for building real extensions.

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

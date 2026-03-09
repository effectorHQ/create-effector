/**
 * Prompt Effector generator
 *
 * Generates a reusable prompt template with variables.
 */

export function generatePrompt({ name, runtime }) {
  const titleName = name.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');

  return {
    'prompt.md': `# ${titleName}

{{#system}}

You are an expert at TODO: define the domain.

## Context

{{context}}

## Task

TODO: Define what the agent should do with this prompt.

## Constraints

- TODO: Constraint 1
- TODO: Constraint 2

## Output Format

TODO: Describe the expected output format.

{{/system}}
`,

    'README.md': `# ${titleName}

[![Effector Type: Prompt](https://img.shields.io/badge/effector-prompt-pink)](https://github.com/effectorHQ/effector-spec)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)

An [Effector](https://github.com/effectorHQ/effector-spec) prompt template for TODO: describe the use case.

## Variables

| Variable | Type | Description |
|----------|------|-------------|
| \`context\` | string | TODO: Describe this variable |

## Usage

This prompt template is injected by the runtime at the appropriate context point. Variables are resolved at invocation time.

### With OpenClaw

Place in your workspace's \`prompts/\` directory:

\`\`\`bash
cp prompt.md ~/.openclaw/workspace/prompts/${name}.md
\`\`\`

### Standalone

Use the template variables syntax (\`{{variable}}\`) and resolve them in your application code.

## License

MIT © ${new Date().getFullYear()} effectorHQ Contributors
`,
  };
}

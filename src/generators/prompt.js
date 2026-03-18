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

You are an expert at reviewing and summarizing content.

## Context

{{context}}

## Task

Given the context above, provide a concise summary highlighting:
1. Key points and decisions
2. Action items (if any)
3. Questions that remain open

## Constraints

- Keep the summary under 200 words
- Use bullet points for action items
- Flag anything that seems unclear or contradictory

## Output Format

**Summary:** <1-2 sentence overview>

**Key Points:**
- ...

**Action Items:**
- [ ] ...

**Open Questions:**
- ...

{{/system}}
`,

    'README.md': `# ${titleName}

[![Effector Type: Prompt](https://img.shields.io/badge/effector-prompt-pink)](https://github.com/effectorHQ/effector-spec)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)

An [Effector](https://github.com/effectorHQ/effector-spec) prompt template for generating concise content summaries.

## Variables

| Variable | Type | Description |
|----------|------|-------------|
| \`context\` | string | The content to review and summarize |

## Usage

This prompt template is injected by the runtime at the appropriate context point. Variables are resolved at invocation time.

### Standalone

Use the template variables syntax (\`{{variable}}\`) and resolve them in your application code.

## License

MIT © ${new Date().getFullYear()} effectorHQ Contributors
`,
  };
}

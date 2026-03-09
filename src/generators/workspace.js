/**
 * Workspace Effector generator
 *
 * Generates a Workspace-as-Kernel configuration bundle.
 */

export function generateWorkspace({ name, runtime }) {
  const titleName = name.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');

  return {
    'SOUL.md': `# ${titleName} — Soul

## Core Personality

TODO: Define the agent's personality, tone, and behavioral guidelines.

### Traits

- **Trait 1**: TODO: Describe how the agent communicates
- **Trait 2**: TODO: Describe the agent's decision-making style
- **Trait 3**: TODO: Describe the agent's risk tolerance

### Communication Style

TODO: How does this agent talk? Formal? Casual? Technical? Supportive?

### Decision-Making Framework

When faced with ambiguity:
1. TODO: First priority
2. TODO: Second priority
3. TODO: When in doubt, do this

### Boundaries

- Never do: TODO
- Always do: TODO
- Ask first: TODO
`,

    'AGENTS.md': `# ${titleName} — Agents

## Agent: ${titleName}

### Expertise Areas

- TODO: Primary domain expertise
- TODO: Secondary skills

### Capabilities

- TODO: What this agent can do
- TODO: What tools it uses

### Limitations

- TODO: What this agent should NOT attempt
- TODO: Known gaps in knowledge

### Collaboration

- TODO: How this agent works with humans
- TODO: When to escalate to a human
`,

    'TOOLS.md': `# ${titleName} — Tools

## Available Tools

### Tool 1: TODO

- **Purpose:** TODO
- **When to use:** TODO
- **Risk level:** Low / Medium / High
- **Notes:** TODO

### Tool 2: TODO

- **Purpose:** TODO
- **When to use:** TODO
- **Risk level:** Low / Medium / High
- **Notes:** TODO
`,

    'IDENTITY.md': `# ${titleName} — Identity

## Name

${titleName}

## Role

TODO: One-line description of this agent's role.

## Avatar

TODO: Describe the visual identity (if applicable).

## Contact

- **Repository:** https://github.com/effectorHQ/${name}
- **Maintainer:** TODO
`,

    'HEARTBEAT.md': `# ${titleName} — Heartbeat

## Health Check

- **Status:** Active
- **Check interval:** 60s
- **Timeout:** 10s

## Monitoring

TODO: Define monitoring endpoints or health check logic.

## Alerts

TODO: Define when and how to alert on issues.
`,

    'README.md': `# ${titleName}

[![Effector Type: Workspace](https://img.shields.io/badge/effector-workspace-teal)](https://github.com/effectorHQ/effector-spec)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)

An [Effector](https://github.com/effectorHQ/effector-spec) workspace template that configures an AI agent for TODO: describe the domain.

## Installation

\`\`\`bash
cp -r . ~/.openclaw/workspace/
openclaw restart
\`\`\`

## Files

| File | Purpose |
|------|---------|
| \`SOUL.md\` | Personality, tone, behavioral guidelines |
| \`AGENTS.md\` | Agent capabilities and expertise |
| \`TOOLS.md\` | Available tools and usage guidance |
| \`IDENTITY.md\` | Name, role, branding |
| \`HEARTBEAT.md\` | Health monitoring config |

## Customization

Fork this workspace and edit the markdown files to match your needs. The Workspace-as-Kernel pattern means these files ARE the configuration — no code required.

## License

MIT © ${new Date().getFullYear()} effectorHQ Contributors
`,
  };
}

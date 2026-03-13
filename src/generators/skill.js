/**
 * Skill Effector generator
 *
 * Generates a SKILL.md file with proper frontmatter and
 * a README documenting the skill.
 */

export function generateSkill({ name, runtime }) {
  const titleName = name.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');

  return {
    'SKILL.md': `---
name: ${name}
description: "Echo back user input with metadata. A starter skill to verify your setup works."
metadata:
  openclaw:
    emoji: 🎯
    requires:
      bins: []
      env: []
    install: []
---

## Purpose

${titleName} is a starter skill that echoes user input back with timestamp and context. Use it to verify your workspace is configured correctly, or as a starting point for a new skill.

## When to Use

- Testing that skills load and respond correctly
- Verifying your workspace configuration after setup
- As a template base for building a real skill

## When NOT to Use

- In production workflows (replace with a real skill)
- When you need external API access (add requirements first)

## Setup

### Prerequisites

No external tools or API keys required.

### Installation

\`\`\`bash
# Install from ClawHub
clawhub install ${name}

# Or install locally
cp -r . ~/.openclaw/workspace/skills/${name}/
\`\`\`

## Commands

### \`echo\`

Repeats the user's input with a timestamp.

**Example:**

\`\`\`
User: "Say hello"
Agent: [${name}] hello (at 2024-01-15T10:30:00Z)
\`\`\`

### \`status\`

Prints the skill's name and version to confirm it is loaded.

\`\`\`
User: "Is ${name} working?"
Agent: ${name} v0.1.0 is active.
\`\`\`

## Examples

### Example 1: Basic Echo

User: "Say hello"
Agent uses the echo command to respond: "[${name}] hello (at <timestamp>)"

### Example 2: Health Check

User: "Is ${name} working?"
Agent runs the status command: "${name} v0.1.0 is active."

## Notes

- This is a starter skill with no external dependencies
- Replace this content with your real skill logic
- See https://github.com/effectorHQ/linear-skill for a production example
`,

    'README.md': `# ${titleName}

[![CI](https://github.com/effectorHQ/${name}/actions/workflows/ci.yml/badge.svg)](https://github.com/effectorHQ/${name}/actions)
[![ClawHub](https://img.shields.io/badge/publish%20to-ClawHub-E03E3E)](https://clawhub.com)
[![Effector Type: Skill](https://img.shields.io/badge/effector-skill-blue)](https://github.com/effectorHQ/effector-spec)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)

An [Effector](https://github.com/effectorHQ/effector-spec) skill that echoes user input with metadata. Use as a starting point for building real skills.

## Quick Start

\`\`\`bash
# Install from ClawHub
clawhub install ${name}

# Or install locally
cp -r . ~/.openclaw/workspace/skills/${name}/
\`\`\`

## Validation

\`\`\`bash
npx @effectorhq/skill-lint SKILL.md
\`\`\`

## Publishing

\`\`\`bash
clawhub publish
\`\`\`

## Contributing

PRs welcome! See [CONTRIBUTING.md](https://github.com/effectorHQ/.github/blob/main/CONTRIBUTING.md).

## License

MIT © ${new Date().getFullYear()} effectorHQ Contributors
`,
  };
}

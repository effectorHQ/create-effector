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
description: "TODO: What this skill does and when the agent should use it."
metadata:
  openclaw:
    emoji: 🎯
    requires:
      bins: []
      env: []
    install: []
---

## Purpose

TODO: Describe what this skill enables the agent to do.

## When to Use

- TODO: Specific scenarios where this skill is appropriate

## When NOT to Use

- TODO: Scenarios where this skill should not be used

## Setup

### Prerequisites

TODO: List any tools, API keys, or configuration needed.

### Installation

\`\`\`bash
# Install from ClawHub
clawhub install ${name}

# Or install locally
cp -r . ~/.openclaw/workspace/skills/${name}/
\`\`\`

## Commands

### \`command-name\`

TODO: Document each command or action the agent can take.

**Example:**

\`\`\`bash
# TODO: Add a real example
\`\`\`

## Examples

### Example 1: Basic Usage

TODO: Provide a complete, working example.

### Example 2: Advanced Usage

TODO: Provide a more complex example.

## Notes

- TODO: Limitations, security considerations, troubleshooting tips
`,

    'README.md': `# ${titleName}

[![CI](https://github.com/effectorHQ/${name}/actions/workflows/ci.yml/badge.svg)](https://github.com/effectorHQ/${name}/actions)
[![ClawHub](https://img.shields.io/badge/publish%20to-ClawHub-E03E3E)](https://clawhub.com)
[![Effector Type: Skill](https://img.shields.io/badge/effector-skill-blue)](https://github.com/effectorHQ/effector-spec)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)

An [Effector](https://github.com/effectorHQ/effector-spec) skill that TODO: describe what it does.

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

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
description: "A starter effector skill with a typed interface, examples, and a verifiable golden path (lint → eval → validate → compile)."
metadata:
  openclaw:
    emoji: 🎯
    requires:
      bins: []
      env: []
    install: []
  effector:
    emoji: 🎯
    requires:
      bins: []
      env: []
    install: []
---

## Purpose

${titleName} is a starter skill designed to be **verifiable** end-to-end: you can lint it, evaluate it (static-only), validate its manifest, and compile it to a runtime target.

## When to Use

- You need a minimal, type-declared skill skeleton that passes the effector toolchain
- You want a known-good baseline before adding real permissions and prerequisites
- You are building a new skill and want a clean structure to extend

## When NOT to Use

- As-is in production workflows (replace the placeholder commands with real ones)
- When you need network/filesystem/subprocess access (declare permissions in \`effector.toml\` first)

## Setup

### Prerequisites

No external tools or API keys required.

### Installation

\`\`\`bash
# Golden path (local)
npx @effectorhq/skill-lint SKILL.md
npx @effectorhq/skill-eval . --static-only
npx effector-core validate .
npx effector-core compile . -t mcp
\`\`\`

## Commands

### \`echo\`

Echo back user input as plain text.

**Example:**

\`\`\`
User: "Say hello"
Agent: hello
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

\`\`\`
hello
\`\`\`

### Example 2: Health Check

User: "Is ${name} working?"

\`\`\`
${name} v0.1.0 is active.
\`\`\`

## Notes

- This is a starter skill with no external dependencies
- Replace this content with your real skill logic
- See https://github.com/effectorHQ/linear-skill for a production example
`,

    'README.md': `# ${titleName}

[![CI](https://github.com/effectorHQ/${name}/actions/workflows/ci.yml/badge.svg)](https://github.com/effectorHQ/${name}/actions)
[![Effector Type: Skill](https://img.shields.io/badge/effector-skill-blue)](https://github.com/effectorHQ/effector-spec)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)

An [Effector](https://github.com/effectorHQ/effector-spec) skill that echoes user input with metadata. Use as a starting point for building real skills.

## Quick Start

\`\`\`bash
npx @effectorhq/skill-lint SKILL.md
npx @effectorhq/skill-eval . --static-only
npx effector-core validate .
npx effector-core compile . -t mcp
\`\`\`

## Validation

\`\`\`bash
npx @effectorhq/skill-lint SKILL.md
\`\`\`

## Contributing

PRs welcome! See [CONTRIBUTING.md](https://github.com/effectorHQ/.github/blob/main/CONTRIBUTING.md).

## License

MIT © ${new Date().getFullYear()} effectorHQ Contributors
`,
  };
}

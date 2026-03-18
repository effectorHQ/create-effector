# create-effector

[![npm version](https://img.shields.io/npm/v/@effectorhq/create-effector.svg)](https://www.npmjs.com/package/@effectorhq/create-effector)
[![CI](https://github.com/effectorHQ/create-effector/actions/workflows/test.yml/badge.svg)](https://github.com/effectorHQ/create-effector/actions/workflows/test.yml)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Effector Spec](https://img.shields.io/badge/spec-0.2.0-blue)](https://github.com/effectorHQ/effector-spec)

**[中文文档 →](./README.zh.md)**

---

Scaffold a new [Effector](https://github.com/effectorHQ/effector-spec) project in 30 seconds. Zero dependencies.

```bash
npx create-effector my-skill --type skill
```

## Install

```bash
npm install -g @effectorhq/create-effector
```

You can also use the CLI directly without installing globally:

```bash
npx @effectorhq/create-effector my-skill
npx @effectorhq/create-effector my-workspace --type workspace
```

See the published package on npm: **https://www.npmjs.com/package/@effectorhq/create-effector**

## What It Does

Generates the correct project structure for any Effector type — manifest, entry files, CI, README, LICENSE — so you can start building immediately instead of copying boilerplate.

## Quick Start

### Interactive Mode

```bash
npx create-effector
```

Walks you through name, type, runtime, and directory selection.

### Direct Mode

```bash
npx create-effector <name> --type <type> [--runtime <runtime>]
```

### Examples

```bash
# Skill — SKILL.md instructions for a CLI tool
npx create-effector github-pr-review --type skill

# Extension — TypeScript plugin for the runtime SDK
npx create-effector telegram-bot --type extension

# Workflow — Lobster pipeline chaining skills
npx create-effector deploy-pipeline --type workflow

# Workspace — Agent persona bundle (SOUL.md, AGENTS.md, etc.)
npx create-effector devops-agent --type workspace

# Bridge — Cross-runtime adapter (e.g., OpenClaw → MCP)
npx create-effector openclaw-langchain --type bridge

# Prompt — Reusable prompt template with variables
npx create-effector review-template --type prompt
```

## Generated Structure

Each type generates a different structure tailored to its use case:

### Skill

```
my-skill/
├── effector.toml      # Effector manifest
├── SKILL.md           # Skill instructions (entry file)
├── README.md
├── LICENSE
├── CHANGELOG.md
├── .gitignore
└── .github/workflows/ci.yml
```

### Extension

```
my-extension/
├── effector.toml
├── src/index.ts       # Plugin entry (register function)
├── package.json       # npm package
├── tsconfig.json
├── README.md
├── LICENSE
├── CHANGELOG.md
├── .gitignore
└── .github/workflows/ci.yml
```

### Workflow

```
my-workflow/
├── effector.toml
├── pipeline.yml       # Lobster pipeline definition
├── README.md
├── LICENSE
├── CHANGELOG.md
├── .gitignore
└── .github/workflows/ci.yml
```

### Workspace

```
my-workspace/
├── effector.toml
├── SOUL.md            # Agent personality
├── AGENTS.md          # Capabilities and expertise
├── TOOLS.md           # Available tools
├── IDENTITY.md        # Name, role, branding
├── HEARTBEAT.md       # Health monitoring
├── README.md
├── LICENSE
├── CHANGELOG.md
├── .gitignore
└── .github/workflows/ci.yml
```

### Bridge

```
my-bridge/
├── effector.toml
├── src/adapter.js     # Bridge adapter
├── package.json
├── README.md
├── LICENSE
├── CHANGELOG.md
├── .gitignore
└── .github/workflows/ci.yml
```

### Prompt

```
my-prompt/
├── effector.toml
├── prompt.md          # Prompt template with variables
├── README.md
├── LICENSE
├── CHANGELOG.md
├── .gitignore
└── .github/workflows/ci.yml
```

## Options

| Option | Short | Default | Description |
|--------|-------|---------|-------------|
| `--type` | `-t` | — | Effector type (required in direct mode) |
| `--runtime` | `-r` | `openclaw` | Primary runtime: openclaw, mcp, claude-agent-sdk, generic |
| `--dir` | `-d` | `./<name>` | Output directory |
| `--no-git` | — | `false` | Skip git initialization |
| `--help` | `-h` | — | Show help |
| `--version` | `-v` | — | Show version |

## How It Works

1. Parses arguments (or runs interactive prompts)
2. Generates `effector.toml` manifest with type-appropriate defaults
3. Generates entry files specific to the Effector type
4. Generates common files (LICENSE, CHANGELOG, .gitignore, CI)
5. Initializes a git repository

No network requests. No dependencies to install. Everything runs with Node.js built-ins.

## Example Skills

The `examples/` directory contains reference skills you can study:

- **`examples/hello-world/`** — Simplest possible skill with no dependencies
- **`examples/api-connector/`** — API integration skill with env vars, curl, and typed interface

Each example includes both `SKILL.md` and `effector.toml` to demonstrate proper structure.

For a production-quality reference, see [linear-skill](https://github.com/effectorHQ/linear-skill).

## Contributing

PRs welcome! See [CONTRIBUTING.md](https://github.com/effectorHQ/.github/blob/main/CONTRIBUTING.md).

## License

MIT © 2026 effectorHQ Contributors

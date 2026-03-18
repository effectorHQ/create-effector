/**
 * Workflow Effector generator
 *
 * Generates a Lobster pipeline with example steps.
 */

export function generateWorkflow({ name, runtime }) {
  const titleName = name.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');

  return {
    'pipeline.yml': `# ${titleName} — Lobster Workflow Pipeline
#
# A deterministic, resumable pipeline that chains skill Effectors.
# Docs: https://github.com/effectorHQ/docs

name: ${name}
description: "Automate a prepare-execute-notify pipeline"
version: "0.1.0"

# Variables — override at runtime via your runner (e.g. env vars or CLI flags)
variables:
  ENVIRONMENT: "staging"
  NOTIFY_CHANNEL: "#general"

steps:
  # Step 1: Preparation
  - name: prepare
    skill: git-operations
    description: "Gather context for the workflow"
    params:
      action: status
    output: prepare_result

  # Step 2: Main action
  - name: execute
    skill: ${name}
    description: "Process the gathered context"
    params:
      input: "\${prepare_result.output}"
      environment: "\${ENVIRONMENT}"
    output: execute_result
    retry:
      max_attempts: 3
      backoff: exponential

  # Step 3: Notify
  - name: notify
    skill: slack-notify
    description: "Send completion notification"
    params:
      channel: "\${NOTIFY_CHANNEL}"
      message: "Workflow \${name} completed: \${execute_result.status}"
    condition: "\${execute_result.status == 'success'}"

  # Error handler
  - name: on-failure-notify
    skill: slack-notify
    description: "Send failure notification"
    params:
      channel: "\${NOTIFY_CHANNEL}"
      message: "Workflow \${name} FAILED at step: \${failed_step}"
    on_failure: true
`,

    'README.md': `# ${titleName}

[![CI](https://github.com/effectorHQ/${name}/actions/workflows/ci.yml/badge.svg)](https://github.com/effectorHQ/${name}/actions)
[![Effector Type: Workflow](https://img.shields.io/badge/effector-workflow-orange)](https://github.com/effectorHQ/effector-spec)
[![Lobster](https://img.shields.io/badge/powered%20by-Lobster-blue)](https://github.com/effectorHQ/docs)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)

An [Effector](https://github.com/effectorHQ/effector-spec) workflow that automates a prepare-execute-notify pipeline.

## Usage

\`\`\`bash
# Provide a pipeline runner that understands this format,
# or compile it to your target runtime using the effector toolchain.
\`\`\`

## Pipeline Steps

| Step | Skill | Description |
|------|-------|-------------|
| prepare | git-operations | Gather context |
| execute | ${name} | Process gathered context |
| notify | slack-notify | Completion notification |

## Customization

Edit \`pipeline.yml\` to:
- Add or remove steps
- Change skill references
- Modify variables and conditions
- Add retry logic and error handlers

## License

MIT © ${new Date().getFullYear()} effectorHQ Contributors
`,
  };
}

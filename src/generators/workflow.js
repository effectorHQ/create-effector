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
# Docs: https://docs.openclaw.dev/lobster

name: ${name}
description: "TODO: Describe what this workflow automates"
version: "0.1.0"

# Variables — override at runtime with \`openclaw pipeline run ${name} --set KEY=VALUE\`
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
    skill: TODO-your-skill
    description: "TODO: Describe the main action"
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
[![Lobster](https://img.shields.io/badge/powered%20by-Lobster-blue)](https://docs.openclaw.dev/lobster)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)

An [Effector](https://github.com/effectorHQ/effector-spec) workflow that TODO: describe the automation.

## Usage

\`\`\`bash
# Deploy the pipeline
openclaw pipeline deploy pipeline.yml

# Run it
openclaw pipeline run ${name}

# Run with overrides
openclaw pipeline run ${name} --set ENVIRONMENT=production --set NOTIFY_CHANNEL="#ops"
\`\`\`

## Pipeline Steps

| Step | Skill | Description |
|------|-------|-------------|
| prepare | git-operations | Gather context |
| execute | TODO | Main action |
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

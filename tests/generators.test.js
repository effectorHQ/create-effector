import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { generateSkill } from '../src/generators/skill.js';
import { generateExtension } from '../src/generators/extension.js';
import { generateWorkflow } from '../src/generators/workflow.js';
import { generateWorkspace } from '../src/generators/workspace.js';
import { generateBridge } from '../src/generators/bridge.js';
import { generatePrompt } from '../src/generators/prompt.js';

const config = { name: 'test-effector', runtime: 'openclaw' };

describe('Generators', () => {
  it('skill generator produces SKILL.md and README.md', () => {
    const files = generateSkill(config);
    assert.ok(files['SKILL.md'], 'Missing SKILL.md');
    assert.ok(files['README.md'], 'Missing README.md');
    assert.ok(files['SKILL.md'].includes('name: test-effector'));
    assert.ok(files['SKILL.md'].includes('---'));  // frontmatter
  });

  it('extension generator produces src/index.ts and package.json', () => {
    const files = generateExtension(config);
    assert.ok(files['src/index.ts'], 'Missing src/index.ts');
    assert.ok(files['package.json'], 'Missing package.json');
    assert.ok(files['tsconfig.json'], 'Missing tsconfig.json');
    assert.ok(files['src/index.ts'].includes('register'));
  });

  it('workflow generator produces pipeline.yml', () => {
    const files = generateWorkflow(config);
    assert.ok(files['pipeline.yml'], 'Missing pipeline.yml');
    assert.ok(files['pipeline.yml'].includes('name: test-effector'));
    assert.ok(files['pipeline.yml'].includes('steps:'));
  });

  it('workspace generator produces all five config files', () => {
    const files = generateWorkspace(config);
    assert.ok(files['SOUL.md'], 'Missing SOUL.md');
    assert.ok(files['AGENTS.md'], 'Missing AGENTS.md');
    assert.ok(files['TOOLS.md'], 'Missing TOOLS.md');
    assert.ok(files['IDENTITY.md'], 'Missing IDENTITY.md');
    assert.ok(files['HEARTBEAT.md'], 'Missing HEARTBEAT.md');
  });

  it('bridge generator produces src/adapter.js', () => {
    const files = generateBridge(config);
    assert.ok(files['src/adapter.js'], 'Missing src/adapter.js');
    assert.ok(files['src/adapter.js'].includes('translate'));
    assert.ok(files['src/adapter.js'].includes('serve'));
  });

  it('prompt generator produces prompt.md', () => {
    const files = generatePrompt(config);
    assert.ok(files['prompt.md'], 'Missing prompt.md');
    assert.ok(files['prompt.md'].includes('{{'));  // template syntax
  });

  it('all generators return README.md', () => {
    const generators = [generateSkill, generateExtension, generateWorkflow,
                        generateWorkspace, generateBridge, generatePrompt];
    for (const gen of generators) {
      const files = gen(config);
      assert.ok(files['README.md'], `${gen.name} missing README.md`);
    }
  });
});

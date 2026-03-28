#!/usr/bin/env python3
import subprocess, os

base = '/Users/nishantchaudhary/Desktop/my-turborepo'
tools = [
    'accessibility-checker', 'analyze-ui-design', 'cli-wrappers',
    'code-modernizer', 'component-factory', 'component-fixer',
    'component-improver', 'component-reviewer', 'component-tools',
    'config-manager', 'dep-auditor', 'enforce-design-tokens',
    'fix-failing-tests', 'generate-tests', 'legacy-analyzer',
    'lighthouse-runner', 'mcp-tool-improviser', 'monorepo-manager',
    'performance-audit', 'quality-pipeline', 'refactor-executor',
    'render-analyzer', 'storybook-generator', 'test-gap-analyzer',
    'typescript-enforcer'
]

for tool in tools:
    tool_dir = os.path.join(base, 'tools', tool)
    if not os.path.isdir(tool_dir):
        print(f'MISS  {tool}')
        continue
    try:
        result = subprocess.run(
            ['npx', 'tsc', '--noEmit'],
            cwd=tool_dir, capture_output=True, text=True, timeout=30
        )
        output = result.stderr + result.stdout
        error_lines = [l for l in output.split('\n') if 'error TS' in l]
        count = len(error_lines)
        if count > 0:
            print(f'FAIL  {tool}: {count} errors')
            for el in error_lines[:3]:
                print(f'      {el[:120]}')
        else:
            print(f'OK    {tool}')
    except subprocess.TimeoutExpired:
        print(f'TIME  {tool}')

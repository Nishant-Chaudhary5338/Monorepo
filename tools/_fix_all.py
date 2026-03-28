#!/usr/bin/env python3
import os, re, json

base = '/Users/nishantchaudhary/Desktop/my-turborepo/tools'
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

total_fixes = 0

for tool in tools:
    tsconfig_path = os.path.join(base, tool, 'tsconfig.json')
    if not os.path.exists(tsconfig_path):
        continue
    
    # Fix tsconfig: remove rootDir if present
    with open(tsconfig_path) as f:
        data = json.load(f)
    if 'rootDir' in data.get('compilerOptions', {}):
        del data['compilerOptions']['rootDir']
        with open(tsconfig_path, 'w') as f:
            json.dump(data, f, indent=2)
            f.write('\n')
        total_fixes += 1
        print(f'  tsconfig: removed rootDir from {tool}')

    # Fix source files
    src_dir = os.path.join(base, tool, 'src')
    if not os.path.isdir(src_dir):
        continue
    
    for root, dirs, files in os.walk(src_dir):
        for fname in files:
            if not fname.endswith('.ts'):
                continue
            fpath = os.path.join(root, fname)
            with open(fpath) as f:
                content = f.read()
            original = content
            
            # Fix 1: args destructuring - add type assertion
            # Pattern: const { path } = args;
            content = re.sub(
                r"const \{ ([\w:,\s'=]+) \} = args;",
                r"const { \1 } = args as any;",
                content
            )
            
            # Fix 2: catch (error) without type annotation
            content = content.replace("} catch (error) {", "} catch (error: unknown) {")
            
            # Fix 3: error.message -> (error as Error).message
            content = content.replace("error.message", "(error as Error).message")
            
            # Fix 4: Fix readonly tuple includes - cast to readonly string[]
            content = re.sub(
                r"(\w+)\.includes\((\w+)\.rule\)",
                r"(\1 as readonly string[]).includes(\2.rule)",
                content
            )
            content = re.sub(
                r"(\w+)\.includes\((\w+)\[1\]\)",
                r"(\1 as readonly string[]).includes(\2[1])",
                content
            )
            
            # Fix 5: Replace manual error return objects with this.error
            # Pattern: return { content: [{ type: 'text', text: JSON.stringify({ success: false, error: ...
            content = re.sub(
                r"return \{\n\s*content: \[\{ type: 'text', text: JSON\.stringify\(\{ success: false, error: \(error as Error\)\.message.*?\}\), null, 2\) \}\],\n\s*isError: true,\n\s*\};",
                "return this.error(error);",
                content,
                flags=re.DOTALL
            )
            
            # Fix 6: Return type literal 'string' -> const assertion for tool content types
            # { type: 'text' } should have literal type
            content = content.replace(
                "{ type: 'text', text:",
                "{ type: 'text' as const, text:"
            )
            
            if content != original:
                with open(fpath, 'w') as f:
                    f.write(content)
                total_fixes += 1
                rel = os.path.relpath(fpath, os.path.join(base, tool))
                print(f'  source: fixed {tool}/{rel}')

print(f'\nTotal fixes applied: {total_fixes}')

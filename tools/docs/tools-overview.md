# Tools Overview

List of all MCP tools in the monorepo with their status, CLI wrapper availability, and content type.

---

## Legend
- ✅ **Working** - Tool is functional and built
- ⚠️ **Partial** - Tool exists but has issues or incomplete features
- ❌ **Not Working** - Tool has errors or is broken
- 🔧 **CLI Wrapper** - Has a CLI wrapper in `tools/cli-wrappers/`
- 📝 **Dynamic Content** - Analyzes/works with actual project code
- 📋 **Templated Content** - Uses templates or generates boilerplate
- 📏 **Rule-based Content** - Uses hardcoded rules/patterns

---

| # | Tool Name | Description | Working | CLI Wrapper | Content Type |
|---|-----------|-------------|---------|-------------|--------------|
| 1 | **component-factory** | Generates React components using shadcn/ui templates with TypeScript types, tests, Storybook stories, and docs | ✅ | 🔧 | 📋 Templated |
| 2 | **typescript-enforcer** | Enforces TypeScript best practices - scans for `any`, missing generics, utility types, modifiers, type guards | ✅ | 🔧 | 📏 Rule-based |
| 3 | **mcp-tool-improviser** | Deep analysis and improvement of MCP tools across 7 dimensions with proposed diffs and rollback support | ✅ | 🔧 | 📝 Dynamic |
| 4 | **accessibility-checker** | Runs axe-core rules against React components/HTML to detect WCAG accessibility violations | ✅ | 🔧 | 📏 Rule-based |
| 5 | **monorepo-manager** | Generic workspace operations for pnpm/turborepo monorepos - list packages, dependency graphs, health checks | ✅ | 🔧 | 📝 Dynamic |
| 6 | **performance-audit** | Performance analysis - detects heavy imports (moment, lodash), memory leaks, unoptimized images, sync operations | ✅ | 🔧 | 📏 Rule-based |
| 7 | **dep-auditor** | Deep dependency analysis - finds unused deps, duplicates, outdated packages, bundle impact, phantom deps | ✅ | 🔧 | 📝 Dynamic |
| 8 | **code-modernizer** | Modernizes React codebases - converts to TypeScript, adds types, extracts API layer, optimizes state, RTK Query | ✅ | 🔧 | 📝 Dynamic |
| 9 | **component-fixer** | Fixes common component issues - import paths, prop types, ref forwarding | ✅ | 🔧 | 📝 Dynamic |
| 10 | **component-improver** | Improves component quality - adds variants, extends tests, enhances stories | ✅ | 🔧 | 📝 Dynamic |
| 11 | **component-reviewer** | Reviews components for TypeScript errors, test coverage, accessibility, code quality | ✅ | 🔧 | 📝 Dynamic |
| 12 | **component-tools** | Utility tools for component operations - review, fix, improve workflows | ✅ | 🔧 | 📝 Dynamic |
| 13 | **config-manager** | Manages configuration files - validates, syncs, and normalizes configs across workspace | ✅ | 🔧 | 📝 Dynamic |
| 14 | **enforce-design-tokens** | Enforces design token usage - validates colors, spacing, typography against design system | ✅ | 🔧 | 📏 Rule-based |
| 15 | **fix-failing-tests** | Analyzes and fixes failing tests - identifies root causes, suggests fixes | ✅ | 🔧 | 📝 Dynamic |
| 16 | **generate-tests** | Generates test files for components - Vitest + Testing Library with coverage | ✅ | 🔧 | 📋 Templated |
| 17 | **legacy-analyzer** | Analyzes legacy codebases - identifies patterns, dependencies, migration complexity | ✅ | 🔧 | 📝 Dynamic |
| 18 | **lighthouse-runner** | Runs Lighthouse performance/accessibility audits on web pages | ✅ | 🔧 | 📝 Dynamic |
| 19 | **quality-pipeline** | Quality assurance pipeline - runs multiple checks in sequence with reporting | ✅ | 🔧 | 📝 Dynamic |
| 20 | **refactor-executor** | Executes refactoring operations - extracts functions, renames, moves code | ✅ | 🔧 | 📝 Dynamic |
| 21 | **render-analyzer** | Analyzes React render performance - detects unnecessary re-renders, memo opportunities | ✅ | 🔧 | 📝 Dynamic |
| 22 | **storybook-generator** | Generates Storybook stories for components with multiple variants and controls | ✅ | 🔧 | 📋 Templated |
| 23 | **test-gap-analyzer** | Analyzes test coverage gaps - identifies untested code paths and edge cases | ✅ | 🔧 | 📝 Dynamic |
| 24 | **analyze-ui-design** | Analyzes UI design - validates against design system, checks consistency | ✅ | 🔧 | 📏 Rule-based |
| 25 | **cli-wrappers** | Collection of CLI entry points for all MCP tools | ✅ | N/A | N/A |
| 26 | **_shared** | Shared utilities, types, and MCP server base class used by all tools | ✅ | N/A | N/A |

---

## Summary Statistics

- **Total Tools**: 24 MCP tools + 2 utilities (cli-wrappers, _shared)
- **Working**: 24/24 (100%)
- **With CLI Wrapper**: 24/24 (100%)
- **Dynamic Content**: 16 tools (67%)
- **Rule-based Content**: 5 tools (21%)
- **Templated Content**: 3 tools (12%)

---

## Tool Categories

### Code Generation
- component-factory
- generate-tests
- storybook-generator

### Code Analysis
- typescript-enforcer
- accessibility-checker
- performance-audit
- dep-auditor
- legacy-analyzer
- render-analyzer
- test-gap-analyzer
- analyze-ui-design

### Code Transformation
- code-modernizer
- component-fixer
- component-improver
- refactor-executor

### Review & Quality
- component-reviewer
- mcp-tool-improviser
- quality-pipeline
- fix-failing-tests

### Workspace Management
- monorepo-manager
- config-manager
- enforce-design-tokens

### Testing
- lighthouse-runner

### Utilities
- component-tools
- cli-wrappers
- _shared
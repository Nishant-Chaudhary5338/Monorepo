// ============================================================================
// TOOL #4: analyze-state-management
// Detects Redux, Context API, local state patterns, and advanced patterns
// ============================================================================

import * as path from 'path';
import { findSourceFiles, readFileContent } from '../utils/file-scanner';
import { parseFile, extractImports, extractHooks } from '../utils/ast-parser';
import type { AnalyzeStateOutput, StatePatterns, AnalyzerConfig } from '../types';

export async function analyzeStateManagement(appPath: string, config?: Partial<AnalyzerConfig>): Promise<AnalyzeStateOutput> {
  const srcPath = path.join(appPath, 'src');
  const files = await findSourceFiles(srcPath);

  const reduxUsage = 0;
  const contextUsage = 0;
  const localStateUsage = 0;

  const patterns: StatePatterns = {
    normalizedState: false,
    derivedState: false,
    reselectUsed: false,
  };

  const issues: string[] = [];

  // Track specific patterns
  let hasEntitiesPattern = false;
  let hasIdsPattern = false;
  let hasDerivedState = false;
  let hasCreateSelector = false;

  for (const file of files) {
    const content = readFileContent(file);
    if (!content) continue;

    const parsed = parseFile(file);
    if (!parsed) continue;

    const imports = extractImports(parsed.ast);
    const hooks = extractHooks(parsed.ast);
    const importSources = imports.map((i) => i.source);

    // Redux detection
    const hasRedux = importSources.some((s) =>
      s.includes('redux') || s.includes('@reduxjs/toolkit') || s.includes('react-redux')
    );
    if (hasRedux) {
      reduxUsage++;
    }

    // Context API detection
    const hasContext = content.includes('createContext') || content.includes('useContext');
    if (hasContext) {
      contextUsage++;
    }

    // Local state detection
    const stateHooks = hooks.filter((h) => h.name === 'useState' || h.name === 'useReducer');
    if (stateHooks.length > 0) {
      localStateUsage++;
    }

    // Reselect detection
    if (content.includes('createSelector') || importSources.some((s) => s.includes('reselect'))) {
      hasCreateSelector = true;
    }

    // Normalized state detection
    if (content.includes('entities') && (content.includes('ids') || content.includes('allIds'))) {
      hasEntitiesPattern = true;
      hasIdsPattern = true;
    }
    if (content.includes('byId') || content.includes('entitiesById')) {
      hasEntitiesPattern = true;
    }

    // Derived state detection
    if (content.includes('useMemo') && stateHooks.length > 0) {
      hasDerivedState = true;
    }
    if (content.includes('getDerived') || content.includes('selectDerived')) {
      hasDerivedState = true;
    }

    // Check for unnecessary global state
    if (hasRedux && stateHooks.length > 5) {
      issues.push(`${path.relative(appPath, file)}: Mix of Redux and excessive local state (${stateHooks.length} useState calls). Consider consolidating.`);
    }

    // Check for large Redux slices
    if (content.includes('createSlice') && content.split('\n').length > 200) {
      issues.push(`${path.relative(appPath, file)}: Large Redux slice. Consider splitting into smaller slices.`);
    }
  }

  // Update patterns
  patterns.normalizedState = hasEntitiesPattern && hasIdsPattern;
  patterns.derivedState = hasDerivedState;
  patterns.reselectUsed = hasCreateSelector;

  // Determine state type
  let stateType: AnalyzeStateOutput['stateType'];
  const hasRedux = reduxUsage > 0;
  const hasContext = contextUsage > 0;
  const hasLocal = localStateUsage > 0;

  if (hasRedux && (hasContext || hasLocal)) {
    stateType = 'mixed';
  } else if (hasRedux) {
    stateType = 'redux';
  } else if (hasContext) {
    stateType = 'context';
  } else if (hasLocal) {
    stateType = 'local';
  } else {
    stateType = 'none';
  }

  // Additional issues
  if (stateType === 'mixed') {
    issues.push('Mixed state management detected (Redux + Context/Local). Consider standardizing on one approach.');
  }

  if (hasRedux && !hasCreateSelector) {
    issues.push('Redux used without Reselect. Consider using memoized selectors for performance.');
  }

  if (contextUsage > 5) {
    issues.push(`High Context API usage (${contextUsage} files). Consider if some contexts should be Redux stores or Zustand.`);
  }

  return {
    stateType,
    patterns,
    issues,
  };
}
// ============================================================================
// TOOL #9: detect-anti-patterns
// Detects prop drilling, tight coupling, duplicated logic, large utility files
// ============================================================================

import * as path from 'path';
import { findSourceFiles, readFileContent } from '../utils/file-scanner';
import { analyzeComponent, parseFile, extractImports, extractFunctions } from '../utils/ast-parser';
import { buildImportGraph, calculateCoupling } from '../utils/import-tracker';
import { DEFAULT_CONFIG } from '../types';
import type { DetectAntiPatternsOutput, AntiPattern, AnalyzerConfig } from '../types';

export async function detectAntiPatterns(appPath: string, config?: Partial<AnalyzerConfig>): Promise<DetectAntiPatternsOutput> {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  const srcPath = path.join(appPath, 'src');
  const files = await findSourceFiles(srcPath);
  const graph = await buildImportGraph(appPath);

  const antiPatterns: AntiPattern[] = [];

  // 1. Detect prop drilling
  const propDrillingFiles: string[] = [];
  for (const file of files) {
    const analysis = analyzeComponent(file);
    if (!analysis) continue;

    // Check if component receives many props and passes them all through
    if (analysis.props.length > 5) {
      const content = readFileContent(file);
      if (!content) continue;

      // Look for spreading props or passing many props to child
      const spreadProps = content.match(/\.\.\.\w+Props/g) || [];
      const passingProps = content.match(/<[A-Z]\w+[^>]*\w+=\{[^}]+\}/g) || [];

      if (spreadProps.length > 0 && passingProps.length > 3) {
        propDrillingFiles.push(path.relative(appPath, file));
      }
    }
  }

  if (propDrillingFiles.length > 0) {
    antiPatterns.push({
      type: 'prop-drilling',
      description: `Components passing props through multiple levels (${propDrillingFiles.length} files). Consider using Context or state management.`,
      files: propDrillingFiles.slice(0, 10),
    });
  }

  // 2. Detect tight coupling (files that import each other heavily)
  const tightCouplingPairs: string[] = [];
  const processedPairs = new Set<string>();

  for (const fileA of files) {
    for (const fileB of files) {
      if (fileA === fileB) continue;
      const pairKey = [fileA, fileB].sort().join('|');
      if (processedPairs.has(pairKey)) continue;
      processedPairs.add(pairKey);

      const coupling = calculateCoupling(graph, fileA, fileB);
      if (coupling >= 3) {
        tightCouplingPairs.push(
          `${path.relative(appPath, fileA)} <-> ${path.relative(appPath, fileB)} (coupling: ${coupling})`
        );
      }
    }
  }

  if (tightCouplingPairs.length > 0) {
    antiPatterns.push({
      type: 'tight-coupling',
      description: `Tightly coupled components detected. Consider extracting shared logic or using dependency injection.`,
      files: tightCouplingPairs.slice(0, 10),
    });
  }

  // 3. Detect large utility files
  const utilFiles = files.filter((f) => {
    const lower = f.toLowerCase();
    return lower.includes('/util') || lower.includes('/helper') || lower.includes('/utils.');
  });

  for (const utilFile of utilFiles) {
    const content = readFileContent(utilFile);
    if (!content) continue;

    const lines = content.split('\n').length;
    if (lines > mergedConfig.largeUtilLines) {
      const parsed = parseFile(utilFile);
      if (!parsed) continue;

      const functions = extractFunctions(parsed.ast);

      antiPatterns.push({
        type: 'large-utility-file',
        description: `Utility file has ${lines} lines with ${functions.length} functions. Consider splitting into smaller modules.`,
        files: [path.relative(appPath, utilFile)],
      });
    }
  }

  // 4. Detect duplicated logic patterns
  const functionBodies: Map<string, string[]> = new Map();

  for (const file of files) {
    const content = readFileContent(file);
    if (!content) continue;

    // Look for common patterns
    const patterns = [
      { name: 'date-formatting', regex: /formatDate|dateFormat|toLocaleDateString|moment\(|dayjs\(/g },
      { name: 'currency-formatting', regex: /formatCurrency|currencyFormat|Intl\.NumberFormat.*style.*currency/g },
      { name: 'validation', regex: /validate\w+|isValid\w+|checkValid/g },
      { name: 'api-error-handling', regex: /catch\s*\([^)]*\)\s*\{[^}]*error/g },
    ];

    for (const pattern of patterns) {
      const matches = content.match(pattern.regex);
      if (matches && matches.length > 0) {
        if (!functionBodies.has(pattern.name)) {
          functionBodies.set(pattern.name, []);
        }
        functionBodies.get(pattern.name)!.push(path.relative(appPath, file));
      }
    }
  }

  for (const [pattern, fileList] of functionBodies) {
    if (fileList.length > 3) {
      antiPatterns.push({
        type: 'duplicated-logic',
        description: `Repeated "${pattern}" pattern found in ${fileList.length} files. Consider extracting to a shared utility.`,
        files: fileList.slice(0, 10),
      });
    }
  }

  // 5. Detect God components (components doing too much)
  for (const file of files) {
    const analysis = analyzeComponent(file);
    if (!analysis) continue;

    const responsibilities = new Set<string>();
    const importSources = analysis.imports.map((i) => i.source.toLowerCase());

    if (analysis.hooks.some((h) => h.name === 'useState')) responsibilities.add('state');
    if (analysis.hooks.some((h) => h.name === 'useEffect')) responsibilities.add('effects');
    if (importSources.some((s) => s.includes('axios') || s.includes('fetch') || s.includes('api'))) responsibilities.add('api');
    if (importSources.some((s) => s.includes('router'))) responsibilities.add('routing');
    if (importSources.some((s) => s.includes('redux') || s.includes('store'))) responsibilities.add('store');
    if (analysis.jsxElements.length > 30) responsibilities.add('heavy-rendering');

    if (responsibilities.size >= 4 && analysis.lines > 200) {
      antiPatterns.push({
        type: 'god-component',
        description: `Component handles ${responsibilities.size} responsibilities (${Array.from(responsibilities).join(', ')}). Consider breaking into smaller components.`,
        files: [path.relative(appPath, file)],
      });
    }
  }

  return {
    antiPatterns,
  };
}
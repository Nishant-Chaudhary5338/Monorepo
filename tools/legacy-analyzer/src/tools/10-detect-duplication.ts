// ============================================================================
// TOOL #10: detect-duplication
// Detects duplicate components, utility functions, similar file structures
// ============================================================================

import * as path from 'path';
import { findSourceFiles, readFileContent } from '../utils/file-scanner';
import { analyzeComponent, parseFile, extractFunctions } from '../utils/ast-parser';
import { DEFAULT_CONFIG } from '../types';
import type { DetectDuplicationOutput, DuplicateItem, AnalyzerConfig } from '../types';

/**
 * Calculate similarity between two strings (0-1)
 */
function calculateSimilarity(a: string, b: string): number {
  if (a.length === 0 || b.length === 0) return 0;
  if (a === b) return 1;

  const longer = a.length > b.length ? a : b;
  const shorter = a.length > b.length ? b : a;

  if (longer.length === 0) return 1;

  // Simple character-based similarity
  const matches = 0;
  for (const i = 0; i < shorter.length; i++) {
    if (shorter[i] === longer[i]) matches++;
  }

  return matches / longer.length;
}

/**
 * Normalize code for comparison (remove whitespace, comments)
 */
function normalizeCode(code: string): string {
  return code
    .replace(/\/\/.*$/gm, '') // Remove single-line comments
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

export async function detectDuplication(appPath: string, config?: Partial<AnalyzerConfig>): Promise<DetectDuplicationOutput> {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  const srcPath = path.join(appPath, 'src');
  const files = await findSourceFiles(srcPath);

  const duplicateComponents: DuplicateItem[] = [];
  const duplicateUtils: DuplicateItem[] = [];

  // Group files by type
  const componentFiles = files.filter((f) => {
    const basename = path.basename(f, path.extname(f));
    return /^[A-Z]/.test(basename);
  });

  const utilFiles = files.filter((f) => {
    const lower = f.toLowerCase();
    return lower.includes('/util') || lower.includes('/helper') || lower.includes('/utils.');
  });

  // 1. Detect duplicate components by comparing structure
  const componentAnalyses = new Map<string, ReturnType<typeof analyzeComponent>>();
  for (const file of componentFiles) {
    const analysis = analyzeComponent(file);
    if (analysis) {
      componentAnalyses.set(file, analysis);
    }
  }

  // Compare each pair of components
  const processedComponentPairs = new Set<string>();
  for (const [fileA, analysisA] of componentAnalyses) {
    for (const [fileB, analysisB] of componentAnalyses) {
      if (fileA === fileB) continue;

      const pairKey = [fileA, fileB].sort().join('|');
      if (processedComponentPairs.has(pairKey)) continue;
      processedComponentPairs.add(pairKey);

      // Compare based on: same hooks, similar imports, similar JSX structure
      const hooksA = new Set(analysisA.hooks.map((h) => h.name));
      const hooksB = new Set(analysisB.hooks.map((h) => h.name));

      const hooksMatch = hooksA.size > 0 &&
        Array.from(hooksA).every((h) => hooksB.has(h)) &&
        hooksA.size === hooksB.size;

      // Compare normalized code
      const contentA = readFileContent(fileA);
      const contentB = readFileContent(fileB);
      if (!contentA || !contentB) continue;

      const normalizedA = normalizeCode(contentA);
      const normalizedB = normalizeCode(contentB);
      const similarity = calculateSimilarity(normalizedA, normalizedB);

      if (hooksMatch && similarity > mergedConfig.duplicationThreshold) {
        // Check if we already have an entry for either file
        const existingEntry = duplicateComponents.find(
          (d) => d.locations.includes(path.relative(appPath, fileA)) || d.locations.includes(path.relative(appPath, fileB))
        );

        if (existingEntry) {
          if (!existingEntry.locations.includes(path.relative(appPath, fileA))) {
            existingEntry.locations.push(path.relative(appPath, fileA));
          }
          if (!existingEntry.locations.includes(path.relative(appPath, fileB))) {
            existingEntry.locations.push(path.relative(appPath, fileB));
          }
          existingEntry.similarity = Math.max(existingEntry.similarity, similarity);
        } else {
          duplicateComponents.push({
            name: analysisA.name,
            locations: [
              path.relative(appPath, fileA),
              path.relative(appPath, fileB),
            ],
            similarity: Math.round(similarity * 100) / 100,
          });
        }
      }
    }
  }

  // 2. Detect duplicate utility functions
  const functionSignatures = new Map<string, { name: string; file: string }[]>();

  for (const file of utilFiles) {
    const parsed = parseFile(file);
    if (!parsed) continue;

    const functions = extractFunctions(parsed.ast);
    for (const fn of functions) {
      const signature = `${fn.name}(${fn.params.join(',')})`;
      if (!functionSignatures.has(signature)) {
        functionSignatures.set(signature, []);
      }
      functionSignatures.get(signature)!.push({
        name: fn.name,
        file: path.relative(appPath, file),
      });
    }
  }

  // Find duplicate function names across files
  for (const [signature, locations] of functionSignatures) {
    const uniqueFiles = new Set(locations.map((l) => l.file));
    if (uniqueFiles.size > 1) {
      const funcName = signature.split('(')[0];
      duplicateUtils.push({
        name: funcName,
        locations: Array.from(uniqueFiles),
        similarity: 1, // Same name = exact match
      });
    }
  }

  // 3. Detect similar file structures (same folder layout)
  const folderPatterns = new Map<string, string[]>();
  for (const file of files) {
    const dir = path.dirname(path.relative(srcPath, file));
    if (!folderPatterns.has(dir)) {
      folderPatterns.set(dir, []);
    }
    folderPatterns.get(dir)!.push(path.basename(file));
  }

  // Find folders with similar file sets
  const processedFolderPairs = new Set<string>();
  for (const [dirA, filesA] of folderPatterns) {
    for (const [dirB, filesB] of folderPatterns) {
      if (dirA === dirB || dirA === '.' || dirB === '.') continue;

      const pairKey = [dirA, dirB].sort().join('|');
      if (processedFolderPairs.has(pairKey)) continue;
      processedFolderPairs.add(pairKey);

      // Check if file sets are similar
      const commonFiles = filesA.filter((f) => filesB.includes(f));
      const similarity = commonFiles.length / Math.max(filesA.length, filesB.length);

      if (similarity > 0.7 && commonFiles.length > 2) {
        duplicateComponents.push({
          name: `Similar folder structure`,
          locations: [
            path.join('src', dirA),
            path.join('src', dirB),
          ],
          similarity: Math.round(similarity * 100) / 100,
        });
      }
    }
  }

  return {
    duplicateComponents,
    duplicateUtils: duplicateUtils.slice(0, 20), // Limit output
  };
}
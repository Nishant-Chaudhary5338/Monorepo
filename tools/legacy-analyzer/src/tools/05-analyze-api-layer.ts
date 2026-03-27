// ============================================================================
// TOOL #5: analyze-api-layer
// Detects API patterns: axios/fetch usage, centralized vs scattered, duplication
// ============================================================================

import * as path from 'path';
import { findSourceFiles, readFileContent } from '../utils/file-scanner';
import { parseFile, extractImports } from '../utils/ast-parser';
import type { AnalyzeApiOutput, AnalyzerConfig } from '../types';

const API_CLIENTS = ['axios', 'node-fetch', 'got', 'superagent', 'ky', 'undici'] as const;
const API_INDICATORS = ['fetch(', 'axios.', 'api.', '/api/', 'useSWR', 'useQuery', 'useMutation'];

export async function analyzeApiLayer(appPath: string, config?: Partial<AnalyzerConfig>): Promise<AnalyzeApiOutput> {
  const srcPath = path.join(appPath, 'src');
  const files = await findSourceFiles(srcPath);

  const clients: Set<string> = new Set();
  const issues: string[] = [];
  const apiEndpoints: Map<string, string[]> = new Map(); // endpoint -> files
  let centralizedFiles = 0;
  let scatteredFiles = 0;
  const duplicateEndpoints: string[] = [];

  // Files that look like API service files
  const apiServiceFiles = files.filter((f) => {
    const lower = f.toLowerCase();
    return lower.includes('/api/') || lower.includes('/service') || lower.includes('/services/') || lower.includes('client.');
  });

  for (const file of files) {
    const content = readFileContent(file);
    if (!content) continue;

    const parsed = parseFile(file);
    if (!parsed) continue;

    const imports = extractImports(parsed.ast);
    const importSources = imports.map((i) => i.source);

    // Detect API clients
    for (const client of API_CLIENTS) {
      if (importSources.some((s) => s.includes(client))) {
        clients.add(client);
      }
    }

    // Check if this is an API service file
    const isApiService = apiServiceFiles.includes(file);

    // Extract API calls/endpoints
    const endpointRegex = /['"`](\/api\/[^'"`\s]+|https?:\/\/[^'"`\s]+)['"`]/g;
    let match;
    while ((match = endpointRegex.exec(content)) !== null) {
      const endpoint = match[1];
      if (!apiEndpoints.has(endpoint)) {
        apiEndpoints.set(endpoint, []);
      }
      apiEndpoints.get(endpoint)!.push(path.relative(appPath, file));
    }

    // Detect fetch/axios calls
    const hasApiCall = API_INDICATORS.some((indicator) => content.includes(indicator));

    if (hasApiCall) {
      if (isApiService) {
        centralizedFiles++;
      } else {
        scatteredFiles++;
      }
    }
  }

  // Find duplicate endpoints
  for (const [endpoint, filesUsingIt] of apiEndpoints) {
    if (filesUsingIt.length > 1) {
      duplicateEndpoints.push(`${endpoint} (used in ${filesUsingIt.length} files)`);
    }
  }

  // Determine pattern
  let apiPattern: AnalyzeApiOutput['apiPattern'];
  if (centralizedFiles === 0 && scatteredFiles === 0) {
    apiPattern = 'none';
  } else if (centralizedFiles > 0 && scatteredFiles === 0) {
    apiPattern = 'centralized';
  } else if (scatteredFiles > centralizedFiles) {
    apiPattern = 'scattered';
  } else {
    apiPattern = 'mixed';
  }

  // Issues
  if (apiPattern === 'scattered') {
    issues.push('API calls scattered across components. Consider creating a centralized API service layer.');
  }

  if (apiPattern === 'mixed') {
    issues.push('Mixed API patterns. Some calls centralized, some scattered. Standardize for consistency.');
  }

  if (duplicateEndpoints.length > 0) {
    issues.push(`Duplicate API endpoints detected: ${duplicateEndpoints.join(', ')}`);
  }

  if (clients.size > 1) {
    issues.push(`Multiple HTTP clients detected (${Array.from(clients).join(', ')}). Consider using one consistently.`);
  }

  if (clients.size === 0 && apiPattern !== 'none') {
    issues.push('API calls detected but no HTTP client library found. May be using native fetch or inline calls.');
  }

  // Check for missing error handling
  for (const file of files) {
    const content = readFileContent(file);
    if (!content) continue;

    if ((content.includes('fetch(') || content.includes('axios.')) && !content.includes('.catch') && !content.includes('try {')) {
      issues.push(`${path.relative(appPath, file)}: API calls without error handling.`);
    }
  }

  return {
    apiPattern,
    clients: Array.from(clients),
    duplicateEndpoints,
    issues,
  };
}
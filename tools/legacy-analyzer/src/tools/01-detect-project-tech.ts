// ============================================================================
// TOOL #1: detect-project-tech
// Detects React version, language, CRA config, and major dependencies
// ============================================================================

import * as path from 'path';
import { readPackageJson, hasConfigFile, readFileContent } from '../utils/file-scanner';
import type { ProjectTechOutput, AnalyzerConfig, DEFAULT_CONFIG } from '../types';

const MAJOR_DEPS = [
  'redux', '@reduxjs/toolkit', 'react-redux',
  'react-router-dom', 'react-router',
  'axios', 'swr', 'react-query', '@tanstack/react-query',
  'styled-components', '@emotion/react', '@emotion/styled',
  'tailwindcss',
  'formik', 'react-hook-form',
  'zod', 'yup',
  'lodash', 'ramda',
  'moment', 'dayjs', 'date-fns',
  'rxjs',
  'graphql', '@apollo/client', 'urql',
  'socket.io-client',
  'react-intl', 'react-i18next',
  'zustand', 'jotai', 'recoil', 'mobx',
  'next',
];

export async function detectProjectTech(appPath: string, config?: Partial<AnalyzerConfig>): Promise<ProjectTechOutput> {
  const pkg = readPackageJson(appPath);

  if (!pkg) {
    return {
      framework: 'unknown',
      reactVersion: 'unknown',
      language: 'JavaScript',
      hasCRAConfig: false,
      majorDependencies: [],
    };
  }

  const allDeps = {
    ...pkg.dependencies,
    ...pkg.devDependencies,
  };

  // Detect React version
  let reactVersion = 'unknown';
  const reactDep = allDeps['react'] || '';
  const versionMatch = reactDep.match(/(\d+)\./);
  if (versionMatch) {
    reactVersion = versionMatch[1];
  }

  // Detect language
  const hasTypeScript = !!(allDeps['typescript'] || allDeps['@types/react']);
  const hasTSConfig = hasConfigFile(appPath, ['tsconfig.json']);
  const language: 'JavaScript' | 'TypeScript' = (hasTypeScript || hasTSConfig) ? 'TypeScript' : 'JavaScript';

  // Detect CRA
  const hasReactScripts = !!allDeps['react-scripts'];
  const hasCRAConfig = hasConfigFile(appPath, [
    'config-overrides',
    '.env',
    '.env.local',
    '.env.development',
    '.env.production',
  ]);
  const isCRA = hasReactScripts || hasCRAConfig;

  // Detect framework
  let framework = 'unknown';
  if (allDeps['next']) framework = 'Next';
  else if (isCRA) framework = 'CRA';
  else if (allDeps['vite'] || allDeps['@vitejs/plugin-react']) framework = 'Vite';
  else if (allDeps['gatsby']) framework = 'Gatsby';
  else if (allDeps['react']) framework = 'React';

  // Detect major dependencies
  const majorDependencies: string[] = [];
  for (const dep of MAJOR_DEPS) {
    if (allDeps[dep]) {
      majorDependencies.push(dep);
    }
  }

  return {
    framework,
    reactVersion,
    language,
    hasCRAConfig: isCRA,
    majorDependencies,
  };
}
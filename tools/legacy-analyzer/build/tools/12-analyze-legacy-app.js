// ============================================================================
// TOOL #12: analyze-legacy-app (AGGREGATOR)
// Calls all tools and produces final report with migration hints
// ============================================================================
import { detectProjectTech } from './..01-detect-project-tech';
import { analyzeFolderStructure } from './..02-analyze-folder-structure';
import { analyzeComponents } from './..03-analyze-components';
import { analyzeStateManagement } from './..04-analyze-state-management';
import { analyzeApiLayer } from './..05-analyze-api-layer';
import { analyzeRouting } from './..06-analyze-routing';
import { analyzeStyling } from './..07-analyze-styling';
import { analyzeAssets } from './..08-analyze-assets';
import { detectAntiPatterns } from './..09-detect-anti-patterns';
import { detectDuplication } from './..10-detect-duplication';
import { analyzeDependenciesUsage } from './..11-analyze-dependencies-usage';
export async function analyzeLegacyApp(appPath, config) {
    // Run all analysis tools in parallel where possible
    const [tech, structure, components, state, api, routing, styling, assets, antiPatterns, duplication, dependencies,] = await Promise.all([
        detectProjectTech(appPath, config),
        analyzeFolderStructure(appPath, config),
        analyzeComponents(appPath, config),
        analyzeStateManagement(appPath, config),
        analyzeApiLayer(appPath, config),
        analyzeRouting(appPath, config),
        analyzeStyling(appPath, config),
        analyzeAssets(appPath, config),
        detectAntiPatterns(appPath, config),
        detectDuplication(appPath, config),
        analyzeDependenciesUsage(appPath, config),
    ]);
    // Count total issues
    const totalIssues = structure.issues.length +
        state.issues.length +
        api.issues.length +
        routing.issues.length +
        styling.issues.length +
        assets.assetIssues.length +
        antiPatterns.antiPatterns.length +
        duplication.duplicateComponents.length +
        duplication.duplicateUtils.length +
        dependencies.issues.length +
        components.largeComponents.length +
        components.complexComponents.length;
    // Calculate health score (0-100)
    let healthScore = 100;
    healthScore -= Math.min(components.largeComponents.length * 5, 20);
    healthScore -= Math.min(components.complexComponents.length * 3, 15);
    healthScore -= Math.min(antiPatterns.antiPatterns.length * 5, 25);
    healthScore -= Math.min(duplication.duplicateComponents.length * 3, 15);
    healthScore -= Math.min(api.issues.length * 2, 10);
    healthScore -= Math.min(styling.issues.length * 2, 10);
    healthScore -= Math.min(dependencies.issues.length * 2, 10);
    if (tech.language === 'JavaScript')
        healthScore -= 10;
    if (!routing.lazyLoading && routing.routeCount > 5)
        healthScore -= 5;
    healthScore = Math.max(0, healthScore);
    // Generate migration hints
    const migrationHints = [];
    // TypeScript migration
    if (tech.language === 'JavaScript') {
        migrationHints.push({
            priority: 'high',
            category: 'TypeScript',
            description: 'Convert project to TypeScript for better type safety and developer experience. Start with renaming files to .ts/.tsx and adding type annotations.',
            affectedFiles: [],
        });
    }
    // UI package extraction
    if (components.totalComponents > 10) {
        migrationHints.push({
            priority: 'medium',
            category: 'UI Package',
            description: `Extract ${Math.min(components.totalComponents, 10)}+ reusable components to @repo/ui for cross-project reuse.`,
            affectedFiles: components.largeComponents.map((c) => c.file),
        });
    }
    // API layer
    if (api.apiPattern === 'scattered') {
        migrationHints.push({
            priority: 'high',
            category: 'API Layer',
            description: 'Create a centralized API service layer. Extract all fetch/axios calls into a dedicated api/ directory with proper error handling.',
            affectedFiles: [],
        });
    }
    // State management
    if (state.stateType === 'mixed') {
        migrationHints.push({
            priority: 'high',
            category: 'State Management',
            description: 'Consolidate state management. Choose one approach (Redux Toolkit or Zustand) and migrate all state to it.',
            affectedFiles: [],
        });
    }
    // Folder restructuring
    if (structure.structureType === 'flat') {
        migrationHints.push({
            priority: 'medium',
            category: 'Folder Structure',
            description: 'Restructure to feature-based organization for better scalability. Group related components, hooks, and utilities by feature.',
            affectedFiles: [],
        });
    }
    // Code splitting
    if (!routing.lazyLoading && routing.routeCount > 5) {
        migrationHints.push({
            priority: 'medium',
            category: 'Performance',
            description: `Add lazy loading for ${routing.routeCount} routes using React.lazy() and Suspense for better initial load performance.`,
            affectedFiles: [],
        });
    }
    // Deduplication
    if (duplication.duplicateComponents.length > 0) {
        migrationHints.push({
            priority: 'medium',
            category: 'Code Quality',
            description: `Consolidate ${duplication.duplicateComponents.length} duplicate components into shared implementations.`,
            affectedFiles: duplication.duplicateComponents.flatMap((d) => d.locations),
        });
    }
    // Styling
    if (styling.stylingType.length > 2) {
        migrationHints.push({
            priority: 'low',
            category: 'Styling',
            description: `Standardize on one styling solution. Currently using ${styling.stylingType.join(', ')}.`,
            affectedFiles: [],
        });
    }
    // Anti-patterns
    if (antiPatterns.antiPatterns.length > 3) {
        migrationHints.push({
            priority: 'high',
            category: 'Code Quality',
            description: `Address ${antiPatterns.antiPatterns.length} anti-patterns (prop drilling, tight coupling, etc.) for better maintainability.`,
            affectedFiles: antiPatterns.antiPatterns.flatMap((a) => a.files),
        });
    }
    // Sort hints by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    migrationHints.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    return {
        summary: {
            appPath,
            analysisDate: new Date().toISOString(),
            totalIssues,
            healthScore,
        },
        tech,
        structure,
        components,
        state,
        api,
        routing,
        styling,
        assets,
        antiPatterns,
        duplication,
        dependencies,
        migrationHints,
    };
}
//# sourceMappingURL=12-analyze-legacy-app.js.map
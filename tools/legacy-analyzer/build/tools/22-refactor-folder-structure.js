// ============================================================================
// TOOL #22: refactor-folder-structure (AGGREGATOR)
// Top-level tool that calls all refactor tools + existing analysis tools
// and produces a comprehensive structured plan
// ============================================================================
import { detectFeatures } from './13-detect-features.js';
import { detectSharedModules } from './15-detect-shared-modules.js';
import { generateRefactorPlan } from './21-generate-refactor-plan.js';
export async function refactorFolderStructure(appPath, config) {
    // Run the comprehensive refactor plan (which calls tools 13-20 internally)
    const plan = await generateRefactorPlan(appPath, config);
    // Also run individual tools for detailed output
    const [featuresResult, sharedResult] = await Promise.all([
        detectFeatures(appPath, config),
        detectSharedModules(appPath, config),
    ]);
    // Calculate overall complexity
    const totalMoves = plan.fileMoves.length;
    const totalSplits = plan.splits.length;
    const totalViolations = plan.violations.length;
    const errorViolations = plan.violations.filter((v) => v.severity === 'error').length;
    let overallComplexity;
    if (totalMoves < 10 && totalSplits < 3 && errorViolations === 0) {
        overallComplexity = 'low';
    }
    else if (totalMoves < 50 && totalSplits < 10 && errorViolations < 5) {
        overallComplexity = 'medium';
    }
    else {
        overallComplexity = 'high';
    }
    // Generate improvements list
    const improvements = [];
    if (plan.features.length > 0) {
        improvements.push(`Organize code into ${plan.features.length} feature modules: ${plan.features.join(', ')}`);
    }
    if (totalMoves > 0) {
        improvements.push(`Move ${totalMoves} files to feature-based structure for better discoverability`);
    }
    if (sharedResult.shared.length > 0) {
        improvements.push(`Extract ${sharedResult.shared.length} shared modules to prevent code duplication`);
    }
    if (totalSplits > 0) {
        improvements.push(`Split ${totalSplits} large/generic files into focused, single-responsibility modules`);
    }
    if (plan.renames.length > 0) {
        improvements.push(`Standardize naming for ${plan.renames.length} files/folders for consistency`);
    }
    if (totalViolations === 0) {
        improvements.push('No architectural boundary violations detected');
    }
    // Generate warnings
    const warnings = [];
    if (errorViolations > 0) {
        warnings.push(`${errorViolations} critical boundary violations must be fixed before refactoring`);
    }
    if (plan.violations.some((v) => v.type === 'circular-dependency')) {
        warnings.push('Circular dependencies detected - these must be resolved before moving files');
    }
    if (totalMoves > 100) {
        warnings.push(`Large number of file moves (${totalMoves}) - consider incremental migration`);
    }
    if (plan.features.length === 0) {
        warnings.push('No clear features detected - file may need manual feature assignment');
    }
    const unmapped = plan.fileMoves.filter(() => false); // unmapped handled in map-files-to-target
    if (plan.fileMoves.length === 0 && plan.features.length > 0) {
        warnings.push('Files may already be well-organized or need manual review');
    }
    // Build feature details
    const featureDetails = {};
    for (const feature of plan.features) {
        featureDetails[feature] = featuresResult.featureMap[feature] || [];
    }
    return {
        summary: {
            appPath,
            analysisDate: new Date().toISOString(),
            featuresDetected: plan.features.length,
            filesToMove: totalMoves,
            filesToSplit: totalSplits,
            violationsFound: totalViolations,
            overallComplexity,
        },
        features: plan.features,
        featureDetails,
        structure: plan.targetStructure,
        moves: plan.fileMoves,
        splits: plan.splits,
        renames: plan.renames,
        sharedModules: sharedResult.shared,
        violations: plan.violations,
        refactorSteps: plan.steps,
        improvements,
        warnings,
    };
}
//# sourceMappingURL=22-refactor-folder-structure.js.map
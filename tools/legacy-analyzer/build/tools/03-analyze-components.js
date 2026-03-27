// ============================================================================
// TOOL #3: analyze-components
// Scans all components: count, large components, complex components
// ============================================================================
import * as path from 'path';
import { findSourceFiles } from '../utils/file-scanner';
import { analyzeComponent } from '../utils/ast-parser';
import { DEFAULT_CONFIG } from '../types';
export async function analyzeComponents(appPath, config) {
    const mergedConfig = { ...DEFAULT_CONFIG, ...config };
    const srcPath = path.join(appPath, 'src');
    const files = await findSourceFiles(srcPath);
    // Filter to likely component files (PascalCase filenames)
    const componentFiles = files.filter((f) => {
        const basename = path.basename(f, path.extname(f));
        return /^[A-Z]/.test(basename);
    });
    const largeComponents = [];
    const complexComponents = [];
    for (const file of componentFiles) {
        const analysis = analyzeComponent(file);
        if (!analysis)
            continue;
        const relPath = path.relative(appPath, file);
        // Detect responsibilities based on imports and hooks
        const responsibilities = [];
        const importSources = analysis.imports.map((i) => i.source.toLowerCase());
        const hookNames = analysis.hooks.map((h) => h.name);
        if (hookNames.includes('useState') || hookNames.includes('useReducer')) {
            responsibilities.push('state-management');
        }
        if (hookNames.includes('useEffect')) {
            responsibilities.push('side-effects');
        }
        if (importSources.some((s) => s.includes('axios') || s.includes('fetch') || s.includes('api'))) {
            responsibilities.push('api-calls');
        }
        if (importSources.some((s) => s.includes('router') || s.includes('navigate'))) {
            responsibilities.push('routing');
        }
        if (analysis.jsxElements.length > 20) {
            responsibilities.push('heavy-rendering');
        }
        const componentInfo = {
            name: analysis.name,
            file: relPath,
            lines: analysis.lines,
            jsxMaxDepth: analysis.jsxMaxDepth,
            responsibilities,
        };
        // Check if large
        if (analysis.lines > mergedConfig.largeComponentLines) {
            largeComponents.push(componentInfo);
        }
        // Check if complex (multiple responsibilities OR deep JSX OR many hooks)
        const isComplex = responsibilities.length > 2 ||
            analysis.jsxMaxDepth > 8 ||
            analysis.hooks.length > 10;
        if (isComplex) {
            complexComponents.push(componentInfo);
        }
    }
    return {
        totalComponents: componentFiles.length,
        largeComponents: largeComponents.sort((a, b) => b.lines - a.lines),
        complexComponents: complexComponents.sort((a, b) => b.responsibilities.length - a.responsibilities.length),
    };
}
//# sourceMappingURL=03-analyze-components.js.map
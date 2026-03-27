// ============================================================================
// TOOL #6: analyze-routing
// Detects react-router usage, route structure, lazy loading
// ============================================================================
import * as path from 'path';
import { findSourceFiles, readFileContent } from '../utils/file-scanner';
import { parseFile, extractImports, extractJSX } from '../utils/ast-parser';
const ROUTING_LIBRARIES = ['react-router-dom', 'react-router', '@reach/router', 'wouter', 'preact-router'];
export async function analyzeRouting(appPath, config) {
    const srcPath = path.join(appPath, 'src');
    const files = await findSourceFiles(srcPath);
    let routingLibrary = null;
    let routeCount = 0;
    let hasNestedRoutes = false;
    let hasLazyLoading = false;
    const issues = [];
    const routeFiles = [];
    for (const file of files) {
        const content = readFileContent(file);
        if (!content)
            continue;
        const parsed = parseFile(file);
        if (!parsed)
            continue;
        const imports = extractImports(parsed.ast);
        const importSources = imports.map((i) => i.source);
        // Detect routing library
        for (const lib of ROUTING_LIBRARIES) {
            if (importSources.some((s) => s.includes(lib))) {
                routingLibrary = lib;
                routeFiles.push(path.relative(appPath, file));
            }
        }
        // Count Route components
        const jsxElements = extractJSX(parsed.ast);
        const routeElements = jsxElements.filter((e) => e.tagName === 'Route' || e.tagName === 'route');
        routeCount += routeElements.length;
        // Detect nested routes
        if (content.includes('<Route') || content.includes('<route')) {
            // Check for nested Route elements by looking at JSX depth
            const routeAtDepth = jsxElements.filter((e) => (e.tagName === 'Route' || e.tagName === 'route') && e.depth > 2);
            if (routeAtDepth.length > 0) {
                hasNestedRoutes = true;
            }
            // Also check for Routes inside Route (v6 pattern)
            if (content.includes('<Routes>') && content.includes('<Route') && routeElements.length > 1) {
                const maxDepth = Math.max(...routeElements.map((e) => e.depth));
                if (maxDepth > 3) {
                    hasNestedRoutes = true;
                }
            }
        }
        // Detect lazy loading
        if (content.includes('React.lazy') || content.includes('lazy(') || content.includes('Suspense')) {
            hasLazyLoading = true;
        }
        // Detect dynamic imports for routes
        if (content.includes('import(') && (content.includes('Route') || content.includes('route'))) {
            hasLazyLoading = true;
        }
    }
    // Determine routing type
    let routingType;
    if (!routingLibrary || routeCount === 0) {
        routingType = 'none';
    }
    else if (hasNestedRoutes) {
        routingType = 'nested';
    }
    else {
        routingType = 'flat';
    }
    // Issues
    if (!routingLibrary && files.length > 5) {
        issues.push('No routing library detected. App may be using custom routing or is a single-page view.');
    }
    if (routingLibrary && !hasLazyLoading && routeCount > 10) {
        issues.push(`${routeCount} routes without lazy loading. Consider using React.lazy() for code splitting.`);
    }
    if (routingType === 'flat' && routeCount > 15) {
        issues.push('Many flat routes detected. Consider organizing routes into nested groups.');
    }
    // Check for hardcoded route strings in components
    const hardcodedRoutes = 0;
    for (const file of files) {
        const content = readFileContent(file);
        if (!content)
            continue;
        // Look for navigate() calls or href patterns
        const navMatches = content.match(/navigate\s*\(\s*['"`]\/[^'"`]*['"`]\)/g) || [];
        const hrefMatches = content.match(/href\s*=\s*['"`]\/[^'"`]*['"`]/g) || [];
        hardcodedRoutes += navMatches.length + hrefMatches.length;
    }
    if (hardcodedRoutes > 5) {
        issues.push(`${hardcodedRoutes} hardcoded route strings found. Consider using route constants.`);
    }
    return {
        routingLibrary,
        routingType,
        lazyLoading: hasLazyLoading,
        routeCount,
        issues,
    };
}
//# sourceMappingURL=06-analyze-routing.js.map
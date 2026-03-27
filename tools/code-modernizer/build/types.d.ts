export interface ImportInfo {
    source: string;
    specifiers: string[];
    isDefault: boolean;
    line: number;
    startColumn: number;
    endColumn: number;
}
export interface ExportInfo {
    name: string;
    isDefault: boolean;
    line: number;
}
export interface FunctionInfo {
    name: string;
    params: string[];
    line: number;
    isExported: boolean;
    isComponent: boolean;
    returnType?: string;
}
export interface JSXInfo {
    tagName: string;
    depth: number;
    line: number;
    childrenCount: number;
}
export interface HookUsage {
    name: string;
    line: number;
}
export interface ParsedFile {
    filePath: string;
    content: string;
    ast: unknown;
    imports: ImportInfo[];
}
export interface ConvertToTypeScriptInput {
    path: string;
    includeProps?: boolean;
    dryRun?: boolean;
    filePattern?: string;
}
export interface ConvertedFile {
    originalPath: string;
    newPath: string;
    addedTypes: string[];
    issues: string[];
}
export interface ConvertToTypeScriptOutput {
    success: boolean;
    convertedFiles: ConvertedFile[];
    skippedFiles: string[];
    errors: string[];
    summary: {
        totalFiles: number;
        convertedCount: number;
        skippedCount: number;
        errorCount: number;
    };
}
export interface AddTypeDefinitionsInput {
    path: string;
    outputDir?: string;
    includeComponentProps?: boolean;
    includeApiTypes?: boolean;
    includeStateTypes?: boolean;
    dryRun?: boolean;
}
export interface GeneratedTypeFile {
    path: string;
    types: string[];
    sourceFiles: string[];
}
export interface AddTypeDefinitionsOutput {
    success: boolean;
    generatedFiles: GeneratedTypeFile[];
    errors: string[];
    coverage: {
        totalComponents: number;
        typedComponents: number;
        percentage: number;
    };
}
export interface ExtractApiLayerInput {
    path: string;
    outputDir?: string;
    httpClient?: 'axios' | 'fetch' | 'auto';
    groupByDomain?: boolean;
    dryRun?: boolean;
}
export interface ApiEndpoint {
    method: string;
    url: string;
    file: string;
    line: number;
    responseType?: string;
    requestType?: string;
}
export interface GeneratedService {
    domain: string;
    path: string;
    endpoints: ApiEndpoint[];
}
export interface ExtractApiLayerOutput {
    success: boolean;
    detectedEndpoints: ApiEndpoint[];
    generatedServices: GeneratedService[];
    errors: string[];
    summary: {
        totalEndpoints: number;
        groupedServices: number;
    };
}
export interface StateOptimizerInput {
    path: string;
    checkNormalized?: boolean;
    checkDerivedState?: boolean;
    checkReselect?: boolean;
    dryRun?: boolean;
}
export interface StateIssue {
    type: 'unnecessary-global' | 'unnormalized' | 'derived-state' | 'missing-reselect' | 'prop-drilling';
    file: string;
    line?: number;
    description: string;
    suggestion: string;
}
export interface StateOptimization {
    file: string;
    currentState: string;
    suggestedState: string;
    reason: string;
}
export interface StateOptimizerOutput {
    success: boolean;
    issues: StateIssue[];
    optimizations: StateOptimization[];
    errors: string[];
    summary: {
        globalStateItems: number;
        localStateCandidates: number;
        unnormalizedItems: number;
        derivedStateItems: number;
    };
}
export interface CreateRtkQueryInput {
    path: string;
    outputDir?: string;
    baseUrl?: string;
    existingApiSlice?: string;
    dryRun?: boolean;
}
export interface RtkQueryEndpoint {
    name: string;
    method: string;
    url: string;
    hookName: string;
    responseType?: string;
    requestType?: string;
}
export interface GeneratedApiSlice {
    path: string;
    endpoints: RtkQueryEndpoint[];
    hooks: string[];
}
export interface CreateRtkQueryOutput {
    success: boolean;
    generatedSlices: GeneratedApiSlice[];
    errors: string[];
    summary: {
        totalEndpoints: number;
        generatedHooks: number;
    };
}
export interface EnforceDesignPatternsInput {
    path: string;
    splitContainerPresentational?: boolean;
    extractHooks?: boolean;
    dryRun?: boolean;
}
export interface PatternViolation {
    type: 'mixed-concerns' | 'missing-container' | 'missing-hook' | 'duplicated-logic';
    file: string;
    component: string;
    description: string;
    suggestion: string;
}
export interface RefactoredComponent {
    originalFile: string;
    containerFile?: string;
    presentationalFile?: string;
    extractedHooks: string[];
}
export interface EnforceDesignPatternsOutput {
    success: boolean;
    violations: PatternViolation[];
    refactoredComponents: RefactoredComponent[];
    extractedHooks: string[];
    errors: string[];
}
export interface EnforceBoundariesInput {
    path: string;
    featuresDir?: string;
    generateEslintRules?: boolean;
    generateBarrelExports?: boolean;
    dryRun?: boolean;
}
export interface BoundaryViolation {
    type: 'cross-feature-import' | 'circular-dependency' | 'missing-barrel';
    fromFile: string;
    toFile: string;
    importPath: string;
    line: number;
}
export interface GeneratedEslintRule {
    path: string;
    rules: string[];
}
export interface EnforceBoundariesOutput {
    success: boolean;
    violations: BoundaryViolation[];
    eslintRules?: GeneratedEslintRule;
    barrelExports: string[];
    errors: string[];
    summary: {
        totalViolations: number;
        crossFeatureImports: number;
        circularDependencies: number;
    };
}
export interface OptimizeComponentsInput {
    path: string;
    maxLines?: number;
    splitLargeComponents?: boolean;
    improveNaming?: boolean;
    dryRun?: boolean;
}
export interface LargeComponent {
    file: string;
    name: string;
    lines: number;
    responsibilities: string[];
    suggestedSplit: string[];
}
export interface NamingIssue {
    file: string;
    currentName: string;
    suggestedName: string;
    reason: string;
}
export interface OptimizeComponentsOutput {
    success: boolean;
    largeComponents: LargeComponent[];
    namingIssues: NamingIssue[];
    refactoredFiles: string[];
    errors: string[];
    summary: {
        totalComponents: number;
        largeComponents: number;
        splitComponents: number;
    };
}
export interface CodeModernizerInput {
    path: string;
    steps?: string[];
    dryRun?: boolean;
    skipBackup?: boolean;
    config?: {
        convertToTypeScript?: Partial<ConvertToTypeScriptInput>;
        addTypeDefinitions?: Partial<AddTypeDefinitionsInput>;
        extractApiLayer?: Partial<ExtractApiLayerInput>;
        stateOptimizer?: Partial<StateOptimizerInput>;
        createRtkQuery?: Partial<CreateRtkQueryInput>;
        enforceDesignPatterns?: Partial<EnforceDesignPatternsInput>;
        enforceBoundaries?: Partial<EnforceBoundariesInput>;
        optimizeComponents?: Partial<OptimizeComponentsInput>;
    };
}
export interface StepResult {
    step: string;
    success: boolean;
    output: unknown;
    duration: number;
    error?: string;
}
export interface CodeModernizerOutput {
    success: boolean;
    dryRun: boolean;
    backupPath?: string;
    steps: StepResult[];
    summary: {
        totalSteps: number;
        successfulSteps: number;
        failedSteps: number;
        totalDuration: number;
    };
    errors: string[];
}
export interface BackupMetadata {
    timestamp: string;
    originalPath: string;
    backupPath: string;
    operations: {
        type: string;
        originalPath: string;
        newPath?: string;
        content?: string;
    }[];
}
export interface ModernizerConfig {
    largeComponentLines: number;
    maxNestingDepth: number;
    outputDir: string;
    httpClient: 'axios' | 'fetch' | 'auto';
    featuresDir: string;
}
//# sourceMappingURL=types.d.ts.map
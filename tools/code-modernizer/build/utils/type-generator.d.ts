/**
 * Generate a TypeScript interface from extracted props
 */
export declare function generatePropsInterface(componentName: string, props: string[]): string;
/**
 * Generate type declaration for a function parameter
 */
export declare function generateParamType(paramName: string): string;
/**
 * Generate API response type interface
 */
export declare function generateApiResponseType(endpointName: string, fields: string[]): string;
/**
 * Generate API request type interface
 */
export declare function generateApiRequestType(endpointName: string, fields: string[]): string;
/**
 * Generate state type interface
 */
export declare function generateStateType(stateName: string, fields: string[]): string;
/**
 * Generate Redux action type
 */
export declare function generateActionType(actionName: string): string;
/**
 * Generate RTK Query endpoint type
 */
export declare function generateRtkEndpointType(hookName: string, responseType: string, requestType?: string): string;
/**
 * Generate complete types file content
 */
export declare function generateTypesFile(interfaces: Array<{
    name: string;
    content: string;
}>, imports?: string[]): string;
/**
 * Generate barrel export file
 */
export declare function generateBarrelExport(exports: Array<{
    name: string;
    path: string;
}>): string;
/**
 * Convert camelCase to PascalCase
 */
export declare function toPascalCase(str: string): string;
/**
 * Convert PascalCase to camelCase
 */
export declare function toCamelCase(str: string): string;
/**
 * Generate hook name from endpoint
 */
export declare function generateHookName(method: string, path: string): string;
/**
 * Generate file header comment
 */
export declare function generateFileHeader(toolName: string): string;
//# sourceMappingURL=type-generator.d.ts.map
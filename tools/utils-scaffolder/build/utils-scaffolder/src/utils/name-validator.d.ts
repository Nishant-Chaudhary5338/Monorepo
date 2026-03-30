export interface ValidationResult {
    valid: boolean;
    error?: string;
    suggestion?: string;
}
export declare function validateModuleName(name: string): ValidationResult;
export declare function validateFunctionName(name: string): ValidationResult;
export declare function toPascalCase(str: string): string;
export declare function toCamelCase(str: string): string;
export declare function toKebabCase(str: string): string;
export declare const ALL_MODULES: readonly ["api", "validation", "search", "pagination", "auth", "hooks", "performance", "media", "string", "array", "object", "date", "number", "storage", "url", "clipboard", "logger", "error", "cache", "types", "constants"];
export type ModuleName = typeof ALL_MODULES[number];
//# sourceMappingURL=name-validator.d.ts.map
/**
 * Validation result
 */
export interface ValidationResult {
    valid: boolean;
    errors: string[];
}
/**
 * Validate that required fields are present
 */
export declare function validateRequired(args: Record<string, unknown>, requiredFields: string[]): ValidationResult;
/**
 * Validate that a value is of a specific type
 */
export declare function validateType(value: unknown, expectedType: 'string' | 'number' | 'boolean' | 'object' | 'array', fieldName: string): ValidationResult;
/**
 * Validate that a string is not empty
 */
export declare function validateNotEmpty(value: unknown, fieldName: string): ValidationResult;
/**
 * Validate that a path exists
 */
export declare function validatePathExists(targetPath: string, options?: {
    mustBeFile?: boolean;
    mustBeDir?: boolean;
}): ValidationResult;
/**
 * Validate that a string is a valid file path
 */
export declare function validateFilePath(filePath: string): ValidationResult;
/**
 * Validate that a string is one of allowed values
 */
export declare function validateEnum(value: unknown, allowedValues: string[], fieldName: string): ValidationResult;
/**
 * Validate that a number is within a range
 */
export declare function validateRange(value: unknown, min: number, max: number, fieldName: string): ValidationResult;
/**
 * Combine multiple validation results
 */
export declare function combineResults(...results: ValidationResult[]): ValidationResult;
/**
 * Sanitize a string for safe use in file names
 */
export declare function sanitizeFileName(name: string): string;
/**
 * Sanitize a string for safe use in shell commands
 */
export declare function sanitizeShellArg(arg: string): string;
/**
 * Validate and parse JSON string
 */
export declare function parseJson<T = unknown>(jsonString: string): {
    valid: boolean;
    data?: T;
    error?: string;
};
/**
 * Validate tool arguments against a schema
 */
export declare function validateToolArgs(args: unknown, schema: {
    required?: string[];
    properties?: Record<string, {
        type: string;
        enum?: string[];
    }>;
}): ValidationResult;
//# sourceMappingURL=validation-utils.d.ts.map
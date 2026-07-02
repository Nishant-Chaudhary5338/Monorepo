/**
 * Error severity levels
 */
export type ErrorSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';
/**
 * Error categories
 */
export type ErrorCategory = 'validation' | 'file_system' | 'network' | 'compilation' | 'runtime' | 'configuration' | 'permission' | 'unknown';
/**
 * Structured error with context
 */
export interface StructuredError {
    code: string;
    category: ErrorCategory;
    severity: ErrorSeverity;
    message: string;
    suggestion?: string;
    context?: Record<string, unknown>;
    timestamp: string;
    stack?: string;
}
/**
 * Validation error
 */
export interface ValidationError extends StructuredError {
    category: 'validation';
    field?: string;
    expected?: string;
    received?: string;
}
/**
 * File system error
 */
export interface FileSystemError extends StructuredError {
    category: 'file_system';
    path?: string;
    operation?: 'read' | 'write' | 'delete' | 'create' | 'rename';
}
/**
 * Compilation error
 */
export interface CompilationError extends StructuredError {
    category: 'compilation';
    file?: string;
    line?: number;
    column?: number;
}
/**
 * Error handler function type
 */
export type ErrorHandler = (error: Error | StructuredError) => void;
/**
 * Error codes enum
 */
export declare const ErrorCodes: {
    readonly INVALID_INPUT: "INVALID_INPUT";
    readonly MISSING_REQUIRED: "MISSING_REQUIRED";
    readonly INVALID_TYPE: "INVALID_TYPE";
    readonly INVALID_FORMAT: "INVALID_FORMAT";
    readonly FILE_NOT_FOUND: "FILE_NOT_FOUND";
    readonly FILE_EXISTS: "FILE_EXISTS";
    readonly PERMISSION_DENIED: "PERMISSION_DENIED";
    readonly IO_ERROR: "IO_ERROR";
    readonly TOOL_NOT_FOUND: "TOOL_NOT_FOUND";
    readonly HANDLER_ERROR: "HANDLER_ERROR";
    readonly TIMEOUT: "TIMEOUT";
    readonly CONFIG_MISSING: "CONFIG_MISSING";
    readonly CONFIG_INVALID: "CONFIG_INVALID";
    readonly UNKNOWN_ERROR: "UNKNOWN_ERROR";
};
export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];
//# sourceMappingURL=error.types.d.ts.map
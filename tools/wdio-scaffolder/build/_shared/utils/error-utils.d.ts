import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import type { StructuredError, ErrorCategory, ErrorSeverity } from '../types/error.types.js';
/**
 * Create a structured error object
 */
export declare function createStructuredError(code: string, message: string, options?: {
    category?: ErrorCategory;
    severity?: ErrorSeverity;
    suggestion?: string;
    context?: Record<string, unknown>;
}): StructuredError;
/**
 * Format an error for MCP tool response
 */
export declare function formatError(error: unknown): {
    code: string;
    message: string;
    suggestion?: string;
    timestamp: string;
};
/**
 * Create an MCP error response
 */
export declare function createErrorResponse(error: unknown): {
    content: Array<{
        type: 'text';
        text: string;
    }>;
    isError: boolean;
};
/**
 * Create an MCP success response
 */
export declare function createSuccessResponse<T>(data: T): {
    content: Array<{
        type: 'text';
        text: string;
    }>;
};
/**
 * Type guard to check if an error is an McpError
 */
export declare function isMcpError(error: unknown): error is McpError;
/**
 * Throw an McpError with proper formatting
 */
export declare function throwToolError(message: string, code?: ErrorCode): never;
/**
 * Wrap an async function with error handling
 */
export declare function withErrorHandling<T>(fn: () => Promise<T>, errorContext?: string): Promise<T>;
//# sourceMappingURL=error-utils.d.ts.map
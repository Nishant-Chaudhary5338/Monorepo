// ============================================================================
// ERROR UTILITIES - Error formatting and handling
// ============================================================================
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { ErrorCodes } from '../types/error.types.js';
/**
 * Create a structured error object
 */
export function createStructuredError(code, message, options = {}) {
    return {
        code,
        category: options.category || 'unknown',
        severity: options.severity || 'medium',
        message,
        suggestion: options.suggestion,
        context: options.context,
        timestamp: new Date().toISOString(),
    };
}
/**
 * Format an error for MCP tool response
 */
export function formatError(error) {
    if (error instanceof McpError) {
        return {
            code: String(error.code),
            message: error.message,
            timestamp: new Date().toISOString(),
        };
    }
    if (error instanceof Error) {
        return {
            code: error.constructor.name || 'Error',
            message: error.message,
            suggestion: getSuggestionForError(error),
            timestamp: new Date().toISOString(),
        };
    }
    return {
        code: ErrorCodes.UNKNOWN_ERROR,
        message: String(error),
        timestamp: new Date().toISOString(),
    };
}
/**
 * Create an MCP error response
 */
export function createErrorResponse(error) {
    const formatted = formatError(error);
    return {
        content: [
            {
                type: 'text',
                text: JSON.stringify({
                    success: false,
                    error: formatted,
                }, null, 2),
            },
        ],
        isError: true,
    };
}
/**
 * Create an MCP success response
 */
export function createSuccessResponse(data) {
    return {
        content: [
            {
                type: 'text',
                text: JSON.stringify({
                    success: true,
                    ...data,
                }, null, 2),
            },
        ],
    };
}
/**
 * Type guard to check if an error is an McpError
 */
export function isMcpError(error) {
    return error instanceof McpError;
}
/**
 * Throw an McpError with proper formatting
 */
export function throwToolError(message, code = ErrorCode.InternalError) {
    throw new McpError(code, message);
}
/**
 * Get a helpful suggestion for common errors
 */
function getSuggestionForError(error) {
    const message = error.message.toLowerCase();
    if (message.includes('enoent') || message.includes('no such file')) {
        return 'Ensure the file or directory exists and the path is correct.';
    }
    if (message.includes('eacces') || message.includes('permission denied')) {
        return 'Check file permissions or run with appropriate privileges.';
    }
    if (message.includes('eexist') || message.includes('already exists')) {
        return 'The file or directory already exists. Use a different name or delete the existing one.';
    }
    if (message.includes('syntax') || message.includes('json')) {
        return 'Check the file syntax for errors. For JSON, ensure proper formatting.';
    }
    if (message.includes('timeout')) {
        return 'The operation timed out. Try again or increase the timeout value.';
    }
    return undefined;
}
/**
 * Wrap an async function with error handling
 */
export async function withErrorHandling(fn, errorContext) {
    try {
        return await fn();
    }
    catch (error) {
        if (error instanceof McpError) {
            throw error;
        }
        const contextMsg = errorContext ? ` (${errorContext})` : '';
        const message = error instanceof Error ? error.message : String(error);
        throw new McpError(ErrorCode.InternalError, `Error${contextMsg}: ${message}`);
    }
}
//# sourceMappingURL=error-utils.js.map
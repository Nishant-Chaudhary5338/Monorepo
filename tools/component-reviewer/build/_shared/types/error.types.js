// ============================================================================
// ERROR TYPES - Error handling types
// ============================================================================
/**
 * Error codes enum
 */
export const ErrorCodes = {
    // Validation errors
    INVALID_INPUT: 'INVALID_INPUT',
    MISSING_REQUIRED: 'MISSING_REQUIRED',
    INVALID_TYPE: 'INVALID_TYPE',
    INVALID_FORMAT: 'INVALID_FORMAT',
    // File system errors
    FILE_NOT_FOUND: 'FILE_NOT_FOUND',
    FILE_EXISTS: 'FILE_EXISTS',
    PERMISSION_DENIED: 'PERMISSION_DENIED',
    IO_ERROR: 'IO_ERROR',
    // Runtime errors
    TOOL_NOT_FOUND: 'TOOL_NOT_FOUND',
    HANDLER_ERROR: 'HANDLER_ERROR',
    TIMEOUT: 'TIMEOUT',
    // Configuration errors
    CONFIG_MISSING: 'CONFIG_MISSING',
    CONFIG_INVALID: 'CONFIG_INVALID',
    // Unknown
    UNKNOWN_ERROR: 'UNKNOWN_ERROR',
};
//# sourceMappingURL=error.types.js.map
// ============================================================================
// VALIDATION UTILITIES - Input validation helpers
// ============================================================================
import * as fs from 'fs';
/**
 * Validate that required fields are present
 */
export function validateRequired(args, requiredFields) {
    const errors = [];
    for (const field of requiredFields) {
        if (args[field] === undefined || args[field] === null) {
            errors.push(`Missing required field: ${field}`);
        }
    }
    return {
        valid: errors.length === 0,
        errors,
    };
}
/**
 * Validate that a value is of a specific type
 */
export function validateType(value, expectedType, fieldName) {
    const errors = [];
    const actualType = Array.isArray(value) ? 'array' : typeof value;
    if (actualType !== expectedType) {
        errors.push(`${fieldName} must be of type ${expectedType}, got ${actualType}`);
    }
    return {
        valid: errors.length === 0,
        errors,
    };
}
/**
 * Validate that a string is not empty
 */
export function validateNotEmpty(value, fieldName) {
    const errors = [];
    if (typeof value !== 'string' || value.trim().length === 0) {
        errors.push(`${fieldName} must be a non-empty string`);
    }
    return {
        valid: errors.length === 0,
        errors,
    };
}
/**
 * Validate that a path exists
 */
export function validatePathExists(targetPath, options = {}) {
    const errors = [];
    if (!fs.existsSync(targetPath)) {
        errors.push(`Path does not exist: ${targetPath}`);
        return { valid: false, errors };
    }
    const stat = fs.statSync(targetPath);
    if (options.mustBeFile && !stat.isFile()) {
        errors.push(`Path is not a file: ${targetPath}`);
    }
    if (options.mustBeDir && !stat.isDirectory()) {
        errors.push(`Path is not a directory: ${targetPath}`);
    }
    return {
        valid: errors.length === 0,
        errors,
    };
}
/**
 * Validate that a string is a valid file path
 */
export function validateFilePath(filePath) {
    const errors = [];
    if (typeof filePath !== 'string') {
        errors.push('File path must be a string');
        return { valid: false, errors };
    }
    if (filePath.trim().length === 0) {
        errors.push('File path cannot be empty');
    }
    // Check for invalid characters (platform-specific)
    const invalidChars = process.platform === 'win32'
        ? /[<>:"|?*]/
        : /\0/;
    if (invalidChars.test(filePath)) {
        errors.push('File path contains invalid characters');
    }
    return {
        valid: errors.length === 0,
        errors,
    };
}
/**
 * Validate that a string is one of allowed values
 */
export function validateEnum(value, allowedValues, fieldName) {
    const errors = [];
    if (typeof value !== 'string') {
        errors.push(`${fieldName} must be a string`);
        return { valid: false, errors };
    }
    if (!allowedValues.includes(value)) {
        errors.push(`${fieldName} must be one of: ${allowedValues.join(', ')}`);
    }
    return {
        valid: errors.length === 0,
        errors,
    };
}
/**
 * Validate that a number is within a range
 */
export function validateRange(value, min, max, fieldName) {
    const errors = [];
    if (typeof value !== 'number') {
        errors.push(`${fieldName} must be a number`);
        return { valid: false, errors };
    }
    if (value < min || value > max) {
        errors.push(`${fieldName} must be between ${min} and ${max}`);
    }
    return {
        valid: errors.length === 0,
        errors,
    };
}
/**
 * Combine multiple validation results
 */
export function combineResults(...results) {
    const allErrors = results.flatMap(r => r.errors);
    return {
        valid: allErrors.length === 0,
        errors: allErrors,
    };
}
/**
 * Sanitize a string for safe use in file names
 */
export function sanitizeFileName(name) {
    return name
        .replace(/[^a-zA-Z0-9-_.]/g, '_')
        .replace(/_{2,}/g, '_')
        .replace(/^_|_$/g, '');
}
/**
 * Sanitize a string for safe use in shell commands
 */
export function sanitizeShellArg(arg) {
    // Escape single quotes and backslashes
    return arg.replace(/['\\]/g, '\\$&');
}
/**
 * Validate and parse JSON string
 */
export function parseJson(jsonString) {
    try {
        const data = JSON.parse(jsonString);
        return { valid: true, data };
    }
    catch (error) {
        return {
            valid: false,
            error: error instanceof Error ? error.message : 'Invalid JSON',
        };
    }
}
/**
 * Validate tool arguments against a schema
 */
export function validateToolArgs(args, schema) {
    const errors = [];
    if (typeof args !== 'object' || args === null) {
        return { valid: false, errors: ['Arguments must be an object'] };
    }
    const argsObj = args;
    // Check required fields
    if (schema.required) {
        for (const field of schema.required) {
            if (argsObj[field] === undefined || argsObj[field] === null) {
                errors.push(`Missing required field: ${field}`);
            }
        }
    }
    // Check property types
    if (schema.properties) {
        for (const [field, propSchema] of Object.entries(schema.properties)) {
            const value = argsObj[field];
            if (value === undefined)
                continue;
            const actualType = Array.isArray(value) ? 'array' : typeof value;
            if (actualType !== propSchema.type) {
                errors.push(`${field} must be of type ${propSchema.type}, got ${actualType}`);
            }
            if (propSchema.enum && !propSchema.enum.includes(value)) {
                errors.push(`${field} must be one of: ${propSchema.enum.join(', ')}`);
            }
        }
    }
    return {
        valid: errors.length === 0,
        errors,
    };
}
//# sourceMappingURL=validation-utils.js.map
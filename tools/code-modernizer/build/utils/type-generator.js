"use strict";
// ============================================================================
// TYPE GENERATOR - Generate TypeScript type strings from AST analysis
// ============================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePropsInterface = generatePropsInterface;
exports.generateParamType = generateParamType;
exports.generateApiResponseType = generateApiResponseType;
exports.generateApiRequestType = generateApiRequestType;
exports.generateStateType = generateStateType;
exports.generateActionType = generateActionType;
exports.generateRtkEndpointType = generateRtkEndpointType;
exports.generateTypesFile = generateTypesFile;
exports.generateBarrelExport = generateBarrelExport;
exports.toPascalCase = toPascalCase;
exports.toCamelCase = toCamelCase;
exports.generateHookName = generateHookName;
exports.generateFileHeader = generateFileHeader;
/**
 * Generate a TypeScript interface from extracted props
 */
function generatePropsInterface(componentName, props) {
    if (props.length === 0) {
        return `interface ${componentName}Props {}`;
    }
    const propLines = props.map((prop) => {
        if (prop === '{...}') {
            return `  // TODO: Define destructured props`;
        }
        return `  ${prop}?: unknown;`;
    });
    return `interface ${componentName}Props {\n${propLines.join('\n')}\n}`;
}
/**
 * Generate type declaration for a function parameter
 */
function generateParamType(paramName) {
    const commonTypes = {
        event: 'React.FormEvent',
        e: 'React.ChangeEvent<HTMLInputElement>',
        props: 'Props',
        children: 'React.ReactNode',
        id: 'string | number',
        name: 'string',
        value: 'string',
        onClick: '() => void',
        onChange: '(value: string) => void',
        onClose: '() => void',
        onSubmit: '(data: FormData) => void',
        className: 'string',
        style: 'React.CSSProperties',
        loading: 'boolean',
        disabled: 'boolean',
        error: 'string | null',
        data: 'unknown',
        item: 'unknown',
        index: 'number',
    };
    return commonTypes[paramName] || 'unknown';
}
/**
 * Generate API response type interface
 */
function generateApiResponseType(endpointName, fields) {
    const typeName = `${endpointName}Response`;
    if (fields.length === 0) {
        return `interface ${typeName} {\n  // TODO: Define response fields\n  [key: string]: unknown;\n}`;
    }
    const fieldLines = fields.map((field) => `  ${field}?: unknown;`);
    return `interface ${typeName} {\n${fieldLines.join('\n')}\n}`;
}
/**
 * Generate API request type interface
 */
function generateApiRequestType(endpointName, fields) {
    const typeName = `${endpointName}Request`;
    if (fields.length === 0) {
        return `interface ${typeName} {\n  // TODO: Define request fields\n}`;
    }
    const fieldLines = fields.map((field) => `  ${field}?: unknown;`);
    return `interface ${typeName} {\n${fieldLines.join('\n')}\n}`;
}
/**
 * Generate state type interface
 */
function generateStateType(stateName, fields) {
    const typeName = `${capitalize(stateName)}State`;
    if (fields.length === 0) {
        return `interface ${typeName} {\n  // TODO: Define state fields\n}`;
    }
    const fieldLines = fields.map((field) => `  ${field}?: unknown;`);
    return `interface ${typeName} {\n${fieldLines.join('\n')}\n}`;
}
/**
 * Generate Redux action type
 */
function generateActionType(actionName) {
    return `type ${actionName}Action = {\n  type: '${actionName}';\n  payload?: unknown;\n}`;
}
/**
 * Generate RTK Query endpoint type
 */
function generateRtkEndpointType(hookName, responseType, requestType) {
    if (requestType) {
        return `export const ${hookName} = api.injectEndpoints({
  endpoints: (builder) => ({
    ${hookName.replace('use', '').replace('Query', '')}: builder.query<${responseType}, ${requestType}>({
      query: (arg) => ({ url: '', method: 'GET', params: arg }),
    }),
  }),
});`;
    }
    return `export const ${hookName} = api.injectEndpoints({
  endpoints: (builder) => ({
    ${hookName.replace('use', '').replace('Query', '')}: builder.query<${responseType}, void>({
      query: () => ({ url: '', method: 'GET' }),
    }),
  }),
});`;
}
/**
 * Generate complete types file content
 */
function generateTypesFile(interfaces, imports = []) {
    const lines = [];
    if (imports.length > 0) {
        lines.push(imports.join('\n'));
        lines.push('');
    }
    for (const iface of interfaces) {
        lines.push(`// ============================================================================
// ${iface.name}
// ============================================================================`);
        lines.push('');
        lines.push(`export ${iface.content}`);
        lines.push('');
    }
    return lines.join('\n');
}
/**
 * Generate barrel export file
 */
function generateBarrelExport(exports) {
    const lines = [];
    for (const exp of exports) {
        if (exp.name === '*') {
            lines.push(`export * from '${exp.path}';`);
        }
        else {
            lines.push(`export { ${exp.name} } from '${exp.path}';`);
        }
    }
    return lines.join('\n') + '\n';
}
/**
 * Capitalize first letter
 */
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
/**
 * Convert camelCase to PascalCase
 */
function toPascalCase(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
/**
 * Convert PascalCase to camelCase
 */
function toCamelCase(str) {
    return str.charAt(0).toLowerCase() + str.slice(1);
}
/**
 * Generate hook name from endpoint
 */
function generateHookName(method, path) {
    const segments = path.split('/').filter(Boolean);
    const resourceName = segments.map((s) => capitalize(s.replace(/[^a-zA-Z0-9]/g, ''))).join('');
    const methodPrefix = {
        GET: 'useGet',
        POST: 'useCreate',
        PUT: 'useUpdate',
        PATCH: 'usePatch',
        DELETE: 'useDelete',
    };
    return `${methodPrefix[method] || 'use'}${resourceName}Query`;
}
/**
 * Generate file header comment
 */
function generateFileHeader(toolName) {
    return `// ============================================================================
// Generated by code-modernizer: ${toolName}
// Generated at: ${new Date().toISOString()}
// ============================================================================
`;
}
//# sourceMappingURL=type-generator.js.map
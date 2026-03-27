// ============================================================================
// RULE: modifiers
// Detect missing readonly, const, as const, satisfies modifiers
// ============================================================================
export function checkModifiers(source, filePath) {
    const violations = [];
    const lines = source.split('\n');
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();
        if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*'))
            continue;
        // Pattern 1: const array that should be `as const`
        // const ITEMS = ['a', 'b', 'c']
        const constArrayRegex = /(?:export\s+)?const\s+(\w+)\s*=\s*\[/g;
        let match;
        while ((match = constArrayRegex.exec(line)) !== null) {
            // Check if it's a simple array literal (not a function call result)
            const restOfLine = line.slice(match.index);
            if (!restOfLine.includes('(') && !restOfLine.includes('map') && !restOfLine.includes('filter')) {
                // Check if already has `as const`
                if (!restOfLine.includes('as const')) {
                    violations.push({
                        rule: 'modifiers',
                        severity: 'info',
                        line: i + 1,
                        column: match.index + 1,
                        current: `const ${match[1]} = [...]`,
                        suggestion: `const ${match[1]} = [...] as const`,
                        fix: `// Add 'as const' to make the array readonly with literal types:\n// const ${match[1]} = [...] as const`,
                        why: "'as const' makes the array readonly and infers literal types (e.g., ['a', 'b'] becomes readonly ['a', 'b'] instead of string[]).",
                    });
                }
            }
        }
        // Pattern 2: const object that should be `as const`
        const constObjectRegex = /(?:export\s+)?const\s+(\w+)\s*=\s*\{/g;
        while ((match = constObjectRegex.exec(line)) !== null) {
            const restOfLine = line.slice(match.index);
            if (!restOfLine.includes('(') && !restOfLine.includes('as const')) {
                // Only suggest for simple config-like objects (no function calls)
                const objectEnd = findObjectEnd(lines, i);
                const objectBody = lines.slice(i, objectEnd + 1).join('\n');
                const hasFunctionCall = objectBody.includes('(');
                const hasSpread = objectBody.includes('...');
                if (!hasFunctionCall && !hasSpread) {
                    violations.push({
                        rule: 'modifiers',
                        severity: 'info',
                        line: i + 1,
                        column: match.index + 1,
                        current: `const ${match[1]} = { ... }`,
                        suggestion: `const ${match[1]} = { ... } as const`,
                        fix: `// Add 'as const' for deeply readonly with literal types:\n// const ${match[1]} = { ... } as const`,
                        why: "'as const' makes the entire object deeply readonly and preserves literal types for all properties.",
                    });
                }
            }
        }
        // Pattern 3: Interface property that should be readonly
        const interfacePropRegex = /^\s+(\w+)\s*\??\s*:\s*([^;]+);/g;
        while ((match = interfacePropRegex.exec(line)) !== null) {
            const propName = match[1];
            const propType = match[2].trim();
            // Skip if already readonly
            if (line.includes('readonly'))
                continue;
            // Suggest readonly for ID-like properties
            if (propName.toLowerCase().endsWith('id') || propName === 'id') {
                violations.push({
                    rule: 'modifiers',
                    severity: 'info',
                    line: i + 1,
                    column: 1,
                    current: `${propName}: ${propType}`,
                    suggestion: `readonly ${propName}: ${propType}`,
                    fix: `// Make ID properties readonly - they shouldn't change after creation:\n// readonly ${propName}: ${propType}`,
                    why: "ID properties should be readonly since they're immutable identifiers set at creation time.",
                });
            }
            // Suggest readonly for timestamp properties
            if (propName.toLowerCase().includes('created') || propName.toLowerCase().includes('updated')) {
                if (propType.includes('Date') || propType.includes('number')) {
                    violations.push({
                        rule: 'modifiers',
                        severity: 'info',
                        line: i + 1,
                        column: 1,
                        current: `${propName}: ${propType}`,
                        suggestion: `readonly ${propName}: ${propType}`,
                        fix: `// Make timestamp properties readonly:\n// readonly ${propName}: ${propType}`,
                        why: "Timestamp properties like createdAt/updatedAt should be readonly as they're set by the system.",
                    });
                }
            }
        }
        // Pattern 4: Function parameter that should be readonly
        const paramRegex = /function\s+\w+\s*\(([^)]+)\)/g;
        while ((match = paramRegex.exec(line)) !== null) {
            const params = match[1];
            const paramList = params.split(',');
            for (const param of paramList) {
                const paramTrimmed = param.trim();
                // Check for object/array parameters that aren't readonly
                if ((paramTrimmed.includes(': {') || paramTrimmed.includes(': [')) && !paramTrimmed.includes('readonly')) {
                    violations.push({
                        rule: 'modifiers',
                        severity: 'info',
                        line: i + 1,
                        column: 1,
                        current: paramTrimmed.trim(),
                        suggestion: `readonly ${paramTrimmed.trim()}`,
                        fix: `// Make object/array parameters readonly to prevent mutation:\n// function foo(readonly config: ConfigType)`,
                        why: 'Readonly parameters prevent accidental mutation of the caller\'s data and make the function\'s contract clearer.',
                    });
                }
            }
        }
        // Pattern 5: Variable that should use const assertion
        const letVariable = line.match(/let\s+(\w+)\s*=/);
        if (letVariable) {
            // Check if the variable is never reassigned
            const varName = letVariable[1];
            const restOfFile = lines.slice(i + 1).join('\n');
            const reassignment = restOfFile.match(new RegExp(`${varName}\\s*=`));
            if (!reassignment) {
                violations.push({
                    rule: 'modifiers',
                    severity: 'warning',
                    line: i + 1,
                    column: 1,
                    current: `let ${varName} = ...`,
                    suggestion: `const ${varName} = ...`,
                    fix: `// Use 'const' instead of 'let' - variable is never reassigned:\n// const ${varName} = ...`,
                    why: "Use 'const' by default. Only use 'let' when the variable needs to be reassigned.",
                });
            }
        }
        // Pattern 6: Type alias that should use satisfies
        const typeAlias = line.match(/const\s+(\w+)\s*:\s*(\w+)\s*=/);
        if (typeAlias) {
            const varName = typeAlias[1];
            const typeName = typeAlias[2];
            // Check if there are subsequent property accesses
            const nextLines = lines.slice(i + 1, Math.min(i + 10, lines.length)).join('\n');
            const hasPropertyAccess = nextLines.includes(`${varName}.`);
            if (hasPropertyAccess && !line.includes('satisfies')) {
                violations.push({
                    rule: 'modifiers',
                    severity: 'info',
                    line: i + 1,
                    column: 1,
                    current: `const ${varName}: ${typeName} = ...`,
                    suggestion: `const ${varName} = ... satisfies ${typeName}`,
                    fix: `// Use 'satisfies' instead of type annotation for better inference:\n// const ${varName} = ... satisfies ${typeName}`,
                    why: "'satisfies' validates the type while preserving the narrower inferred type, enabling better autocomplete.",
                });
            }
        }
        // Pattern 7: Enum-like const that should be enum or const assertion
        const enumLike = line.match(/(?:export\s+)?const\s+(\w+_(?:TYPE|STATUS|MODE|STATE|KIND))\s*=\s*['"]([^'"]+)['"]/);
        if (enumLike) {
            violations.push({
                rule: 'modifiers',
                severity: 'info',
                line: i + 1,
                column: 1,
                current: `const ${enumLike[1]} = '${enumLike[2]}'`,
                suggestion: `const ${enumLike[1]} = '${enumLike[2]}' as const`,
                fix: `// Use 'as const' for string literal types:\n// const ${enumLike[1]} = '${enumLike[2]}' as const`,
                why: "'as const' creates a literal type ('value') instead of widening to string.",
            });
        }
    }
    return { violations };
}
function findObjectEnd(lines, startLine) {
    let depth = 0;
    for (const i = startLine; i < lines.length; i++) {
        depth += (lines[i].match(/{/g) || []).length;
        depth -= (lines[i].match(/}/g) || []).length;
        if (depth === 0 && i > startLine)
            return i;
    }
    return Math.min(startLine + 20, lines.length - 1);
}
//# sourceMappingURL=modifiers.js.map
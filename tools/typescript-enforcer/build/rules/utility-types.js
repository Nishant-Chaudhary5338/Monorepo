// ============================================================================
// RULE: utility-types
// Detect patterns that should use TypeScript utility types
// ============================================================================
export function checkUtilityTypes(source, filePath) {
    const violations = [];
    const lines = source.split('\n');
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();
        if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*'))
            continue;
        // Pattern 1: Manual Partial - all properties optional
        // interface Foo { a?: string; b?: number; c?: boolean }
        const allOptionalRegex = /interface\s+(\w+)\s*\{([^}]*)\}/g;
        let match;
        while ((match = allOptionalRegex.exec(line)) !== null) {
            const body = match[2];
            const props = body.split(';').filter(p => p.trim());
            const allOptional = props.every(p => p.includes('?:'));
            const hasRequired = props.some(p => !p.includes('?:') && p.trim().length > 0);
            if (allOptional && props.length >= 3) {
                violations.push({
                    rule: 'utility-types',
                    severity: 'info',
                    line: i + 1,
                    column: 1,
                    current: `interface ${match[1]} (all properties optional)`,
                    suggestion: `type ${match[1]} = Partial<FullInterface>`,
                    fix: `// Use Partial<T> instead of manually making all properties optional:\n// type ${match[1]} = Partial<${match[1].replace(/Options|Config/, '')}>`,
                    why: 'Partial<T> is more maintainable - when the base interface changes, Partial automatically includes new properties.',
                });
            }
        }
        // Pattern 2: Manual Required - no optional properties
        // Detect when someone manually removes all ? from an interface
        // This is harder to detect generically, skip for now
        // Pattern 3: Manual Pick - selecting specific properties
        const pickPattern = /interface\s+(\w+)\s*\{\s*(\w+):\s*(\w+);\s*(\w+):\s*(\w+);\s*\}/g;
        while ((match = pickPattern.exec(line)) !== null) {
            if (match[1].includes('Pick') || match[1].includes('Selected')) {
                violations.push({
                    rule: 'utility-types',
                    severity: 'info',
                    line: i + 1,
                    column: 1,
                    current: `interface ${match[1]} { ${match[2]}: ${match[3]}; ${match[4]}: ${match[5]} }`,
                    suggestion: `type ${match[1]} = Pick<BaseInterface, '${match[2]}' | '${match[4]}'>`,
                    fix: `// Use Pick<T, K> to select specific properties from an existing type:\n// type ${match[1]} = Pick<BaseType, '${match[2]}' | '${match[4]}'>`,
                    why: 'Pick<T, K> keeps types DRY - if the base type changes, the picked type automatically updates.',
                });
            }
        }
        // Pattern 4: Manual Omit - excluding specific properties
        // type FooWithoutBar = Omit<Foo, 'bar'> pattern detection
        const omitUsage = line.match(/Omit<(\w+),\s*'(\w+)'>/);
        // Good - they're already using Omit. Skip.
        // Pattern 5: Manual Record
        const recordPattern = /\{\s*\[key:\s*string\]:\s*(\w+)\s*\}/g;
        while ((match = recordPattern.exec(line)) !== null) {
            violations.push({
                rule: 'utility-types',
                severity: 'info',
                line: i + 1,
                column: match.index + 1,
                current: `{ [key: string]: ${match[1]} }`,
                suggestion: `Record<string, ${match[1]}>`,
                fix: `// Use Record<K, V> for cleaner object type definitions:\n// type MyMap = Record<string, ${match[1]}>`,
                why: 'Record<string, T> is more readable and idiomatic than manual index signatures.',
            });
        }
        // Pattern 6: ReturnType opportunity
        const returnComment = line.match(/\/\/\s*[Rr]eturns?\s+(the\s+)?(\w+)/);
        if (returnComment && line.includes('function')) {
            // Check if the function could use ReturnType<T>
        }
        // Pattern 7: Parameters opportunity - function extracting params
        const paramExtract = line.match(/Parameters<(\w+)>/);
        // Good - already using Parameters. Skip.
        // Pattern 8: Extract/Exclude opportunity
        // type Foo = A | B | C; type Bar = A | B; (Bar should be Extract<Foo, A | B>)
        // Hard to detect generically, skip
        // Pattern 9: NonNullable opportunity
        const nullableUnion = line.match(/type\s+(\w+)\s*=\s*(\w+)\s*\|\s*null\s*\|\s*undefined/);
        if (nullableUnion) {
            violations.push({
                rule: 'utility-types',
                severity: 'info',
                line: i + 1,
                column: 1,
                current: `type ${nullableUnion[1]} = ${nullableUnion[2]} | null | undefined`,
                suggestion: `type ${nullableUnion[1]} = NonNullable<${nullableUnion[2]}>`,
                fix: `// Use NonNullable<T> to remove null and undefined:\n// type ${nullableUnion[1]} = NonNullable<SomeNullableType>`,
                why: 'NonNullable<T> clearly communicates intent and automatically handles new nullable additions to the base type.',
            });
        }
        // Pattern 10: Awaited opportunity for Promise unwrapping
        const awaitedPattern = line.match(/type\s+(\w+)\s*=\s*(\w+)\s*extends\s*Promise<infer\s+(\w+)>\s*\?\s*\3\s*:\s*never/);
        if (awaitedPattern) {
            violations.push({
                rule: 'utility-types',
                severity: 'info',
                line: i + 1,
                column: 1,
                current: line.trim(),
                suggestion: `type ${awaitedPattern[1]} = Awaited<${awaitedPattern[2]}>`,
                fix: `// Use Awaited<T> to unwrap Promise types:\n// type ${awaitedPattern[1]} = Awaited<PromiseType>`,
                why: 'Awaited<T> is built-in and handles nested Promises correctly.',
            });
        }
        // Pattern 11: Readonly opportunity
        const mutableArray = line.match(/readonly\s+(\w+)\s*:\s*(\w+)\[\s*\]/);
        if (mutableArray) {
            // Good - already using readonly. Skip.
        }
        // Pattern 12: Uppercase/Lowercase/Capitalize/Uncapitalize
        const stringManip = line.match(/\.toUpperCase\(\)|\.toLowerCase\(\)/);
        if (stringManip && line.includes('type ')) {
            // String utility types for template literals
        }
        // Pattern 13: satisfies operator opportunity
        const typeAssertion = line.match(/const\s+(\w+)\s*:\s*(\w+)\s*=/);
        if (typeAssertion && !line.includes('satisfies')) {
            // Check if satisfies would be better
            const nextLines = lines.slice(i, Math.min(i + 5, lines.length)).join('\n');
            if (nextLines.includes('as ') || nextLines.includes(typeAssertion[1] + '.')) {
                violations.push({
                    rule: 'utility-types',
                    severity: 'info',
                    line: i + 1,
                    column: 1,
                    current: `const ${typeAssertion[1]}: ${typeAssertion[2]} = ...`,
                    suggestion: `const ${typeAssertion[1]} = ... satisfies ${typeAssertion[2]}`,
                    fix: `// Use 'satisfies' to validate type while preserving narrower inference:\n// const ${typeAssertion[1]} = { ... } satisfies ${typeAssertion[2]}`,
                    why: "'satisfies' validates the type without widening, preserving autocomplete and literal types.",
                });
            }
        }
    }
    return { violations };
}
//# sourceMappingURL=utility-types.js.map
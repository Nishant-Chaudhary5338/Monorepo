#!/usr/bin/env node
/**
 * handoff-to-figma MCP server
 *
 * Parses claude.ai/design handoff zips and surfaces structured design data
 * (brand tokens, screen components, page layout) so Claude can push them
 * directly into Figma via the figma-official MCP — no manual JSX reading needed.
 */
import { McpServerBase } from '../../_shared/index.js';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createReadStream } from 'fs';
import unzipper from 'unzipper';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// ============================================================================
// ZIP EXTRACTION
// ============================================================================
async function extractZip(zipPath) {
    const dest = path.join(os.tmpdir(), `handoff-${Date.now()}`);
    fs.mkdirSync(dest, { recursive: true });
    await createReadStream(zipPath)
        .pipe(unzipper.Extract({ path: dest }))
        .promise();
    return dest;
}
/**
 * Walk up to two levels to find the directory that contains a `project/` subdirectory.
 * Handles both extracted-flat (zip root = project parent) and nested zips.
 */
function findProjectRoot(baseDir) {
    if (fs.existsSync(path.join(baseDir, 'project')))
        return baseDir;
    for (const entry of fs.readdirSync(baseDir, { withFileTypes: true })) {
        if (!entry.isDirectory())
            continue;
        const candidate = path.join(baseDir, entry.name);
        if (fs.existsSync(path.join(candidate, 'project')))
            return candidate;
    }
    throw new Error(`Cannot find project/ directory under ${baseDir}. ` +
        `Make sure the path points to a valid claude.ai/design handoff zip or its extracted directory.`);
}
// ============================================================================
// BRAND TOKEN EXTRACTION
// ============================================================================
function extractBrandTokens(brandJsx) {
    const tokens = {};
    const brandBlock = brandJsx.match(/const\s+BRAND\s*=\s*\{([^}]+)\}/s)?.[1] ?? '';
    const re = /(\w+)\s*:\s*'(#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))'/g;
    let m;
    while ((m = re.exec(brandBlock)) !== null) {
        tokens[m[1]] = m[2];
    }
    return tokens;
}
function extractFonts(content) {
    const families = new Set();
    const re = /(?:fontFamily|font-family|family)\s*[:=]\s*['"]([^'"]+)['"]/g;
    let m;
    while ((m = re.exec(content)) !== null) {
        families.add(m[1].split(',')[0].trim());
    }
    return families.size > 0 ? Array.from(families) : ['Inter'];
}
// ============================================================================
// COMPONENT DISCOVERY
// ============================================================================
const SCREEN_PATTERN = /Screen|Dashboard|App|Section|Page|Module|Header|Footer/;
const SKIP_NAMES = new Set(['React', 'Fragment', 'Object', 'Array', 'App']);
function findComponentNames(jsxContent) {
    const names = [];
    const re = /(?:function\s+([A-Z][A-Za-z0-9]*)\s*\(|const\s+([A-Z][A-Za-z0-9]*)\s*=\s*(?:\([^)]*\)|[A-Za-z_$][A-Za-z0-9_$]*)\s*=>)/g;
    let m;
    while ((m = re.exec(jsxContent)) !== null) {
        const name = m[1] ?? m[2];
        if (name && !SKIP_NAMES.has(name))
            names.push(name);
    }
    return [...new Set(names)];
}
/**
 * Extract a named component's brace-balanced body.
 * Returns empty string if the component is not found.
 */
function extractComponentBody(jsxContent, componentName) {
    const startRe = new RegExp(`(?:function\\s+${componentName}\\s*\\([^)]*\\)\\s*\\{|const\\s+${componentName}\\s*=.*?=>\\s*\\{)`);
    const match = startRe.exec(jsxContent);
    if (!match)
        return '';
    let depth = 0;
    let bodyStart = -1;
    for (let i = match.index; i < jsxContent.length; i++) {
        if (jsxContent[i] === '{') {
            depth++;
            if (bodyStart === -1)
                bodyStart = i;
        }
        else if (jsxContent[i] === '}') {
            depth--;
            if (depth === 0 && bodyStart !== -1) {
                return jsxContent.slice(bodyStart, i + 1);
            }
        }
    }
    return '';
}
/** Truncate very large component bodies (SVG-heavy merch products) to 4 KB. */
function truncateIfLarge(content, maxBytes = 4096) {
    if (content.length <= maxBytes)
        return content;
    return content.slice(0, maxBytes) + '\n// [truncated — call read_screen_content for full body]';
}
// ============================================================================
// PAGE DETECTION
// ============================================================================
function collectScreensFromFiles(projectDir, relFiles, pageName) {
    const screens = [];
    for (const rel of relFiles) {
        const fullPath = path.join(projectDir, rel);
        if (!fs.existsSync(fullPath))
            continue;
        const content = fs.readFileSync(fullPath, 'utf-8');
        const names = findComponentNames(content).filter(n => SCREEN_PATTERN.test(n));
        for (const name of names) {
            const body = extractComponentBody(content, name);
            screens.push({ name, file: fullPath, content: truncateIfLarge(body) });
        }
    }
    return screens.length > 0 ? { name: pageName, screens } : null;
}
function detectPages(projectDir) {
    const pages = [];
    // Mobile: screens.jsx + app.jsx at project root
    const mobilePage = collectScreensFromFiles(projectDir, ['screens.jsx', 'app.jsx'], 'Mobile');
    if (mobilePage)
        pages.push(mobilePage);
    // Optional subdirectories → additional pages
    const subdirs = [
        ['web', 'Web'],
        ['guidelines', 'Guidelines'],
        ['merch', 'Merch'],
    ];
    for (const [subdir, pageName] of subdirs) {
        const dir = path.join(projectDir, subdir);
        if (!fs.existsSync(dir))
            continue;
        const files = fs.readdirSync(dir)
            .filter(f => f.endsWith('.jsx'))
            .map(f => `${subdir}/${f}`);
        const page = collectScreensFromFiles(projectDir, files, pageName);
        if (page)
            pages.push(page);
    }
    return pages;
}
function findAssets(projectDir) {
    const dir = path.join(projectDir, 'brand-assets');
    if (!fs.existsSync(dir))
        return [];
    return fs.readdirSync(dir)
        .filter(f => /\.(png|jpg|jpeg|svg|webp)$/i.test(f))
        .map(f => path.join(dir, f));
}
// ============================================================================
// MCP SERVER — McpServerBase subclass
// ============================================================================
class HandoffToFigmaServer extends McpServerBase {
    constructor() {
        super({ name: 'handoff-to-figma', version: '1.0.0' });
    }
    registerTools() {
        // ── list_handoffs ────────────────────────────────────────────────────────
        this.addTool('list_handoffs', [
            'Scan a directory for claude.ai/design handoff zip files and return them sorted newest-first.',
            'Defaults to ~/Downloads. Use before parse_handoff when the user has not provided a path.',
            'Returns: { files: Array<{ path, name, modified }> }',
        ].join(' '), {
            type: 'object',
            properties: {
                searchDir: {
                    type: 'string',
                    description: 'Absolute or ~-prefixed path to search. Defaults to ~/Downloads.',
                },
            },
            required: [],
        }, this.handleListHandoffs.bind(this));
        // ── parse_handoff ────────────────────────────────────────────────────────
        this.addTool('parse_handoff', [
            'Extract and fully parse a claude.ai/design handoff zip (or an already-extracted directory).',
            'Reads brand.jsx for color tokens, scans all JSX files for screen components,',
            'and groups them into pages: Mobile, Web, Guidelines, Merch (only pages that exist).',
            'Returns: { projectName, extractedPath, brand, fonts, pages, assets }.',
            'If a screen content field ends with [truncated], call read_screen_content for the full body.',
        ].join(' '), {
            type: 'object',
            properties: {
                zipPath: {
                    type: 'string',
                    description: 'Absolute or ~-prefixed path to the handoff .zip file, ' +
                        'or a directory that has already been extracted (must contain a project/ subdirectory).',
                },
            },
            required: ['zipPath'],
        }, this.handleParseHandoff.bind(this));
        // ── read_screen_content ──────────────────────────────────────────────────
        this.addTool('read_screen_content', [
            'Read the complete JSX body of a named component from a handoff source file.',
            'Use when parse_handoff returns a truncated content field (marked [truncated]).',
            'Returns: { componentName, file, content } with the full brace-balanced function body.',
        ].join(' '), {
            type: 'object',
            properties: {
                filePath: {
                    type: 'string',
                    description: 'Absolute path to the JSX file (use the file field from parse_handoff screens).',
                },
                screenName: {
                    type: 'string',
                    description: 'Exact PascalCase component name, e.g. "HomeScreen" or "LandingScreen".',
                },
            },
            required: ['filePath', 'screenName'],
        }, this.handleReadScreenContent.bind(this));
    }
    // ── handlers ───────────────────────────────────────────────────────────────
    async handleListHandoffs(args) {
        const { searchDir } = args;
        const dir = searchDir
            ? path.resolve(searchDir.replace(/^~/, os.homedir()))
            : path.join(os.homedir(), 'Downloads');
        if (!fs.existsSync(dir)) {
            return this.error(`Directory not found: ${dir}. ` +
                `Provide a valid searchDir or ensure ~/Downloads exists.`);
        }
        const files = fs.readdirSync(dir)
            .filter(f => f.endsWith('.zip') && /handoff|padel|design/i.test(f))
            .map(f => {
            const full = path.join(dir, f);
            return { path: full, name: f, modified: fs.statSync(full).mtime.toISOString() };
        })
            .sort((a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime());
        if (files.length === 0) {
            return this.error(`No handoff zips found in ${dir}. ` +
                `Make sure the file name contains "handoff", "padel", or "design", ` +
                `or provide a different searchDir.`);
        }
        return this.success({ files });
    }
    async handleParseHandoff(args) {
        const { zipPath } = args;
        const resolved = path.resolve(zipPath.replace(/^~/, os.homedir()));
        if (!fs.existsSync(resolved)) {
            return this.error(`Path not found: ${resolved}. ` +
                `Run list_handoffs to find available handoff files.`);
        }
        // Extract zip if needed
        let baseDir = resolved;
        if (resolved.endsWith('.zip')) {
            try {
                baseDir = await extractZip(resolved);
            }
            catch (err) {
                return this.error(`Failed to extract zip at ${resolved}: ${String(err)}. ` +
                    `Make sure the file is a valid zip and is not password-protected.`);
            }
        }
        let projectRoot;
        try {
            projectRoot = findProjectRoot(baseDir);
        }
        catch (err) {
            return this.error(String(err));
        }
        const projectDir = path.join(projectRoot, 'project');
        const projectName = path.basename(projectRoot)
            .replace(/-/g, ' ')
            .replace(/\b\w/g, c => c.toUpperCase());
        // Brand tokens
        const brandFile = path.join(projectDir, 'brand.jsx');
        let brand = {};
        let fonts = ['Inter'];
        if (fs.existsSync(brandFile)) {
            const brandContent = fs.readFileSync(brandFile, 'utf-8');
            brand = extractBrandTokens(brandContent);
            const detected = extractFonts(brandContent);
            if (detected.length > 0)
                fonts = detected;
        }
        const pages = detectPages(projectDir);
        // Supplement font detection from screen content if brand.jsx had none
        if (fonts.length <= 1) {
            const allContent = pages.flatMap(p => p.screens.map(s => s.content)).join('\n');
            const detected = extractFonts(allContent);
            if (detected.length > 0)
                fonts = detected;
        }
        const assets = findAssets(projectDir);
        const result = {
            projectName,
            extractedPath: projectDir,
            brand,
            fonts,
            pages,
            assets,
        };
        return this.success(result);
    }
    async handleReadScreenContent(args) {
        const { filePath, screenName } = args;
        const resolved = path.resolve(filePath);
        if (!fs.existsSync(resolved)) {
            return this.error(`File not found: ${resolved}. ` +
                `Use the exact file path returned by parse_handoff.`);
        }
        const content = fs.readFileSync(resolved, 'utf-8');
        const body = extractComponentBody(content, screenName);
        if (!body) {
            const available = findComponentNames(content);
            return this.error(`Component "${screenName}" not found in ${path.basename(resolved)}. ` +
                `Available components: ${available.join(', ')}. ` +
                `Check the exact name from parse_handoff screens[].name.`);
        }
        return this.success({ componentName: screenName, file: resolved, content: body });
    }
}
new HandoffToFigmaServer().run();
//# sourceMappingURL=index.js.map
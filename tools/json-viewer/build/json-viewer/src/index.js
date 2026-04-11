#!/usr/bin/env node
import { McpServerBase } from '../../_shared/index.js';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
// ============================================================================
// HELPERS
// ============================================================================
const RESPONSES_DIR = path.join(os.homedir(), '.mcp-responses');
function ensureDir() {
    if (!fs.existsSync(RESPONSES_DIR)) {
        fs.mkdirSync(RESPONSES_DIR, { recursive: true });
    }
}
function generateId(label) {
    const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const safeLabel = label.replace(/[^a-zA-Z0-9-_]/g, '-').slice(0, 50);
    return `${safeLabel}-${ts}`;
}
function countKeys(obj) {
    if (obj === null || typeof obj !== 'object')
        return 0;
    let count = 0;
    if (Array.isArray(obj)) {
        for (const item of obj) {
            count += countKeys(item);
        }
    }
    else {
        const record = obj;
        count += Object.keys(record).length;
        for (const value of Object.values(record)) {
            count += countKeys(value);
        }
    }
    return count;
}
function getMaxDepth(obj, current = 0) {
    if (obj === null || typeof obj !== 'object')
        return current;
    let max = current;
    if (Array.isArray(obj)) {
        for (const item of obj) {
            max = Math.max(max, getMaxDepth(item, current + 1));
        }
    }
    else {
        for (const value of Object.values(obj)) {
            max = Math.max(max, getMaxDepth(value, current + 1));
        }
    }
    return max;
}
// ============================================================================
// HTML TEMPLATE
// ============================================================================
function generateHtml(label, parsed, timestamp) {
    // Escape </script> so a JSON string value can't break out of the <script> block.
    const compactJson = JSON.stringify(parsed).replace(/<\/script>/gi, '<\\/script>');
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>JSON Viewer — ${label}</title>
<style>
  :root {
    --bg: #1e1e2e;
    --surface: #282840;
    --surface2: #313150;
    --border: #44447a;
    --text: #cdd6f4;
    --text-dim: #8888b0;
    --key: #89b4fa;
    --string: #a6e3a1;
    --number: #fab387;
    --boolean: #cba6f7;
    --null: #f38ba8;
    --bracket: #8888b0;
    --highlight: #f9e2af;
    --search-bg: #f9e2af33;
    --link: #89dceb;
  }
  [data-theme="light"] {
    --bg: #eff1f5;
    --surface: #e6e9ef;
    --surface2: #dce0e8;
    --border: #bcc0cc;
    --text: #4c4f69;
    --text-dim: #8c8fa1;
    --key: #1e66f5;
    --string: #40a02b;
    --number: #fe640b;
    --boolean: #8839ef;
    --null: #d20f39;
    --bracket: #8c8fa1;
    --highlight: #df8e1d;
    --search-bg: #df8e1d33;
    --link: #04a5e5;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'SF Mono', 'Fira Code', 'JetBrains Mono', 'Cascadia Code', monospace;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
  }
  .header {
    position: sticky;
    top: 0;
    z-index: 100;
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    padding: 12px 20px;
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }
  .header h1 {
    font-size: 14px;
    font-weight: 600;
    color: var(--key);
    flex-shrink: 0;
  }
  .header .meta {
    font-size: 11px;
    color: var(--text-dim);
    flex-shrink: 0;
  }
  .search-box {
    flex: 1;
    min-width: 200px;
    position: relative;
  }
  .search-box input {
    width: 100%;
    padding: 6px 10px 6px 28px;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 6px;
    color: var(--text);
    font-family: inherit;
    font-size: 12px;
    outline: none;
  }
  .search-box input:focus { border-color: var(--key); }
  .search-box::before {
    content: '\\1F50D';
    position: absolute;
    left: 8px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 12px;
  }
  .search-count {
    font-size: 11px;
    color: var(--text-dim);
    flex-shrink: 0;
    min-width: 60px;
    text-align: right;
  }
  .btn {
    padding: 4px 10px;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 6px;
    color: var(--text);
    font-family: inherit;
    font-size: 11px;
    cursor: pointer;
    flex-shrink: 0;
  }
  .btn:hover { background: var(--border); }
  .toolbar {
    position: sticky;
    top: 50px;
    z-index: 99;
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    padding: 6px 20px;
    display: flex;
    gap: 8px;
    align-items: center;
    font-size: 11px;
  }
  .breadcrumb {
    color: var(--text-dim);
    font-size: 11px;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .breadcrumb span { color: var(--key); cursor: pointer; }
  .breadcrumb span:hover { text-decoration: underline; }
  .stats {
    display: flex;
    gap: 12px;
    font-size: 11px;
    color: var(--text-dim);
    flex-shrink: 0;
  }
  .stats b { color: var(--text); }
  .container { padding: 20px; }
  .json-tree { font-size: 13px; line-height: 1.6; }
  .json-line { display: flex; align-items: flex-start; }
  .line-number {
    color: var(--text-dim);
    min-width: 40px;
    text-align: right;
    padding-right: 12px;
    user-select: none;
    opacity: 0.5;
    font-size: 11px;
  }
  .json-content { flex: 1; white-space: pre; }
  .json-key { color: var(--key); }
  .json-string { color: var(--string); }
  .json-number { color: var(--number); }
  .json-boolean { color: var(--boolean); }
  .json-null { color: var(--null); }
  .json-bracket { color: var(--bracket); }
  .json-colon { color: var(--text-dim); }
  .json-comma { color: var(--text-dim); }
  .collapsible { cursor: pointer; user-select: none; }
  .collapsible::before {
    content: '\\25BC';
    display: inline-block;
    margin-right: 4px;
    font-size: 8px;
    transition: transform 0.15s;
    color: var(--text-dim);
  }
  .collapsed::before { transform: rotate(-90deg); }
  .collapsed + .json-children { display: none; }
  .collapsed .json-closing { display: inline; }
  .json-children { padding-left: 20px; }
  .json-summary {
    color: var(--text-dim);
    font-style: italic;
    font-size: 11px;
  }
  .highlight { background: var(--search-bg); border-radius: 2px; }
  .hidden { display: none !important; }
  .raw-view {
    white-space: pre-wrap;
    word-break: break-all;
    font-size: 12px;
    line-height: 1.5;
    padding: 20px;
    background: var(--surface);
    border-radius: 8px;
    border: 1px solid var(--border);
  }
  .copy-toast {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: var(--string);
    color: var(--bg);
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 12px;
    opacity: 0;
    transition: opacity 0.3s;
    z-index: 1000;
  }
  .copy-toast.show { opacity: 1; }
</style>
</head>
<body>
<div class="header">
  <h1>${escapeHtml(label)}</h1>
  <span class="meta">${timestamp}</span>
  <div class="search-box">
    <input type="text" id="search" placeholder="Search keys or values..." autocomplete="off" />
  </div>
  <span class="search-count" id="searchCount"></span>
  <button class="btn" onclick="toggleTheme()">Theme</button>
  <button class="btn" onclick="toggleView()">Raw</button>
  <button class="btn" onclick="copyAll()">Copy All</button>
  <button class="btn" onclick="expandAll()">Expand All</button>
  <button class="btn" onclick="collapseAll()">Collapse All</button>
</div>
<div class="toolbar">
  <div class="breadcrumb" id="breadcrumb">root</div>
  <div class="stats" id="stats"></div>
</div>
<div class="container">
  <div id="treeView" class="json-tree"></div>
  <div id="rawView" class="raw-view hidden"></div>
</div>
<div class="copy-toast" id="copyToast">Copied!</div>
<script>
const RAW_JSON = ${compactJson};
let lineNum = 0;
let showingRaw = false;

function escapeHtml(s) {
  return String(s).replace(/&/g,'&').replace(/</g,'<').replace(/>/g,'>').replace(/"/g,'"');
}

function toggleTheme() {
  const body = document.body;
  // Remove attribute for dark (falls back to :root vars); set to 'light' for light mode.
  // Setting data-theme="dark" would override :root without any matching rule defined.
  if (body.getAttribute('data-theme') === 'light') {
    body.removeAttribute('data-theme');
  } else {
    body.setAttribute('data-theme', 'light');
  }
}

function showCopyToast() {
  const t = document.getElementById('copyToast');
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 1500);
}

function copyValue(path) {
  const val = getByPath(RAW_JSON, path);
  navigator.clipboard.writeText(JSON.stringify(val, null, 2));
  showCopyToast();
}

function copyAll() {
  navigator.clipboard.writeText(JSON.stringify(RAW_JSON, null, 2));
  showCopyToast();
}

function getByPath(obj, path) {
  if (!path || path === 'root') return obj;
  const parts = path.replace(/^root\\.?/, '').split(/[.\\[\\]]/).filter(Boolean);
  let cur = obj;
  for (const p of parts) {
    if (cur === null || cur === undefined) return undefined;
    cur = cur[p];
  }
  return cur;
}

function toggleView() {
  showingRaw = !showingRaw;
  document.getElementById('treeView').classList.toggle('hidden', showingRaw);
  const raw = document.getElementById('rawView');
  raw.classList.toggle('hidden', !showingRaw);
  if (showingRaw && !raw.textContent) {
    raw.textContent = JSON.stringify(RAW_JSON, null, 2);
  }
}

function expandAll() {
  document.querySelectorAll('.collapsed').forEach(el => el.classList.remove('collapsed'));
}

function collapseAll() {
  document.querySelectorAll('.collapsible').forEach(el => el.classList.add('collapsed'));
}

function renderValue(val, path, depth) {
  if (val === null) return '<span class="json-null">null</span>';
  if (typeof val === 'boolean') return '<span class="json-boolean">' + val + '</span>';
  if (typeof val === 'number') return '<span class="json-number">' + val + '</span>';
  if (typeof val === 'string') {
    const escaped = escapeHtml(val);
    const display = val.length > 200 ? escaped.slice(0, 200) + '...' : escaped;
    return '<span class="json-string">"' + display + '"</span>';
  }
  if (Array.isArray(val)) {
    if (val.length === 0) return '<span class="json-bracket">[]</span>';
    const items = val.map((item, i) => {
      const childPath = path + '[' + i + ']';
      const ln = ++lineNum;  // increment per item so each row has its own line number
      return '<div class="json-line"><span class="line-number">' + ln + '</span><span class="json-content">' +
        renderValue(item, childPath, depth + 1) + (i < val.length - 1 ? '<span class="json-comma">,</span>' : '') +
        '</span></div>';
    }).join('');
    return '<span class="collapsible" data-path="' + escapeHtml(path) + '" onclick="toggleNode(this)">' +
      '<span class="json-bracket">[</span></span>' +
      '<span class="json-summary"> ' + val.length + ' items</span>' +
      '<div class="json-children">' + items + '</div>' +
      '<span class="json-closing"><span class="json-bracket">]</span></span>';
  }
  if (typeof val === 'object') {
    const keys = Object.keys(val);
    if (keys.length === 0) return '<span class="json-bracket">{}</span>';
    const items = keys.map((key, i) => {
      const childPath = path + '.' + key;
      const ln = ++lineNum;  // increment per key so each row has its own line number
      return '<div class="json-line"><span class="line-number">' + ln + '</span><span class="json-content">' +
        '<span class="json-key" data-key="' + escapeHtml(key) + '">"' + escapeHtml(key) + '"</span>' +
        '<span class="json-colon">: </span>' +
        renderValue(val[key], childPath, depth + 1) + (i < keys.length - 1 ? '<span class="json-comma">,</span>' : '') +
        '</span></div>';
    }).join('');
    return '<span class="collapsible" data-path="' + escapeHtml(path) + '" onclick="toggleNode(this)">' +
      '<span class="json-bracket">{</span></span>' +
      '<span class="json-summary"> ' + keys.length + ' keys</span>' +
      '<div class="json-children">' + items + '</div>' +
      '<span class="json-closing"><span class="json-bracket">}</span></span>';
  }
  return '<span class="json-null">' + escapeHtml(String(val)) + '</span>';
}

function toggleNode(el) {
  el.classList.toggle('collapsed');
  const path = el.getAttribute('data-path');
  document.getElementById('breadcrumb').innerHTML = '<span onclick="navigateTo(\\'root\\')">root</span>' +
    path.replace(/^root\\.?/, '').split('.').map((p, i, arr) => {
      const pPath = 'root.' + arr.slice(0, i + 1).join('.');
      return '.<span onclick="navigateTo(\\'' + pPath + '\\')">' + escapeHtml(p) + '</span>';
    }).join('');
}

function navigateTo(path) {
  expandAll();
  document.getElementById('breadcrumb').textContent = path;
}

// Search
let searchTimeout;
document.getElementById('search').addEventListener('input', function() {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => performSearch(this.value), 150);
});

function performSearch(query) {
  document.querySelectorAll('.highlight').forEach(el => el.classList.remove('highlight'));
  document.getElementById('searchCount').textContent = '';
  if (!query) return;
  const q = query.toLowerCase();
  let count = 0;
  function expandParents(el) {
    // DOM order: .collapsible → .json-summary → .json-children
    // previousElementSibling from .json-children is .json-summary, not .collapsible,
    // so we walk backwards until we find the .collapsible sibling.
    let parent = el.closest('.json-children');
    while (parent) {
      let sib = parent.previousElementSibling;
      while (sib && !sib.classList.contains('collapsible')) {
        sib = sib.previousElementSibling;
      }
      if (sib) sib.classList.remove('collapsed');
      parent = parent.parentElement?.closest('.json-children');
    }
  }

  // Search keys
  document.querySelectorAll('.json-key').forEach(el => {
    if (el.textContent.toLowerCase().includes(q)) {
      el.classList.add('highlight');
      count++;
      expandParents(el);
    }
  });
  // Search string values
  document.querySelectorAll('.json-string').forEach(el => {
    if (el.textContent.toLowerCase().includes(q)) {
      el.classList.add('highlight');
      count++;
      expandParents(el);
    }
  });
  document.getElementById('searchCount').textContent = count + ' match' + (count !== 1 ? 'es' : '');
}

// Compute stats
function computeStats(obj) {
  let keys = 0, strings = 0, numbers = 0, bools = 0, nulls = 0, arrays = 0, objects = 0;
  function walk(v) {
    if (v === null) { nulls++; return; }
    if (typeof v === 'string') { strings++; return; }
    if (typeof v === 'number') { numbers++; return; }
    if (typeof v === 'boolean') { bools++; return; }
    if (Array.isArray(v)) { arrays++; v.forEach(walk); return; }
    if (typeof v === 'object') { objects++; Object.keys(v).length && (keys += Object.keys(v).length); Object.values(v).forEach(walk); }
  }
  walk(obj);
  return { keys, strings, numbers, bools, nulls, arrays, objects };
}

// Init
const tree = document.getElementById('treeView');
lineNum = 1;
tree.innerHTML = '<div class="json-line"><span class="line-number">1</span><span class="json-content">' + renderValue(RAW_JSON, 'root', 0) + '</span></div>';

const s = computeStats(RAW_JSON);
document.getElementById('stats').innerHTML =
  '<span><b>' + s.keys + '</b> keys</span>' +
  '<span><b>' + s.strings + '</b> strings</span>' +
  '<span><b>' + s.numbers + '</b> numbers</span>' +
  '<span><b>' + s.arrays + '</b> arrays</span>' +
  '<span><b>' + s.objects + '</b> objects</span>';
</script>
</body>
</html>`;
}
function escapeHtml(s) {
    return s.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>').replace(/"/g, '"');
}
// ============================================================================
// SERVER
// ============================================================================
class JsonViewerServer extends McpServerBase {
    constructor() {
        super({ name: 'json-viewer', version: '1.0.0' });
    }
    registerTools() {
        this.addTool('view_json', 'Save JSON data and generate an interactive HTML viewer. Opens in browser for easy visualization of complex JSON responses.', {
            type: 'object',
            properties: {
                data: {
                    type: 'string',
                    description: 'JSON string or object to visualize',
                },
                label: {
                    type: 'string',
                    description: 'Label for this response (used in filename and title)',
                },
                open: {
                    type: 'boolean',
                    description: 'Automatically open in browser (default: true)',
                    default: true,
                },
            },
            required: ['data'],
        }, this.handleViewJson.bind(this));
        this.addTool('list_responses', 'List all saved JSON responses with timestamps and metadata.', {
            type: 'object',
            properties: {
                limit: {
                    type: 'number',
                    description: 'Max number of responses to return (default: 20)',
                    default: 20,
                },
            },
        }, this.handleListResponses.bind(this));
        this.addTool('view_response', 'Re-open a previously saved JSON response by its ID.', {
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    description: 'Response ID (from list_responses)',
                },
            },
            required: ['id'],
        }, this.handleViewResponse.bind(this));
    }
    async handleViewJson(args) {
        const { data, label = 'response', open = true } = args;
        try {
            ensureDir();
            // Parse JSON
            let parsed;
            let jsonStr;
            try {
                parsed = typeof data === 'string' ? JSON.parse(data) : data;
                jsonStr = JSON.stringify(parsed, null, 2);
            }
            catch {
                throw new Error('Invalid JSON data provided');
            }
            const id = generateId(label);
            const timestamp = new Date().toISOString();
            const jsonPath = path.join(RESPONSES_DIR, `${id}.json`);
            const htmlPath = path.join(RESPONSES_DIR, `${id}.html`);
            // Save JSON file
            fs.writeFileSync(jsonPath, jsonStr, 'utf-8');
            // Generate and save HTML
            const html = generateHtml(label, parsed, timestamp);
            fs.writeFileSync(htmlPath, html, 'utf-8');
            // Save metadata
            const meta = {
                id,
                label,
                timestamp,
                jsonPath,
                htmlPath,
                sizeBytes: Buffer.byteLength(jsonStr, 'utf-8'),
                keyCount: countKeys(parsed),
                maxDepth: getMaxDepth(parsed),
            };
            const metaPath = path.join(RESPONSES_DIR, `${id}.meta.json`);
            fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2), 'utf-8');
            // Open in browser if requested
            if (open) {
                const cmd = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open';
                const { execSync } = await import('child_process');
                try {
                    execSync(`${cmd} "${htmlPath}"`, { stdio: 'ignore' });
                }
                catch {
                    // Browser open failed silently
                }
            }
            return this.success({
                id,
                jsonPath,
                htmlPath,
                message: `JSON saved and viewer generated. Open: ${htmlPath}`,
                stats: {
                    sizeBytes: meta.sizeBytes,
                    keyCount: meta.keyCount,
                    maxDepth: meta.maxDepth,
                },
            });
        }
        catch (error) {
            return this.error(error);
        }
    }
    async handleListResponses(args) {
        const { limit = 20 } = (args || {});
        try {
            ensureDir();
            const files = fs.readdirSync(RESPONSES_DIR)
                .filter(f => f.endsWith('.meta.json'))
                .sort()
                .reverse()
                .slice(0, limit);
            const responses = [];
            for (const file of files) {
                try {
                    const meta = JSON.parse(fs.readFileSync(path.join(RESPONSES_DIR, file), 'utf-8'));
                    responses.push(meta);
                }
                catch {
                    // Skip corrupted metadata
                }
            }
            return this.success({
                total: responses.length,
                responses,
            });
        }
        catch (error) {
            return this.error(error);
        }
    }
    async handleViewResponse(args) {
        const { id } = args;
        try {
            ensureDir();
            const metaPath = path.join(RESPONSES_DIR, `${id}.meta.json`);
            if (!fs.existsSync(metaPath)) {
                throw new Error(`Response not found: ${id}`);
            }
            const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
            if (!fs.existsSync(meta.htmlPath)) {
                throw new Error(`HTML viewer not found for response: ${id}`);
            }
            // Open in browser
            const cmd = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open';
            const { execSync } = await import('child_process');
            try {
                execSync(`${cmd} "${meta.htmlPath}"`, { stdio: 'ignore' });
            }
            catch {
                // Browser open failed
            }
            return this.success({
                id: meta.id,
                label: meta.label,
                timestamp: meta.timestamp,
                htmlPath: meta.htmlPath,
                message: `Opened viewer for: ${meta.label}`,
            });
        }
        catch (error) {
            return this.error(error);
        }
    }
}
// ============================================================================
// ENTRY POINT
// ============================================================================
new JsonViewerServer().run().catch(console.error);
//# sourceMappingURL=index.js.map
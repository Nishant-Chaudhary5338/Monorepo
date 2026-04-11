#!/usr/bin/env node
// ============================================================================
// JSON VIEWER DASHBOARD — persistent HTTP dev server
// Run once: node build/json-viewer/src/dashboard.js
// Then open: http://localhost:4040
// ============================================================================
import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
const PORT = 4040;
const RESPONSES_DIR = path.join(os.homedir(), '.mcp-responses');
// SSE clients waiting for push notifications
const sseClients = new Set();
function ensureDir() {
    if (!fs.existsSync(RESPONSES_DIR))
        fs.mkdirSync(RESPONSES_DIR, { recursive: true });
}
// ============================================================================
// SSE PUSH
// ============================================================================
function broadcast(event, data) {
    const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    for (const client of sseClients) {
        try {
            client.write(payload);
        }
        catch {
            sseClients.delete(client);
        }
    }
}
function loadAllMeta(limit = 100) {
    ensureDir();
    const files = fs.readdirSync(RESPONSES_DIR)
        .filter(f => f.endsWith('.meta.json'));
    const metas = [];
    for (const f of files) {
        try {
            const m = JSON.parse(fs.readFileSync(path.join(RESPONSES_DIR, f), 'utf-8'));
            metas.push(m);
        }
        catch { /* skip corrupted */ }
    }
    // Sort newest-first by timestamp field (not filename which includes label prefix)
    return metas
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, limit);
}
// ============================================================================
// DASHBOARD HTML
// ============================================================================
function dashboardHtml() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>MCP Output Dashboard</title>
<style>
  :root {
    --bg:#1e1e2e; --surface:#282840; --surface2:#313150; --border:#44447a;
    --text:#cdd6f4; --dim:#8888b0; --key:#89b4fa; --string:#a6e3a1;
    --number:#fab387; --accent:#cba6f7; --red:#f38ba8;
  }
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:'SF Mono','Fira Code',monospace; background:var(--bg); color:var(--text); min-height:100vh; display:flex; flex-direction:column; }
  .topbar {
    position:sticky; top:0; z-index:100;
    background:var(--surface); border-bottom:1px solid var(--border);
    padding:12px 20px; display:flex; align-items:center; gap:12px;
  }
  .topbar h1 { font-size:14px; font-weight:700; color:var(--key); }
  .live-dot {
    width:8px; height:8px; border-radius:50%; background:var(--string);
    animation:pulse 1.5s infinite;
  }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
  .topbar .count { font-size:11px; color:var(--dim); margin-left:auto; }
  .layout { display:flex; flex:1; overflow:hidden; height:calc(100vh - 45px); }
  .sidebar {
    width:320px; min-width:220px; max-width:420px;
    border-right:1px solid var(--border);
    overflow-y:auto; flex-shrink:0;
  }
  .sidebar-header {
    padding:8px 14px; font-size:11px; color:var(--dim);
    border-bottom:1px solid var(--border); position:sticky; top:0;
    background:var(--surface); display:flex; align-items:center; gap:8px;
  }
  .sidebar-header input {
    flex:1; background:var(--surface2); border:1px solid var(--border);
    border-radius:4px; color:var(--text); font-family:inherit; font-size:11px;
    padding:3px 7px; outline:none;
  }
  .sidebar-header input:focus { border-color:var(--key); }
  .entry {
    padding:10px 14px; border-bottom:1px solid var(--border);
    cursor:pointer; transition:background 0.1s;
  }
  .entry:hover, .entry.active { background:var(--surface2); }
  .entry .label { font-size:12px; color:var(--key); font-weight:600; margin-bottom:3px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .entry .meta { font-size:10px; color:var(--dim); display:flex; gap:8px; flex-wrap:wrap; }
  .entry .meta b { color:var(--text); }
  .entry.new-flash { animation:flash 0.6s; }
  @keyframes flash { 0%{background:rgba(137,180,250,0.2)} 100%{background:transparent} }
  .main { flex:1; overflow:hidden; display:flex; flex-direction:column; }
  .main-empty {
    flex:1; display:flex; align-items:center; justify-content:center;
    color:var(--dim); font-size:13px; flex-direction:column; gap:8px;
  }
  .main-empty .hint { font-size:11px; opacity:0.6; }
  iframe {
    flex:1; border:none; width:100%; height:100%;
  }
  .toolbar {
    padding:6px 14px; border-bottom:1px solid var(--border);
    background:var(--surface); display:flex; gap:8px; align-items:center; font-size:11px;
  }
  .toolbar .path { color:var(--dim); flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .btn { padding:3px 9px; background:var(--surface2); border:1px solid var(--border); border-radius:4px; color:var(--text); font-family:inherit; font-size:10px; cursor:pointer; }
  .btn:hover { background:var(--border); }
  .tag { font-size:9px; padding:1px 5px; border-radius:3px; background:var(--surface2); color:var(--dim); border:1px solid var(--border); }
  .new-tag { color:var(--string); border-color:var(--string); }
</style>
</head>
<body>
<div class="topbar">
  <div class="live-dot" id="liveDot" title="Listening for new MCP outputs"></div>
  <h1>MCP Output Dashboard</h1>
  <span class="count" id="totalCount">Loading...</span>
</div>
<div class="layout">
  <div class="sidebar">
    <div class="sidebar-header">
      <input type="text" id="filterInput" placeholder="Filter by label..." oninput="filterEntries(this.value)" />
    </div>
    <div id="entryList"></div>
  </div>
  <div class="main" id="mainPane">
    <div class="main-empty" id="emptyState">
      <span>Select a response to view it</span>
      <span class="hint">New MCP tool outputs appear here automatically</span>
    </div>
    <div id="viewerPane" style="display:none;flex:1;flex-direction:column;display:none;">
      <div class="toolbar">
        <span class="path" id="viewerPath"></span>
        <button class="btn" onclick="openInNewTab()">Open Tab</button>
        <button class="btn" onclick="copyPath()">Copy Path</button>
      </div>
      <iframe id="viewerFrame" title="JSON Viewer"></iframe>
    </div>
  </div>
</div>
<script>
let allEntries = [];
let activeId = null;
let currentPath = null;

async function loadEntries() {
  const res = await fetch('/api/list');
  allEntries = await res.json();
  renderList(allEntries);
  document.getElementById('totalCount').textContent = allEntries.length + ' response' + (allEntries.length !== 1 ? 's' : '');
}

function renderList(entries) {
  const list = document.getElementById('entryList');
  if (entries.length === 0) {
    list.innerHTML = '<div style="padding:16px;font-size:11px;color:var(--dim)">No responses yet</div>';
    return;
  }
  list.innerHTML = entries.map(e => {
    const age = formatAge(e.timestamp);
    return \`<div class="entry\${e.id === activeId ? ' active' : ''}" data-id="\${e.id}" onclick="selectEntry('\${e.id}', this)">
      <div class="label">\${escHtml(e.label || e.id)}</div>
      <div class="meta">
        <span>\${age}</span>
        <span><b>\${e.keyCount}</b> keys</span>
        <span><b>\${formatBytes(e.sizeBytes)}</b></span>
        <span>depth <b>\${e.maxDepth}</b></span>
      </div>
    </div>\`;
  }).join('');
}

function filterEntries(q) {
  const filtered = q ? allEntries.filter(e => (e.label || '').toLowerCase().includes(q.toLowerCase())) : allEntries;
  renderList(filtered);
}

function selectEntry(id, el) {
  activeId = id;
  document.querySelectorAll('.entry').forEach(e => e.classList.remove('active'));
  if (el) el.classList.add('active');

  const entry = allEntries.find(e => e.id === id);
  if (!entry) return;

  currentPath = entry.htmlPath;
  document.getElementById('viewerPath').textContent = entry.htmlPath;
  document.getElementById('emptyState').style.display = 'none';

  const pane = document.getElementById('viewerPane');
  pane.style.display = 'flex';
  pane.style.flexDirection = 'column';
  pane.style.flex = '1';

  document.getElementById('viewerFrame').src = '/view?id=' + encodeURIComponent(id);
}

function openInNewTab() {
  if (currentPath) window.open('/view?id=' + encodeURIComponent(activeId), '_blank');
}

function copyPath() {
  if (currentPath) navigator.clipboard.writeText(currentPath).then(() => {
    const btn = event.target;
    btn.textContent = 'Copied!';
    setTimeout(() => btn.textContent = 'Copy Path', 1200);
  });
}

function formatAge(ts) {
  const diff = Date.now() - new Date(ts).getTime();
  if (diff < 60000) return Math.round(diff / 1000) + 's ago';
  if (diff < 3600000) return Math.round(diff / 60000) + 'm ago';
  return Math.round(diff / 3600000) + 'h ago';
}

function formatBytes(b) {
  if (b < 1024) return b + 'B';
  if (b < 1048576) return (b / 1024).toFixed(1) + 'KB';
  return (b / 1048576).toFixed(1) + 'MB';
}

function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// SSE for live updates
const evtSrc = new EventSource('/events');
evtSrc.addEventListener('new_response', (e) => {
  const entry = JSON.parse(e.data);
  allEntries.unshift(entry);
  document.getElementById('totalCount').textContent = allEntries.length + ' response' + (allEntries.length !== 1 ? 's' : '');
  const q = document.getElementById('filterInput').value;
  filterEntries(q);
  // Flash the newly added entry
  setTimeout(() => {
    const el = document.querySelector('[data-id="' + entry.id + '"]');
    if (el) el.classList.add('new-flash');
  }, 50);
});
evtSrc.addEventListener('error', () => {
  document.getElementById('liveDot').style.background = 'var(--red)';
});
evtSrc.addEventListener('open', () => {
  document.getElementById('liveDot').style.background = 'var(--string)';
});

loadEntries();
</script>
</body>
</html>`;
}
// ============================================================================
// HTTP SERVER
// ============================================================================
const server = http.createServer((req, res) => {
    const url = new URL(req.url ?? '/', `http://localhost:${PORT}`);
    // SSE stream
    if (url.pathname === '/events') {
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*',
        });
        res.write(':ok\n\n');
        sseClients.add(res);
        req.on('close', () => sseClients.delete(res));
        return;
    }
    // API: list all saved responses
    if (url.pathname === '/api/list') {
        const metas = loadAllMeta();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(metas));
        return;
    }
    // Serve the HTML viewer for a specific response
    if (url.pathname === '/view') {
        const id = url.searchParams.get('id');
        if (!id) {
            res.writeHead(400);
            res.end('Missing id');
            return;
        }
        const htmlPath = path.join(RESPONSES_DIR, `${id}.html`);
        if (!fs.existsSync(htmlPath)) {
            res.writeHead(404);
            res.end('Not found');
            return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(fs.readFileSync(htmlPath, 'utf-8'));
        return;
    }
    // Dashboard root
    if (url.pathname === '/' || url.pathname === '/index.html') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(dashboardHtml());
        return;
    }
    res.writeHead(404);
    res.end('Not found');
});
// ============================================================================
// FILE WATCHER — notify SSE clients when a new .meta.json lands
// ============================================================================
function watchResponses() {
    ensureDir();
    fs.watch(RESPONSES_DIR, (eventType, filename) => {
        if (!filename?.endsWith('.meta.json'))
            return;
        if (eventType !== 'rename')
            return; // 'rename' = new file created
        const metaPath = path.join(RESPONSES_DIR, filename);
        // Brief delay so the file is fully written before we read it
        setTimeout(() => {
            try {
                if (!fs.existsSync(metaPath))
                    return;
                const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
                broadcast('new_response', meta);
            }
            catch { /* file not ready yet */ }
        }, 100);
    });
}
// ============================================================================
// START
// ============================================================================
ensureDir();
watchResponses();
server.listen(PORT, () => {
    console.log(`\nMCP Dashboard running at http://localhost:${PORT}`);
    console.log(`Watching: ${RESPONSES_DIR}`);
    console.log('Press Ctrl+C to stop.\n');
});
//# sourceMappingURL=dashboard.js.map
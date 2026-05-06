const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 8080;
const CANVAS_DIR = path.join(__dirname, '..', 'canvas');
const WORKSPACE_DIR = path.join(__dirname);

const STATE_FILE = path.join(WORKSPACE_DIR, 'dashboard-state.json');
const TRIGGER_FILE = path.join(WORKSPACE_DIR, 'deploy-trigger.json');

// MIME types
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

function serveFile(res, filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('File not found');
            } else {
                res.writeHead(500);
                res.end('Server error: ' + err.code);
            }
        } else {
            res.writeHead(200, { 
                'Content-Type': contentType,
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            });
            res.end(content, 'utf-8');
        }
    });
}

function readJsonFile(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        return null;
    }
}

function writeJsonFile(filePath, data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        return true;
    } catch (e) {
        console.error('Write error:', e);
        return false;
    }
}

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    // API: Get dashboard state
    if (pathname === '/api/state') {
        const state = readJsonFile(STATE_FILE) || { error: 'No state file' };
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(state));
        return;
    }
    
    // API: Get deploy trigger
    if (pathname === '/api/trigger') {
        const trigger = readJsonFile(TRIGGER_FILE) || { agent: '', status: 'idle' };
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(trigger));
        return;
    }
    
    // API: Set deploy trigger (POST)
    if (pathname === '/api/deploy' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const trigger = {
                    agent: data.agent || '',
                    projectUrl: data.projectUrl || '',
                    timestamp: Date.now(),
                    status: 'pending'
                };
                
                if (writeJsonFile(TRIGGER_FILE, trigger)) {
                    // Also update state file
                    const state = readJsonFile(STATE_FILE);
                    if (state) {
                        state.pendingDeploys = state.pendingDeploys || [];
                        if (!state.pendingDeploys.includes(data.agent)) {
                            state.pendingDeploys.push(data.agent);
                        }
                        state.lastUpdated = new Date().toISOString();
                        writeJsonFile(STATE_FILE, state);
                    }
                    
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true, message: 'Deploy triggered for ' + data.agent }));
                } else {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'Failed to write trigger' }));
                }
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: 'Invalid JSON' }));
            }
        });
        return;
    }
    
    // API: Clear deploy trigger
    if (pathname === '/api/clear-trigger' && req.method === 'POST') {
        const trigger = { agent: '', projectUrl: '', timestamp: 0, status: 'idle' };
        writeJsonFile(TRIGGER_FILE, trigger);
        
        // Also clear pending deploys in state
        const state = readJsonFile(STATE_FILE);
        if (state) {
            state.pendingDeploys = [];
            state.lastUpdated = new Date().toISOString();
            writeJsonFile(STATE_FILE, state);
        }
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
        return;
    }
    
    // API: Update state (POST)
    if (pathname === '/api/state' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                if (writeJsonFile(STATE_FILE, data)) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true }));
                } else {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'Failed to write state' }));
                }
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: 'Invalid JSON' }));
            }
        });
        return;
    }
    
    // Serve static files from canvas directory
    let filePath = pathname === '/' ? '/index.html' : pathname;
    filePath = path.join(CANVAS_DIR, filePath);
    
    // Security: prevent directory traversal
    if (!filePath.startsWith(CANVAS_DIR)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }
    
    fs.exists(filePath, exists => {
        if (exists) {
            serveFile(res, filePath);
        } else {
            // Try index.html for SPA routes
            const indexPath = path.join(CANVAS_DIR, 'index.html');
            fs.exists(indexPath, indexExists => {
                if (indexExists) {
                    serveFile(res, indexPath);
                } else {
                    res.writeHead(404);
                    res.end('Not found');
                }
            });
        }
    });
});

server.listen(PORT, () => {
    console.log(`🚀 Testing Family Dashboard Server running at http://localhost:${PORT}`);
    console.log(`📁 Serving files from: ${CANVAS_DIR}`);
    console.log(`📊 API endpoints:`);
    console.log(`   GET  /api/state     - Read dashboard state`);
    console.log(`   POST /api/state     - Update dashboard state`);
    console.log(`   GET  /api/trigger   - Read deploy trigger`);
    console.log(`   POST /api/deploy    - Trigger agent deployment`);
    console.log(`   POST /api/clear-trigger - Clear deploy trigger`);
    console.log('');
    console.log('Press Ctrl+C to stop');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n👋 Shutting down server...');
    server.close(() => {
        process.exit(0);
    });
});

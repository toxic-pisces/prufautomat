const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const chokidar = require('chokidar');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Enable CORS for all routes
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Serve static files
app.use(express.static(__dirname));

// Configuration
const CONFIG_FILE = path.join(__dirname, 'server-config.json');
const EVENTS_FILE = path.join(__dirname, 'machine-events.json');
let watchFolder = null;
let machineEvents = [];

// Load configuration
function loadConfig() {
    try {
        if (fs.existsSync(CONFIG_FILE)) {
            const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
            watchFolder = config.watchFolder;
            console.log(`📁 Loaded watch folder from config: ${watchFolder}`);
        }
    } catch (error) {
        console.error('Error loading config:', error);
    }
}

// Save configuration
function saveConfig(folder) {
    try {
        const config = { watchFolder: folder };
        fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
        console.log(`💾 Saved watch folder to config: ${folder}`);
    } catch (error) {
        console.error('Error saving config:', error);
    }
}

// Load machine events
function loadEvents() {
    try {
        if (fs.existsSync(EVENTS_FILE)) {
            machineEvents = JSON.parse(fs.readFileSync(EVENTS_FILE, 'utf8'));
            console.log(`📊 Loaded ${machineEvents.length} machine events`);
        }
    } catch (error) {
        console.error('Error loading events:', error);
        machineEvents = [];
    }
}

// Save machine events
function saveEvents() {
    try {
        fs.writeFileSync(EVENTS_FILE, JSON.stringify(machineEvents, null, 2));
    } catch (error) {
        console.error('Error saving events:', error);
    }
}

// Add a new event
function addEvent(eventData) {
    const event = {
        id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        ...eventData
    };
    machineEvents.push(event);
    saveEvents();
    console.log(`📝 Event logged: ${event.type} - ${event.reason || 'N/A'}`);
    return event;
}

// Load config and events on startup
loadConfig();
loadEvents();

let watcher = null;
let connectedClients = 0;

// Setup folder watcher
function setupWatcher(folder) {
    // Stop existing watcher if any
    if (watcher) {
        watcher.close();
        console.log('🛑 Stopped previous folder watcher');
    }

    if (!folder || !fs.existsSync(folder)) {
        console.warn(`⚠️  Folder does not exist: ${folder}`);
        return;
    }

    watchFolder = folder;
    saveConfig(folder);

    console.log(`👀 Starting to watch folder: ${folder}`);

    watcher = chokidar.watch(folder, {
        ignored: /(^|[\/\\])\../, // ignore dotfiles
        persistent: true,
        ignoreInitial: true,
        awaitWriteFinish: {
            stabilityThreshold: 2000,
            pollInterval: 100
        }
    });

    watcher
        .on('add', async (filepath) => {
            if (path.extname(filepath).toLowerCase() === '.dfq') {
                console.log(`📄 New DFQ file detected: ${path.basename(filepath)}`);

                try {
                    // Read file content
                    const content = fs.readFileSync(filepath, 'utf8');

                    // Send to all connected clients
                    io.emit('dfq-file-added', {
                        filename: path.basename(filepath),
                        filepath: filepath,
                        content: content,
                        timestamp: new Date().toISOString()
                    });

                    console.log(`✅ Sent file to ${connectedClients} client(s)`);
                } catch (error) {
                    console.error('Error reading DFQ file:', error);
                }
            }
        })
        .on('error', error => {
            console.error('Watcher error:', error);
        });

    console.log('✅ Folder watcher is active');
}

// Socket.IO connection handling
io.on('connection', (socket) => {
    connectedClients++;
    console.log(`🔌 Client connected (Total: ${connectedClients})`);

    // Send current watch folder to client
    socket.emit('watch-folder-status', {
        watching: !!watchFolder,
        folder: watchFolder
    });

    // Handle watch folder change
    socket.on('set-watch-folder', (folder) => {
        console.log(`📁 Client requested to watch: ${folder}`);
        setupWatcher(folder);

        // Notify all clients
        io.emit('watch-folder-status', {
            watching: true,
            folder: folder
        });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        connectedClients--;
        console.log(`🔌 Client disconnected (Total: ${connectedClients})`);
    });
});

// API endpoint to get/set watch folder
app.get('/api/watch-folder', (req, res) => {
    res.json({
        watching: !!watchFolder,
        folder: watchFolder
    });
});

app.post('/api/watch-folder', express.json(), (req, res) => {
    const { folder } = req.body;

    if (!folder) {
        return res.status(400).json({ error: 'Folder path required' });
    }

    if (!fs.existsSync(folder)) {
        return res.status(400).json({ error: 'Folder does not exist' });
    }

    setupWatcher(folder);
    res.json({ success: true, folder: folder });
});

// API endpoint to log a machine event
app.post('/api/events', (req, res) => {
    const { type, reason, startTime, endTime, durationMinutes, additionalData } = req.body;

    if (!type) {
        return res.status(400).json({ error: 'Event type required' });
    }

    const event = addEvent({
        type,
        reason,
        startTime,
        endTime,
        durationMinutes,
        ...additionalData
    });

    res.json({ success: true, event });
});

// API endpoint to get all events
app.get('/api/events', (req, res) => {
    res.json({ events: machineEvents, count: machineEvents.length });
});

// API endpoint to get events filtered by date range
app.get('/api/events/range', (req, res) => {
    const { start, end } = req.query;

    let filteredEvents = machineEvents;

    if (start) {
        filteredEvents = filteredEvents.filter(e => new Date(e.timestamp) >= new Date(start));
    }

    if (end) {
        filteredEvents = filteredEvents.filter(e => new Date(e.timestamp) <= new Date(end));
    }

    res.json({ events: filteredEvents, count: filteredEvents.length });
});

// API endpoint to export events (for SQL import)
app.get('/api/events/export', (req, res) => {
    // Format for SQL import - CSV style
    const csvHeader = 'id,timestamp,type,reason,startTime,endTime,durationMinutes\n';
    const csvRows = machineEvents.map(e =>
        `"${e.id}","${e.timestamp}","${e.type}","${e.reason || ''}","${e.startTime || ''}","${e.endTime || ''}",${e.durationMinutes || 0}`
    ).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="machine-events.csv"');
    res.send(csvHeader + csvRows);
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log('');
    console.log('╔════════════════════════════════════════╗');
    console.log('║   DFQ File Watcher Server Started     ║');
    console.log('╚════════════════════════════════════════╝');
    console.log('');
    console.log(`🌐 Server running at: http://localhost:${PORT}`);
    console.log(`📡 WebSocket ready for connections`);

    if (watchFolder) {
        console.log(`👀 Watching folder: ${watchFolder}`);
    } else {
        console.log(`⚠️  No folder configured. Set it in the web interface.`);
    }

    console.log('');
    console.log('Press Ctrl+C to stop the server');
    console.log('');
});

// Setup initial watcher if folder is configured
if (watchFolder) {
    setupWatcher(watchFolder);
}

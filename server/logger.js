const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const LOG_DIR = path.join(__dirname, 'logs');
const LOG_FILE = path.join(LOG_DIR, 'app.log');

// Créer le dossier logs s'il n'existe pas
if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
}

app.post('/log', (req, res) => {
    const { level, message, timestamp, data } = req.body;
    const logEntry = `[${timestamp}] ${level.toUpperCase()}: ${message}\n`;
    const dataString = data ? `DATA: ${JSON.stringify(data, null, 2)}\n` : '';
    
    fs.appendFile(LOG_FILE, logEntry + dataString + '\n', (err) => {
        if (err) {
            console.error('Error writing to log file:', err);
            res.status(500).json({ error: 'Failed to write log' });
        } else {
            res.json({ success: true });
        }
    });
});

app.get('/logs', (req, res) => {
    fs.readFile(LOG_FILE, 'utf8', (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.json({ logs: [] });
            } else {
                res.status(500).json({ error: 'Failed to read logs' });
            }
        } else {
            res.json({ logs: data.split('\n').filter(Boolean) });
        }
    });
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Logger server running on port ${PORT}`);
});

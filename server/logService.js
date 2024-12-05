const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');

const app = express();

// Configuration
const LOG_DIR = path.join(__dirname, 'logs');
const LOG_FILE = path.join(LOG_DIR, 'app.log');

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Créer le dossier logs s'il n'existe pas
if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
}

// Fonction pour formater un log
function formatLog(level, message, timestamp, data) {
    const dateStr = new Date(timestamp).toLocaleString('fr-FR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    let logStr = `[${dateStr}] ${level.toUpperCase()}: ${message}\n`;
    
    if (data) {
        const dataStr = typeof data === 'object' 
            ? JSON.stringify(data, null, 2)
            : data.toString();
        logStr += '------- Données -------\n';
        logStr += dataStr + '\n';
        logStr += '---------------------\n';
    }
    
    return logStr + '\n';
}

// Routes
app.post('/api/logs', (req, res) => {
    const { level, message, timestamp, data } = req.body;
    const logStr = formatLog(level, message, timestamp, data);

    fs.appendFile(LOG_FILE, logStr, (err) => {
        if (err) {
            console.error('Error writing to log file:', err);
            res.status(500).json({ error: 'Failed to write log' });
        } else {
            console.log('\nNouveau log enregistré :\n' + logStr);
            res.json({ success: true });
        }
    });
});

app.get('/api/logs', (req, res) => {
    fs.readFile(LOG_FILE, 'utf8', (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.send('Aucun log disponible');
            } else {
                res.status(500).send('Erreur lors de la lecture des logs');
            }
        } else {
            // Si c'est une requête du navigateur, renvoyer le texte formaté
            if (req.headers.accept.includes('text/html')) {
                res.send(`<pre style="background: #1e1e1e; color: #d4d4d4; padding: 20px; font-family: monospace; white-space: pre-wrap;">${data}</pre>`);
            } else {
                // Pour les appels API, renvoyer les données brutes
                res.send(data);
            }
        }
    });
});

app.delete('/api/logs', (req, res) => {
    fs.writeFile(LOG_FILE, '', err => {
        if (err) {
            console.error('Error clearing log file:', err);
            res.status(500).send('Erreur lors de la suppression des logs');
        } else {
            console.log('Logs effacés');
            res.send('Tous les logs ont été effacés');
        }
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════╗
║        Service de Logs PerfectCV        ║
╠════════════════════════════════════════╣
║                                        ║
║  🌐 Serveur démarré sur le port ${PORT}   ║
║  📁 Logs stockés dans: ${LOG_FILE}        ║
║                                        ║
║  Endpoints:                            ║
║  GET    /api/logs   - Voir les logs    ║
║  POST   /api/logs   - Ajouter un log   ║
║  DELETE /api/logs   - Effacer les logs ║
║                                        ║
╚════════════════════════════════════════╝
`);
});

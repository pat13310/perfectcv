const fs = require('fs');
const path = require('path');

// Lire le contenu du fichier .env
const envPath = path.resolve(__dirname, '../.env');
const envConfig = {};

if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
        const match = line.match(/^(REACT_APP_[^=]+=)(.*)$/);
        if (match) {
            const key = match[1].slice(0, -1); // Enlever le '='
            envConfig[key] = process.env[key] || match[2];
        }
    });
}

// Créer le contenu du fichier env-config.js
const envConfigContent = `window.ENV = ${JSON.stringify(envConfig, null, 2)};`;

// Écrire le fichier env-config.js
const outputPath = path.resolve(__dirname, '../public/env-config.js');
fs.writeFileSync(outputPath, envConfigContent);

console.log('env-config.js generated successfully!');

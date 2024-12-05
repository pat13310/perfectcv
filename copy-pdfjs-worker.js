const fs = require('fs');
const path = require('path');

const sourceFile = path.join(__dirname, 'node_modules', 'pdfjs-dist', 'build', 'pdf.worker.mjs');
const targetDir = path.join(__dirname, 'public', 'pdfjs-dist', 'build');
const targetFile = path.join(targetDir, 'pdf.worker.js');

// Create target directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

// Copy the file
fs.copyFileSync(sourceFile, targetFile);
console.log('PDF.js worker file copied successfully!');

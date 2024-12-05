type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogMessage {
    level: LogLevel;
    message: string;
    timestamp: string;
    data?: any;
}

class Logger {
    private static instance: Logger;
    private logs: LogMessage[] = [];
    private isDebugMode: boolean = true;
    private logFile: string = 'app.log';
    private maxLogSize: number = 5 * 1024 * 1024; // 5MB

    private constructor() {
        console.log('Logger initialized in debug mode');
        this.initLogFile();
    }

    private async initLogFile() {
        try {
            // Vérifier si le dossier logs existe, sinon le créer
            if (typeof process !== 'undefined' && process.versions && process.versions.node) {
                const fs = require('fs');
                if (!fs.existsSync('logs')) {
                    fs.mkdirSync('logs');
                }
            } else if (typeof window !== 'undefined' && (window as any).fs) {
                if (!(window as any).fs.existsSync('logs')) {
                    (window as any).fs.mkdirSync('logs');
                }
            }

            this.logFile = 'logs/app.log';

            // Vérifier la taille du fichier de log
            if (typeof process !== 'undefined' && process.versions && process.versions.node) {
                const fs = require('fs');
                if (fs.existsSync(this.logFile)) {
                    const stats = fs.statSync(this.logFile);
                    if (stats.size > this.maxLogSize) {
                        // Renommer l'ancien fichier avec un timestamp
                        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                        fs.renameSync(this.logFile, `logs/app-${timestamp}.log`);
                    }
                }
            } else if (typeof window !== 'undefined' && (window as any).fs) {
                if ((window as any).fs.existsSync(this.logFile)) {
                    const stats = (window as any).fs.statSync(this.logFile);
                    if (stats.size > this.maxLogSize) {
                        // Renommer l'ancien fichier avec un timestamp
                        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                        (window as any).fs.renameSync(this.logFile, `logs/app-${timestamp}.log`);
                    }
                }
            }
        } catch (error) {
            console.error('Error initializing log file:', error);
        }
    }

    static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    private formatLogMessage(level: LogLevel, message: string, data?: any): LogMessage {
        return {
            level,
            message,
            timestamp: new Date().toISOString(),
            data: data ? this.sanitizeData(data) : undefined
        };
    }

    private sanitizeData(data: any): any {
        try {
            return JSON.parse(JSON.stringify(data));
        } catch {
            return String(data);
        }
    }

    private async writeToFile(logMessage: LogMessage) {
        try {
            const formattedMessage = `[${logMessage.timestamp}] ${logMessage.level.toUpperCase()}: ${logMessage.message}${
                logMessage.data ? '\nData: ' + JSON.stringify(logMessage.data, null, 2) : ''
            }\n`;

            // Check if running in Node.js environment
            if (typeof window !== 'undefined' && (window as any).require) {
                const fs = (window as any).require('fs').promises;
                await fs.appendFile(this.logFile, formattedMessage);
            } else if (typeof process !== 'undefined' && process.versions && process.versions.node) {
                const fs = require('fs').promises;
                await fs.appendFile(this.logFile, formattedMessage);
            } else {
                // Fallback for browser environments
                console.log('File logging not supported in this environment');
                console.log(formattedMessage);
            }
        } catch (error) {
            console.error('Error writing to log file:', error);
        }
    }

    private log(level: LogLevel, message: string, data?: any) {
        const logMessage = this.formatLogMessage(level, message, data);
        this.logs.push(logMessage);

        // Log to console
        const consoleMessage = `${logMessage.timestamp} [${level.toUpperCase()}] ${message}`;
        switch (level) {
            case 'error':
                console.error(consoleMessage, data);
                break;
            case 'warn':
                console.warn(consoleMessage, data);
                break;
            case 'debug':
                if (this.isDebugMode) {
                    console.debug(consoleMessage, data);
                }
                break;
            default:
                console.log(consoleMessage, data);
        }

        // Write to file
        this.writeToFile(logMessage);
    }

    info(message: string, data?: any) {
        this.log('info', message, data);
    }

    warn(message: string, data?: any) {
        this.log('warn', message, data);
    }

    error(message: string, data?: any) {
        this.log('error', message, data);
    }

    debug(message: string, data?: any) {
        this.log('debug', message, data);
    }

    getLogs(): LogMessage[] {
        return [...this.logs];
    }

    clearLogs() {
        this.logs = [];
    }

    setDebugMode(enabled: boolean) {
        this.isDebugMode = enabled;
    }
}

export const logger = Logger.getInstance();

import React, { useState, useEffect } from 'react';
import { logger } from '../../utils/logger';

const LogViewer: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [logs, setLogs] = useState(logger.getLogs());
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'info' | 'warn' | 'error' | 'debug'>('all');

  useEffect(() => {
    // Update logs every second
    const interval = setInterval(() => {
      setLogs(logger.getLogs());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const filteredLogs = selectedLevel === 'all' 
    ? logs 
    : logs.filter(log => log.level === selectedLevel);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'info': return 'text-blue-500';
      case 'warn': return 'text-yellow-500';
      case 'error': return 'text-red-500';
      case 'debug': return 'text-purple-500';
      default: return 'text-gray-500';
    }
  };

  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-gray-800 text-white px-4 py-2 rounded-md shadow-lg hover:bg-gray-700 transition-colors"
      >
        {isVisible ? 'Hide Logs' : 'Show Logs'}
      </button>

      {isVisible && (
        <div className="fixed bottom-16 right-4 w-[600px] max-h-[500px] bg-gray-900 rounded-lg shadow-xl overflow-hidden">
          <div className="p-4 border-b border-gray-700 flex justify-between items-center">
            <h3 className="text-white font-medium">Debug Logs</h3>
            <div className="flex space-x-2">
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value as any)}
                className="bg-gray-800 text-white text-sm rounded px-2 py-1 border border-gray-700"
              >
                <option value="all">All Levels</option>
                <option value="info">Info</option>
                <option value="warn">Warnings</option>
                <option value="error">Errors</option>
                <option value="debug">Debug</option>
              </select>
              <button
                onClick={() => logger.clearLogs()}
                className="bg-gray-800 text-white text-sm px-3 py-1 rounded border border-gray-700 hover:bg-gray-700"
              >
                Clear
              </button>
            </div>
          </div>
          
          <div className="overflow-auto max-h-[400px] p-4">
            {filteredLogs.map((log, index) => (
              <div key={index} className="mb-4 last:mb-0">
                <div className="flex items-center space-x-2">
                  <span className={`font-medium ${getLevelColor(log.level)}`}>
                    {log.level.toUpperCase()}
                  </span>
                  <span className="text-gray-400 text-sm">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="text-white mt-1">{log.message}</div>
                {log.data && (
                  <pre className="mt-2 p-2 bg-gray-800 rounded text-sm text-gray-300 overflow-auto">
                    {JSON.stringify(log.data, null, 2)}
                  </pre>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LogViewer;

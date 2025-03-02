const { contextBridge, ipcRenderer } = require('electron');

// Log preload script execution
console.log('Loading screen preload script executing');

// Expose protected methods for the loading screen
contextBridge.exposeInMainWorld('loadingAPI', {
  // Listen for database ready event
  onDatabaseReady: (callback) => {
    ipcRenderer.on('database-ready', (event, data) => {
      console.log('Database ready event received in loading screen:', data);
      callback(data);
    });
  },
  
  // Get current database status
  getDatabaseStatus: () => ipcRenderer.invoke('get-database-status'),
  
  // Notify main process that loading screen is ready to close
  readyToClose: () => {
    console.log('Notifying main process that loading screen is ready to close');
    ipcRenderer.send('loading-screen-ready-to-close');
  },
  
  // Get app info
  getAppInfo: () => {
    return {
      platform: process.platform,
      arch: process.arch,
      versions: {
        electron: process.versions.electron,
        chrome: process.versions.chrome,
        node: process.versions.node
      }
    };
  }
});

// Log when preload script is done
console.log('Loading screen preload script completed'); 
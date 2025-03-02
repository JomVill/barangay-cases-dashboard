const { contextBridge, ipcRenderer } = require('electron');

// Log preload script execution
console.log('Preload script executing');
console.log('Node version:', process.versions.node);
console.log('Chrome version:', process.versions.chrome);
console.log('Electron version:', process.versions.electron);

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  ping: () => ipcRenderer.invoke('ping'),
  getCases: () => ipcRenderer.invoke('get-cases'),
  saveCases: (cases) => ipcRenderer.invoke('save-cases', cases),
});

// Expose a flag to indicate that the app is running in Electron
contextBridge.exposeInMainWorld('isRunningInElectron', true);

// Debug function to check if electronAPI is available
setTimeout(() => {
  console.log('Checking if electronAPI is available on window object...');
  if (typeof window !== 'undefined') {
    console.log('Window object exists');
    if (window.electronAPI) {
      console.log('electronAPI is available on window object');
      console.log('Available methods:', Object.keys(window.electronAPI));
    } else {
      console.log('electronAPI is NOT available on window object');
    }
  } else {
    console.log('Window object does not exist yet');
  }
}, 1000);

// Log when preload script is done
console.log('Preload script completed'); 
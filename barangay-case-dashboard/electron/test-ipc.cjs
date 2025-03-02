const { ipcMain } = require('electron');

// Log all IPC handlers
console.log('IPC handlers:', ipcMain.eventNames());

// Test the ping handler
ipcMain.handle('test-ping', async () => {
  console.log('Test ping handler called');
  return 'test-pong';
});

// Log that the test script has been loaded
console.log('Test IPC script loaded');

module.exports = {
  testIpc: () => {
    console.log('Test IPC function called');
    return true;
  }
}; 
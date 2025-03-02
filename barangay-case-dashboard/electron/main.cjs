const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

// Determine if we're in development mode
const isDevelopment = process.env.NODE_ENV !== 'production';

// Custom logger that only logs in development mode
function log(...args) {
  if (isDevelopment) {
    console.log(...args);
  } else {
    // In production, log critical information to console
    if (args[0] && typeof args[0] === 'string' && 
        (args[0].includes('Error') || args[0].includes('Failed') || args[0].includes('Critical'))) {
      console.log(...args);
    }
  }
}

// Log app paths for debugging
log('App paths:');
log('- User data path:', app.getPath('userData'));
log('- App path:', app.getAppPath());
log('- Exe path:', app.getPath('exe'));
log('- Current working directory:', process.cwd());

// Register IPC handlers
const ipcHandlers = ['error', 'ping', 'get-cases', 'save-cases', 'get-database-status'];
log('IPC handlers:', ipcHandlers);

// Test IPC script
log('Test IPC script loaded');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
try {
  if (require('electron-squirrel-startup')) {
    app.quit();
  }
} catch (error) {
  log('electron-squirrel-startup not available:', error.message);
}

let mainWindow;
let loadingWindow;
let casesData = [];
let databaseReady = false;
let databaseError = null;

// Function to load cases data from file
async function loadCasesData() {
  try {
    const userDataPath = app.getPath('userData');
    const casesFilePath = path.join(userDataPath, 'cases.json');
    
    log('Preloading cases from:', casesFilePath);
    
    if (fs.existsSync(casesFilePath)) {
      const data = fs.readFileSync(casesFilePath, 'utf8');
      
      try {
        casesData = JSON.parse(data);
        log(`Successfully preloaded ${casesData.length} cases`);
        
        // Verify the data structure
        if (!Array.isArray(casesData)) {
          log('Critical: Loaded data is not an array, resetting to empty array');
          casesData = [];
        } else {
          // Log the first case for debugging
          if (casesData.length > 0) {
            log('First case sample:', JSON.stringify(casesData[0]).substring(0, 200) + '...');
          }
        }
      } catch (parseError) {
        log('Error parsing cases JSON:', parseError);
        databaseError = 'JSON parse error: ' + parseError.message;
        casesData = [];
      }
      
      return casesData;
    } else {
      log('No cases file found, initializing with empty array');
      return [];
    }
  } catch (error) {
    log('Error preloading cases:', error);
    databaseError = 'File read error: ' + error.message;
    return [];
  }
}

// Function to notify loading screen that database is ready
function notifyLoadingScreenDatabaseReady() {
  if (loadingWindow && !loadingWindow.isDestroyed()) {
    log('Notifying loading screen that database is ready');
    loadingWindow.webContents.send('database-ready', { 
      count: casesData.length,
      error: databaseError
    });
    databaseReady = true;
  }
}

const createWindow = async () => {
  // Create the loading window first
  loadingWindow = new BrowserWindow({
    width: 500,
    height: 400,
    frame: false,
    transparent: false,
    resizable: false,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'loading-preload.cjs'),
    },
    backgroundColor: '#f0f2f5'
  });

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    backgroundColor: '#f0f2f5',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Load the loading screen
  loadingWindow.loadFile(path.join(__dirname, 'loading.html'));
  loadingWindow.once('ready-to-show', () => {
    loadingWindow.show();
  });

  // Preload the cases data while showing the loading screen
  try {
    await loadCasesData();
    log('Database preloading complete');
    
    // Notify loading screen that database is ready
    notifyLoadingScreenDatabaseReady();
  } catch (error) {
    log('Error during database preloading:', error);
    databaseError = 'Database load error: ' + error.message;
    // Still notify loading screen even if there was an error
    notifyLoadingScreenDatabaseReady();
  }

  // Load the index.html of the app.
  const startUrl = isDevelopment
    ? 'http://localhost:5173'
    : `file://${path.join(__dirname, '../dist/index.html')}`;

  log('Loading URL:', startUrl);
  mainWindow.loadURL(startUrl);

  // When main window is ready, hide loading screen and show main window
  mainWindow.webContents.once('did-finish-load', () => {
    log('Main window loaded');
    
    // Only close loading window if it hasn't been closed already
    if (loadingWindow && !loadingWindow.isDestroyed()) {
      // The loading screen will close itself when it receives the database-ready message
      // and its minimum display time has elapsed
      log('Main window ready, waiting for loading screen to close itself');
    }
  });

  // Open the DevTools in development mode
  if (isDevelopment) {
    mainWindow.webContents.openDevTools();
  }

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
    if (loadingWindow && !loadingWindow.isDestroyed()) {
      loadingWindow.close();
      loadingWindow = null;
    }
  });

  // Handle IPC messages
  ipcMain.handle('ping', async () => {
    log('Ping received');
    return 'pong';
  });

  // Handle getting cases from file - now returns preloaded data for faster response
  ipcMain.handle('get-cases', async () => {
    log('Returning preloaded cases data, count:', casesData.length);
    return casesData;
  });

  // Handle saving cases to file
  ipcMain.handle('save-cases', async (event, cases) => {
    try {
      const userDataPath = app.getPath('userData');
      const casesFilePath = path.join(userDataPath, 'cases.json');
      
      log('Saving cases to:', casesFilePath);
      log('Number of cases:', cases.length);
      
      // Verify the data is an array
      if (!Array.isArray(cases)) {
        log('Error: Attempted to save non-array data');
        return false;
      }
      
      // Create a backup of the current file if it exists
      if (fs.existsSync(casesFilePath)) {
        const backupPath = `${casesFilePath}.backup`;
        fs.copyFileSync(casesFilePath, backupPath);
        log('Created backup at:', backupPath);
      }
      
      fs.writeFileSync(casesFilePath, JSON.stringify(cases, null, 2), 'utf8');
      
      // Update the preloaded data
      casesData = cases;
      
      return true;
    } catch (error) {
      log('Error saving cases:', error);
      return false;
    }
  });

  // Handle loading screen ready to close
  ipcMain.on('loading-screen-ready-to-close', () => {
    log('Loading screen is ready to close');
    if (loadingWindow && !loadingWindow.isDestroyed()) {
      loadingWindow.close();
      loadingWindow = null;
      
      // Now show the main window
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.show();
      }
    }
  });

  // Handle request for database status from loading screen
  ipcMain.handle('get-database-status', async () => {
    log('Loading screen requested database status');
    return { 
      ready: databaseReady,
      caseCount: casesData.length,
      error: databaseError
    };
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
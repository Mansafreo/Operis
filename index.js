const electronReload = require('electron-reload');
const path = require('path');
const { app, BrowserWindow } = require('electron');

// Resolve paths to files and directories
const mainFile = path.resolve(__dirname, 'UI', 'index.html');
const dbDirectory = path.resolve(__dirname, 'Database');
const logsDirectory = path.resolve(__dirname, 'Logs');
const storageDirectory = path.resolve(__dirname, 'Storage');
// Define paths to exclude from reloading
const ignoredPaths = [
  dbDirectory // Exclude the Database directory itself
  , logsDirectory // Exclude the Logs directory itself
  , storageDirectory // Exclude the Storage directory itself
];

// Configure electron-reload with ignored paths
electronReload(__dirname, {
  ignored: ignoredPaths
});

function createWindow() {
  // Create the browser window
  const mainWindow = new BrowserWindow({
    width: 1980,
    height: 1000,
    fullscreen: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // Load your HTML file or URL
  mainWindow.loadFile(mainFile);
}

// Create the main window when the app is ready
app.whenReady().then(createWindow);

// Quit the app when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Create a new window if the app is activated (on macOS)
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

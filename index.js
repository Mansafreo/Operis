// main.js
require('electron-reload')(__dirname);//To support hot-reloading for the UI
const path=require('path');//To support the use of path.resolve
let main_file=path.resolve(__dirname, 'UI', 'index.html');
const { app, BrowserWindow } = require('electron');

function createWindow() {
  // Create the browser window
  const mainWindow = new BrowserWindow({
    width: 1980,
    height: 1000,
    fullscreen: false,//This is set to true to make the window full screen
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false//This is set to false to allow the use of require in the UI
    }
  });

  // Load your HTML file or URL
  mainWindow.loadFile(main_file);
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

'use strict';

const electron = require('electron');
const app = electron.app;  // Module to control application life.
const BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.
const dialog = electron.dialog;
const ipcMain = electron.ipcMain;

const viewer = require('./lib/viewer');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600});

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/views/index.html`);

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});


var openWindows = {};
ipcMain.on('application:open-zdf', (e, options) => {
  dialog.showOpenDialog(mainWindow, {
    filters: [{
      name: 'ZDF Files',
      extensions: ['zdf']
    }],
    properties: ['openFile']
  }, (filename) => {
    if (filename) {
      viewer.openFile(filename, {
        publicKey: options.verificationKey,
        privateKey: options.decryptionKey,
        privateKeyPassphrase: options.decryptionKeyPassphrase
      }).then((result) => {
        mainWindow.close();

        var openWindow = new BrowserWindow({
          width: 800,
          height: 600
        });

        openWindow[openWindow.id] = {
          browserWindow: openWindow,
          zdf: result
        };

        openWindow.on('closed', () => {
          openWindows[openWindow.id] = null;
        });

        openWindow.webContents.on('did-finish-load', () => {
          openWindow.webContents.send('viewer:open', result);
        });

        openWindow.loadUrl(`file://${__dirname}/views/viewer.html`);
      }).catch((err) => {
        console.error(err);
      });
    }
  });
});

ipcMain.on('application:select-open-file', (event, options) => {
  if (!options) {
    options = {};
  }

  dialog.showOpenDialog({
    filters: options.filters,
    properties: ['openFile']
  }, (destination) => {
    if (destination) {
      event.sender.send('application:file-selected', destination, options);
    }
  });
});

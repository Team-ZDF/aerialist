var app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');  // Module to create native browser window.
var dialog = require('dialog');
var fs = require('fs');
var ipc = require('ipc');
var viewer = require('./lib/viewer.js');

// Report crashes to our server.
//require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is GCed.
var mainWindow = null;

// Read settings and size file
var size = {}, settingsjson = {};
try {
  size = JSON.parse(fs.readFileSync(path.join(process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'], 'Library', 'Application\ Support', 'ZDF', 'Aerialist', 'size')));
} catch (err) {}
try {
  settingsjson = JSON.parse(fs.readFileSync(path.join(__dirname, 'settings.json'), 'utf8'));
} catch (err) {}

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: size.width || 800,
    height: size.height || 600
  });

  // and load the index.html of the app.
  mainWindow.loadUrl('file://' + __dirname + '/views/startup.html');

  ipc.on('application:open-file', function(e) {
    console.log('application:open-file');
    dialog.showOpenDialog(mainWindow, {
      filters: [
        { name: 'ZDF Files', extensions: ['zdf'] }
      ],
      properties: ['openFile']
    }, function(filename) {
      viewer.openFile(filename, e.sender);
    });
  });

  // Open the devtools.
  mainWindow.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});

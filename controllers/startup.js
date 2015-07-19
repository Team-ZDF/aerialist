var fs = require('fs');
var ipc = require('ipc');

console.log('Beginning startup.js');

// Send the open file command to the main application
ipc.send('application:open-file');

ipc.on('application:render-html', function(html) {
  console.log('Rendering HTML');
  document.body.innerHTML = html;
});

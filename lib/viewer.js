var app = require('app');
var fs = require('fs');
var jsdom = require('jsdom');
var zdf = require('../../node-zdf/zdf.js');
console.log(zdf.version);

//var jquery = fs.readFileSync(__dirname + '/../node_modules/jquery/dist/jquery.js', 'utf-8');

function processDocumentContent(html, callback) {
  console.log(html);
  // TODO: Change jQuery to load locally
  jsdom.env(html, ['http://code.jquery.com/jquery.js'], function(errors, window) {
    // TODO: Split out header, footer, and body then begin to render
    var $header = window.$('header').remove();
    var $footer = window.$('footer').remove();
    var $body = window.$('body');
    console.log($body.html());
    callback($body.html());
  });
}

module.exports = {
  openFile:  function(filename, sender) {
    console.log('Opening ' + filename);

    var stream = fs.createReadStream(filename.toString());

    zdf.read(stream, function(zdfInfo) {
      console.log('Opening ""' + zdfInfo.manifest.title + '" by ' + zdfInfo.manifest.author);
      app.addRecentDocument(filename);
      processDocumentContent(zdfInfo.files[zdfInfo.manifest.mainFile].toString(), function(body) {
        sender.send('application:render-html', body);
      });
    });
  }
};

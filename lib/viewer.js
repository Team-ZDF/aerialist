const {app} = require('electron');
const fs = require('fs');
const path = require('path');
const temp = require('temp');
const zdf = require('../../node-zdf/zdf.js');

function openFile(filename, options) {
  return new Promise((resolve, reject) => {
    temp.mkdir('temp', (err, dirPath) => {
      if (err) {
        reject(err);
        return;
      }

      var stream = fs.createReadStream(filename.toString())
        .on('error', reject);

      var zdfStream = new zdf.PackageReadStream(options)
        .on('error', reject);

      stream.pipe(zdfStream).on('entry', (entry) => {
        var entryStream = fs.createWriteStream(path.join(dirPath, entry.props.path));
        entry.pipe(entryStream);
      }).on('end', (zdfInfo) => {
        app.addRecentDocument(filename.toString());
        resolve({
          zdfInfo: zdfInfo,
          tempLocation: dirPath
        });
      });
    });
  });
}

module.exports = {
  openFile: openFile
};

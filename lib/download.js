const spawn = require('child_process').spawn;
const tmp = require('tmp');

function download(url) {
  const filepath = tmp.tmpNameSync();
  const pytube = spawn('python3', ['./download.py', url, filepath]);
  return new Promise((resolve, reject) => {
    pytube.on('exit', () => {
      resolve(filepath);
    });
    pytube.on('error', reject);
  });
}

exports.download = download;

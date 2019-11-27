const tmp = require('tmp');
const ytdl = require('ytdl-core');
const fs = require('fs');

function download(url) {
  const filepath = tmp.tmpNameSync({ postfix: '.mp4' });

  return new Promise((resolve, reject) => {
    ytdl(url, {
      filter: format =>
        format.container === 'mp4' && format.qualityLabel === '720p'
    })
      .pipe(fs.createWriteStream(filepath))
      .on('error', reject)
      .on('close', () => {
        console.log('download complete: ', filepath);
        resolve(filepath);
      });
  });
}

exports.download = download;

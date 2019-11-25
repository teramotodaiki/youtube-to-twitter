const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const spawn = require('child_process').spawn;

function trim(input = '', output = '', start = 0, end = 0) {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn(ffmpegPath, [
      '-ss',
      start + '',
      '-i',
      input,
      '-t',
      end + '',
      output
    ]);
    ffmpeg.on('exit', () => {
      resolve();
    });
    ffmpeg.on('error', reject);
  });
}

exports.trim = trim;

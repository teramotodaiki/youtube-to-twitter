const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const spawn = require('child_process').spawn;
const tmp = require('tmp');

function trim(input, start = 0, end = 0) {
  return new Promise((resolve, reject) => {
    const output = tmp.tmpNameSync({ postfix: '.mp4' });
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
      console.log('trimmed', output);
      resolve(output);
    });
    ffmpeg.on('error', reject);
  });
}

exports.trim = trim;

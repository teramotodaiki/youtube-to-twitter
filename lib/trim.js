const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const spawn = require('child_process').spawn;
const tmp = require('tmp');

function trim(input, start = 0, duration = 0) {
  return new Promise((resolve, reject) => {
    const output = tmp.tmpNameSync({ postfix: '.mp4' });
    const ffmpeg = spawn(ffmpegPath, [
      '-ss',
      start + '',
      '-i',
      input,
      '-t',
      duration + '',
      output
    ]);
    ffmpeg.on('exit', () => {
      console.log('trimmed', output);
      resolve(output);
    });
    ffmpeg.on('error', reject);
    // debug
    ffmpeg.stdout.pipe(process.stdout);
    ffmpeg.stderr.pipe(process.stderr);
  });
}

exports.trim = trim;

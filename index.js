const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const spawn = require('child_process').spawn;

const ffmpeg = spawn(ffmpegPath, [
  '-ss',
  '0',
  '-i',
  './source.mp4',
  '-t',
  '5',
  './output.mp4'
]);
ffmpeg.on('exit', () => {
  console.log('complete!');
});

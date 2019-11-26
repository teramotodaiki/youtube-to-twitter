const download = require('./lib/download').download;
const trim = require('./lib/trim').trim;
const { tweet, upload } = require('./lib/tweet');
const video = require('./lib/video').video;

module.exports = {
  download,
  trim,
  tweet,
  upload,
  video
};

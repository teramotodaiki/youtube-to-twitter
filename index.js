const download = require('./lib/download').download;
const trim = require('./lib/trim').trim;
const { tweet, upload } = require('./lib/tweet');
const getVideos = require('./lib/video').getVideos;

module.exports = {
  download,
  trim,
  tweet,
  upload,
  getVideos
};

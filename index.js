const download = require('./lib/download').download;
const slack = require('./lib/slack').slack;
const trim = require('./lib/trim').trim;
const { tweet, upload } = require('./lib/tweet');
const getVideos = require('./lib/video').getVideos;

module.exports = {
  download,
  slack,
  trim,
  tweet,
  upload,
  getVideos
};

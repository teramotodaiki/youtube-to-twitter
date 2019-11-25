const trim = require('./lib/trim').trim;
const tweet = require('./lib/tweet').tweet;

trim('./source.mp4', './output.mp4', 0, 30)
  .then(() => tweet('./output.mp4', '３０秒の動画のテストです'))
  .catch(err => {
    console.error(err);
  });

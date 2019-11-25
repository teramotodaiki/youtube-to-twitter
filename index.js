const trim = require('./lib/trim').trim;
const tweet = require('./lib/tweet').tweet;

trim('./source.mp4', 0, 30)
  .then(output => tweet(output, '３０秒の動画のテストです'))
  .catch(err => {
    console.error(err);
  });

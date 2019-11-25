const download = require('./lib/download').download;
const trim = require('./lib/trim').trim;
const tweet = require('./lib/tweet').tweet;

download('https://www.youtube.com/watch?v=9cY5m03rPpM')
  .then(source => trim(source, 0, 30))
  .then(output => tweet(output, 'ダウンロードしてアップロードするテストです'))
  .catch(console.error);

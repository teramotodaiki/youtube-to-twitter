const express = require('express');
const download = require('./lib/download').download;
const trim = require('./lib/trim').trim;
const { tweet, upload } = require('./lib/tweet');
const video = require('./lib/video').video;

const app = express();

app.get('/', async (req, res) => {
  res.sendStatus(200);
  main();
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listen on port ${port}`);
});

async function main() {
  const start = parseInt(process.env.VIDEO_START, 10) || 0;
  const duration = parseInt(process.env.VIDEO_DURATION, 10) || 30;

  const { title, url } = await video();
  const status =
    title.replace(/【ハックフォープレイ実況】/, ' #HackforPlay') +
    '\n\nつづきはこちら↓\n' +
    url;
  console.log('next tweet:\n', status);

  const source = await download(url);
  const output = await trim(source, start, start + duration);

  const mediaId = await upload(output);
  await tweet(mediaId, status);
}

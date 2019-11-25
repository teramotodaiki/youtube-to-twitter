const download = require('./lib/download').download;
const trim = require('./lib/trim').trim;
const tweet = require('./lib/tweet').tweet;
const video = require('./lib/video').video;

async function main() {
  const { title, url } = await video();
  const status =
    title.replace(/【ハックフォープレイ実況】/, ' #HackforPlay') +
    '\n\nつづきはこちら↓\n' +
    url;
  const source = await download(url);
  const output = await trim(source, 0, 30);

  await tweet(output, status);
}

main().then(console.log, console.error);

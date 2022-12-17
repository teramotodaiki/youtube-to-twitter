const express = require('express');
const fs = require('fs').promises;
const { download, slack, trim, tweet, upload, getVideos } = require('./index');

const app = express();

app.get('/', async (req, res) => {
  res.sendStatus(200);

  main().then(console.log).catch(console.error);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listen on port ${port}`);
});

async function main() {
  const start = parseInt(process.env.VIDEO_START, 10) || 0;
  const duration = parseInt(process.env.VIDEO_DURATION, 10) || 30;

  let lastError = null; // ひとつもツイート出来なかった場合 Slack に通知する

  try {
    const videos = await getVideos();
    videos.splice(10); // 最大10件までリトライ

    // 直近で紹介していない動画を順番にダウンロードとアップロードを試みる
    for (const { title, url } of videos) {
      let mediaId = '';
      try {
        const source = await download(url);
        const output = await trim(source, start, duration);
        await fs.unlink(source);

        mediaId = await upload(output);
        await fs.unlink(output);
      } catch (error) {
        console.warn(error);
        lastError = error; // エラーを保持して次へ
        continue;
      }

      // アップロードに成功したのでツイートして終了
      const status =
        title.replace(/【ハックフォープレイ実況】/, '') +
        '\n\nつづきはこちら↓\n' +
        url;
      console.log('next tweet:\n', status);
      await tweet(mediaId, status);

      return;
    }

    if (lastError) {
      throw lastError;
    }
  } catch (error) {
    try {
      await slack(error.message);
    } catch (error) {
      console.warn('Failed to send slack webhook!', error);
    }
  }
}

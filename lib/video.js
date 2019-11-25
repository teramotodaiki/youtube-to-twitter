const fetch = require('node-fetch');

require('dotenv').config();

const endpoint = 'https://www.googleapis.com/youtube/v3/playlistItems';
const key = process.env.YOUTUBE_DATA_API_KEY;
const msOfDay = 48 * 60 * 60 * 1000;

async function video(playlistId = 'PLS3yjd7GifuWkG_W8Jg3ZFxu5s8d5zWca') {
  const response = await fetch(
    `${endpoint}?part=snippet,contentDetails,status&playlistId=${playlistId}&key=${key}`
  );
  const json = await response.text();
  const data = JSON.parse(json);
  for (const item of data.items) {
    const {
      snippet: { title },
      contentDetails: { videoId, videoPublishedAt }
    } = item;
    if (!videoPublishedAt) continue; // not published yet
    const sinceFromPublished = Date.now() - Date.parse(videoPublishedAt);
    if (sinceFromPublished > msOfDay) continue; // too old

    return {
      title,
      url: `https://www.youtube.com/watch?v=${videoId}`
    };
  }

  throw new Error('No video found');
}

exports.video = video;

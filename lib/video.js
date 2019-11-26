const fetch = require('node-fetch');
const { timeline, isDupulicated } = require('./timeline');

require('dotenv').config();

const endpoint = 'https://www.googleapis.com/youtube/v3/playlistItems';
const key = process.env.YOUTUBE_DATA_API_KEY;

async function video(playlistId = 'PLS3yjd7GifuWkG_W8Jg3ZFxu5s8d5zWca') {
  const response = await fetch(
    `${endpoint}?part=snippet,contentDetails,status&maxResults=50&playlistId=${playlistId}&key=${key}`
  );
  const json = await response.text();
  const data = JSON.parse(json);

  const tl = await timeline();

  for (const item of data.items) {
    const {
      snippet: { title },
      contentDetails: { videoId, videoPublishedAt }
    } = item;
    if (!videoPublishedAt) continue; // not published yet
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    if (isDupulicated(tl, url)) continue; // already tweeted

    return {
      title,
      url
    };
  }

  throw new Error('No video found');
}

exports.video = video;

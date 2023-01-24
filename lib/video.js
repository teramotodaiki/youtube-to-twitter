const fetch = require('node-fetch');
const { timeline, isDupulicated } = require('./timeline');

require('dotenv').config();

const endpoint = 'https://www.googleapis.com/youtube/v3/playlistItems';
const key = process.env.YOUTUBE_DATA_API_KEY;
const playlist = process.env.YOUTUBE_PLAYLIST_ID;

async function getVideos(playlistId = playlist) {
  const response = await fetch(
    `${endpoint}?part=snippet,contentDetails,status&maxResults=50&playlistId=${playlistId}&key=${key}`,
    {
      headers: {
        Referer: 'https://www.hackforplay.xyz/'
      }
    }
  );
  const json = await response.text();
  const data = JSON.parse(json);

  if (!response.ok) {
    console.error(data.error);
    throw new Error(data.error.message);
  }

  const tl = await timeline();

  // 直近のツイートで紹介していない動画
  const videos = [];
  let notPublishedYet = 0;
  let alreadyTweeted = 0;

  for (const item of data.items) {
    const {
      snippet: { title },
      contentDetails: { videoId, videoPublishedAt }
    } = item;
    if (!videoPublishedAt) {
      notPublishedYet += 1;
      continue; // not published yet
    }
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    if (isDupulicated(tl, url)) {
      alreadyTweeted += 1;
      continue; // already tweeted
    }

    videos.push({
      title,
      url
    });
  }

  if (videos.length === 0) {
    console.log(`fetched ${data.items.length}`);
    console.log(`tweeted ${alreadyTweeted}`);
    console.log(`waiting ${notPublishedYet}`);
    throw new Error('No video found');
  }
  return videos;
}

exports.getVideos = getVideos;

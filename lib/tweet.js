const fs = require('fs').promises;
const Twitter = require('twitter');

require('dotenv').config();
const client = new Twitter({
  consumer_key: process.env.TWITTER_COSUMER_KEY,
  consumer_secret: process.env.TWITTER_COSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_SECRET
});

const chunkSize = 5242880; // Max chunk size of twitter API

exports.client = client;

async function upload(media) {
  const mediaType = 'video/mp4';

  const stat = await fs.stat(media);
  const mediaData = await fs.readFile(media);

  const mediaId = await initUpload(stat.size, mediaType);
  const chunkNum = Math.ceil(mediaData.byteLength / chunkSize);
  if (chunkNum <= 1) {
    await appendUpload(mediaId, mediaData);
  } else {
    for (let index = 0; index < chunkNum; index++) {
      const segment = mediaData.slice(
        index * chunkSize,
        (index + 1) * chunkSize
      );
      await appendUpload(mediaId, segment, index);
    }
  }

  await finalizeUpload(mediaId);
  console.log('waiting upload: ', mediaId);

  await checkComplete(mediaId);
  console.log('complete upload: ', mediaId);

  return mediaId;
}

exports.upload = upload;

async function checkComplete(mediaId) {
  const data = await client.get('media/upload', {
    command: 'STATUS',
    media_id: mediaId
  });
  const {
    processing_info: { error, state, check_after_secs }
  } = data;
  if (error) {
    throw new Error(error.message);
  }
  if (state === 'in_progress' || state === 'pending') {
    await new Promise(resolve => setTimeout(resolve, check_after_secs * 1000));
    return await checkComplete(mediaId);
  }
  if (state !== 'succeeded') {
    console.log(data);
    throw new Error('Unknown error on upload. See above');
  }
}

async function tweet(mediaId, status = '') {
  await makePost('statuses/update', {
    status,
    media_ids: mediaId
  });
  console.log('Successfuly tweeted!');
}

exports.tweet = tweet;

/**
 * ref. https://github.com/desmondmorris/node-twitter/tree/master/examples#chunked-media
 */

/**
 * Step 1 of 3: Initialize a media upload
 * @return Promise resolving to String mediaId
 */
function initUpload(mediaSize, mediaType) {
  return makePost('media/upload', {
    command: 'INIT',
    total_bytes: mediaSize,
    media_category: 'tweet_video', // enable async upload to up 30+ sec video
    media_type: mediaType
  }).then(data => data.media_id_string);
}

/**
 * Step 2 of 3: Append file chunk
 * @param String mediaId    Reference to media object being uploaded
 * @return Promise resolving to String mediaId (for chaining)
 */
function appendUpload(mediaId, mediaData, segmentIndex = 0) {
  return makePost('media/upload', {
    command: 'APPEND',
    media_id: mediaId,
    media: mediaData,
    segment_index: segmentIndex
  }).then(data => mediaId);
}

/**
 * Step 3 of 3: Finalize upload
 * @param String mediaId   Reference to media
 * @return Promise resolving to mediaId (for chaining)
 */
function finalizeUpload(mediaId) {
  return makePost('media/upload', {
    command: 'FINALIZE',
    media_id: mediaId
  }).then(data => mediaId);
}

/**
 * (Utility function) Send a POST request to the Twitter API
 * @param String endpoint  e.g. 'statuses/upload'
 * @param Object params    Params object to send
 * @return Promise         Rejects if response is error
 */
function makePost(endpoint, params) {
  return new Promise((resolve, reject) => {
    client.post(endpoint, params, (error, data, response) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
}

const fs = require('fs').promises;
const Twitter = require('twitter');

require('dotenv').config();
const client = new Twitter({
  consumer_key: process.env.TWITTER_COSUMER_KEY,
  consumer_secret: process.env.TWITTER_COSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_SECRET
});

async function tweet(media, status = '') {
  const mediaType = 'video/mp4';

  const stat = await fs.stat(media);
  const mediaData = await fs.readFile(media);

  const mediaId = await initUpload(stat.size, mediaType);
  await appendUpload(mediaId, mediaData);
  await finalizeUpload(mediaId);
  console.log('uploaded: ', mediaId);

  await makePost('statuses/update', {
    status,
    media_ids: mediaId
  });
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
    media_type: mediaType
  }).then(data => data.media_id_string);
}

/**
 * Step 2 of 3: Append file chunk
 * @param String mediaId    Reference to media object being uploaded
 * @return Promise resolving to String mediaId (for chaining)
 */
function appendUpload(mediaId, mediaData) {
  return makePost('media/upload', {
    command: 'APPEND',
    media_id: mediaId,
    media: mediaData,
    segment_index: 0
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
        console.log(response);
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
}

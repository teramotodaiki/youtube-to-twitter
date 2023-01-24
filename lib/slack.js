require('dotenv').config();
const url = process.env.SLACK_INCOMING_WEBHOOK;
if (!url) {
  console.error('Please set SLACK_INCOMING_WEBHOOK into .env');
}

exports.slack = function slack(text) {
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      username: 'youtube-to-twitter',
      text
    })
  });
};

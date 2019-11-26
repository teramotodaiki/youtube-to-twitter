const client = require('./tweet').client;

function timeline() {
  return client.get('statuses/home_timeline', {
    count: 200,
    trim_user: true,
    exclude_replies: true
  });
}

exports.timeline = timeline;

function isDupulicated(timeline, url) {
  for (const tweet of timeline) {
    const {
      entities: { urls }
    } = tweet;
    if (!Array.isArray(urls) || urls.length < 1) continue;
    for (const { expanded_url } of urls) {
      if (url === expanded_url) {
        return true;
      }
    }
  }
  return false;
}

exports.isDupulicated = isDupulicated;

const { code } = require('../../../util/text');
const { DISCORD_DARK_MODE_BG_COLOR } = require('../color-constants');

module.exports = events => ({
  username: 'Warframe News',
  avatar_url: 'https://i.imgur.com/B3Ropbx.png',
  embeds: events
    .filter(([, event]) => 'en' in event.messages)
    .map(([, event]) => ({
      title: 'News',
      image: {
        url: event.image
      },
      url: event.link,
      color: DISCORD_DARK_MODE_BG_COLOR,
      description: code(event.messages.en),
      timestamp: new Date().toISOString()
    }))
});

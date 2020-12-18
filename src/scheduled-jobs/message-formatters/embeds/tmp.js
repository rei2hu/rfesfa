const { code } = require('../../../util/text');
const { DISCORD_DARK_MODE_BG_COLOR } = require('../color-constants');

module.exports = sfn => ({
  username: 'Sentients Detected',
  avatar_url: 'https://i.imgur.com/CrpduqD.png',
  embeds: sfn.map(([, location]) => ({
    color: DISCORD_DARK_MODE_BG_COLOR,
    title: 'Anomaly',
    description: code(`Sentient anomaly detected at ${location}`, 'haskell'),
    timestamp: new Date().toISOString()
  }))
});

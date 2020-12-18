const { code } = require('../../../util/text');
const { DISCORD_DARK_MODE_BG_COLOR } = require('../color-constants');

module.exports = enemies => ({
  username: 'Acolyte Discovered',
  avatar_url: 'https://i.imgur.com/zCeaLgj.png',
  embeds: enemies.map(([, enemy]) => ({
    color: DISCORD_DARK_MODE_BG_COLOR,
    title: enemy.enemyType,
    description: `${code(
      `Enemy    : ${enemy.enemyType}
Location : ${enemy.lastLocation}
Health   : ${(enemy.health * 100).toFixed(2)}%`,
      'haskell'
    )}`,
    timestamp: new Date(enemy.lastTime).toISOString()
  }))
});

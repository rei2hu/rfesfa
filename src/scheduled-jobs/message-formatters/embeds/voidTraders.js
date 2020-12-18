const { code } = require('../../../util/text');
const { DISCORD_DARK_MODE_BG_COLOR } = require('../color-constants');
const { duration } = require('../../../util/time');

module.exports = traders => ({
  username: 'Void Trader Incoming',
  avatar_url: 'https://i.imgur.com/urI6EKB.png',
  embeds: traders.map(([, trader]) => ({
    color: DISCORD_DARK_MODE_BG_COLOR,
    title: trader.trader,
    description: `${trader.trader} has arrived at ${trader.location}
    ${
      trader.wares.length > 0
        ? `${code(
            // eslint-disable-next-line no-unused-vars
            trader.wares.map(({ name, ducatPrice, creditPrice }) => name).join('\n'),
            'haskell'
          )
            .slice(0, -3)
            .slice(0, 500)}\`\`\``
        : ''
    }
**Duration**: ${duration(trader.startTimestamp, trader.endTimestamp)}`,
    timestamp: new Date(trader.startTimestamp).toISOString()
  }))
});

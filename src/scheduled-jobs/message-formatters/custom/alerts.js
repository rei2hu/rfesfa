const { code } = require('../../../util/text');
const { duration } = require('../../../util/time');
const { DISCORD_DARK_MODE_BG_COLOR } = require('../color-constants');

module.exports = worldstate => ({
  content: '',
  embed: {
    title: 'Alerts',
    color: DISCORD_DARK_MODE_BG_COLOR,
    description: Object.values(worldstate.alerts)
      .map(alert => {
        const rewards = alert.rewards.concat(
          alert.countedRewards.map(
            reward => `${reward.amount > 1 ? `${reward.amount} ` : ''}${reward.item}`
          )
        );
        return code(
          `-- started ${duration(alert.startTimestamp, Date.now())} ago
   Levels   : ${alert.minEnemyLevel} - ${alert.maxEnemyLevel}
   Type     : ${alert.missionType}
   Location : ${alert.location}${
            rewards.length > 0
              ? `
   Rewards  : ${rewards.join(', ')}`
              : ''
          }
   Credits  : ${alert.credits}
-- expires in ${duration(Date.now(), alert.endTimestamp)}`,
          'haskell'
        );
      })
      .join(''),
    timestamp: new Date().toISOString(),
    footer: {
      text: 'Last updated'
    }
  }
});

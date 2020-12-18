const { code } = require('../../../util/text');
const { DISCORD_DARK_MODE_BG_COLOR } = require('../color-constants');
const { duration } = require('../../../util/time');

module.exports = alerts => ({
  username: 'New Alerts',
  avatar_url: 'https://i.imgur.com/Foxrp7u.png',
  embeds: alerts.map(([, alert]) => {
    const rewards = alert.rewards.concat(
      alert.countedRewards.map(
        reward => `${reward.amount > 1 ? `${reward.amount} ` : ''}${reward.item}`
      )
    );
    return {
      title: 'Alert',
      color: DISCORD_DARK_MODE_BG_COLOR,
      description: code(
        `Levels   : ${alert.minEnemyLevel} - ${alert.maxEnemyLevel}
Type     : ${alert.missionType}
Location : ${alert.location}${
          rewards.length > 0
            ? `
Rewards  : ${rewards.join(', ')}`
            : ''
        }
Credits  : ${alert.credits}
Duration : ${duration(alert.startTimestamp, alert.endTimestamp)}`,
        'haskell'
      ),
      timestamp: new Date(alert.startTimestamp).toISOString()
    };
  })
});

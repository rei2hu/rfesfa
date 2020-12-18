const { code } = require('../../../util/text');
const { DISCORD_DARK_MODE_BG_COLOR } = require('../color-constants');
const { duration } = require('../../../util/time');

module.exports = goals => ({
  username: 'New Events',
  avatar_url: 'https://i.imgur.com/ccce8MV.png',
  embeds: goals.map(([, goal]) => ({
    color: DISCORD_DARK_MODE_BG_COLOR,
    title: goal.description,
    description: `${code(
      `Location : ${goal.location}
Rewards  : ${goal.rewards.map(reward => reward.item).join(', ')}${
        goal.credits ? `\nCredits  : ${goal.credits}` : ''
      }
Duration : ${duration(goal.startTimestamp, goal.endTimestamp)}`,
      'haskell'
    )}`,
    timestamp: new Date(goal.startTimestamp).toISOString()
  }))
});

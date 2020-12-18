const { pullId, pullStart, pullEnd } = require('./formatters-util');
const { translate } = require('../../warframe-language-translations');

module.exports = goals =>
  Object.fromEntries(
    goals.map(goal => [
      pullId(goal),
      {
        startTimestamp: pullStart(goal),
        endTimestamp: pullEnd(goal),
        location: goal.Node ? translate(goal.Node) : 'None',
        progress: goal.HealthPct,
        rewards: goal.Reward
          ? goal.Reward.items.map(item => ({
              item: translate(item)
            }))
          : [],
        credits: goal.Reward ? goal.Reward.credits : 0,
        description: translate(goal.Desc)
      }
    ])
  );

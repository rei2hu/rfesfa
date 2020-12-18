const { code } = require('../../../util/text');
const { groupBy } = require('../../../util/util');
const { DISCORD_DARK_MODE_BG_COLOR } = require('../color-constants');

module.exports = invasions => ({
  username: 'New Invasions',
  avatar_url: 'https://i.imgur.com/Ly8BiCo.png',
  embeds: Object.entries(
    groupBy(invasions, ([, invasion]) => {
      const loc = invasion.location.match(/\[(.*?)]/);
      return loc ? loc[1] : loc;
    })
  ).map(([planet, invasionsOnPlanet]) => ({
    title: `${planet} Invasion`,
    color: DISCORD_DARK_MODE_BG_COLOR,
    description: invasionsOnPlanet
      .map(([, invasion]) => {
        const attackerRewards = invasion.attackerRewards
          ? invasion.attackerRewards
              .map(reward => `${reward.amount > 1 ? `${reward.amount} ` : ''}${reward.item}`)
              .join(', ')
          : '';
        const defenderRewards = invasion.defenderRewards
          ? invasion.defenderRewards
              .map(reward => `${reward.amount > 1 ? `${reward.amount} ` : ''}${reward.item}`)
              .join(', ')
          : '';
        return code(
          `Location : ${invasion.location}
Conflict : ${invasion.attackerFaction} vs ${invasion.defenderFaction}
Rewards  : ${
            attackerRewards
              ? defenderRewards
                ? `${attackerRewards} or ${defenderRewards}`
                : attackerRewards
              : defenderRewards || ''
          }`,
          'haskell'
        );
      })
      .join(''),
    timestamp: new Date().toISOString()
  }))
});

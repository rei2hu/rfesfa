const { code } = require('../../../util/text');
const { groupBy } = require('../../../util/util');
const { DISCORD_DARK_MODE_BG_COLOR } = require('../color-constants');

const invasionBarLength = 43;

module.exports = worldstate => ({
  content: '',
  embed: {
    title: 'Invasions',
    color: DISCORD_DARK_MODE_BG_COLOR,
    description: Object.entries(
      groupBy(Object.values(worldstate.invasions), invasion => {
        const loc = invasion.location.match(/\[(.*?)]/);
        return loc ? loc[1] : loc;
      })
    )
      .filter(([, invasionsOnPlanet]) => invasionsOnPlanet.find(invasion => !invasion.completed))
      .map(([, invasionsOnPlanet]) =>
        code(
          `${invasionsOnPlanet
            .filter(invasion => !invasion.completed)
            .map(invasion => {
              const left = invasion.progress + invasion.goal;
              const total = invasion.goal * 2;
              const attackerLength = Math.max(Math.floor((invasionBarLength * left) / total), 0);
              const defenderLength = Math.max(invasionBarLength - 1 - attackerLength, 0);
              const attackerRewards = invasion.attackerRewards
                ? invasion.attackerRewards
                    .map(reward => `${reward.amount > 1 ? `${reward.amount} ` : ''}${reward.item}`)
                    .join(', ')
                : 'nothing';
              const defenderRewards = invasion.defenderRewards
                ? invasion.defenderRewards
                    .map(reward => `${reward.amount > 1 ? `${reward.amount} ` : ''}${reward.item}`)
                    .join(', ')
                : '';
              const node = invasion.location;
              return `${' '.repeat(
                Math.floor((invasionBarLength + 3) / 2 - node.length / 2)
              )}${node}
   [${'0'.repeat(defenderLength)} ${'O'.repeat(attackerLength)}]
${defenderRewards}${
                attackerRewards
                  ? `${' '.repeat(
                      Math.max(
                        invasionBarLength + 3 - attackerRewards.length - defenderRewards.length + 5,
                        0
                      )
                    )}${attackerRewards}`
                  : ''
              }`;
            })
            .join('\n')}`,
          'haskell'
        )
      )
      .join(''),
    timestamp: new Date().toISOString(),
    footer: {
      text: 'Last updated'
    }
  }
});

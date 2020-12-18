const { code } = require('../../../util/text');
const { groupBy } = require('../../../util/util');
const { duration } = require('../../../util/time');
const { DISCORD_DARK_MODE_BG_COLOR } = require('../color-constants');

module.exports = worldstate => ({
  content: '',
  embed: {
    title: 'Active Fissures',
    color: DISCORD_DARK_MODE_BG_COLOR,
    description: Object.entries(
      groupBy(Object.values(worldstate.activeMissions), fissure => fissure.tier)
    )
      .map(([tier, fissures]) =>
        code(
          `{-# ${tier} #-}
${fissures
  .map(
    fissure =>
      `${fissure.missionType.replace(/ /g, '').toLowerCase()}  on  ${
        fissure.location
      } -- ${duration(Date.now(), fissure.endTimestamp)} left`
  )
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

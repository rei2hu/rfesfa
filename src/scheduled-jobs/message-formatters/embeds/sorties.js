const { code } = require('../../../util/text');
const { DISCORD_DARK_MODE_BG_COLOR } = require('../color-constants');
const { duration } = require('../../../util/time');

module.exports = sorties => ({
  username: 'New Sorties',
  avatar_url: 'https://i.imgur.com/qgq28p1.png',
  embeds: sorties.map(([, sortie]) => ({
    color: DISCORD_DARK_MODE_BG_COLOR,
    title: sortie.boss,
    description: `${code(
      sortie.missions
        .map(mission =>
          [
            mission.missionType.padEnd(
              Math.max(...sortie.missions.map(m1 => m1.missionType.length))
            ),
            mission.location.padEnd(Math.max(...sortie.missions.map(m3 => m3.location.length))),
            mission.modifier.padEnd(Math.max(...sortie.missions.map(m2 => m2.modifier.length)))
          ].join('  ')
        )
        .join('\n'),
      'haskell'
    )}
**Duration**: ${duration(sortie.startTimestamp, sortie.endTimestamp)}`,
    timestamp: new Date(sortie.startTimestamp).toISOString()
  }))
});

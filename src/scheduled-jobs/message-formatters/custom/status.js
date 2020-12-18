const { code } = require('../../../util/text');
const { duration } = require('../../../util/time');
const { DISCORD_DARK_MODE_BG_COLOR } = require('../color-constants');

/*
	[{
		name: 'DAY  ',
		duration: 4 * 60 * 60 * 1e3
	}, {
		name: 'night',
		duration: 4 * 60 * 60 * 1e3
	}]
*/
function cycleCalculator(cycles, startSeed) {
  const totalTime = cycles.reduce((a, b) => a + b.duration, 0);
  let progress = (Date.now() - startSeed) % totalTime;
  let i = 0;
  while (progress > 0) {
    progress -= cycles[i].duration;
    i++;
  }
  // i is the time that it will be
  // progress is ms until that thing, although negative
  return {
    nextPhase: cycles[i % cycles.length].name,
    timeUntil: Math.floor(-progress / 60e3)
  };
}

function cycleStr(cycle, seed) {
  switch (cycle) {
    case 'CETUS': {
      const { nextPhase, timeUntil } = cycleCalculator(
        [
          {
            name: 'DAY  ',
            duration: 100 * 60e3
          },
          {
            name: 'night',
            duration: 50 * 60e3
          }
        ],
        seed - 150 * 60e3
      );
      return `${nextPhase} in ${timeUntil} minutes`;
    }
    case 'EARTH': {
      const { nextPhase, timeUntil } = cycleCalculator(
        [
          {
            name: 'DAY  ',
            duration: 4 * 60 * 60e3
          },
          {
            name: 'night',
            duration: 4 * 60 * 60e3
          }
        ],
        0
      );
      return `${nextPhase} in ${timeUntil} minutes`;
    }
    case 'VALLIS': {
      const { nextPhase, timeUntil } = cycleCalculator(
        [
          {
            name: 'WARM ',
            duration: 6 * 60e3 + 40e3
          },
          {
            name: 'cold ',
            duration: 20 * 60e3
          }
        ],
        // weird thing with server so I have to add 60 seconds
        1563338240000 + 60e3
      );
      return `${nextPhase} in ${timeUntil} minutes`;
    }
    case 'CAMBION': {
      const { nextPhase, timeUntil } = cycleCalculator(
        [
          {
            name: 'FASS ',
            duration: 100 * 60e3
          },
          {
            name: 'vome ',
            duration: 50 * 60e3
          }
        ],
        seed - 150 * 60e3
      );
      return `${nextPhase} in ${timeUntil} minutes`;
    }
    default:
      return '';
  }
}

module.exports = worldstate => ({
  content: '',
  embed: {
    title: 'World Status',
    color: DISCORD_DARK_MODE_BG_COLOR,
    description: [
      // darvo
      code(
        `{-# Darvo's Daily Deal #-}
${Object.entries(worldstate.dailyDeals)
  .map(
    ([item, info]) =>
      `    ${item} for ${info.salePrice} (original: ${info.originalPrice})
    ${info.stockLeft} left!
 -- ${duration(worldstate.time, info.endTimestamp)} until over`
  )
  .join('\n')}`,
        'haskell'
      ),
      // sorties
      code(
        `{-# Sorties #-}
${Object.entries(worldstate.sorties)
  .map(
    ([, sortie]) =>
      `    Boss: ${sortie.boss}
${sortie.missions
  .map(mission => `    ${mission.missionType} on ${mission.location} (${mission.modifier})`)
  .join('\n')}
 -- ${duration(worldstate.time, sortie.endTimestamp)} until reset`
  )
  .join('\n')}`,
        'haskell'
      ),
      // environment
      code(
        `{-# Cycles/Rotations #-}
    Cetus  : ${cycleStr(
      'CETUS',
      worldstate.syndicateMissions.find(syndicate => syndicate.Tag === 'CetusSyndicate').Expiry
        .$date.$numberLong
    )}
    Earth  : ${cycleStr('EARTH')}
    Vallis : ${cycleStr('VALLIS')}
    Cambion: ${cycleStr(
      'CAMBION',
      worldstate.syndicateMissions.find(syndicate => syndicate.Tag === 'EntratiSyndicate').Expiry
        .$date.$numberLong
    )}`,
        'haskell'
      ),
      // void traders
      code(
        `{-# Void Traders #-}
${Object.entries(worldstate.voidTraders)
  .map(([, trader]) =>
    trader.wares.length > 0
      ? `    ${trader.trader} has arrived at ${trader.location}
 -- departing in ${duration(worldstate.time, trader.endTimestamp)}`
      : `    ${trader.trader} will arrive at ${trader.location}
 -- arriving in ${duration(worldstate.time, trader.startTimestamp)}`
  )
  .join('\n')}`,
        'haskell'
      ),
      // nightwave
      worldstate.seasonInfo
        ? code(
            `{-# Nightwave: Season ${worldstate.seasonInfo.season}, Phase ${worldstate.seasonInfo
              .phase + 1} #-}
${Object.entries(worldstate.seasonInfo.missions)
  .sort(([, mission1], [, mission2]) => mission1.endTimestamp - mission2.endTimestamp)
  .map(
    ([, mission]) =>
      `    ${mission.challenge.split(' - ')[0]} -- expires in ${duration(
        worldstate.time,
        mission.endTimestamp
      )}`
  )
  .join('\n')}`,
            'haskell'
          )
        : '',
      // goals
      Object.keys(worldstate.goals).length > 0
        ? code(
            `{-# Special Events #-}
${[
  ...Object.entries(worldstate.goals).map(
    ([, goal]) =>
      `    ${goal.description} ${
        goal.progress ? `${(goal.progress * 100).toFixed(2)}% ` : ''
      }-- expires in ${duration(worldstate.time, goal.endTimestamp)}`
  ),
  ...Object.entries(worldstate.persistentEnemies)
    .filter(([, enemy]) => enemy.discovered)
    .map(
      ([, enemy]) =>
        `    ${enemy.enemyType} at ${enemy.lastLocation} (${(enemy.health * 100).toFixed(
          2
        )}% health)`
    )
].join('\n')}`,
            'haskell'
          )
        : ''
    ].join(''),
    timestamp: new Date(worldstate.time).toISOString(),
    footer: {
      text: 'Last updated'
    }
  }
});

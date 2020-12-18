const { code } = require('../../../util/text');
const { DISCORD_DARK_MODE_BG_COLOR } = require('../color-constants');
const { duration } = require('../../../util/time');
const { groupBy } = require('../../../util/util');

module.exports = fissures => ({
  username: 'New Fissures',
  avatar_url: 'https://i.imgur.com/o8KHxdz.png',
  embeds: Object.entries(groupBy(fissures, ([, fissure]) => fissure.tier)).map(
    ([tier, fissuresData]) => ({
      title: `${tier} Fissures`,
      color: DISCORD_DARK_MODE_BG_COLOR,
      description: fissuresData
        .map(([, fissure]) =>
          code(
            `Type     : ${fissure.missionType}
Location : ${fissure.location}
Duration : ${duration(fissure.startTimestamp, fissure.endTimestamp)}`,
            'css'
          )
        )
        .join(''),
      timestamp: new Date().toISOString()
    })
  )
});

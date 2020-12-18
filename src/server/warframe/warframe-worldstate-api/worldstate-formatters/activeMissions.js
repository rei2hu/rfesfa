const { pullId, pullStart, pullEnd } = require('./formatters-util');
const { translate } = require('../../warframe-language-translations');

module.exports = missions =>
  Object.fromEntries(
    missions.map(mission => [
      pullId(mission),
      {
        tier: translate(mission.Modifier),
        region: mission.Region,
        seed: mission.Seed,
        missionType: translate(mission.MissionType),
        location: translate(mission.Node),
        startTimestamp: pullStart(mission),
        endTimestamp: pullEnd(mission)
      }
    ])
  );

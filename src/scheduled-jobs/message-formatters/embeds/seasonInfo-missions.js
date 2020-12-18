const { code } = require('../../../util/text');
const { DISCORD_DARK_MODE_BG_COLOR } = require('../color-constants');
const { duration } = require('../../../util/time');

module.exports = (missions, seasonInfo) => {
  const longestMissionText = Math.max(
    ...missions.map(([, mission]) => mission.challenge.includes(' - ') ? mission.challenge.split(' - ')[1].length : mission.challenge.length)
  );
  return {
    username: 'New Nightwave Missions',
    avatar_url: 'https://i.imgur.com/K3QytHq.png',
    embeds: [
      {
        color: DISCORD_DARK_MODE_BG_COLOR,
        title: `Nightwave: Season ${seasonInfo.season}, Phase ${seasonInfo.phase + 1}`,
        description: missions
          .map(([, mission]) => {
            const [missionTitle, missionDescription] = mission.challenge.split(' - ');
            const timeStr = duration(mission.startTimestamp, mission.endTimestamp);
            if (missionDescription) {
              return code(
                `${' '.padEnd(
                  longestMissionText / 2 - missionTitle.length / 2 - 4
                )}{-# ${missionTitle} #-}
${' '.padEnd(longestMissionText / 2 - missionDescription.length / 2)}${missionDescription}
${' '.padEnd(longestMissionText / 2 - timeStr.length / 2)}${timeStr}`,
                'haskell'
              );
            } else {
              return code(
                `${' '.padEnd(
                  longestMissionText / 2 - missionTitle.length / 2 - 4
                )}{-# ${missionTitle} #-}`, 'haskell',
              );
            }
          })
          .join(''),
        timestamp: new Date().toISOString()
      }
    ]
  };
};

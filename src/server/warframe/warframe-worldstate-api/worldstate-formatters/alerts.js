const { pullId, pullStart, pullEnd } = require('./formatters-util');
const { translate } = require('../../warframe-language-translations');

module.exports = alerts =>
  Object.fromEntries(
    alerts.map(alert => [
      pullId(alert),
      {
        startTimestamp: pullStart(alert),
        endTimestamp: pullEnd(alert),
        location: translate(alert.MissionInfo.location),
        missionType: translate(alert.MissionInfo.missionType),
        faction: translate(alert.MissionInfo.faction),
        difficulty: alert.MissionInfo.difficulty,
        credits: alert.MissionInfo.missionReward.credits,
        rewards: alert.MissionInfo.missionReward.items
          ? alert.MissionInfo.missionReward.items.map(translate)
          : [],
        countedRewards: alert.MissionInfo.missionReward.countedItems
          ? alert.MissionInfo.missionReward.countedItems.map(item => ({
              item: translate(item.ItemType),
              amount: item.ItemCount
            }))
          : [],
        levelOverride: alert.MissionInfo.levelOverride,
        enemySpec: alert.MissionInfo.enemySpec,
        minEnemyLevel: alert.MissionInfo.minEnemyLevel,
        maxEnemyLevel: alert.MissionInfo.maxEnemyLevel,
        description: alert.MissionInfo.descText // description text, cant translate it though
        // maxWaves: alert.MissionInfo.maxWaves, // number of objective completions per mission, might not be applicable for something like exterminate
        // onlyWeapon: alert.MissionInfo.exclusiveWeapon // if you can only use a certain weapon type
      }
    ])
  );

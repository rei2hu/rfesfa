const { pullId, pullStart } = require('./formatters-util');
const { translate } = require('../../warframe-language-translations');

module.exports = invasions =>
  Object.fromEntries(
    invasions.map(invasion => [
      pullId(invasion),
      {
        startTimestamp: pullStart(invasion),
        attackerFaction: translate(invasion.Faction),
        defenderFaction: translate(invasion.DefenderFaction),
        location: translate(invasion.Node),
        progress: invasion.Count,
        goal: invasion.Goal,
        description: invasion.LocTag,
        completed: invasion.Completed,
        attackerRewards: invasion.AttackerReward.countedItems
          ? invasion.AttackerReward.countedItems.map(item => ({
              item: translate(item.ItemType),
              amount: item.ItemCount
            }))
          : [],
        attackerMissionInfo: {
          faction: translate(invasion.AttackerMissionInfo.faction),
          seed: invasion.AttackerMissionInfo.seed
        },
        defenderRewards: invasion.DefenderReward.countedItems
          ? invasion.DefenderReward.countedItems.map(item => ({
              item: translate(item.ItemType),
              amount: item.ItemCount
            }))
          : [],
        defenderMissionInfo: {
          faction: translate(invasion.DefenderMissionInfo.faction),
          seed: invasion.DefenderMissionInfo.seed
        }
      }
    ])
  );

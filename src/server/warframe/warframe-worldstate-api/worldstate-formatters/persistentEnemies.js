const { pullId } = require('./formatters-util');
const { translate } = require('../../warframe-language-translations');

module.exports = enemies =>
  Object.fromEntries(
    enemies.map(enemy => [
      pullId(enemy),
      {
        enemyType: translate(enemy.AgentType),
        rank: enemy.Rank,
        health: enemy.HealthPercent,
        discovered: enemy.Discovered,
        lastLocation: translate(enemy.LastDiscoveredLocation),
        lastTime: +enemy.LastDiscoveredTime.$date.$numberLong,
        ticketing: enemy.UseTicketing,
        fleeDamage: enemy.FleeDamage
      }
    ])
  );

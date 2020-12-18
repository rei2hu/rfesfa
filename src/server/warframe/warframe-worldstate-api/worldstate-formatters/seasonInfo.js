const { pullId, pullStart, pullEnd } = require('./formatters-util');
const { translate } = require('../../warframe-language-translations');

module.exports = seasonInfo => ({
  startTimestamp: pullStart(seasonInfo),
  endTimestamp: pullEnd(seasonInfo),
  affiliation: seasonInfo.AffiliationTag,
  season: seasonInfo.Season,
  phase: seasonInfo.Phase,
  params: seasonInfo.Params,
  missions: Object.fromEntries(
    seasonInfo.ActiveChallenges.map(challenge => [
      pullId(challenge),
      {
        challenge: translate(challenge.Challenge),
        daily: challenge.Daily,
        startTimestamp: pullStart(challenge),
        endTimestamp: pullEnd(challenge)
      }
    ])
  )
});

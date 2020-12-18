const { pullId, pullStart, pullEnd } = require('./formatters-util');
const { translate } = require('../../warframe-language-translations');

module.exports = sorties =>
  Object.fromEntries(
    sorties.map(sortie => [
      pullId(sortie),
      {
        startTimestamp: pullStart(sortie),
        endTimestamp: pullEnd(sortie),
        boss: sortie.Boss,
        seed: sortie.Seed,
        missions: sortie.Variants.map(variant => ({
          missionType: translate(variant.missionType),
          modifier: translate(variant.modifierType),
          location: translate(variant.node),
          tileset: variant.tileset
        }))
      }
    ])
  );

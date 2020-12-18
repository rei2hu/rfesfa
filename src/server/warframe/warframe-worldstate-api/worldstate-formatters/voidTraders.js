const { pullId, pullStart, pullEnd } = require('./formatters-util');
const { translate } = require('../../warframe-language-translations');

module.exports = voidTraders =>
  Object.fromEntries(
    voidTraders.map(trader => [
      pullId(trader),
      {
        startTimestamp: pullStart(trader),
        endTimestamp: pullEnd(trader),
        trader: trader.Character,
        location: translate(trader.Node),
        wares: trader.Manifest
          ? trader.Manifest.map(item => ({
              name: translate(item.ItemType),
              ducatPrice: item.PrimePrice,
              creditPrice: item.RegularPrice
            }))
          : []
      }
    ])
  );

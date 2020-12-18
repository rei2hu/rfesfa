const { pullStart, pullEnd } = require('./formatters-util');
const { translate } = require('../../warframe-language-translations');

module.exports = dailyDeals =>
  Object.fromEntries(
    dailyDeals.map(deal => [
      translate(deal.StoreItem),
      {
        startTimestamp: pullStart(deal),
        endTimestamp: pullEnd(deal),
        originalPrice: deal.OriginalPrice,
        salePrice: deal.SalePrice,
        totalStock: deal.AmountTotal,
        stockLeft: deal.AmountTotal - deal.AmountSold
      }
    ])
  );

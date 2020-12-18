/* eslint-disable no-param-reassign */

// mob rewards format
/*
  Format = Entry+
  Entry = Mob Rest
  Rest = Rewards+ BlankRow
*/

let mob = null;
let baseDropChance = null;

function parseRest(rows, formattedTable) {
  let next = rows.shift();
  // avoid maximum call stack exceeded
  while (!next.includes('blank-row')) {
    const [, item, chance] = next.match(/<td><\/td><td>(.*?)<\/td><td>.*?\((.*?)%\)<\/td>/);
    formattedTable[mob][item] = parseFloat(
      ((parseFloat(chance) * baseDropChance) / 1e2).toFixed(2)
    );
    next = rows.shift();
  }
  // eslint-disable-next-line no-use-before-define
  parseEntry(rows, formattedTable);
}

function parseEntry(rows, formattedTable) {
  if (rows.length === 0) return;
  [, mob, baseDropChance] = rows.shift().match(/<th>(.*?)<\/th>.*?>.*?: (.*?)%</);
  baseDropChance = parseFloat(baseDropChance);
  if (!formattedTable[mob]) formattedTable[mob] = {};
  parseRest(rows, formattedTable);
}

module.exports = parseEntry;

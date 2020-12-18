/* eslint-disable no-param-reassign */

// mission rewards format
/*
  Format = Entry+
  Entry = Mission Rest
  Rest = ((Rotation Rewards)* | Rewards)* BlankRow
*/

let mission = null;
let rotation = null;

function parseRest(rows, formattedTable) {
  let next = rows.shift();
  // avoid maximum call stack exceeded
  // also note that sorties does not end with a blank line
  // for some reason so by adding `next &&` we can let this work
  // for sorties too.
  while (next && !next.includes('blank-row')) {
    if (next.includes('Rotation')) {
      [, rotation] = next.match(/>(.*?)</);
      formattedTable[mission][rotation] = {};
    } else {
      if (!next.match(/<td>(.*?)<\/td><td>.*?\((.*?)%\)<\/td>/)) {
        next = rows.shift();
        continue;
      }
      const [, item, chance] = next.match(/<td>(.*?)<\/td><td>.*?\((.*?)%\)<\/td>/);
      if (rotation) formattedTable[mission][rotation][item] = parseFloat(chance);
      else formattedTable[mission][item] = parseFloat(chance);
    }
    next = rows.shift();
  }
  // eslint-disable-next-line no-use-before-define
  parseEntry(rows, formattedTable);
  /*
    if (next.includes('blank-row')) {
      parseEntry(rows);
    } else if (next.includes('Rotation')) {
      rotation = next;
      formattedTable[mission][rotation] = {};
      parseRest(rows);
    } else {
      const [, item, chance] = next.match(/<td>(.*?)<\/td><td>.*?\((.*?)%\)<\/td>/);
      if (rotation) formattedTable[mission][rotation][item] = chance;
      else formattedTable[mission][item] = chance;
      parseRest(rows);
    }
    */
}

function parseEntry(rows, formattedTable) {
  if (rows.length === 0) return;
  [, mission] = rows.shift().match(/>(.*?)</);
  rotation = '';
  formattedTable[mission] = {};
  parseRest(rows, formattedTable);
}

module.exports = parseEntry;

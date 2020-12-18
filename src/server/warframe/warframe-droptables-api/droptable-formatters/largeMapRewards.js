/* eslint-disable no-param-reassign */

// cetus/solaris rewards format
/*
  Format = Entry+
  Entry = Mission Rest
  Rest = (Rotation (Stage Rewards)+)+ BlankRow
*/

let mission = null;
let rotation = null;
let stage = null;

function parseRest(rows, formattedTable) {
  let next = rows.shift();
  // avoid maximum call stack exceeded
  // also note that sorties does not end with a blank line
  // for some reason so by adding `next &&` we can let this work
  // for sorties too.
  while (next && !next.includes('blank-row')) {
    // instead of rotation, profit-taker missions use "Bounty Completion"
    if (next.includes('Rotation') || next.includes('Completion')) {
      [, rotation] = next.match(/>(.*?)</);
      formattedTable[mission][rotation] = {};
    } else if (next.includes('Stage')) {
      [, stage] = next.match(/<th colspan="2">(.*?)<\/th>/);
      formattedTable[mission][rotation][stage] = {};
    } else {
      const [, item, chance] = next.match(/<td><\/td><td>(.*?)<\/td><td>.*?\((.*?)%\)<\/td>/);
      formattedTable[mission][rotation][stage][item] = parseFloat(chance);
    }
    next = rows.shift();
  }
  // eslint-disable-next-line no-use-before-define
  parseEntry(rows, formattedTable);
}

function parseEntry(rows, formattedTable) {
  if (rows.length === 0) return;
  [, mission] = rows.shift().match(/>(.*?)</);
  rotation = '';
  stage = '';
  formattedTable[mission] = {};
  parseRest(rows, formattedTable);
}

module.exports = parseEntry;

const {
  lang,
  starChart,
  voidFissures,
  missionTypes,
  factions,
  sortieModifiers
} = require('./resources.js');

function translate(str) {
  const matchables = [str, str.replace('/StoreItems', '')];
  for (const match of matchables) {
    // there's some overlap between starChart and the other langs
    if (match in starChart) return starChart[match].name;
    if (match in lang) return lang[match];
    if (match in voidFissures) return voidFissures[match];
    if (match in missionTypes) return missionTypes[match];
    if (match in factions) return factions[match];
    if (match in sortieModifiers) return sortieModifiers[match].split(': ').slice(-1)[0];
  }
  const base = str.split('/').slice(-1)[0];
  return `[ut] ${base[0] + base.slice(1).replace(/([A-Z]+|[0-9]+)/g, ' $1')}`;
}

module.exports = {
  translate
};

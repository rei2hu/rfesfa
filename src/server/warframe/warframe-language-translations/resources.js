const lang = require('./resources/lang');
const manualLang = require('./resources/manual_lang');
const starChart = require('./resources/star_chart');
const voidFissures = require('./resources/void_fissures');
const missionTypes = require('./resources/mission_types');
const factions = require('./resources/factions');
const sortieModifiers = require('./resources/sortie_modifiers');

Object.assign(lang, manualLang);

module.exports = {
  lang,
  starChart,
  voidFissures,
  missionTypes,
  factions,
  sortieModifiers
};

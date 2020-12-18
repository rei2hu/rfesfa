const fetchWorldstate = require('./raw-worldstate');
const formatWorldstate = require('./format-worldstate');
const { PLATFORM_PC } = require('../constants');

async function getFormattedWorldstate(platform = PLATFORM_PC) {
  const rawWorldstate = await fetchWorldstate(platform);
  return formatWorldstate(rawWorldstate);
}

module.exports = getFormattedWorldstate;

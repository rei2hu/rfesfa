const fetch = require('node-fetch');
const { WORLDSTATE_URL, WORLDSTATE_URL_XB1, WORLDSTATE_URL_PS4 } = require('../warframe-constants');
const { PLATFORM_PC, PLATFORM_XB1, PLATFORM_PS4 } = require('../constants');

function fetchWorldstate(platform = PLATFORM_PC) {
  switch (platform) {
    case PLATFORM_PC:
      return fetch(WORLDSTATE_URL).then(res => res.json());
    case PLATFORM_XB1:
      return fetch(WORLDSTATE_URL_XB1).then(res => res.json());
    case PLATFORM_PS4:
      return fetch(WORLDSTATE_URL_PS4).then(res => res.json());
    default:
      throw new Error(`Unexpected platform when fetching worldstate: ${platform}`);
  }
}

module.exports = fetchWorldstate;

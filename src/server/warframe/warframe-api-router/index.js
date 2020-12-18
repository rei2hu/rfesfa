const url = require('url');
const getFormattedWorldstate = require('../warframe-worldstate-api');
const { getDroptables, searchDroptables } = require('../warframe-droptables-api');
const { PLATFORM_PC, PLATFORM_XB1, PLATFORM_PS4 } = require('../constants');

const formattedWorldstate = {};
setInterval(async () => {
  formattedWorldstate[PLATFORM_PC] = await getFormattedWorldstate(PLATFORM_PC);
  formattedWorldstate[PLATFORM_XB1] = await getFormattedWorldstate(PLATFORM_XB1);
}, 60e3);

let dropTables = null;
setInterval(async () => {
  dropTables = await getDroptables();
}, 24 * 60 * 60e3);

let fakeCache = {};
setInterval(() => {
  fakeCache = {};
}, 60e3);

module.exports = async req => {
  if (fakeCache[req.url]) return fakeCache[req.url];

  if (req.url.startsWith('/api/warframe/worldstate')) {
    let {
      query: { platform }
    } = url.parse(req.url, true);
    platform = platform || PLATFORM_PC;
    if (![PLATFORM_PC, PLATFORM_XB1, PLATFORM_PS4].includes(platform)) {
      throw new Error(`Invalid platform type ${platform}`);
    }
    if (req.url === '/api/warframe/worldstate') {
      if (formattedWorldstate[platform]) {
        // eslint-disable-next-line no-return-assign
        fakeCache[req.url] = formattedWorldstate[platform];
      } else {
        // eslint-disable-next-line no-multi-assign
        fakeCache[req.url] = formattedWorldstate[platform] = await getFormattedWorldstate(platform);
      }
      return formattedWorldstate[platform];
    }
    // eslint-disable-next-line no-return-assign
    return (formattedWorldstate[platform] = await getFormattedWorldstate(platform));
  }

  if (req.url.startsWith('/api/warframe/droptables')) {
    const {
      query: { searchTerm, searchForEntry }
    } = url.parse(req.url, true);
    if (!dropTables) dropTables = await getDroptables();
    // eslint-disable-next-line no-return-assign
    return (fakeCache[req.url] = searchDroptables(dropTables, searchTerm, searchForEntry));
  }

  return null;
};

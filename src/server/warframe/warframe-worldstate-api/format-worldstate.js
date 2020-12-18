const { formatKeys } = require('./worldstate-formatters/formatters-util');

function formatWorldstate(worldstate) {
  const keys = Object.keys(worldstate);
  const formattedWorldstate = {};
  keys.forEach(key => {
    try {
      // note that require is not case sensitive for whatever reason
      // but on heroku it is?!
      // eslint-disable-next-line import/no-dynamic-require,global-require
      formattedWorldstate[key] = require(`./worldstate-formatters/${key[0].toLowerCase() +
        key.slice(1)}`)(worldstate[key]);
    } catch (e) {
      if (e.code !== 'MODULE_NOT_FOUND')
        // eslint-disable-next-line no-console
        console.error(e);
    }
  });
  return formatKeys(formattedWorldstate);
}

module.exports = formatWorldstate;

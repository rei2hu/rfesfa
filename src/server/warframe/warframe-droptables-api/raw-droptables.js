const fetch = require('node-fetch');
const { DROPTABLE_URL } = require('../warframe-constants');

function fetchDroptables() {
  return fetch(DROPTABLE_URL).then(res => res.text());
}

module.exports = fetchDroptables;

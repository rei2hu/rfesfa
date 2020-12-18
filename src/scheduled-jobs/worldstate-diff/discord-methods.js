const fetch = require('node-fetch');
const { FETCH_GUILD_ROLES_ENDPOINT } = require('./discord-constants');

if (!process.env.DISCORD_TOKEN) throw new Error('missing environment variable DISCORD_TOKEN');

function fetchRoles(guildId) {
  return fetch(FETCH_GUILD_ROLES_ENDPOINT.replace('{{guildId}}', guildId), {
    headers: {
      authorization: `Bot ${process.env.DISCORD_TOKEN}`
    }
  })
    .then(async res => {
      if (res.ok) return res.json();
      // reject promise
      throw new Error(`Bad response from fetchRoles: ${JSON.stringify(await res.json())}`);
    })
    .then(roles =>
      roles.reduce((obj, guild) => {
        // eslint-disable-next-line no-param-reassign
        obj[guild.id] = guild;
        return obj;
      }, {})
    );
}

module.exports = {
  fetchRoles
};

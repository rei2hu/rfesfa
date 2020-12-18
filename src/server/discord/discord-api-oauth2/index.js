const fetch = require('node-fetch');
const {
  FETCH_USER_GUILDS_ENDPOINT,
  FETCH_USER_INFO_ENDPOINT,
  FETCH_GUILD_CHANNELS_ENDPOINT
} = require('../discord-constants');

if (!process.env.DISCORD_TOKEN) throw new Error('missing environment variable DISCORD_TOKEN');

/**
 * Fetches a user's guilds using their oauth token. If there is an error, returns no guilds
 * @param {string} token
 */
function fetchGuilds(token) {
  return fetch(FETCH_USER_GUILDS_ENDPOINT, {
    headers: {
      authorization: `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(guilds =>
      !('code' in guilds)
        ? guilds.reduce((obj, guild) => {
            // eslint-disable-next-line no-param-reassign
            obj[guild.id] = guild;
            return obj;
          }, {})
        : {}
    )
    .then(guilds =>
      Object.fromEntries(
        Object.entries(guilds).filter(
          ([, guild]) =>
            guild.owner || (guild.permissions & 0x20) > 0 || (guild.permissions & 0x8) > 0
        )
      )
    );
}

// relies on normal discord api
// to fetch channels
async function fetchGuildInfo(token) {
  const filteredUserGuilds = await fetchGuilds(token);
  // filter to guilds they have owner, admin (0x8), or manage guild (0x20) permissions
  const filteredGuildChannelData = Object.fromEntries(
    await Promise.all(
      Object.entries(filteredUserGuilds).map(([guildId, guild]) =>
        fetch(FETCH_GUILD_CHANNELS_ENDPOINT.replace('{{guildId}}', guildId), {
          headers: {
            authorization: `Bot ${process.env.DISCORD_TOKEN}`
          }
        })
          .then(res => res.json())
          .then(channelData => [guildId, guild, channelData])
      )
    )
      // filter out ones that are errors
      .then(data => data.filter(([, , channelData]) => !('code' in channelData)))
      .then(data =>
        data.map(([guildId, guild, channelData]) => {
          // eslint-disable-next-line no-param-reassign
          guild.channels = channelData.reduce((obj, channel) => {
            // eslint-disable-next-line no-param-reassign
            obj[channel.id] = channel;
            return obj;
          }, {});
          return [guildId, guild];
        })
      )
  );
  return filteredGuildChannelData;
}

function fetchUser(token) {
  return fetch(FETCH_USER_INFO_ENDPOINT, {
    headers: {
      authorization: `Bearer ${token}`
    }
  }).then(res => res.json());
}

module.exports = {
  fetchGuilds,
  fetchUser,
  fetchGuildInfo
};

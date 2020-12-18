const url = require('url');
const { fetchGuildInfo, fetchUser } = require('../discord-api-oauth2');

module.exports = async req => {
  const {
    query: { token }
  } = url.parse(req.url, true);
  if (!token)
    return {
      error: 'Missing authorization'
    };

  if (req.url.startsWith('/api/discord/user_guilds?')) {
    return fetchGuildInfo(token);
  }

  if (req.url.startsWith('/api/discord/user?')) {
    return fetchUser(token);
  }

  if (req.url.startsWith('/api/discord/arch_info?')) {
    const guildInfo = await fetchGuildInfo(token);
    const userInfo = await fetchUser(token);
    return {
      guilds: guildInfo,
      user: userInfo
    };
  }
  return null;
};

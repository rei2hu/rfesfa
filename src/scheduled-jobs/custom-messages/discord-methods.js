const fetch = require('node-fetch');

if (!process.env.DISCORD_TOKEN) throw new Error('missing environment variable DISCORD_TOKEN');

function sendMessage(channelId, body) {
  return fetch(`https://discordapp.com/api/channels/${channelId}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bot ${process.env.DISCORD_TOKEN}`
    },
    body: JSON.stringify(body)
  }).then(res => res.json());
}

function editMessage(channelId, messageId, body) {
  return fetch(`https://discordapp.com/api/channels/${channelId}/messages/${messageId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bot ${process.env.DISCORD_TOKEN}`
    },
    body: JSON.stringify(body)
  }).then(res => res.json());
}

module.exports = {
  sendMessage,
  editMessage
};

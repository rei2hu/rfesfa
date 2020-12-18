const fetch = require('node-fetch');
const { getWebhooks, removeWebhooks } = require('./database-query');
const { fetchRoles } = require('./discord-methods');

const mappings = [
  {
    events: new Set(),
    alerts: new Set(),
    sorties: new Set(),
    activeMissions: new Set(),
    invasions: new Set(),
    voidTraders: new Set(),
    'seasonInfo-missions': new Set(),
    goals: new Set(),
    tmp: new Set(),
    persistentEnemies: new Set()
  },
  {
    events: new Set(),
    alerts: new Set(),
    sorties: new Set(),
    activeMissions: new Set(),
    invasions: new Set(),
    voidTraders: new Set(),
    'seasonInfo-missions': new Set(),
    goals: new Set(),
    tmp: new Set(),
    persistentEnemies: new Set()
  },
  {
    events: new Set(),
    alerts: new Set(),
    sorties: new Set(),
    activeMissions: new Set(),
    invasions: new Set(),
    voidTraders: new Set(),
    'seasonInfo-missions': new Set(),
    goals: new Set(),
    tmp: new Set(),
    persistentEnemies: new Set()
  }
];

function dive(mapping, worldstate, filteredWorldstate, platform, firstRun) {
  for (const key in mapping[platform]) {
    const end = key.split('-').reduce((curr, wsKey) => curr ? curr[wsKey] : curr, worldstate);
    if (!end) {
      continue;
    }
    // ids in the worldstate that are new
    // and whose start timestamp have passed (and a small minute lookahead)
    const checkAgainst = Object.entries(end)
      .filter(
        ([, event]) =>
          (!event.time || event.time - 60e3 <= Date.now()) &&
          (!event.startTimestamp || event.startTimestamp - 60e3 <= Date.now()) &&
          (typeof event.discovered === 'undefined' || event.discovered)
      )
      .map(([uid]) => uid);
    const difference = checkAgainst.filter(id => !mapping[platform][key].has(id));
    /* eslint-disable no-param-reassign */
    if (!firstRun) {
      difference.forEach(id => {
        if (!filteredWorldstate[key]) filteredWorldstate[key] = {};
        filteredWorldstate[key][id] = end[id];
      });
    }
    // update the set with the current ids
    mapping[platform][key] = new Set(checkAgainst);
    /* eslint-enable no-param-reassign */
  }
}

const roleStore = {};

module.exports = async (platform, worldstate, first) => {
  const filteredWorldstate = {};
  dive(mappings, worldstate, filteredWorldstate, platform, first);
  // eslint-disable-next-line no-console
  if (Object.keys(filteredWorldstate).length < 1) return;

  let webhooks = await getWebhooks();
  webhooks = webhooks.filter(webhook => webhook.platform === platform);

  const filteredWorldstateString = Object.fromEntries(
    Object.entries(filteredWorldstate).map(([key, value]) => [
      key,
      JSON.stringify(value).toLowerCase()
    ])
  );

  // do it sequentially so we can remove failed webhooks in
  // the middle and avoid trying to send multiple times when
  // one has already failed?
  const failedWebhooks = [];
  const keys = Object.keys(mappings[platform]);
  for (let index = 0; index < keys.length; index++) {
    const key = keys[index];
    if (!(key in filteredWorldstate)) continue;
    // eslint-disable-next-line no-await-in-loop
    const results = await Promise.all(
      webhooks.map(async ({ guildId, pushWebhook, pushOptions, platform: hookPlatform }) => {
        // dont filter if not being sent to
        if (((1 << index) & pushOptions) === 0)
          return { guildId, pushWebhook, pushOptions, passFilter: true };

        // set up the response
        let response = {
          content: JSON.stringify(filteredWorldstate[key])
        };

        try {
          // eslint-disable-next-line global-require, import/no-dynamic-require
          response = require(`../message-formatters/embeds/${key}`)(
            Object.entries(filteredWorldstate[key]),
            worldstate[key.split('-')[0]]
          );
          // eslint-disable-next-line no-empty
        } catch (e) { }

        // get roles for the guild
        let roles = {};
        if (guildId in roleStore && Date.now() - roleStore[guildId].lastUpdated < 2 * 60e3) {
          roles = roleStore[guildId].roles;
        } else {
          try {
            roles = await fetchRoles(guildId);
            roleStore[guildId] = {
              roles,
              lastUpdated: Date.now()
            };
          } catch (e) {
            // eslint-disable-next-line no-console
            console.error(guildId, e.message); // probably a ratelimit?
          }
        }

        // find out what roles to stick to the content of the response
        response.content =
          (response.content || '') +
          Object.values(roles)
            .filter(role => role.name.match(/^(arch|wf)-/i))
            .filter(role =>
              filteredWorldstateString[key].includes(
                role.name.replace(/^(arch|wf)-/gi, '').toLowerCase()
              )
            )
            .map(role => `<@&${role.id}>`)
            .join('');

        return fetch(pushWebhook, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(response)
        })
          .then(res => ({
            guildId,
            pushWebhook,
            pushOptions,
            // 429 is rate limited, 400 is bad request (like 2000 char limit)
            passFilter: res.ok || res.status === 429 || res.status === 400
          }))
          .catch(() => ({
            platform: hookPlatform,
            guildId,
            pushWebhook,
            pushOptions,
            passFilter: false
          }));
      })
    );
    webhooks = [];
    for (const { passFilter, ...webhook } of results) {
      if (passFilter) webhooks.push(webhook);
      else failedWebhooks.push(webhook);
    }
  }

  // delete webhooks that failed
  await removeWebhooks(failedWebhooks);
};

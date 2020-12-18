const database = require('../../server/database/database-api-methods/connection');
const { transformKeys } = require('../../server/database/database-api-methods');

function getWebhooks() {
  return database
    .query(
      `select 
        guildid,
        pushwebhook,
        pushoptions,
        platform
      from
        archguilds
      where
        pushwebhook is not null`
    )
    .then(res => res.rows.map(row => transformKeys(row)));
}

function removeWebhooks(webhooks) {
  return database
    .query(
      `update 
        archguilds
       set
        pushwebhook=null
       where 
        pushwebhook=any($1)`,
      [webhooks.map(({ pushWebhook }) => pushWebhook)]
    )
    .then(res => res.rowCount);
}

module.exports = {
  getWebhooks,
  removeWebhooks
};

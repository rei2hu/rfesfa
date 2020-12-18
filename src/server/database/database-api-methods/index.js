const database = require('./connection');
const { fetchGuilds } = require('../../discord/discord-api-oauth2');

const mapping = {
  guildid: 'guildId',
  alertchannelid: 'alertChannel',
  invasionchannelid: 'invasionChannel',
  statuschannelid: 'statusChannel',
  fissurechannelid: 'fissureChannel',
  pushwebhook: 'pushWebhook',
  pushoptions: 'pushOptions',
  commandprefix: 'commandPrefix',
  roleprefix: 'rolePrefix',
  alertmessageid: 'alertMessage',
  invasionmessageid: 'invasionMessage',
  statusmessageid: 'statusMessage',
  fissuremessageid: 'fissureMessage'
};

// const valueMapping = {
//   platform: [PLATFORM_PC, PLATFORM_XB1, PLATFORM_PS4]
// };

function transformKeys(obj) {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [mapping[key] || key, value])
  );
}

function getGuildData(id) {
  return database
    .query(
      `select
        *
      from
        ArchGuilds
      where
        GuildID = $1
      limit
        1`,
      [id]
    )
    .then(res =>
      res.rows.length > 0
        ? transformKeys(res.rows[0])
        : {
            default: true,
            guildId: id,
            alertChannel: null,
            invasionChannel: null,
            statusChannel: null,
            fissureChannel: null,
            pushWebhook: null,
            pushOptions: 0,
            commandPrefix: null,
            rolePrefix: null,
            platform: 0
          }
    )
    .catch(() => {
      return { error: 'Database query error, check logs' };
    });
}

async function setGuildData(id, token, data) {
  // only allow updating things without token if data sent only contains commandPrefix
  if (Object.keys(data).some(column => column !== 'commandPrefix') && !token) {
    return {
      error: 'Missing auth'
    };
  }
  // if you don't have access to this guild
  if (!(id in (await fetchGuilds(token)))) {
    return {
      error: 'Invalid auth'
    };
  }
  const guildData = await getGuildData(id);
  const {
    alertChannel = null,
    invasionChannel = null,
    statusChannel = null,
    fissureChannel = null,
    pushWebhook = null,
    pushOptions = 0,
    commandPrefix = null,
    rolePrefix = null,
    platform = 0
  } = { ...guildData, ...data };
  // if guild entry doesn't exist
  if (guildData.default) {
    return (
      database
        .query(`insert into ArchGuilds values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`, [
          id,
          alertChannel,
          invasionChannel,
          statusChannel,
          fissureChannel,
          pushWebhook,
          pushOptions,
          commandPrefix,
          rolePrefix,
          platform
        ])
        .then(() => ({ result: 'success1' }))
        // eslint-disable-next-line no-console
        .catch(err => console.log(err) || { result: 'failure1' })
    );
  }
  return (
    database
      .query(
        `update
        ArchGuilds
      set 
        AlertChannelID=$2,
        InvasionChannelID=$3,
        StatusChannelId=$4,
        FissureChannelId=$5,
        PushWebhook=$6,
        PushOptions=$7,
        CommandPrefix=$8,
        RolePrefix=$9,
        Platform=$10
      where
        GuildID=$1`,
        [
          id,
          alertChannel,
          invasionChannel,
          statusChannel,
          fissureChannel,
          pushWebhook,
          pushOptions,
          commandPrefix,
          rolePrefix,
          platform
        ]
      )
      .then(() => ({ result: 'success2' }))
      // eslint-disable-next-line no-console
      .catch(err => console.error(err) || { result: 'failure2' })
  );
}

module.exports = {
  getGuildData,
  setGuildData,
  transformKeys
};

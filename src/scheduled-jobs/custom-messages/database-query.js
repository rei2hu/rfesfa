const database = require('../../server/database/database-api-methods/connection');
const { transformKeys } = require('../../server/database/database-api-methods');

function getPostChannelsAndMessages() {
  return database
    .query(
      `select
        AG.guildid as guildid,
        AG.alertchannelid as alertchannelid,
        AG.invasionchannelid as invasionchannelid,
        AG.statuschannelid as statuschannelid,
        AG.fissurechannelid as fissurechannelid,
        AG.platform as platform,
        AAM.messageid as alertmessageid,
        AIM.messageid as invasionmessageid,
        ASM.messageid as statusmessageid,
        AFM.messageid as fissuremessageid
      from
        archguilds as AG
        left join
          archalertmessages as AAM
        on
          AG.alertchannelid = AAM.channelid
        left join
          archinvasionmessages as AIM
        on
          AG.invasionchannelid = AIM.channelid
        left join
          archstatusmessages as ASM
        on
          AG.statuschannelid = ASM.channelid
        left join
          archfissuremessages as AFM
        on
          AG.fissurechannelid = AFM.channelid
      where
        AG.alertchannelid != 0 or
        AG.invasionchannelid != 0 or
        AG.statuschannelid != 0 or
        AG.fissurechannelid != 0
      `
    )
    .then(res => res.rows.map(row => transformKeys(row)));
}

function insertInvasionMessage(invasionChannelId, messageId) {
  return database.query(
    `insert into
      archinvasionmessages
    values
      ($1, $2)`,
    [messageId, invasionChannelId]
  );
}

function removeInvasionMessage(messageId) {
  return database
    .query(
      `delete from
        archinvasionmessages
      where
        messageid = $1`,
      [messageId]
    )
    .then(res => res.rowCount);
}

function resetInvasionChannel(channelId) {
  return database.query(
    `update
      archguilds
    set
      invasionchannelid = null
    where
      invasionchannelid = $1`,
    [channelId]
  );
}

function insertAlertMessage(alertChannelId, messageId) {
  return database.query(
    `insert into
      archalertmessages
    values
      ($1, $2)`,
    [messageId, alertChannelId]
  );
}

function removeAlertMessage(messageId) {
  return database
    .query(
      `delete from
        archalertmessages
      where
        messageid = $1`,
      [messageId]
    )
    .then(res => res.rowCount);
}

function resetAlertChannel(channelId) {
  return database.query(
    `update
      archguilds
    set
      alertchannelid = null
    where
      alertchannelid = $1`,
    [channelId]
  );
}

function insertStatusMessage(statusChannelId, messageId) {
  return database.query(
    `insert into
      archstatusmessages
    values
      ($1, $2)`,
    [messageId, statusChannelId]
  );
}

function removeStatusMessage(messageId) {
  return database
    .query(
      `delete from
        archstatusmessages
      where
        messageid = $1`,
      [messageId]
    )
    .then(res => res.rowCount);
}

function resetStatusChannel(channelId) {
  return database.query(
    `update
      archguilds
    set
      statuschannelid = null
    where
      statuschannelid = $1`,
    [channelId]
  );
}

function insertFissureMessage(fissureChannelId, messageId) {
  return database.query(
    `insert into
      archfissuremessages
    values
      ($1, $2)`,
    [messageId, fissureChannelId]
  );
}

function removeFissureMessage(messageId) {
  return database
    .query(
      `delete from
        archfissuremessages
      where
        messageid = $1`,
      [messageId]
    )
    .then(res => res.rowCount);
}

function resetFissureChannel(channelId) {
  return database.query(
    `update
      archguilds
    set
      fissurechannelid = null
    where
      fissurechannelid = $1`,
    [channelId]
  );
}

function removeGuildEntry(guildId) {
  return database
    .query(
      `delete from
        archguilds
      where
        guildid = $1`,
      [guildId]
    )
    .then(res => res.rowCount);
}

module.exports = {
  getPostChannelsAndMessages,
  insertInvasionMessage,
  removeInvasionMessage,
  resetInvasionChannel,
  insertAlertMessage,
  removeAlertMessage,
  resetAlertChannel,
  insertFissureMessage,
  removeFissureMessage,
  resetFissureChannel,
  insertStatusMessage,
  removeStatusMessage,
  resetStatusChannel,
  removeGuildEntry
};

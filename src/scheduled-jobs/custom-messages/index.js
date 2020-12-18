const alerts = require('../message-formatters/custom/alerts');
const invasions = require('../message-formatters/custom/invasions');
const status = require('../message-formatters/custom/status');
const fissure = require('../message-formatters/custom/fissure');
const { sleep } = require('../../util/util');

const {
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
} = require('./database-query');
const {
  UNKNOWN_CHANNEL,
  UNKNOWN_GUILD,
  UNKNOWN_MESSAGE,
  MISSING_ACCESS,
  MISSING_PERMISSIONS
} = require('./discord-constants');
const { sendMessage, editMessage } = require('./discord-methods');

module.exports = async (platform, worldstate) => {
  const alertMessageContent = alerts(worldstate);
  const invasionMessageContent = invasions(worldstate);
  const statusMessageContent = status(worldstate);
  const fissureMessageContent = fissure(worldstate);

  const guildSettings = await getPostChannelsAndMessages();

  for (const {
    guildId,
    alertChannel,
    invasionChannel,
    statusChannel,
    fissureChannel,
    alertMessage,
    invasionMessage,
    statusMessage,
    fissureMessage,
    platform: gPlatform
  } of guildSettings) {
    // eslint-disable-next-line eqeqeq
    if (platform != gPlatform) continue;

    /* eslint-disable no-await-in-loop */
    let response;

    if (alertChannel) {
      if (alertMessage) {
        response = await editMessage(alertChannel, alertMessage, alertMessageContent);
      } else {
        response = await sendMessage(alertChannel, alertMessageContent);
        if (response.id) {
          insertAlertMessage(alertChannel, response.id);
        }
      }
      if (response.code === UNKNOWN_MESSAGE) {
        removeAlertMessage(alertMessage);
      } else if (response.code === UNKNOWN_GUILD) {
        removeGuildEntry(guildId);
      } else if (
        response.code === UNKNOWN_CHANNEL ||
        response.code === MISSING_PERMISSIONS ||
        response.code === MISSING_ACCESS
      ) {
        resetAlertChannel(alertChannel);
      } else if (response.retry_after) {
        await sleep(response.retry_after + 100);
      }
    }

    if (invasionChannel) {
      if (invasionMessage) {
        response = await editMessage(invasionChannel, invasionMessage, invasionMessageContent);
      } else {
        response = await sendMessage(invasionChannel, invasionMessageContent);
        if (response.id) {
          insertInvasionMessage(invasionChannel, response.id);
        }
      }
      if (response.code === UNKNOWN_MESSAGE) {
        removeInvasionMessage(invasionMessage);
      } else if (response.code === UNKNOWN_GUILD) {
        removeGuildEntry(guildId);
      } else if (
        response.code === UNKNOWN_CHANNEL ||
        response.code === MISSING_PERMISSIONS ||
        response.code === MISSING_ACCESS
      ) {
        resetInvasionChannel(invasionChannel);
      } else if (response.retry_after) {
        await sleep(response.retry_after + 100);
      }
    }

    if (statusChannel) {
      if (statusMessage) {
        response = await editMessage(statusChannel, statusMessage, statusMessageContent);
      } else {
        response = await sendMessage(statusChannel, statusMessageContent);
        if (response.id) {
          insertStatusMessage(statusChannel, response.id);
        }
      }
      if (response.code === UNKNOWN_MESSAGE) {
        removeStatusMessage(statusMessage);
      } else if (response.code === UNKNOWN_GUILD) {
        removeGuildEntry(guildId);
      } else if (
        response.code === UNKNOWN_CHANNEL ||
        response.code === MISSING_PERMISSIONS ||
        response.code === MISSING_ACCESS
      ) {
        resetStatusChannel(statusChannel);
      } else if (response.retry_after) {
        await sleep(response.retry_after + 100);
      }
    }

    if (fissureChannel) {
      if (fissureMessage) {
        response = await editMessage(fissureChannel, fissureMessage, fissureMessageContent);
      } else {
        response = await sendMessage(fissureChannel, fissureMessageContent);
        if (response.id) {
          insertFissureMessage(fissureChannel, response.id);
        }
      }
      if (response.code === UNKNOWN_MESSAGE) {
        removeFissureMessage(fissureMessage);
      } else if (response.code === UNKNOWN_GUILD) {
        removeGuildEntry(guildId);
      } else if (
        response.code === UNKNOWN_CHANNEL ||
        response.code === MISSING_PERMISSIONS ||
        response.code === MISSING_ACCESS
      ) {
        resetFissureChannel(fissureChannel);
      } else if (response.retry_after) {
        await sleep(response.retry_after + 100);
      }
    }

    /* eslint-enable no-await-in-loop */
  }
};

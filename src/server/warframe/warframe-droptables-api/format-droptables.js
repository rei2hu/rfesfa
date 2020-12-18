const parseMissions = require('./droptable-formatters/missionRewards');
const parseBounties = require('./droptable-formatters/largeMapRewards');
const parseEnemies = require('./droptable-formatters/mobRewards');

function formatDroptables(droptablesHtml) {
  const formattedTable = {};
  const tablesRegex = /<h3 id="(.*?)">.*?<\/h3><table>(.*?)<\/table>/g;
  let tableMatch = null;

  // eslint-disable-next-line no-cond-assign
  while ((tableMatch = tablesRegex.exec(droptablesHtml))) {
    const [, tableType, tableContent] = tableMatch;
    // <tr>
    // <tr id=...>
    // <tr class=...>
    // </tr><tr id=...>
    // </tr><tr class=...>
    // </tr>
    const rows = tableContent.split(
      /<tr(?: (?:class|id)=(?:.*?))?>|<\/tr><tr(?: (?:class|id)=(?:.*?))?>|<\/tr>/g
    );
    rows.shift(); // get rid of blank at beginning
    rows.pop(); // and at the end
    if (tableType.includes('ByDrop')) continue;
    if (
      [
        'missionRewards',
        'relicRewards',
        'keyRewards',
        'transientRewards',
        'sortieRewards'
      ].includes(tableType)
    ) {
      parseMissions(rows, formattedTable);
    } else if (['solarisRewards', 'cetusRewards'].includes(tableType)) {
      parseBounties(rows, formattedTable);
    } else if (
      [
        'modByAvatar',
        'blueprintByAvatar',
        'resourceByAvatar',
        'sigilByAvatar',
        'additionalItemByAvatar'
      ].includes(tableType)
    ) {
      parseEnemies(rows, formattedTable);
    }
  }
  return formattedTable;
}

module.exports = formatDroptables;

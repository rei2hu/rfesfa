const fs = require('fs');

// guildid
// alertchannelid
// invasionchannelid
// statuschannelid
// fissurechannelid
// pushchannelid
// prefix
const csv = fs.readFileSync('./guild_data.csv', 'utf8');
const data = csv
  .split('\n')
  .map(row => row.split(','))
  .filter(d => d.length === 8 || d.length === 9 || d.length === 10)
  .filter(d => {
    switch (d.length) {
      case 8:
        return d[1] || d[2] || d[3] || d[4] || d[5] || d[6];
      default:
        return true;
    }
  })
  // guild, alert, invasion, status, channel, pushhook, pushoptions, commandprefix, roleprefix
  .map(d => {
    switch (d.length) {
      case 8:
        return `${d[0]},${d[1]},${d[2]},${d[3]},${d[4]},,,${d[6]},`;
      case 9:
        return `${d[0]},${d[1]},${d[2]},${d[3]},${d[4]},,,",",`;
      case 10:
        return `${d[0]},${d[1]},${d[2]},${d[3]},${d[4]},,,",,",`;
      default:
        return '';
    }
  });
fs.writeFileSync('./guild_data_transformed.csv', data.join('\n'));

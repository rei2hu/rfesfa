const SEC_DUR = 1000;
const MIN_DUR = SEC_DUR * 60;
const HOUR_DUR = MIN_DUR * 60;
const DAY_DUR = HOUR_DUR * 24;

/* eslint-disable no-param-reassign */
function format(ms) {
  let str = '';
  if (ms > DAY_DUR) {
    // days
    str += `${Math.floor(ms / DAY_DUR)}d `;
    ms %= DAY_DUR;
  }
  if (ms > HOUR_DUR) {
    // hours
    str += `${Math.floor(ms / HOUR_DUR)}h `;
    ms %= HOUR_DUR;
  }
  // if (ms > MIN_DUR) { // minutes
  str += `${Math.floor(ms / MIN_DUR)}m`;
  // }
  return str;
}
/* eslint-enable no-param-reassign */

function duration(start, end) {
  return format(end - start);
}

module.exports = {
  duration,
  format
};

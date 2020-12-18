const fetch = require('node-fetch');
const worldstateDiff = require('./worldstate-diff');
const customMessages = require('./custom-messages');
const { PLATFORM_PC, PLATFORM_XB1, PLATFORM_PS4 } = require('../server/warframe/constants');

if (!process.env.BASE_URL) throw new Error('missing environment variable BASE_URL');
if (!process.env.PORT) throw new Error('missing environment variable PORT');

async function executeAndSchedule(fn, time) {
  const started = Date.now();
  await fn();
  const elapsed = Date.now() - started;
  const timeToNext = time - elapsed;
  setTimeout(executeAndSchedule, timeToNext, fn, time);
}

let firstRun = true;

setTimeout(
  executeAndSchedule,
  10e3,
  async () => {
    // eslint-disable-next-line no-console
    const platforms = [PLATFORM_PC, PLATFORM_XB1, PLATFORM_PS4];
    for (let i = 0; i < 3; i++) {
      /* eslint-disable no-console, no-await-in-loop */
      const worldstate = await fetch(
        `${process.env.BASE_URL}:${process.env.PORT}/api/warframe/worldstate?platform=${platforms[i]}`
      ).then(res => res.json());

      await worldstateDiff(i, worldstate, firstRun).catch(console.error);
      await new Promise(resolve => setTimeout(resolve, 10000));
      await customMessages(i, worldstate).catch(console.error);
      await new Promise(resolve => setTimeout(resolve, 10000));
      /* eslint-enable no-console, no-await-in-loop */
    }
    firstRun = false;
  },
  60e3
);

function groupBy(arr, fn) {
  return arr.reduce((obj, curr) => {
    const key = fn(curr);
    // eslint-disable-next-line no-param-reassign
    if (!(key in obj)) obj[key] = [];
    obj[key].push(curr);
    return obj;
  }, {});
}

async function trueInterval(fn, timeout, instant, ...args) {
  if (instant) await fn().catch(() => {});
  // eslint-disable-next-line no-constant-condition
  while (1)
    // eslint-disable-next-line no-await-in-loop
    await new Promise(resolve =>
      setTimeout(
        () => {
          const result = fn();
          if (result instanceof Promise) result.then(resolve).catch(resolve);
          resolve();
        },
        timeout,
        ...args
      )
    );
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
  groupBy,
  trueInterval,
  sleep
};

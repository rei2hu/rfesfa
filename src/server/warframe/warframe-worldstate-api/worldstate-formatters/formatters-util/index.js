function pullId(obj) {
  // eslint-disable-next-line no-underscore-dangle
  return obj._id.$oid;
}

function formatKey(key) {
  return key[0].toLowerCase() + key.slice(1);
}

function formatKeys(obj) {
  return Object.fromEntries(Object.entries(obj).map(([key, value]) => [formatKey(key), value]));
}

function pullStart(obj) {
  return +obj.Activation.$date.$numberLong;
}

function pullEnd(obj) {
  return +obj.Expiry.$date.$numberLong;
}

module.exports = {
  pullId,
  formatKeys,
  pullStart,
  pullEnd
};

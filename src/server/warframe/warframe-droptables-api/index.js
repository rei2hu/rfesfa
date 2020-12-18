const fetchDroptables = require('./raw-droptables');
const formatDroptables = require('./format-droptables');

async function getDroptables() {
  const rawDroptables = await fetchDroptables();
  return formatDroptables(rawDroptables);
}

// the lower the score is, the more letters
// the words have in common
function stringSimilarity(str1, str2) {
  const arr = Array(26).fill(0);
  [str1, str2].forEach((str, i) =>
    str
      .replace(/[^a-z]/gi, '')
      .toLowerCase()
      .split('')
      .forEach(
        // eslint-disable-next-line no-return-assign
        ch => (arr[ch.charCodeAt(0) - 97] += i === 0 ? -1 : 1)
      )
  );
  return arr.reduce((total, diff) => total + Math.abs(diff), 0);
}

function recursiveDive(obj, searchTerm, save, scores, ...keys) {
  Object.entries(obj).forEach(([key, value]) => {
    if (typeof value !== 'object') {
      if (key.toLowerCase().includes(searchTerm)) {
        let assignment = save;
        for (const k of keys) {
          if (!assignment[k]) assignment[k] = {};
          assignment = assignment[k];
        }
        assignment[key] = value;
      } else if (!scores[key]) {
        // eslint-disable-next-line no-param-reassign
        scores[key] = stringSimilarity(key, searchTerm);
      }
    } else {
      recursiveDive(obj[key], searchTerm, save, scores, ...keys, key);
    }
  });
}

async function searchDroptables(table, searchTerm, searchForEntry) {
  if (searchForEntry) {
    const matches = [];
    const scores = {};
    Object.entries(table).forEach(([key, value]) => {
      if (key.toLowerCase().includes(searchTerm.toLowerCase())) {
        matches.push([key, value]);
      } else if (!scores[key]) {
        scores[key] = stringSimilarity(key, searchTerm);
      }
    });

    return {
      result: Object.fromEntries(matches),
      suggestions: Object.entries(scores)
        .sort((a, b) => a[1] - b[1])
        .slice(0, 10)
        .map(score => score[0])
    };
  }
  const match = {};
  const scores = {};
  recursiveDive(table, searchTerm.toLowerCase(), match, scores);

  return {
    result: match,
    suggestions: Object.entries(scores)
      .sort((a, b) => a[1] - b[1])
      .slice(0, 10)
      .map(score => score[0])
  };
}

module.exports = {
  getDroptables,
  searchDroptables
};

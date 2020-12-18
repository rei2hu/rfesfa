function code(text, type = '') {
  // eslint-disable-next-line prefer-template
  return '```' + type + '\n' + text + '```';
}

module.exports = {
  code
};

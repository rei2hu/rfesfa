const url = require('url');
const { getGuildData, setGuildData } = require('../database-api-methods');

module.exports = req => {
  if (req.url.startsWith('/api/db/arch/update?')) {
    if (req.method !== 'POST') {
      return {
        error: 'This endpoint only accepts POST requests'
      };
    }
    const {
      query: { id, token }
    } = url.parse(req.url, true);
    if (!id)
      return {
        error: 'Missing id'
      };
    return new Promise(resolve => {
      let body = '';
      req.on('data', data => {
        body += data;
        if (body.length > 1e6) resolve({ error: 'Body too large' });
      });
      req.on('end', async () => {
        try {
          body = JSON.parse(body);
        } catch (e) {
          resolve({ error: 'Malformed body' });
        }
        resolve(setGuildData(id, token, body));
      });
    });
  }

  if (req.url.startsWith('/api/db/arch/get?')) {
    const {
      query: { id }
    } = url.parse(req.url, true);
    if (!id)
      return {
        error: 'Missing id'
      };
    return getGuildData(id);
  }

  return null;
};

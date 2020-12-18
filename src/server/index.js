const http = require('http');

const warframeApi = require('./warframe/warframe-api-router');
const discordApi = require('./discord/discord-api-router');
const databaseApi = require('./database/database-api-router');
const serveStatic = require('./webserver/static-file-router');

if (!process.env.PORT) throw new Error('missing environment variable PORT');

const server = http.createServer(async (req, res) => {
  try {
    let response = null;
    if (req.url.startsWith('/api/warframe/')) {
      response = await warframeApi(req);
      res.writeHead(response ? 200 : 404, {
        'Content-Type': 'application/json'
      });
    } else if (req.url.startsWith('/api/discord/')) {
      response = await discordApi(req);
      res.writeHead(response ? 200 : 404, {
        'Content-Type': 'application/json'
      });
    } else if (req.url.startsWith('/api/db')) {
      response = await databaseApi(req);
      res.writeHead(response ? 200 : 404, {
        'Content-Type': 'application/json'
      });
    } else {
      const fileData = await serveStatic(req);
      const { headers } = fileData;
      response = fileData.response;
      res.writeHead(response ? 200 : 404, {
        'Content-Type': 'application/json',
        ...headers
      });
    }
    if (response && !(response instanceof Buffer) && response instanceof Object)
      response = JSON.stringify(response);
    res.write(response || JSON.stringify({ error: 'Nothing found' }));
  } catch (e) {
    res.writeHead(500, {
      'Content-Type': 'application/json'
    });
    res.write(JSON.stringify({ error: e.message }));
  } finally {
    res.end();
  }
});

server.listen(process.env.PORT);

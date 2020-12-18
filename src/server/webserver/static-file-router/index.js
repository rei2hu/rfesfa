const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const obfus = require('javascript-obfuscator');
const uglify = require('uglify-js');

const jsBmpPacker = require('js-bmp-packer');

const promReadFile = promisify(fs.readFile);
const cache = {
  '/': {
    response: fs.readFileSync(path.join(__dirname, '..', 'html', 'index.html')),
    headers: { 'Content-Type': 'text/html' }
  }
};

async function packageJavascript(scriptLocation, url) {
  const newDayTimestamp = Math.ceil(Date.now() / 8.64e7) * 8.64e7;
  const base = path.basename(scriptLocation, '.js');
  const buf = await Promise.all([
    promReadFile(path.join(path.dirname(scriptLocation), `${base}.bmp`)),
    promReadFile(scriptLocation)
  ]).then(([image, script]) => {
    const uglified = uglify.minify(
      obfus
        .obfuscate(script, {
          compact: true,
          disableConsoleOutput: true,
          identifierNamesGenerator: 'hexadecimal',
          stringArray: true,
          stringArrayEncoding: 'base64',
          stringArrayThreshold: 0.75,
          transformObjectKeys: true,
          unicodeEscapeSequence: true
        })
        .getObfuscatedCode(),
      { toplevel: false }
    );
    return jsBmpPacker(image, Buffer.from(uglified.code));
  });

  // eslint-disable-next-line no-return-assign
  return (cache[url] = {
    response: buf,
    headers: {
      'Cache-Control': 'public;max-age=86400',
      Expires: new Date(newDayTimestamp).toUTCString(),
      'Content-Type': 'image'
    }
  });
}

module.exports = req => {
  try {
    if (cache[req.url]) return cache[req.url];
    let location;
    const folder = ['html', 'js', 'etc'].find(dir => {
      location = path.join(__dirname, '..', dir, `${req.url}.${dir}`);
      return fs.existsSync(location);
    });
    if (folder) {
      if (folder === 'js') return packageJavascript(location, req.url);
      const data = fs.readFileSync(
        path.join(__dirname, '..', folder, `${req.url}.${folder}`),
        'utf8'
      );
      // eslint-disable-next-line no-return-assign
      return (cache[req.url] = {
        response: data,
        headers: {
          'Content-Type': 'text/html'
        }
      });
    }
    return {
      response: null,
      headers: {}
    };
  } catch (e) {
    return {
      response: { error: e },
      headers: {}
    };
  }
};

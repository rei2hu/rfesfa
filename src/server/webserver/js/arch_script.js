/* eslint-disable no-use-before-define, no-var, vars-on-top, prefer-template, camelcase, func-names, prefer-destructuring, no-console */
(function() {
  var wsdiff = {
    events: 'News',
    alerts: 'Alerts',
    sorties: 'Sorties',
    activeMissions: 'Fissures',
    invasions: 'Invasions',
    voidTraders: 'Void Traders',
    'seasonInfo-missions': 'Nightwave',
    goals: 'Events',
    tmp: 'Sentient Anomalies',
    persistentEnemies: 'Acolytes'
  };
  window.onload = function() {
    if (!localStorage.getItem('ARCH_INFO')) {
      this.localStorage.setItem('ARCH_INFO', '{}');
    }
    document.getElementById('help').addEventListener('click', function() {
      document.getElementById('md').classList.add('is-active');
    });
    document.getElementById('mdbg').addEventListener('click', function() {
      document.getElementById('md').classList.remove('is-active');
    });
    document.getElementById('resetCache').addEventListener('click', function() {
      saveStorage({});
      window.location.reload();
    });

    try {
      var info = getFrags();
      if (!compareState(info.state)) {
        console.log('jacked');
        return;
      }
      window.location.hash = '';
      document.getElementById('save').style.display = 'block';
      document.getElementById('save').addEventListener('click', setGuildSettings);

      getArchInfo(info, renderPage);
    } catch (e) {
      console.log(e);
      var butt = document.createElement('div');
      butt.id = 'connect';
      butt.classList.add('button');
      butt.innerText = 'Connect to Discord';
      document.getElementById('scrollable').appendChild(butt);
      document.getElementById('connect').addEventListener('click', login);
    }
  };

  // ==========
  // Db stuff
  // ==========

  var lookingAt;

  function setGuildSettings() {
    // get info from element that displays guild settings

    // get oauth2 token info stuff to double check guild

    // the guild that's being updated
    if (this.hasAttribute('disabled')) return;
    var obj = getStorage();
    var id = lookingAt;
    var channels = ['alertChannel', 'invasionChannel', 'statusChannel', 'fissureChannel'];
    var info = {};
    for (var i = 0; i < channels.length; i++) {
      var channelType = channels[i];
      var ele = document.getElementById(channelType);
      info[channelType] = ele.parentElement.id || null;
    }
    var pushKeys = Object.keys(wsdiff);
    info.pushOptions = 0;
    for (var j = 0; j < pushKeys.length; j++) {
      var pushKey = pushKeys[j];
      if (document.getElementById(pushKey).checked) {
        info.pushOptions |= 1 << j;
      }
    }
    info.pushWebhook = document.getElementById('pushWebhook').value;
    console.log(info);

    // save settings locally
    obj.guilds[id].settings = info;
    saveStorage(obj);

    // make request
    var x = new XMLHttpRequest();
    x.onload = function() {
      document.getElementById('save').classList.remove('is-loading');
      console.log(x.response);
      if (x.response !== '{}') {
        console.log('saved!');
      } else {
        console.log('some error!');
      }
    };

    x.open('POST', '/api/db/arch/update?id=' + id + '&token=' + getStorage().oauth.access_token);
    x.send(JSON.stringify(info));
    document.getElementById('save').classList.add('is-loading');
  }

  function getGuildSettings(id, guild, cb) {
    lookingAt = id;
    var obj = getStorage();
    // if i have settings for this guild
    if (obj.guilds[id].settings) {
      console.log('cached');
      cb(obj.guilds[id].settings, guild.channels);
      return;
    }
    var x = new XMLHttpRequest();
    x.onload = function() {
      obj.guilds[id].settings = JSON.parse(x.response);
      saveStorage(obj);
      cb(obj.guilds[id].settings, guild.channels);
    };
    x.open('GET', '/api/db/arch/get?id=' + id);
    x.send();
  }

  function renderGuildSettings(info, channels) {
    var div;
    var i;
    var leftPanel = document.getElementById('leftPanel');
    while (leftPanel.firstChild) {
      leftPanel.removeChild(leftPanel.firstChild);
    }
    var keys = Object.keys(channels);
    for (i = 0; i < keys.length; i++) {
      var ch_id = keys[i];
      if (channels[ch_id].type !== 0) continue;
      var name = channels[ch_id].name;
      div = document.createElement('div');
      div.classList.add('channelTile');
      div.classList.add('is-info');
      div.innerText = '#' + name;
      div.setAttribute('id', ch_id);
      leftPanel.appendChild(div);
      div.addEventListener('dragover', function(ev) {
        ev.preventDefault();
      });
      div.addEventListener('drop', function(ev) {
        ev.preventDefault();
        var nodeInfo = ev.dataTransfer.getData('nodeinfo');
        if (!nodeInfo) return;
        ev.target.appendChild(document.getElementById(nodeInfo));
      });
    }

    div = document.createElement('div');
    div.classList.add('channelTile');
    div.innerText = 'Disabled';
    div.style.background = '#444';
    div.addEventListener('dragover', function(ev) {
      ev.preventDefault();
    });
    div.addEventListener('drop', function(ev) {
      ev.preventDefault();
      var nodeInfo = ev.dataTransfer.getData('nodeinfo');
      if (!nodeInfo) return;
      ev.target.appendChild(document.getElementById(nodeInfo));
    });
    leftPanel.appendChild(div);

    var entries = Object.entries(info);
    for (i = 0; i < entries.length; i++) {
      var key = entries[i][0];
      var id = entries[i][1];
      if (!key.endsWith('Channel')) continue;
      var choice = document.createElement('div');
      choice.classList.add('choice');
      choice.id = key;
      choice.innerText = (key[0].toUpperCase() + key.slice(1)).replace(/([A-Z])/g, ' $1');
      choice.title = 'Drag me';
      choice.setAttribute('draggable', 'true');
      choice.addEventListener('dragstart', function(ev) {
        ev.dataTransfer.setData('nodeinfo', ev.target.id);
      });
      var par = document.getElementById(id);
      if (par) {
        par.appendChild(choice);
      } else {
        div.appendChild(choice);
      }
    }

    var rightPanel = document.getElementById('rightPanel');
    while (rightPanel.firstChild) {
      rightPanel.removeChild(rightPanel.firstChild);
    }
    var title = document.createElement('div');
    title.innerText = 'Push events (put a webhook url below)';
    title.classList.add('pushTitle');
    rightPanel.appendChild(title);
    var input = document.createElement('input');
    input.classList.add('webhookInput');
    input.classList.add('input');
    input.id = 'pushWebhook';
    input.value = info.pushWebhook;
    rightPanel.appendChild(input);

    var hooktestButt = document.createElement('div');
    hooktestButt.classList.add('button', 'is-secondary');
    hooktestButt.innerText = 'Test Webhook';
    hooktestButt.addEventListener('click', function() {
      var hookUrl = document.getElementById('pushWebhook').value;
      var x = new XMLHttpRequest();
      x.onload = function() {
        try {
          var response = JSON.parse(x.response);
          if (response.content === 'test') {
            hooktestButt.classList.add('is-success');
          } else {
            hooktestButt.classList.add('is-danger');
          }
        } catch (e) {
          hooktestButt.classList.add('is-danger');
          // bad response
        } finally {
          setTimeout(function() {
            hooktestButt.classList.remove('is-success');
            hooktestButt.classList.remove('is-danger');
          }, 1000);
        }
      };
      x.onerror = function() {
        hooktestButt.classList.add('is-danger');
        setTimeout(function() {
          hooktestButt.classList.remove('is-danger');
        }, 1000);
      };
      x.open('POST', hookUrl + '?wait=true');
      x.setRequestHeader('Content-Type', 'application/json');
      x.send(
        JSON.stringify({
          content: 'test'
        })
      );
    });
    rightPanel.appendChild(hooktestButt);

    var cbkeys = Object.keys(wsdiff);
    var cbBox = document.createElement('div');
    cbBox.id = 'cbBox';
    rightPanel.appendChild(cbBox);

    for (var j = 0; j < cbkeys.length; j++) {
      var cbkey = cbkeys[j];
      var niceName = wsdiff[cbkey];
      var label = document.createElement('label');
      label.classList.add('checkbox');
      label.innerText = ' ' + niceName;
      label.classList.add('pushCheckbox');
      var cb = document.createElement('input');
      cb.id = cbkey;
      cb.type = 'checkbox';
      cb.checked = ((1 << j) & info.pushOptions) !== 0;
      label.prepend(cb);
      cbBox.appendChild(label);
      cbBox.appendChild(document.createElement('br'));
    }
  }

  // ==========================
  // Modifying page after login
  // ==========================

  function getArchInfo(auth, cb) {
    var obj = getStorage();
    if (obj.guilds) {
      document.getElementById('help').style.display = 'block';
      cb(obj.guilds);
    } else {
      var x = new XMLHttpRequest();
      x.onload = function() {
        document.getElementById('help').style.display = 'block';
        document.getElementById('save').classList.remove('is-loading');
        var response = JSON.parse(x.response);
        obj.guilds = response.guilds;
        obj.user = response.user;
        saveStorage(obj);
        cb();
      };
      x.open('GET', '/api/discord/arch_info?token=' + auth.access_token);
      x.send();
      document.getElementById('save').classList.add('is-loading');
    }
  }

  function renderPage() {
    var info = getStorage();
    var user = info.user;
    var guilds = info.guilds;
    var av = document.getElementById('avatar');
    av.src = 'https://cdn.discordapp.com/avatars/' + user.id + '/' + user.avatar + '.png';
    av.style.display = 'block';
    var un = document.getElementById('username');
    un.innerText = user.username + '#' + user.discriminator;
    un.style.display = 'block';

    var nav = document.getElementById('scrollable');
    var keys = Object.keys(guilds);
    for (var i = 0; i < keys.length; i++) {
      var guild_id = keys[i];
      var guild = guilds[guild_id];

      var fig = document.createElement('figure');
      fig.classList.add('image');
      fig.classList.add('is-128x128');
      fig.style.display = 'inline-block';
      fig.style.margin = '10px';

      var img = document.createElement('img');
      img.src = 'https://cdn.discordapp.com/icons/' + guild.id + '/' + guild.icon + '.png';
      img.classList.add('is-rounded');
      img.title = guild.name;
      img.style.border = '0.5rem outset grey';

      // add listeners to img
      img.addEventListener(
        'click',
        function(guildArg, id) {
          document.getElementById('save').removeAttribute('disabled');
          document.getElementById('scrollable').childNodes.forEach(function(n) {
            if (!n.children) return;
            if (n.children[0].tagName === 'svg') return;
            // eslint-disable-next-line no-param-reassign
            n.children[0].style.border = '0.5rem outset grey';
          });
          getGuildSettings(id, guildArg, renderGuildSettings);
          this.style.border = '3px #39ff14 solid';
        }.bind(img, guild, guild_id)
      );

      fig.appendChild(img);
      nav.appendChild(fig);
    }
  }

  // ===========
  // login stuff
  // ===========

  function hashss(str) {
    var hash = 5381;
    for (var i = 0; i < str.length; i++) {
      hash = (hash << 5) + hash + str.charCodeAt(i);
    }
    return hash;
  }

  function setState() {
    var str = '';
    for (var key in navigator) {
      str += navigator[key];
    }
    var state = btoa(hashss(str) + '' + hashss(Date.now() + ''));
    var obj = getStorage();
    obj.oauth = {};
    obj.oauth.state = state;
    saveStorage(obj);
    return state;
  }

  function login() {
    var hasho = setState();
    localStorage.removeItem('archInfo');
    var url =
      'https://discordapp.com/oauth2/authorize?client_id=277818389756641280' +
      '&redirect_uri=' +
      encodeURIComponent(window.location.href) +
      '&response_type=token&scope=identify%20guilds' +
      '&state=' +
      hasho;
    window.location.href = url;
  }

  function getFrags() {
    // if you still have an hour left at least
    // or else we'll try to get a new token
    var obj = getStorage();
    if (obj.oauth) {
      if (obj.oauth.expiration > Date.now() + 60 * 60e3) {
        return obj.oauth;
      }
      // oauth outdated, remove all cache?
      obj = {};
      saveStorage(obj);
    }
    // if no hash, this will throw
    var obj2 = window.location.hash
      .slice(1)
      .split('&')
      .reduce(function(a, b) {
        var sp = b.split('=');
        // eslint-disable-next-line no-param-reassign
        a[sp[0]] = sp[1];
        return a;
      }, {});
    if (!obj2.access_token) {
      throw new Error();
    }
    obj2.token = obj2.access_token;
    obj2.type = obj2.token_type;
    obj2.state = decodeURIComponent(obj2.state);
    obj2.expiration = Date.now() + obj2.expires_in * 1000;
    // delete obj2.expires_in;
    // delete obj2.access_token;
    // delete obj2.token_type;
    obj.oauth = obj2;
    saveStorage(obj);
    return obj2;
  }

  function compareState(state) {
    return getStorage().oauth.state === state;
  }

  // ================
  // storage updating
  // ================

  function getStorage() {
    return JSON.parse(localStorage.getItem('ARCH_INFO'));
  }

  function saveStorage(obj) {
    localStorage.setItem('ARCH_INFO', JSON.stringify(obj));
  }
})();

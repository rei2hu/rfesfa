## Archimedes-public

A public version of the bot that I have hosted for the past few years which I still
host but that can't be added to any more servers because I don't want to give my pii
to Discord. Code is kind of all over the place.

### Explanation

There are technically two different parts - the scheduled jobs and the server. The
schedued jobs are what send/edit messages. The server is what provides a simplified
api for the Warframe worldstate. They can be run seperately (on different servers),
but due to costs I always ran them together.

### Setup

#### Obtain code

First, clone the repository or download as a zip.

#### Some replacements that need to be made:

(requires basic knowledge of setting up an app on Discord)

1. Go to discord and your applications. For the application you plan to use, copy the
    following:
    - Bot token
    - Client id

2. Go to `src/server/webserver/js/arch_script.js` and replace const client_id with the
    client id you copied.

As far as I'm aware, that's the only hardcoded thing that exists. Well I guess you want
to replace my server link on that page, too. You'll find that on the html page. Search
for `Zct6VgD`.

#### Environment variables and other setup

This uses postgresql, so make sure you have a database set up somewhere. Create a `.env`
in the root directory and have the following setup:

```
DISCORD_TOKEN=the bot token you copied earlier
DATABASE_URL=postgres://your.postgres-database.url
BASE_URL=the url where the server part will be hosted
PORT=the port that the server will listen on
```

There is also an sql file which contains the schema (I think). Let's hope it's updated.
And don't forget to install dependencies with

```
npm install
```

Also make sure to set up the redirect url for oauth2 for your bot to be the BASE_URL+PORT
so you don't get an invalid redirect_uri error when trying to connect to Discord.

#### Running

Assuming the setup above is correct, you can run it with `node src`. You can also run it
"locally" with `node src/local`. Really all local does is change the `BASE_URL` and `PORT`
so it runs on `http://localhost:12345/`. If you look at what is in `src/index.js` or
`src/local.js`, you'll realize they just require the scheduled-job and server files.

### What is missing?

My old website files - you remember how you had to click through to `/arch`? Well that's
because I originally hosted my website on the exact same server. Good luck extracting the
img bmp thing though.

The bot. Really it was just used for commands. Not too important as anyone can make a bot
that's basically ping pong. Well, there is still the guild prefix column in the database
which is now useless.
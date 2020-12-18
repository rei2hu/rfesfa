/*
    How to approach things
        - Normal message updates:
            - Select rows with those channels set
            - Update the messages for those channels
        - PushWebhook updates (scheduled-job):
            - Once there are new events, calculate the number that represents the events with &
            - Select from Guilds where number & PushOptions > 0
            - Push updates to those channels
        - On a channelID change
            - Take related entries in AlertMessages, IvasionMessages, StatusMessage, FissureMessage with the old channelID
            - Delete those entries
            - Update the channelID

    require('node-fetch')('http://127.0.0.1:12345/api/db/update?id=292006672732520478', {method: 'POST',body: "{}",}).then(res =>res.json()).then(console.log)
    fetch('http://127.0.0.1:12345/api/db/update?id=292006672732520478', {method: 'POST',body: "{}",}).then(res =>res.json()).then(console.log)

    How to run the file:
        - connect to database and run \i [file]
*/
create table if not exists ArchGuilds (
  -- The id of the guild
  GuildID bigint unique,
  -- The id of the channel to manage an alert message on
  AlertChannelID bigint unique,
  -- the id of the channel to manage an invasion message on
  InvasionChannelID bigint unique,
  -- The id of the channel to manage a status message on
  StatusChannelID bigint unique,
  -- The id of the channel to manage a fissure message on
  FissureChannelID bigint unique,
  -- The webhook url to send worldstate diff updates to
  PushWebhook text unique,
  -- What things in the worldstate you want to get updates for
  PushOptions int,
  -- Guild specific prefix
  CommandPrefix text,
  -- Prefix for the notification roles
  RolePrefix text,
  -- The platform the guild is on
  Platform smallint,
  primary key (GuildID)
);
create table if not exists ArchAlertMessages (
  -- The id of the alert message
  MessageID bigint unique,
  -- The channel of the alert message
  ChannelID bigint,
  primary key (MessageID),
  foreign key (ChannelID) references ArchGuilds (AlertChannelID) on delete cascade on update cascade
);
create table if not exists ArchInvasionMessages (
  MessageID bigint unique,
  ChannelID bigint,
  primary key (MessageID),
  foreign key (ChannelID) references ArchGuilds (InvasionChannelID) on delete cascade on update cascade
);
create table if not exists ArchStatusMessages (
  MessageID bigint unique,
  ChannelID bigint,
  primary key (MessageID),
  foreign key (ChannelID) references ArchGuilds (StatusChannelID) on delete cascade on update cascade
);
create table if not exists ArchFissureMessages (
  MessageID bigint unique,
  ChannelID bigint,
  primary key (MessageID),
  foreign key (ChannelID) references ArchGuilds (FissureChannelID) on delete cascade on update cascade
);
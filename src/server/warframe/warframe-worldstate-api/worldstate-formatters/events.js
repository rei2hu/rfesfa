const { pullId } = require('./formatters-util');

module.exports = events =>
  Object.fromEntries(
    events
      .filter(event => event.Messages.find(message => message.LanguageCode === 'en'))
      .map(event => [
        pullId(event),
        {
          messages: Object.fromEntries(
            event.Messages.map(message => [message.LanguageCode, message.Message])
          ),
          link: event.Prop,
          image: event.ImageUrl,
          time: +event.Date.$date.$numberLong
        }
      ])
  );

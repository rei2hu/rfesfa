## /api/db/arch/update

##### Query parameters

| name  | type   | default value | description                                         |
| ----- | ------ | ------------- | --------------------------------------------------- |
| id    | string | ""            | The id of the guild whose settings you are updating |
| token | string | ""            | The oauth2 token (without Bearer prefix)            |

##### Body

| name            | type             | default value | description                           |
| --------------- | ---------------- | ------------- | ------------------------------------- |
| alertChannel    | string           | ""            | The id of the alert channel           |
| invasionChannel | string           | ""            | The id of the invasion channel        |
| statusChannel   | string           | ""            | The id of the status channel          |
| fissureChannel  | string           | ""            | The id of the fissure channel         |
| pushWebhook     | string           | ""            | The id of the webhook channel         |
| pushOptions     | int              | 0             | The events to get push events for     |
| commandPrefix   | string           | ""            | The prefix for commands               |
| rolePrefix      | string           | ""            | The prefix for the notification roles |
| platform        | PC or XB1 or PS4 | "PC"          | The platform for the guild            |

Updates the settings for a guild using the arch discord bot. If you only update the commandPrefix,
then the token is not needed. Body should be sent as json.

<hr />

## /api/db/arch/get

##### Query parameters

| name | type   | default value | description                                         |
| ---- | ------ | ------------- | --------------------------------------------------- |
| id   | string | ""            | The id of the guild whose settings you are updating |

Gets a guild's settings.

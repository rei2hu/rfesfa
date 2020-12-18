## /api/warframe/worldstate(/.\*)\*

##### Query parameters

| name     | type             | default value | description                    |
| -------- | ---------------- | ------------- | ------------------------------ |
| platform | PC or XB1 or PS4 | PC            | The platform of the worldstate |

Get the worldstate.

<hr />

## /api/warframe/droptables

##### Query parameters

| name           | type    | default value | description                                    |
| -------------- | ------- | ------------- | ---------------------------------------------- |
| searchTerm     | string  | ""            | The string to search for                       |
| searchForEntry | boolean | false         | If you are looking for a droptable by its name |

Search the droptables for an item.

<hr />

## TODO /api/warframe/translation

##### Query parameters

| name       | type   | default value | description                 |
| ---------- | ------ | ------------- | --------------------------- |
| identifier | string | ""            | The identifier to translate |

Tries to translate a certain key with **machine learning**! (actually just some fancy algorithm)

<hr />

## TODO /api/warframe/query

##### Query parameters

| name       | type   | default value | description                        |
| ---------- | ------ | ------------- | ---------------------------------- |
| identifier | string | ""            | The identifier to look up info for |

Tries to look up information about an item.

##### Modify variables in the following files to affect the website page

src/server/webserver/js/arch_script.js

1. L3 - wsdiff

<hr />

##### Modify variables in the following files to check it in the worldstate diff

src/scheduled-jobs/worldstate-diff/index.js

1. L5 - mappings

<hr />

##### Add a new embed message formatter to format the message based on the data

src/message-formatters/embeds/{key-name}.js

<hr />

i guess that's it, note that there is a max of 32 different events that can be tracked because postgres' integer type is 4 byte/32 bit

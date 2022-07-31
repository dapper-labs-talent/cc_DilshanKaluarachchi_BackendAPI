Step 1: Run "npm i" command to install the node modules

Step 2: Run "npm i -g knex" command to install the "knex" node module in a global setting, otherwise sometimes it won't work properly

Step 3: Update database configuration in the "development.js" file in the "config" folder

Step 4: Update database configuration in the "knexfile.js" file in the root folder

Step 5: Run "knex migrate:latest" command to create the "user" table inside database

Step 6: Run "node index.js" command to run the API

API specs are as same as the ones in the "README.md"
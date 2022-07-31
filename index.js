/**
 * Read the INSTRUCTIONS.md first
 * Run node index.js to start server
 */

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const application = require('./app');
const { init } = require('./app');
const port = 3000;
const auth = require("./middleware/auth");


app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get('/', (request, response) => {
  response.json({ info: 'Dapper Labs assignment - Dilshan Kaluarachchi' });
});

app.post('/signup', application.signup);
app.post('/login', application.login);
app.get('/users', auth, application.getUsers);
app.put('/users', auth, application.updateUser);

// creating the DB connection and starting the API
init().then(() => {
  console.log('Database connection successful');
  app.listen(port, () => {
    console.log(`Application listening on port ${port}`);
  });
}).catch((error) => {
  console.log('Database connection failed: ', error);
});

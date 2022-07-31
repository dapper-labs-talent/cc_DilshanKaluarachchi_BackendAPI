const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Client } = require('pg');
const configurations = require("./config/config.js");
const { v4: uuidv4 } = require('uuid');
const userTableName = "user";

const client = new Client({
  user: configurations.database.user,
  host: configurations.database.host,
  database: configurations.database.database,
  password: configurations.database.password,
  port: configurations.database.port,
});

const getUserByEmail = async (email) => {
  try {
    const results = await client.query(`SELECT * FROM "${userTableName}" WHERE "email" = $1`, [email]);
    return results.rows;
  } catch (error) {
    console.log('Error occurred when getting existing user by email', error);
    throw error;
  }
};

const signup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  // validating user input
  if (!(email && password && firstName && lastName)) {
    return res.status(400).send("All input is required");
  }

  // check if user already exists
  try {
    const oldUser = await getUserByEmail(email.toLowerCase());

    if (oldUser.length > 0) {
      return res.status(409).send("User already exists. Please login");
    }
  } catch (error) {
    return res.status(400).send('Signup failed. Please try again');
  }


  // encrypt user password
  encryptedPassword = await bcrypt.hash(password, 10);

  // create user in the DB
  try {
    const insertResult = await client.query(
      `INSERT INTO "${userTableName}" (uuid, "firstName", "lastName", "email", "password") VALUES ($1, $2, $3, $4, $5) RETURNING uuid, "firstName", "lastName", "email"`,
      [uuidv4(), firstName, lastName, email.toLowerCase(), encryptedPassword]);

    const user = insertResult.rows[0];

    // create token
    const token = jwt.sign(
      { uuid: user.uuid, email: user.email },
      configurations.jwt.key,
      {
        expiresIn: configurations.jwt.validDuration,
      }
    );

    // binding the token into user data
    user.token = token;

    return res.status(201).json(user);

  } catch (error) {
    console.log('Error occurred when inserting a record into DB', error);
    return res.status(400).send('Signup failed. Please try again');
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  // validating user input
  if (!(email && password)) {
    return res.status(400).send("All input is required");
  }

  // check if user exists
  try {
    const user = await getUserByEmail(email.toLowerCase());

    if (!user.length > 0) {
      return res.status(409).send("User does not exist. Please signup");
    }

    // checking password
    if (!(await bcrypt.compare(password, user[0].password))) {
      return res.status(400).send("Enter the correct password");
    }

    delete user[0].password;

    // create token
    const token = jwt.sign(
      { uuid: user[0].uuid, email: user[0].email },
      configurations.jwt.key,
      {
        algorithm: "HS256",
        expiresIn: configurations.jwt.validDuration,
      }
    );

    // binding the token into user data
    user[0].token = token;

    return res.status(201).json(user[0]);

  } catch (error) {
    console.log('Error occurred when creating a JWT token', error);
    return res.status(400).send('Login failed. Please try again');
  }
};

const getUsers = async (req, res) => {
  try {
    const records = await client.query(`SELECT "email", "firstName", "lastName" FROM "${userTableName}" ORDER BY "id" ASC`);
    return res.status(200).json({ "users": records.rows });
  } catch (error) {
    console.log('Error occurred when getting records from DB', error);
    return res.status(400).send('Getting records has failed. Please try again');
  }
};

const updateUser = async (req, res) => {
  const { firstName, lastName } = req.body;

  try {
    const uploadResult = await client.query(`UPDATE "${userTableName}" SET "firstName" = $1, "lastName" = $2 WHERE "email" = $3 RETURNING "firstName", "lastName"`, [firstName, lastName, req.user.email]);

    return res.status(201).json(uploadResult.rows[0]);
  } catch (error) {
    console.log('Error occurred when updating the record', error);
    return res.status(400).send('Update failed. Please try again');
  }
};

const init = async () => {
  console.log('Creating database connection');

  await client.connect();
};

module.exports = {
  init,
  signup,
  login,
  getUsers,
  updateUser,
};
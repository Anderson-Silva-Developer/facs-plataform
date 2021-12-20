const { MongoClient } = require('mongodb');
require("dotenv").config()

// const MONGO_DB_URL = 'mongodb://127.0.0.1:27017';
const MONGO_DB_URL =process.env.APP_URLFACS;

const DB_NAME = 'facefacs';

const connection = () => MongoClient
  .connect(MONGO_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((conn) => conn.db(DB_NAME))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

module.exports = connection;              
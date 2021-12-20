const { MongoClient } = require('mongodb');
require("dotenv")

const MONGO_DB_URL = process.env.APP_URL;
const DB_NAME = 'tokens';

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
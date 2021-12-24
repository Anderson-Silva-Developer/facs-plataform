const { MongoClient } = require('mongodb');
require("dotenv").config()

const MONGO_DB_URL_FACS =process.env.APP_URLFACS;
const DB_NAME_FACS = 'facefacs';
const MONGO_DB_URL_TOKEN =process.env.APP_URLTOKEN;
const DB_NAME_TOKEN = 'tokens';

const connectFacefacs = () => MongoClient
  .connect(MONGO_DB_URL_FACS, {
    useNewUrlParser: true,
    useUnifiedTopology: true    
  })
  .then((conn) => conn.db(DB_NAME_FACS)
  )
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

const connectTokens = () => MongoClient
  .connect(MONGO_DB_URL_TOKEN, {
    useNewUrlParser: true,
    useUnifiedTopology: true    
  })
  .then((conn) => conn.db(DB_NAME_TOKEN))
  .catch((err) => {   
    console.error(err);
    process.exit(1);
  });

  module.exports={connectFacefacs,connectTokens}
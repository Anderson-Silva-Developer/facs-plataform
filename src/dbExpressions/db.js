var MongoClient = require('mongodb').MongoClient;
require("dotenv").config()

const MONGO_DB_URL_FACS =process.env.APP_URLFACS;
const DB_NAME_FACS = 'facefacs';
const MONGO_DB_URL_TOKEN =process.env.APP_URLTOKEN;
const DB_NAME_TOKEN = 'tokens';

var DbConnectionFacs = function () {

    var db = null;
    var instance = 0;

    async function DbConnect() {
        try {
            
            let _db = await MongoClient.connect(
                MONGO_DB_URL_FACS, {
                useNewUrlParser: true,
                useUnifiedTopology: true}).then((conn) => conn.db(DB_NAME_FACS));

            return _db
        } catch (e) {
            return e;
        }
    }

   async function Get() {
        try {
            instance++;     // this is just to count how many times our singleton is called.
            console.log(`DbConnection called ${instance} times`);

            if (db != null) {
                console.log(`db connection is already alive`);
                return db;
            } else {
                console.log(`getting new db connection expressions`);
                db = await DbConnect();
                return db; 
            }
        } catch (e) {
            return e;
        }
    }

    return {
        Get: Get
    }
}
var DbConnectionToken = function () {

    var db = null;
    var instance = 0;

    async function DbConnect() {
        try {
            
            let _db = await MongoClient.connect(
                MONGO_DB_URL_TOKEN, {
                useNewUrlParser: true,
                useUnifiedTopology: true}).then((conn) => conn.db(DB_NAME_TOKEN));

            return _db
        } catch (e) {
            return e;
        }
    }

   async function Get() {
        try {
            instance++;     // this is just to count how many times our singleton is called.
            console.log(`DbConnection called ${instance} times`);

            if (db != null) {
                console.log(`db connection is already alive`);
                return db;
            } else {
                console.log(`getting new db connection token`);
                db = await DbConnect();
                return db; 
            }
        } catch (e) {
            return e;
        }
    }

    return {
        Get: Get
    }
}


module.exports.DbConnectionToken = DbConnectionToken()
module.exports.DbConnectionFacs= DbConnectionFacs()
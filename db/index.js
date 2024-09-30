//code (modified) from 
//https://codeoftheprogrammer.com/2020/01/16/postgresql-from-nextjs-api-route/

//evt. needed: require('dotenv').config();


const { Pool } = require('pg');
// Use a symbol to store a global instance of a connection, and to access it from the singleton.
const DB_KEY = Symbol.for("newdb.db");
const globalSymbols = Object.getOwnPropertySymbols(global);
const hasDb = (globalSymbols.indexOf(DB_KEY) > -1);
if (!hasDb) {
    global[DB_KEY] = { pool : new Pool()};
}
// Create and freeze the singleton object so that it has an instance property.
const singleton = {};
Object.defineProperty(singleton, "instance", {
    get: function () {
        return {query: (text, params) => global[DB_KEY].pool.query(text, params)};
    }
});
Object.freeze(singleton);
module.exports = singleton;
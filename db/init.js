require("dotenv").config();
const { Pool } = require('pg'); 
const pool = new Pool();
const db = {query: (text, params) => pool.query(text, params)};
const dbName = process.env.New_PGDATABASE;
var newDB;

try {
db.query('DROP DATABASE IF EXISTS ' + dbName).then(() => 
db.query('CREATE DATABASE ' + dbName).then(() => {
    process.env.PGDATABASE = process.env.New_PGDATABASE;
    const { Pool } = require("pg");
    newDB = new Pool();
    newDB.query("CREATE TABLE NavBar (_id BIGSERIAL UNIQUE PRIMARY KEY,parentid INTEGER,position SMALLINT,name VARCHAR,url VARCHAR)").then(() => {newDB.query("CREATE TABLE Blocks (_id BIGSERIAL UNIQUE PRIMARY KEY,Pageid integer,Possml integer[4],Posmd integer[4],Posbig integer[4],Data VARCHAR,Zelltype VARCHAR,Style VARCHAR)").then(() => {newDB.query("CREATE TABLE NotLiveBlocks (_id BIGSERIAL UNIQUE PRIMARY KEY,Pageid integer,Possml integer[4],Posmd integer[4],Posbig integer[4],Data VARCHAR,Zelltype VARCHAR,NewBlock boolean,Style VARCHAR)").then(() => {newDB.query("INSERT INTO NavBar (parentid, position, name, url) VALUES (0, 8, 'Test1', 'Test1'), (0, 9, 'Test2', 'Test2'), (0, 10, 'Test3', 'Test3'),(0, 11, 'Test4', 'Test4'), (0, 12, 'Test5', 'Test5'), (1, 1, 'Test7', 'Test7'), (1, 2, 'Test8', 'Test8'), (6, 1, 'Test9', 'Test9'), (6, 2, 'Test10', 'Test10');").then(() => {newDB.query("CREATE OR REPLACE FUNCTION updatenavitem(itemurl VARCHAR, itemname VARCHAR, itemId integer) RETURNS boolean AS 'BEGIN UPDATE NavBar SET name = itemname WHERE _id = itemId AND name != itemname AND length(itemname) > 0; UPDATE NavBar SET url = itemurl WHERE _id = itemId AND url != itemurl AND length(itemurl) > 0; RETURN true; END;' LANGUAGE plpgsql;").then(() => {console.log('Database initialized!');});});});});});
}))
} catch {
    db.query('DROP DATABASE IF EXISTS ' + dbName).then(() => {console.log("Database initialization failed!")});
}
const dotenv = require('dotenv').config({ path: "./.env" });
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');
const dbName = 'database';
let clusterUri = process.env.DB_URI;

let client;
let db; 

//mongoConfig.js: sets up the cluster connection & database object, and exposes them to modules

module.exports = {
    //Connect to the cluster and set the database to use
    connectToCluster: async function() {
        if (process.env.NODE_ENV === "testing") { //Testing: setup MongoMemoryServer
            let mongoServer = await MongoMemoryServer.create();
            clusterUri = mongoServer.getUri();
        } 
        client = await MongoClient.connect(clusterUri);
        db = await client.db(dbName);
        return (true);
    },
    
    //Get reference to the database object
    getDb: function() {
        return db;
    }
};